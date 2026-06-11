import { createHash } from "crypto";
import { config as loadEnv } from "dotenv";
import path from "path";
import { convertToGbp } from "./convert-price";
import {
  createManualSnapshot,
  createPool,
  ensureScrapeRun,
  ensureSource,
  finishScrapeRun,
  insertExtraction,
  loadWines,
} from "./db";
import { loadObservedPrices, resolveInputPath } from "./load-input";
import { matchWine } from "./match-wine";
import { parseFormatLabel } from "./normalize";
import { recalculateEstimatedValues } from "./recalculate-estimates";
import type { AggregateMethod, IngestResult, ObservedPrice } from "./types";

loadEnv({ path: path.resolve(__dirname, "../../../.env.local") });
loadEnv({ path: path.resolve(__dirname, "../../../.env") });

interface CliOptions {
  inputPath: string;
  aggregate: AggregateMethod;
  dryRun: boolean;
}

function parseCliArgs(argv: string[]): CliOptions {
  let inputPath = resolveInputPath();
  let aggregate: AggregateMethod = "median";
  let dryRun = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--input" || arg === "-i") {
      const next = argv[i + 1];
      if (!next) {
        throw new Error("Missing value for --input");
      }
      inputPath = resolveInputPath(next);
      i++;
      continue;
    }
    if (arg === "--aggregate" || arg === "-a") {
      const next = argv[i + 1];
      if (next !== "median" && next !== "average") {
        throw new Error("--aggregate must be 'median' or 'average'");
      }
      aggregate = next;
      i++;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
    }
  }

  return { inputPath, aggregate, dryRun };
}

function contentHash(observation: ObservedPrice): string {
  return createHash("sha256")
    .update(
      [
        observation.source_url,
        observation.raw_title,
        observation.price,
        observation.currency,
        observation.observed_at,
      ].join("|")
    )
    .digest("hex");
}

async function runDryRun(inputPath: string): Promise<IngestResult> {
  const input = loadObservedPrices(inputPath);
  const stats = {
    total: input.observations.length,
    inserted: 0,
    matched: 0,
    unmatched: 0,
    gbpConverted: 0,
    fxConverted: 0,
    failed: 0,
    winesUpdated: 0,
  };
  const unmatched: IngestResult["unmatched"] = [];

  if (!process.env.DATABASE_URL) {
    console.log(`[dry-run] Validated ${stats.total} observation(s). Set DATABASE_URL to test wine matching.`);
    return { stats, unmatched };
  }

  const pool = createPool();
  const client = await pool.connect();

  try {
    const wines = await loadWines(client);
    console.log(`[dry-run] Loaded ${wines.length} wines and ${stats.total} observations.`);

    for (const observation of input.observations) {
      const match = matchWine(observation, wines);
      if (match) {
        stats.matched++;
        console.log(`  match: ${observation.raw_title} -> ${match.wine.slug} (${match.method})`);
      } else {
        stats.unmatched++;
        unmatched.push({
          raw_title: observation.raw_title,
          producer: observation.producer,
          reason: "No wine match",
        });
        console.log(`  miss:  ${observation.raw_title}`);
      }
    }

    return { stats, unmatched };
  } finally {
    client.release();
    await pool.end();
  }
}

async function runIngest(options: CliOptions): Promise<IngestResult> {
  if (options.dryRun) {
    return runDryRun(options.inputPath);
  }

  const input = loadObservedPrices(options.inputPath);
  const pool = createPool();
  const client = await pool.connect();

  const stats = {
    total: input.observations.length,
    inserted: 0,
    matched: 0,
    unmatched: 0,
    gbpConverted: 0,
    fxConverted: 0,
    failed: 0,
    winesUpdated: 0,
  };

  const unmatched: IngestResult["unmatched"] = [];
  const affectedWineIds = new Set<string>();
  const runStats = new Map<
    string,
    { pagesAttempted: number; pagesSucceeded: number; errorCount: number }
  >();

  try {
    const wines = await loadWines(client);

    await client.query("BEGIN");

    for (const observation of input.observations) {
      const sourceId = await ensureSource(client, observation.source_name, observation.source_url);
      const scheduledFor = observation.observed_at.slice(0, 10);
      const scrapeRunId = await ensureScrapeRun(client, sourceId, scheduledFor);

      const runKey = scrapeRunId;
      const current = runStats.get(runKey) ?? {
        pagesAttempted: 0,
        pagesSucceeded: 0,
        errorCount: 0,
      };
      current.pagesAttempted++;
      runStats.set(runKey, current);

      const match = matchWine(observation, wines);
      const { formatMl, packSize } = parseFormatLabel(observation.format_label);
      const converted = await convertToGbp(
        client,
        observation.price,
        observation.currency,
        observation.observed_at
      );

      let extractStatus: "ok" | "partial" | "failed" = "ok";
      let priceGbp: number | null = null;
      let fxRate: number | null = null;
      let fxDate: string | null = null;

      if (!converted) {
        extractStatus = "failed";
        stats.failed++;
        current.errorCount++;
      } else {
        priceGbp = converted.priceGbp;
        fxRate = converted.fxRate;
        fxDate = converted.fxDate;
        if (observation.currency === "GBP") {
          stats.gbpConverted++;
        } else {
          stats.fxConverted++;
        }
      }

      if (!match) {
        extractStatus = extractStatus === "failed" ? "failed" : "partial";
        stats.unmatched++;
        unmatched.push({
          raw_title: observation.raw_title,
          producer: observation.producer,
          reason: "No wine match",
        });
        if (extractStatus !== "failed") {
          current.errorCount++;
        }
      } else {
        stats.matched++;
        affectedWineIds.add(match.wine.id);
        if (extractStatus !== "failed") {
          current.pagesSucceeded++;
        }
      }

      const snapshotId = await createManualSnapshot(
        client,
        scrapeRunId,
        sourceId,
        observation.source_url,
        observation.observed_at,
        contentHash(observation)
      );

      await insertExtraction(client, {
        snapshotId,
        sourceId,
        wineId: match?.wine.id ?? null,
        wineName: observation.raw_title,
        producer: observation.producer,
        vintage: observation.vintage,
        formatRaw: observation.format_label,
        formatMl,
        packSize,
        priceOriginal: observation.price,
        currencyOriginal: observation.currency,
        priceGbp,
        fxRate,
        fxDate,
        sourceName: observation.source_name,
        sourceUrl: observation.source_url,
        capturedAt: observation.observed_at,
        extractStatus,
      });

      stats.inserted++;
    }

    for (const [scrapeRunId, run] of runStats) {
      await finishScrapeRun(
        client,
        scrapeRunId,
        run.pagesAttempted,
        run.pagesSucceeded,
        run.errorCount
      );
    }

    stats.winesUpdated = await recalculateEstimatedValues(
      client,
      [...affectedWineIds],
      options.aggregate
    );

    await client.query("COMMIT");
    return { stats, unmatched };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));

  console.log("Vinoex manual price ingestion");
  console.log(`Input: ${options.inputPath}`);
  console.log(`Aggregate: ${options.aggregate}`);
  if (options.dryRun) {
    console.log("Mode: dry-run (no database writes)");
  }

  const result = await runIngest(options);

  console.log("");
  console.log("Results:");
  console.log(`  observations:   ${result.stats.total}`);
  console.log(`  inserted:       ${result.stats.inserted}`);
  console.log(`  matched wines:  ${result.stats.matched}`);
  console.log(`  unmatched:      ${result.stats.unmatched}`);
  console.log(`  gbp direct:     ${result.stats.gbpConverted}`);
  console.log(`  fx converted:   ${result.stats.fxConverted}`);
  console.log(`  failed:         ${result.stats.failed}`);
  console.log(`  wines updated:  ${result.stats.winesUpdated}`);

  if (result.unmatched.length > 0) {
    console.log("");
    console.log("Unmatched observations:");
    for (const row of result.unmatched) {
      console.log(`  - ${row.raw_title} (${row.producer}): ${row.reason}`);
    }
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Manual ingestion failed: ${message}`);
  process.exitCode = 1;
});
