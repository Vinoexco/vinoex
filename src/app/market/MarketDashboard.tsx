"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  EARLY_PREVIEW_MARKET_NOTE,
  formatMarketValue,
} from "@/lib/format-currency";
import {
  estimatedMarketValueGbp,
  formatEstimatedLastUpdated,
  placeholderLastUpdated,
  placeholderLastUpdatedMs,
  placeholderSourceCount,
} from "@/lib/market-estimate";
import type { MarketLot } from "@/types/database";

type WineRow = {
  id: string;
  slug: string;
  producer: string;
  vintage: number;
  format: string;
  region: string | null;
  category: string | null;
  estimatedValue: number;
  sourceCount: number;
  lastUpdated: string;
  lastUpdatedAt: number;
  hasRealEstimate: boolean;
};

type Trade = {
  id: string;
  time: string;
  producer: string;
  vintage: number;
  format: string;
  price: number;
  side: "bid" | "ask";
  qty: number;
};

function lotToRow({ wine, estimate }: MarketLot): WineRow {
  return {
    id: wine.id,
    slug: wine.slug,
    producer: wine.canonical_producer,
    vintage: wine.vintage,
    format: wine.format_label,
    region: wine.region,
    category: wine.category,
    estimatedValue: estimate
      ? Number(estimate.estimated_value_gbp)
      : estimatedMarketValueGbp(wine.slug),
    sourceCount: estimate ? estimate.source_count : placeholderSourceCount(wine.slug),
    lastUpdated: estimate
      ? formatEstimatedLastUpdated(estimate.last_updated)
      : placeholderLastUpdated(wine.slug),
    lastUpdatedAt: estimate
      ? new Date(estimate.last_updated).getTime()
      : placeholderLastUpdatedMs(wine.slug),
    hasRealEstimate: estimate !== null,
  };
}

type SortOption = "value-desc" | "value-asc" | "producer" | "updated";
type SourceCountRange = "all" | "1-3" | "4-6" | "7+";

const DEFAULT_SORT: SortOption = "value-desc";

function matchesSourceCountRange(count: number, range: SourceCountRange): boolean {
  if (range === "all") return true;
  if (range === "1-3") return count >= 1 && count <= 3;
  if (range === "4-6") return count >= 4 && count <= 6;
  return count >= 7;
}

function rowMatchesSearch(row: WineRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    row.producer,
    String(row.vintage),
    row.format,
    row.slug,
    row.region,
    row.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function sortRows(rows: WineRow[], sort: SortOption): WineRow[] {
  const sorted = [...rows];
  switch (sort) {
    case "value-desc":
      sorted.sort((a, b) => b.estimatedValue - a.estimatedValue);
      break;
    case "value-asc":
      sorted.sort((a, b) => a.estimatedValue - b.estimatedValue);
      break;
    case "producer":
      sorted.sort((a, b) => a.producer.localeCompare(b.producer));
      break;
    case "updated":
      sorted.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
      break;
  }
  return sorted;
}

const controlClassName =
  "rounded border border-[#c4a96a]/20 bg-[#2a221c] px-3 py-2 text-xs text-[#f5f1eb] outline-none transition-colors focus:border-[#c4a96a]/50";

function nowTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function randomTrade(rows: WineRow[]): Trade | null {
  if (rows.length === 0) return null;
  const row = rows[Math.floor(Math.random() * rows.length)];
  const side: "bid" | "ask" = Math.random() > 0.5 ? "bid" : "ask";
  const spread = Math.round(row.estimatedValue * 0.02);
  const price =
    side === "bid"
      ? row.estimatedValue - Math.floor(spread / 2)
      : row.estimatedValue + Math.floor(spread / 2);

  return {
    id: `${Date.now()}-${Math.random()}`,
    time: nowTime(),
    producer: row.producer,
    vintage: row.vintage,
    format: row.format,
    price,
    side,
    qty: [1, 2, 3, 6, 12][Math.floor(Math.random() * 5)],
  };
}

function initialTrades(rows: WineRow[]): Trade[] {
  return rows.slice(0, 8).map((row, i) => ({
    id: `t${i}`,
    time: "--:--:--",
    producer: row.producer,
    vintage: row.vintage,
    format: row.format,
    price: row.estimatedValue,
    side: i % 2 === 0 ? "ask" : "bid",
    qty: [1, 2, 3, 6][i % 4],
  }));
}

type MarketDashboardProps = {
  lots: MarketLot[];
  error: string | null;
};

export default function MarketDashboard({ lots, error }: MarketDashboardProps) {
  const rows = useMemo(() => lots.map(lotToRow), [lots]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vintageFilter, setVintageFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [sourceCountFilter, setSourceCountFilter] = useState<SourceCountRange>("all");
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [trades, setTrades] = useState<Trade[]>(() => initialTrades(rows));
  const [clock, setClock] = useState("--:--:--");
  const [flashTradeId, setFlashTradeId] = useState<string | null>(null);

  const vintageOptions = useMemo(
    () => [...new Set(rows.map((row) => row.vintage))].sort((a, b) => b - a),
    [rows]
  );
  const regionOptions = useMemo(
    () =>
      [...new Set(rows.map((row) => row.region).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b)
      ),
    [rows]
  );
  const categoryOptions = useMemo(
    () =>
      [...new Set(rows.map((row) => row.category).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b)
      ),
    [rows]
  );
  const formatOptions = useMemo(
    () => [...new Set(rows.map((row) => row.format))].sort((a, b) => a.localeCompare(b)),
    [rows]
  );
  const hasRealSourceCounts = useMemo(() => rows.some((row) => row.hasRealEstimate), [rows]);

  const filteredRows = useMemo(() => {
    const filtered = rows.filter(
      (row) =>
        rowMatchesSearch(row, search) &&
        (regionFilter === "all" || row.region === regionFilter) &&
        (categoryFilter === "all" || row.category === categoryFilter) &&
        (vintageFilter === "all" || String(row.vintage) === vintageFilter) &&
        (formatFilter === "all" || row.format === formatFilter) &&
        matchesSourceCountRange(row.sourceCount, sourceCountFilter)
    );
    return sortRows(filtered, sort);
  }, [rows, search, regionFilter, categoryFilter, vintageFilter, formatFilter, sourceCountFilter, sort]);

  const hasActiveFilters =
    search.trim() !== "" ||
    regionFilter !== "all" ||
    categoryFilter !== "all" ||
    vintageFilter !== "all" ||
    formatFilter !== "all" ||
    sourceCountFilter !== "all" ||
    sort !== DEFAULT_SORT;

  function resetFilters() {
    setSearch("");
    setRegionFilter("all");
    setCategoryFilter("all");
    setVintageFilter("all");
    setFormatFilter("all");
    setSourceCountFilter("all");
    setSort(DEFAULT_SORT);
  }

  useEffect(() => {
    const updateClock = () => setClock(nowTime());
    updateClock();
    const clockInterval = setInterval(updateClock, 2200);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (rows.length === 0 || Math.random() <= 0.4) return;

      const trade = randomTrade(rows);
      if (!trade) return;

      setTrades((prev) => [trade, ...prev.slice(0, 19)]);
      setFlashTradeId(trade.id);
      setTimeout(() => setFlashTradeId(null), 800);
    }, 2200);
    return () => clearInterval(interval);
  }, [rows]);

  const totalVolume = rows.reduce((s, r) => s + r.estimatedValue, 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1410] text-[#f5f1eb]">
      <header className="border-b border-[#c4a96a]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-wine text-3xl tracking-wide text-[#c4a96a] transition-colors hover:text-[#f5f1eb]"
            >
              Vinoex
            </Link>
            <div className="hidden h-5 w-px bg-[#c4a96a]/30 sm:block" />
            <span className="hidden text-xs uppercase tracking-[0.25em] text-[#f5f1eb]/50 sm:block">
              Fine Wine &amp; Spirits Exchange
            </span>
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.2em] text-[#f5f1eb]/40 transition-colors hover:text-[#c4a96a]"
            >
              ← Home
            </Link>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d5a3d] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2d5a3d]" />
              </span>
              <span className="uppercase tracking-widest text-[#2d5a3d]">Market Open</span>
            </div>
            <span className="font-mono text-[#c4a96a]">{clock}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-px border-b border-[#c4a96a]/10 bg-[#c4a96a]/10 sm:grid-cols-4">
        {[
          { label: "Active Lots", value: rows.length.toString() },
          { label: "Aggregate EMV", value: formatMarketValue(totalVolume) },
          { label: "Currency", value: "GBP" },
          { label: "Data Sources", value: "Preview" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1410] px-5 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5f1eb]/40">{stat.label}</p>
            <p className="mt-0.5 text-lg font-light text-[#c4a96a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Market Board</h2>
              <p className="mt-1 text-sm text-[#f5f1eb]/50">
                Estimated market values across primary lots
              </p>
              <p className="mt-1 text-[10px] text-[#f5f1eb]/35">{EARLY_PREVIEW_MARKET_NOTE}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded border border-[#7a2020]/40 bg-[#7a2020]/10 px-4 py-3 text-sm text-[#f5f1eb]">
              <p className="font-medium text-[#c4a96a]">Unable to load wines</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {!error && rows.length === 0 && (
            <p className="mb-4 text-sm text-[#f5f1eb]/50">
              No wines in the catalogue yet. Add rows to the <code className="text-[#c4a96a]">wines</code> table to populate this board.
            </p>
          )}

          {!error && rows.length > 0 && (
            <div className="mb-4 space-y-3 rounded border border-[#c4a96a]/15 bg-[#1f1915] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="sr-only" htmlFor="market-search">
                  Search lots
                </label>
                <input
                  id="market-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search producer, vintage, format, region…"
                  className={`${controlClassName} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="shrink-0 rounded border border-[#c4a96a]/20 px-3 py-2 text-xs uppercase tracking-[0.15em] text-[#c4a96a] transition-colors hover:border-[#c4a96a]/40 hover:bg-[#c4a96a]/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reset filters
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                    Region
                  </span>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className={controlClassName}
                  >
                    <option value="all">All regions</option>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                    Category
                  </span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={controlClassName}
                  >
                    <option value="all">All categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                    Vintage
                  </span>
                  <select
                    value={vintageFilter}
                    onChange={(e) => setVintageFilter(e.target.value)}
                    className={controlClassName}
                  >
                    <option value="all">All vintages</option>
                    {vintageOptions.map((vintage) => (
                      <option key={vintage} value={String(vintage)}>
                        {vintage}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                    Format
                  </span>
                  <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className={controlClassName}
                  >
                    <option value="all">All formats</option>
                    {formatOptions.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </label>

                {hasRealSourceCounts && (
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                      Sources
                    </span>
                    <select
                      value={sourceCountFilter}
                      onChange={(e) => setSourceCountFilter(e.target.value as SourceCountRange)}
                      className={controlClassName}
                    >
                      <option value="all">All ranges</option>
                      <option value="1-3">1–3 sources</option>
                      <option value="4-6">4–6 sources</option>
                      <option value="7+">7+ sources</option>
                    </select>
                  </label>
                )}

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                    Sort
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className={controlClassName}
                  >
                    <option value="value-desc">EMV high to low</option>
                    <option value="value-asc">EMV low to high</option>
                    <option value="producer">Producer A–Z</option>
                    <option value="updated">Last updated</option>
                  </select>
                </label>
              </div>

              <p className="text-xs text-[#f5f1eb]/45">
                Showing {filteredRows.length} of {rows.length} lots
              </p>
            </div>
          )}

          <div className="overflow-x-auto rounded border border-[#c4a96a]/15">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#c4a96a]/15 bg-[#2a221c] text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                  <th className="px-4 py-3 text-left font-normal">Producer</th>
                  <th className="px-3 py-3 text-center font-normal">Vintage</th>
                  <th className="px-3 py-3 text-center font-normal">Format</th>
                  <th className="px-3 py-3 text-right font-normal">Est. Market Value</th>
                  <th className="px-3 py-3 text-center font-normal">Sources</th>
                  <th className="px-4 py-3 text-right font-normal">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-[#f5f1eb]/45"
                    >
                      No lots match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-[#c4a96a]/8 transition-colors duration-300 hover:bg-[#2a221c]/60 ${
                        i % 2 === 0 ? "bg-[#1a1410]" : "bg-[#1f1915]"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-wine text-base text-[#f5f1eb]">{row.producer}</span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-[#c4a96a]">{row.vintage}</td>
                      <td className="px-3 py-3 text-center text-xs text-[#f5f1eb]/60">{row.format}</td>
                      <td className="px-3 py-3 text-right font-mono text-[#f5f1eb]">
                        {formatMarketValue(row.estimatedValue)}
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-xs text-[#f5f1eb]/50">
                        {row.sourceCount}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[#f5f1eb]/45">{row.lastUpdated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="w-full shrink-0 border-t border-[#c4a96a]/15 bg-[#1f1915] lg:w-80 lg:border-t-0 lg:border-l xl:w-96">
          <div className="border-b border-[#c4a96a]/15 px-4 py-4">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Trade Tape</h2>
            <p className="mt-1 text-[10px] text-[#f5f1eb]/40">Recent executions</p>
            <p className="mt-1 text-[10px] text-[#f5f1eb]/30">{EARLY_PREVIEW_MARKET_NOTE}</p>
          </div>

          <div className="overflow-auto lg:max-h-[calc(100vh-200px)]">
            {trades.length === 0 ? (
              <p className="px-4 py-6 text-xs text-[#f5f1eb]/35">No activity yet.</p>
            ) : (
              trades.map((trade) => (
                <div
                  key={trade.id}
                  className={`border-b border-[#c4a96a]/8 px-4 py-3 transition-colors duration-500 ${
                    flashTradeId === trade.id ? "bg-[#c4a96a]/10" : "hover:bg-[#2a221c]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#f5f1eb]/35">{trade.time}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-widest ${
                        trade.side === "bid"
                          ? "bg-[#2d5a3d]/20 text-[#2d5a3d]"
                          : "bg-[#7a2020]/20 text-[#7a2020]"
                      }`}
                    >
                      {trade.side}
                    </span>
                  </div>
                  <p className="font-wine mt-1 text-sm leading-snug text-[#f5f1eb]">
                    {trade.producer}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-[#f5f1eb]/45">
                      {trade.vintage} · {trade.format} · {trade.qty} cs
                    </span>
                    <span
                      className={`font-mono text-sm ${
                        trade.side === "bid" ? "text-[#2d5a3d]" : "text-[#7a2020]"
                      }`}
                    >
                      {formatMarketValue(trade.price)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <footer className="border-t border-[#c4a96a]/10 px-6 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#f5f1eb]/25">
        Vinoex · London · Hong Kong · New York · Estimated market data
      </footer>
    </div>
  );
}
