import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Wine } from "@/types/database";
import MarketDashboard from "./MarketDashboard";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  let wines: Wine[] = [];
  let error: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error: queryError } = await supabase
      .from("wines")
      .select("*")
      .order("canonical_producer", { ascending: true });

    if (queryError) {
      error = queryError.message;
    } else {
      wines = data ?? [];
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to connect to Supabase";
  }

  return <MarketDashboard wines={wines} error={error} />;
}
