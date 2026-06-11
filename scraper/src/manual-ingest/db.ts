import { Pool, type PoolClient } from "pg";
import { slugifySourceName } from "./normalize";
import type { WineRow } from "./types";

export function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for manual price ingestion.");
  }

  return new Pool({ connectionString });
}

export async function loadWines(client: PoolClient): Promise<WineRow[]> {
  const result = await client.query<WineRow>(
    `SELECT id, slug, canonical_producer, vintage, format_ml, pack_size, format_label
     FROM wines`
  );
  return result.rows;
}

export async function ensureSource(
  client: PoolClient,
  sourceName: string,
  sourceUrl: string
): Promise<string> {
  const slug = slugifySourceName(sourceName);
  const baseUrl = new URL(sourceUrl).origin;

  const existing = await client.query<{ id: string }>(
    `SELECT id FROM sources WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  if (existing.rows[0]) {
    return existing.rows[0].id;
  }

  const inserted = await client.query<{ id: string }>(
    `INSERT INTO sources (slug, name, base_url, enabled, trust_weight)
     VALUES ($1, $2, $3, false, 0.75)
     RETURNING id`,
    [slug, sourceName, baseUrl]
  );

  return inserted.rows[0].id;
}

export async function ensureScrapeRun(
  client: PoolClient,
  sourceId: string,
  scheduledFor: string
): Promise<string> {
  const existing = await client.query<{ id: string }>(
    `SELECT id
     FROM scrape_runs
     WHERE source_id = $1 AND scheduled_for = $2::date
     LIMIT 1`,
    [sourceId, scheduledFor]
  );

  if (existing.rows[0]) {
    await client.query(
      `UPDATE scrape_runs
       SET status = 'running', started_at = now(), finished_at = NULL
       WHERE id = $1`,
      [existing.rows[0].id]
    );
    return existing.rows[0].id;
  }

  const inserted = await client.query<{ id: string }>(
    `INSERT INTO scrape_runs (source_id, scheduled_for, status)
     VALUES ($1, $2::date, 'running')
     RETURNING id`,
    [sourceId, scheduledFor]
  );

  return inserted.rows[0].id;
}

export async function createManualSnapshot(
  client: PoolClient,
  scrapeRunId: string,
  sourceId: string,
  sourceUrl: string,
  observedAt: string,
  contentHash: string
): Promise<string> {
  const snapshotDate = observedAt.slice(0, 10);
  const result = await client.query<{ id: string }>(
    `INSERT INTO html_snapshots (
       scrape_run_id,
       source_id,
       source_url,
       captured_at,
       snapshot_date,
       storage_path,
       content_hash
     )
     VALUES ($1, $2, $3, $4::timestamptz, $5::date, $6, $7)
     RETURNING id`,
    [
      scrapeRunId,
      sourceId,
      sourceUrl,
      observedAt,
      snapshotDate,
      `manual://${contentHash}`,
      contentHash,
    ]
  );

  return result.rows[0].id;
}

export async function insertExtraction(
  client: PoolClient,
  params: {
    snapshotId: string;
    sourceId: string;
    wineId: string | null;
    wineName: string;
    producer: string;
    vintage: number;
    formatRaw: string;
    formatMl: number | null;
    packSize: number | null;
    priceOriginal: number;
    currencyOriginal: string;
    priceGbp: number | null;
    fxRate: number | null;
    fxDate: string | null;
    sourceName: string;
    sourceUrl: string;
    capturedAt: string;
    extractStatus: "ok" | "partial" | "failed";
  }
): Promise<void> {
  await client.query(
    `INSERT INTO scrape_extractions (
       snapshot_id,
       source_id,
       wine_id,
       wine_name,
       producer,
       vintage,
       format_raw,
       format_ml,
       pack_size,
       price_original,
       currency_original,
       price_gbp,
       fx_rate,
       fx_date,
       source_name,
       source_url,
       captured_at,
       extract_status
     )
     VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9,
       $10, $11, $12, $13, $14::date, $15, $16, $17::timestamptz, $18
     )`,
    [
      params.snapshotId,
      params.sourceId,
      params.wineId,
      params.wineName,
      params.producer,
      params.vintage,
      params.formatRaw,
      params.formatMl,
      params.packSize,
      params.priceOriginal,
      params.currencyOriginal,
      params.priceGbp,
      params.fxRate,
      params.fxDate,
      params.sourceName,
      params.sourceUrl,
      params.capturedAt,
      params.extractStatus,
    ]
  );
}

export async function finishScrapeRun(
  client: PoolClient,
  scrapeRunId: string,
  pagesAttempted: number,
  pagesSucceeded: number,
  errorCount: number
): Promise<void> {
  const status =
    errorCount === 0
      ? "success"
      : pagesSucceeded > 0
        ? "partial"
        : "failed";

  await client.query(
    `UPDATE scrape_runs
     SET status = $2,
         finished_at = now(),
         pages_attempted = $3,
         pages_succeeded = $4,
         error_count = $5
     WHERE id = $1`,
    [scrapeRunId, status, pagesAttempted, pagesSucceeded, errorCount]
  );
}
