"use client";

import { useEffect, useState } from "react";

const INDICES = [
  { name: "Fine Wine Index", change: 2.4, primary: true },
  { name: "Bordeaux", change: 1.8 },
  { name: "Burgundy", change: 3.2 },
  { name: "Champagne", change: 0.9 },
  { name: "Spirits", change: 4.1 },
];

const CHART_POINTS = [42, 44, 43, 46, 48, 47, 51, 53, 52, 56, 58, 61, 63, 65, 68, 71, 74];
const CHART_LABELS = ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Jan"];

function buildPath(points: number[], width: number, height: number, padding: number) {
  const max = Math.max(...points);
  const min = Math.min(...points) - 2;
  const range = max - min;
  const stepX = (width - padding * 2) / (points.length - 1);

  const coords = points.map((p, i) => ({
    x: padding + i * stepX,
    y: padding + (height - padding * 2) * (1 - (p - min) / range),
  }));

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padding} L ${coords[0].x.toFixed(1)} ${height - padding} Z`;

  return { line, area, coords, last: coords[coords.length - 1] };
}

function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function HeroMarketPanel() {
  const [clock, setClock] = useState("");
  const [indices, setIndices] = useState(INDICES);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setClock(nowTime());
    const interval = setInterval(() => {
      setClock(nowTime());
      setTick((t) => t + 1);

      if (Math.random() > 0.55) {
        setIndices((prev) =>
          prev.map((item) => {
            const delta = (Math.random() - 0.48) * 0.15;
            return { ...item, change: parseFloat(Math.max(0, item.change + delta).toFixed(1)) };
          })
        );
      }
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const w = 400;
  const h = 140;
  const pad = 8;
  const { line, area, last } = buildPath(CHART_POINTS, w, h, pad);

  return (
    <div className="relative overflow-hidden rounded-lg border border-[#c4a96a]/20 bg-[#1f1915] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#c4a96a]/12 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#c4a96a]">Market Intelligence</span>
          <span className="hidden h-3 w-px bg-[#c4a96a]/20 sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d5a3d] opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2d5a3d]" />
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#2d5a3d]/80">Live</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-[#f5f1eb]/30">{clock}</span>
      </div>

      {/* Primary index */}
      <div className="border-b border-[#c4a96a]/10 px-5 py-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5f1eb]/35">Fine Wine Index</p>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="font-mono text-3xl font-light tracking-tight text-[#f5f1eb] sm:text-4xl">
            1,847.3
          </span>
          <span
            key={indices[0].change}
            className="font-mono text-sm text-[#2d5a3d] transition-opacity duration-300"
          >
            +{indices[0].change.toFixed(1)}%
          </span>
        </div>
        <p className="mt-1 text-[10px] text-[#f5f1eb]/25">YTD · Liv-ex benchmark composite</p>
      </div>

      {/* Chart */}
      <div className="relative px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/30">12-Month Performance</span>
          <span className="font-mono text-[10px] text-[#c4a96a]/50">+12.8%</span>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c4a96a" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#c4a96a" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9a8455" />
                <stop offset="100%" stopColor="#c4a96a" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((pct) => (
              <line
                key={pct}
                x1={pad}
                y1={pad + (h - pad * 2) * pct}
                x2={w - pad}
                y2={pad + (h - pad * 2) * pct}
                stroke="#c4a96a"
                strokeOpacity="0.06"
                strokeWidth="0.5"
              />
            ))}

            <path d={area} fill="url(#chartFill)" />
            <path
              d={line}
              fill="none"
              stroke="url(#chartLine)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* End dot */}
            <circle
              cx={last.x}
              cy={last.y}
              r="3"
              fill="#c4a96a"
              opacity="0.9"
            />
            <circle
              cx={last.x}
              cy={last.y}
              r="6"
              fill="#c4a96a"
              opacity={tick % 2 === 0 ? 0.15 : 0.25}
              className="transition-opacity duration-1000"
            />
          </svg>

          <div className="mt-2 flex justify-between">
            {CHART_LABELS.map((label, index) => (
              <span key={`${label}-${index}`} className="text-[9px] text-[#f5f1eb]/20">{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Regional indices */}
      <div className="border-t border-[#c4a96a]/10 px-5 py-4">
        <div className="space-y-2.5">
          {indices.slice(1).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <span className="text-xs text-[#f5f1eb]/50">{item.name}</span>
              <div className="flex items-center gap-3">
                <div className="hidden h-[3px] w-20 overflow-hidden rounded-full bg-[#f5f1eb]/5 sm:block sm:w-28">
                  <div
                    className="h-full rounded-full bg-[#2d5a3d]/50"
                    style={{ width: `${Math.min(100, item.change * 22)}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-xs text-[#2d5a3d]">
                  +{item.change.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker strip */}
      <div className="overflow-hidden border-t border-[#c4a96a]/10 bg-[#1a1410]/60 px-5 py-2">
        <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-[#f5f1eb]/25">
          <span className="shrink-0 text-[#c4a96a]/40">Tape</span>
          <div className="flex gap-6 overflow-hidden whitespace-nowrap">
            <span>DRC &apos;19 <span className="text-[#2d5a3d]">+1.2%</span></span>
            <span className="hidden sm:inline">Pétrus &apos;10 <span className="text-[#7a2020]/70">−0.4%</span></span>
            <span className="hidden md:inline">Lafite &apos;09 <span className="text-[#2d5a3d]">+0.8%</span></span>
            <span className="hidden lg:inline">Macallan 25 <span className="text-[#2d5a3d]">+0.3%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
