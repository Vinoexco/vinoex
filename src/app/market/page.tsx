import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EstimatedValue, MarketLot } from "@/types/database";
import MarketDashboard from "./MarketDashboard";

export const dynamic = "force-dynamic";

function latestEstimatesByWineId(rows: EstimatedValue[]): Map<string, EstimatedValue> {
  const map = new Map<string, EstimatedValue>();
  for (const row of rows) {
    if (!map.has(row.wine_id)) {
      map.set(row.wine_id, row);
    }
  }
  return map;
}

export default async function MarketPage() {
  let lots: MarketLot[] = [];
  let error: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data: wines, error: winesError } = await supabase
      .from("wines")
      .select("*")
      .order("canonical_producer", { ascending: true });

    if (winesError) {
      error = winesError.message;
    } else {
      const wineRows = wines ?? [];
      let estimates = new Map<string, EstimatedValue>();

      if (wineRows.length > 0) {
        const { data: estimateRows, error: estimatesError } = await supabase
          .from("estimated_values")
          .select("*")
          .in(
            "wine_id",
            wineRows.map((wine) => wine.id)
          )
          .order("as_of_date", { ascending: false });

        if (estimatesError) {
          error = estimatesError.message;
        } else {
          estimates = latestEstimatesByWineId(estimateRows ?? []);
        }
      }

      if (!error) {
        lots = wineRows.map((wine) => ({
          wine,
          estimate: estimates.get(wine.id) ?? null,
        }));
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to connect to Supabase";
  }

  return <MarketDashboard lots={lots} error={error} />;
}
