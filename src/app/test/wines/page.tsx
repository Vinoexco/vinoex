import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Wine } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function TestWinesPage() {
  let wines: Wine[] = [];
  let error: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error: queryError } = await supabase
      .from("wines")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      error = queryError.message;
    } else {
      wines = data ?? [];
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to connect to Supabase";
  }

  return (
    <div className="min-h-screen bg-[#1a1410] px-6 py-12 text-[#f5f1eb]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Supabase Test</p>
        <h1 className="font-wine mt-2 text-4xl text-[#f5f1eb]">Wines Table</h1>
        <p className="mt-2 text-sm text-[#f5f1eb]/50">
          Read-only check against <code className="text-[#c4a96a]">public.wines</code>
        </p>

        {error && (
          <div className="mt-8 rounded border border-[#7a2020]/40 bg-[#7a2020]/10 px-4 py-3 text-sm text-[#f5f1eb]">
            <p className="font-medium text-[#c4a96a]">Error</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs text-[#f5f1eb]/50">
              Check <code>.env.local</code> for{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, and ensure RLS allows anon
              SELECT on <code>wines</code>.
            </p>
          </div>
        )}

        {!error && wines.length === 0 && (
          <p className="mt-8 text-sm text-[#f5f1eb]/50">
            Connected successfully. No rows in <code>wines</code> yet.
          </p>
        )}

        {wines.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded border border-[#c4a96a]/20">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[#c4a96a]/15 bg-[#2a221c] text-left text-[10px] uppercase tracking-widest text-[#f5f1eb]/40">
                  <th className="px-4 py-3 font-normal">Producer</th>
                  <th className="px-3 py-3 font-normal">Slug</th>
                  <th className="px-3 py-3 font-normal">Vintage</th>
                  <th className="px-3 py-3 font-normal">Format</th>
                  <th className="px-3 py-3 font-normal">Pack</th>
                  <th className="px-4 py-3 font-normal">Created</th>
                </tr>
              </thead>
              <tbody>
                {wines.map((wine, i) => (
                  <tr
                    key={wine.id}
                    className={`border-b border-[#c4a96a]/8 ${
                      i % 2 === 0 ? "bg-[#1a1410]" : "bg-[#1f1915]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-wine text-[#f5f1eb]">{wine.canonical_producer}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[#c4a96a]/80">{wine.slug}</td>
                    <td className="px-3 py-3 font-mono text-[#c4a96a]">{wine.vintage}</td>
                    <td className="px-3 py-3 text-[#f5f1eb]/70">{wine.format_label}</td>
                    <td className="px-3 py-3 font-mono text-xs text-[#f5f1eb]/50">
                      {wine.pack_size}×{wine.format_ml}ml
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#f5f1eb]/40">
                      {new Date(wine.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-3 text-xs text-[#f5f1eb]/35">
              {wines.length} row{wines.length === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
