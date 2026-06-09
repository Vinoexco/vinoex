"use client";

import { useEffect, useState, useCallback } from "react";

type OrderRow = {
  id: string;
  producer: string;
  vintage: number;
  format: string;
  bid: number;
  ask: number;
  lastTrade: number;
  change: number;
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

const INITIAL_ORDERS: OrderRow[] = [
  { id: "1", producer: "Domaine de la Romanée-Conti", vintage: 2019, format: "6×750ml", bid: 24800, ask: 25400, lastTrade: 25100, change: 1.2 },
  { id: "2", producer: "Château Pétrus", vintage: 2010, format: "12×750ml", bid: 41200, ask: 42800, lastTrade: 42000, change: -0.4 },
  { id: "3", producer: "Screaming Eagle", vintage: 2016, format: "3×750ml", bid: 8950, ask: 9400, lastTrade: 9175, change: 2.1 },
  { id: "4", producer: "Château Lafite Rothschild", vintage: 2009, format: "12×750ml", bid: 18600, ask: 19200, lastTrade: 18900, change: 0.8 },
  { id: "5", producer: "Krug", vintage: 2002, format: "6×750ml", bid: 3200, ask: 3450, lastTrade: 3325, change: -0.2 },
  { id: "6", producer: "Penfolds Grange", vintage: 2015, format: "6×750ml", bid: 4100, ask: 4350, lastTrade: 4225, change: 0.5 },
  { id: "7", producer: "Opus One", vintage: 2018, format: "6×750ml", bid: 2850, ask: 3100, lastTrade: 2975, change: -1.1 },
  { id: "8", producer: "Château d'Yquem", vintage: 2001, format: "12×375ml", bid: 6200, ask: 6600, lastTrade: 6400, change: 1.6 },
  { id: "9", producer: "Harlan Estate", vintage: 2017, format: "3×750ml", bid: 7200, ask: 7650, lastTrade: 7425, change: 0.3 },
  { id: "10", producer: "Macallan 25 Year", vintage: 1997, format: "1×700ml", bid: 4800, ask: 5200, lastTrade: 5000, change: 0.0 },
  { id: "11", producer: "Château Margaux", vintage: 2015, format: "12×750ml", bid: 9800, ask: 10200, lastTrade: 10000, change: -0.6 },
  { id: "12", producer: "Sassicaia", vintage: 2016, format: "6×750ml", bid: 3400, ask: 3700, lastTrade: 3550, change: 1.4 },
];

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatChange(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function randomTrade(): Trade {
  const order = INITIAL_ORDERS[Math.floor(Math.random() * INITIAL_ORDERS.length)];
  const side: "bid" | "ask" = Math.random() > 0.5 ? "bid" : "ask";
  const price = side === "bid"
    ? order.bid + Math.floor(Math.random() * 200)
    : order.ask - Math.floor(Math.random() * 200);
  return {
    id: `${Date.now()}-${Math.random()}`,
    time: nowTime(),
    producer: order.producer,
    vintage: order.vintage,
    format: order.format,
    price,
    side,
    qty: [1, 2, 3, 6, 12][Math.floor(Math.random() * 5)],
  };
}

const INITIAL_TRADES: Trade[] = [
  { id: "t1", time: "14:32:08", producer: "Domaine de la Romanée-Conti", vintage: 2019, format: "6×750ml", price: 25100, side: "ask", qty: 1 },
  { id: "t2", time: "14:31:54", producer: "Château Pétrus", vintage: 2010, format: "12×750ml", price: 42000, side: "bid", qty: 2 },
  { id: "t3", time: "14:31:41", producer: "Screaming Eagle", vintage: 2016, format: "3×750ml", price: 9175, side: "ask", qty: 1 },
  { id: "t4", time: "14:31:22", producer: "Krug", vintage: 2002, format: "6×750ml", price: 3325, side: "bid", qty: 3 },
  { id: "t5", time: "14:31:09", producer: "Harlan Estate", vintage: 2017, format: "3×750ml", price: 7425, side: "ask", qty: 1 },
  { id: "t6", time: "14:30:55", producer: "Macallan 25 Year", vintage: 1997, format: "1×700ml", price: 5000, side: "bid", qty: 2 },
  { id: "t7", time: "14:30:38", producer: "Château Lafite Rothschild", vintage: 2009, format: "12×750ml", price: 18900, side: "ask", qty: 1 },
  { id: "t8", time: "14:30:17", producer: "Sassicaia", vintage: 2016, format: "6×750ml", price: 3550, side: "bid", qty: 6 },
];

export default function MarketPage() {
  const [orders, setOrders] = useState<OrderRow[]>(INITIAL_ORDERS);
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [clock, setClock] = useState("");
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const [flashTradeId, setFlashTradeId] = useState<string | null>(null);

  const tick = useCallback(() => {
    setClock(nowTime());

    setOrders((prev) => {
      const idx = Math.floor(Math.random() * prev.length);
      const row = prev[idx];
      const delta = (Math.random() - 0.5) * 80;
      const newBid = Math.max(100, Math.round(row.bid + delta));
      const newAsk = newBid + Math.round(200 + Math.random() * 400);
      const newLast = Math.round((newBid + newAsk) / 2);
      const newChange = row.change + (Math.random() - 0.5) * 0.3;

      setFlashIds(new Set([row.id]));
      setTimeout(() => setFlashIds(new Set()), 600);

      const updated = [...prev];
      updated[idx] = { ...row, bid: newBid, ask: newAsk, lastTrade: newLast, change: parseFloat(newChange.toFixed(1)) };
      return updated;
    });

    if (Math.random() > 0.4) {
      const trade = randomTrade();
      setTrades((prev) => [trade, ...prev.slice(0, 19)]);
      setFlashTradeId(trade.id);
      setTimeout(() => setFlashTradeId(null), 800);
    }
  }, []);

  useEffect(() => {
    setClock(nowTime());
    const interval = setInterval(tick, 2200);
    return () => clearInterval(interval);
  }, [tick]);

  const totalVolume = orders.reduce((s, o) => s + o.lastTrade, 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1410] text-[#f5f1eb]">
      <header className="border-b border-[#c4a96a]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-wine text-3xl tracking-wide text-[#c4a96a]">
              Vinoex
            </h1>
            <div className="hidden h-5 w-px bg-[#c4a96a]/30 sm:block" />
            <span className="hidden text-xs uppercase tracking-[0.25em] text-[#f5f1eb]/50 sm:block">
              Fine Wine &amp; Spirits Exchange
            </span>
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
          { label: "Active Lots", value: orders.length.toString() },
          { label: "Session Volume", value: formatPrice(totalVolume) },
          { label: "Avg Spread", value: "3.2%" },
          { label: "Trades Today", value: "847" },
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
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Order Book</h2>
              <p className="mt-1 text-sm text-[#f5f1eb]/50">Live bids &amp; asks across primary markets</p>
            </div>
            <div className="flex gap-3 text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-[#2d5a3d]">
                <span className="h-2 w-2 rounded-sm bg-[#2d5a3d]" /> Bid
              </span>
              <span className="flex items-center gap-1.5 text-[#7a2020]">
                <span className="h-2 w-2 rounded-sm bg-[#7a2020]" /> Ask
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded border border-[#c4a96a]/15">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#c4a96a]/15 bg-[#2a221c] text-[10px] uppercase tracking-[0.15em] text-[#f5f1eb]/40">
                  <th className="px-4 py-3 text-left font-normal">Producer</th>
                  <th className="px-3 py-3 text-center font-normal">Vintage</th>
                  <th className="px-3 py-3 text-center font-normal">Format</th>
                  <th className="px-3 py-3 text-right font-normal text-[#2d5a3d]">Bid</th>
                  <th className="px-3 py-3 text-right font-normal text-[#7a2020]">Ask</th>
                  <th className="px-3 py-3 text-right font-normal">Spread</th>
                  <th className="px-3 py-3 text-right font-normal">Last Trade</th>
                  <th className="px-4 py-3 text-right font-normal">Change</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((row, i) => {
                  const spread = row.ask - row.bid;
                  const spreadPct = ((spread / row.bid) * 100).toFixed(1);
                  const isUp = row.change > 0;
                  const isDown = row.change < 0;
                  const flashing = flashIds.has(row.id);

                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-[#c4a96a]/8 transition-colors duration-300 hover:bg-[#2a221c]/60 ${
                        flashing ? "bg-[#c4a96a]/8" : i % 2 === 0 ? "bg-[#1a1410]" : "bg-[#1f1915]"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-wine text-base text-[#f5f1eb]">{row.producer}</span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-[#c4a96a]">{row.vintage}</td>
                      <td className="px-3 py-3 text-center text-xs text-[#f5f1eb]/60">{row.format}</td>
                      <td className="px-3 py-3 text-right font-mono text-[#2d5a3d]">{formatPrice(row.bid)}</td>
                      <td className="px-3 py-3 text-right font-mono text-[#7a2020]">{formatPrice(row.ask)}</td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-[#f5f1eb]/50">
                        {formatPrice(spread)}
                        <span className="ml-1 text-[#f5f1eb]/30">({spreadPct}%)</span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[#f5f1eb]">{formatPrice(row.lastTrade)}</td>
                      <td className={`px-4 py-3 text-right font-mono text-xs ${
                        isUp ? "text-[#2d5a3d]" : isDown ? "text-[#7a2020]" : "text-[#f5f1eb]/40"
                      }`}>
                        {formatChange(row.change)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="w-full shrink-0 border-t border-[#c4a96a]/15 bg-[#1f1915] lg:w-80 lg:border-t-0 lg:border-l xl:w-96">
          <div className="border-b border-[#c4a96a]/15 px-4 py-4">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Trade Tape</h2>
            <p className="mt-1 text-[10px] text-[#f5f1eb]/40">Recent executions</p>
          </div>

          <div className="overflow-auto lg:max-h-[calc(100vh-200px)]">
            {trades.map((trade) => (
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
                    {formatPrice(trade.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer className="border-t border-[#c4a96a]/10 px-6 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#f5f1eb]/25">
        Vinoex · London · Hong Kong · New York · Simulated market data
      </footer>
    </div>
  );
}
