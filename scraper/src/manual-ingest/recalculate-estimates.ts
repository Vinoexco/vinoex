import type { PoolClient } from "pg";
import type { AggregateMethod } from "./types";

export async function recalculateEstimatedValues(
  client: PoolClient,
  wineIds: string[],
  aggregate: AggregateMethod
): Promise<number> {
  if (wineIds.length === 0) {
    return 0;
  }

  const valueExpr =
    aggregate === "median"
      ? "PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price_gbp)"
      : "AVG(price_gbp)";

  const result = await client.query(
    `WITH valid_obs AS (
       SELECT wine_id, price_gbp, source_id, captured_at
       FROM scrape_extractions
       WHERE wine_id = ANY($1::uuid[])
         AND price_gbp IS NOT NULL
         AND extract_status IN ('ok', 'partial')
     ),
     per_wine AS (
       SELECT
         wine_id,
         COUNT(DISTINCT source_id)::int AS source_count,
         MAX(captured_at) AS last_updated,
         ${valueExpr} AS estimated_value_gbp
       FROM valid_obs
       GROUP BY wine_id
     )
     INSERT INTO estimated_values (
       wine_id,
       estimated_value_gbp,
       source_count,
       last_updated,
       as_of_date
     )
     SELECT
       wine_id,
       ROUND(estimated_value_gbp::numeric, 2),
       source_count,
       last_updated,
       CURRENT_DATE
     FROM per_wine
     ON CONFLICT (wine_id, as_of_date) DO UPDATE SET
       estimated_value_gbp = EXCLUDED.estimated_value_gbp,
       source_count = EXCLUDED.source_count,
       last_updated = EXCLUDED.last_updated,
       computed_at = now()`,
    [wineIds]
  );

  return result.rowCount ?? 0;
}
