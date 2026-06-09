"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PREVIEW_ROWS = [
  { producer: "Domaine de la Romanée-Conti", vintage: 2019, bid: 24800, ask: 25400, change: 1.2 },
  { producer: "Château Pétrus", vintage: 2010, bid: 41200, ask: 42800, change: -0.4 },
  { producer: "Screaming Eagle", vintage: 2016, bid: 8950, ask: 9400, change: 2.1 },
  { producer: "Château Lafite Rothschild", vintage: 2009, bid: 18600, ask: 19200, change: 0.8 },
];

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function MarketPreview() {
  const [rows, setRows] = useState(PREVIEW_ROWS);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const row = prev[idx];
        const delta = Math.round((Math.random() - 0.5) * 60);
        const updated = [...prev];
        updated[idx] = {
          ...row,
          bid: row.bid + delta,
          ask: row.ask + delta,
          change: parseFloat((row.change + (Math.random() - 0.5) * 0.4).toFixed(1)),
        };
        return updated;
      });
      setPulse((p) => p + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden rounded border border-[#c4a96a]/20 bg-[#1f1915]">
      <div className="flex items-center justify-between border-b border-[#c4a96a]/15 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d5a3d] opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2d5a3d]" />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#2d5a3d]">Live</span>
        </div>
        <span className="font-mono text-[10px] text-[#c4a96a]/60">LIVE · SIMULATED</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-[#c4a96a]/10 text-[10px] uppercase tracking-[0.12em] text-[#f5f1eb]/35">
              <th className="px-4 py-2.5 text-left font-normal sm:px-6">Producer</th>
              <th className="px-3 py-2.5 text-center font-normal">Vintage</th>
              <th className="px-3 py-2.5 text-right font-normal text-[#2d5a3d]">Bid</th>
              <th className="px-3 py-2.5 text-right font-normal text-[#7a2020]">Ask</th>
              <th className="px-4 py-2.5 text-right font-normal sm:px-6">Chg</th>
            </tr>
          </thead>
          <tbody key={pulse}>
            {rows.map((row, i) => {
              const isUp = row.change > 0;
              const isDown = row.change < 0;
              return (
                <tr key={row.producer} className={i % 2 === 0 ? "bg-[#1a1410]" : "bg-[#1f1915]"}>
                  <td className="px-4 py-3 sm:px-6">
                    <span className="font-wine text-sm text-[#f5f1eb]">{row.producer}</span>
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-xs text-[#c4a96a]">{row.vintage}</td>
                  <td className="px-3 py-3 text-right font-mono text-xs text-[#2d5a3d]">{formatPrice(row.bid)}</td>
                  <td className="px-3 py-3 text-right font-mono text-xs text-[#7a2020]">{formatPrice(row.ask)}</td>
                  <td className={`px-4 py-3 text-right font-mono text-xs sm:px-6 ${
                    isUp ? "text-[#2d5a3d]" : isDown ? "text-[#7a2020]" : "text-[#f5f1eb]/40"
                  }`}>
                    {isUp ? "+" : ""}{row.change.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#c4a96a]/15 px-4 py-4 text-center sm:px-6">
        <Link
          href="/market"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c4a96a] transition-colors hover:text-[#f5f1eb]"
        >
          Open Full Terminal
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
