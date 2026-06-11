"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  EARLY_PREVIEW_MARKET_NOTE,
  formatMarketValue,
} from "@/lib/format-currency";
import {
  estimatedMarketValueGbp,
  placeholderLastUpdated,
  placeholderSourceCount,
} from "@/lib/market-estimate";
import type { Wine } from "@/types/database";

type WineRow = {
  id: string;
  slug: string;
  producer: string;
  vintage: number;
  format: string;
  estimatedValue: number;
  sourceCount: number;
  lastUpdated: string;
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

function wineToRow(wine: Wine): WineRow {
  return {
    id: wine.id,
    slug: wine.slug,
    producer: wine.canonical_producer,
    vintage: wine.vintage,
    format: wine.format_label,
    estimatedValue: estimatedMarketValueGbp(wine.slug),
    sourceCount: placeholderSourceCount(wine.slug),
    lastUpdated: placeholderLastUpdated(wine.slug),
  };
}

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
    time: nowTime(),
    producer: row.producer,
    vintage: row.vintage,
    format: row.format,
    price: row.estimatedValue,
    side: i % 2 === 0 ? "ask" : "bid",
    qty: [1, 2, 3, 6][i % 4],
  }));
}

type MarketDashboardProps = {
  wines: Wine[];
  error: string | null;
};

export default function MarketDashboard({ wines, error }: MarketDashboardProps) {
  const rows = useMemo(() => wines.map(wineToRow), [wines]);
  const [trades, setTrades] = useState<Trade[]>(() => initialTrades(rows));
  const [clock, setClock] = useState(nowTime);
  const [flashTradeId, setFlashTradeId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(nowTime());

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
                {rows.map((row, i) => (
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
                ))}
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
