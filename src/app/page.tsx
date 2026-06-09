import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroMarketPanel from "@/components/HeroMarketPanel";
import MarketPreview from "@/components/MarketPreview";

const WHY_WINE = [
  {
    title: "Uncorrelated Returns",
    body: "Fine wine has historically moved independently of equities and bonds, offering genuine portfolio diversification when traditional markets falter.",
  },
  {
    title: "Finite Supply",
    body: "Each vintage is produced once. As bottles are consumed, scarcity deepens — a structural tailwind that equities cannot replicate.",
  },
  {
    title: "Global Demand",
    body: "Collectors across Asia, Europe, and the Americas compete for the same blue-chip labels, sustaining liquidity in premier lots.",
  },
];

const PORTFOLIO_FEATURES = [
  { label: "Total Value", value: "$1.24M", sub: "+8.3% YTD" },
  { label: "Holdings", value: "47 Lots", sub: "12 regions" },
  { label: "Avg. Holding", value: "4.2 yrs", sub: "Long-term" },
  { label: "Unrealised Gain", value: "+$186K", sub: "Since inception" },
];

const STEPS = [
  { step: "01", title: "Discover", body: "Browse live order books across Bordeaux, Burgundy, Napa, and spirits — with institutional-grade pricing data." },
  { step: "02", title: "Analyse", body: "Track vintage performance, monitor spreads, and build watchlists around producers that match your thesis." },
  { step: "03", title: "Allocate", body: "Construct a diversified cellar portfolio with the same rigour you apply to any alternative asset class." },
  { step: "04", title: "Monitor", body: "Receive real-time valuations, trade alerts, and portfolio intelligence as markets move." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1410] text-[#f5f1eb]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#c4a96a]/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#c4a96a08_0%,_transparent_55%)]" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#7a2020]/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-[500px] w-[500px] rounded-full bg-[#c4a96a]/[0.03] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-28 xl:gap-16">
          {/* Left column — copy */}
          <div className="lg:pr-4">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#c4a96a]">
              Alternative Assets
            </p>
            <h1 className="font-wine text-5xl leading-tight text-[#f5f1eb] sm:text-6xl lg:text-6xl xl:text-7xl">
              Invest In Wine
            </h1>
            <p className="mt-4 text-lg text-[#c4a96a] sm:text-xl">
              Alternative assets made accessible.
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f5f1eb]/60 sm:text-lg">
              Track fine wine prices, monitor market movement, and build a portfolio
              around one of the world&apos;s most overlooked asset classes.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/market"
                className="inline-flex h-12 items-center justify-center bg-[#c4a96a] px-8 text-xs uppercase tracking-[0.2em] text-[#1a1410] transition-colors hover:bg-[#d4bc82]"
              >
                Explore Market
              </Link>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center border border-[#c4a96a]/40 px-8 text-xs uppercase tracking-[0.2em] text-[#c4a96a] transition-colors hover:border-[#c4a96a] hover:bg-[#c4a96a]/5"
              >
                Join Waitlist
              </button>
            </div>
          </div>

          {/* Right column — market intelligence panel */}
          <div className="mt-14 lg:mt-0">
            <HeroMarketPanel />
          </div>
        </div>
      </section>

      {/* Why Wine */}
      <section id="why-wine" className="border-b border-[#c4a96a]/10 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Why Wine</h2>
            <p className="font-wine mt-3 text-3xl text-[#f5f1eb] sm:text-4xl">
              A tangible asset with centuries of provenance
            </p>
            <p className="mt-4 text-[#f5f1eb]/55 leading-relaxed">
              For decades, fine wine sat behind auction-house velvet ropes. Vinoex
              brings institutional transparency to a market once reserved for insiders.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_WINE.map((item) => (
              <div
                key={item.title}
                className="rounded border border-[#c4a96a]/15 bg-[#1f1915] p-6 transition-colors hover:border-[#c4a96a]/30"
              >
                <h3 className="font-wine text-xl text-[#c4a96a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f5f1eb]/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Preview */}
      <section id="live-market" className="border-b border-[#c4a96a]/10 bg-[#1f1915]/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Live Market Preview</h2>
              <p className="font-wine mt-3 text-3xl text-[#f5f1eb] sm:text-4xl">
                Real-time pricing, auction-house depth
              </p>
            </div>
            <p className="max-w-sm text-sm text-[#f5f1eb]/50">
              A glimpse into the Vinoex terminal — full order books, trade tape, and
              spread analytics at your fingertips.
            </p>
          </div>
          <MarketPreview />
        </div>
      </section>

      {/* Portfolio Intelligence */}
      <section id="portfolio-intelligence" className="border-b border-[#c4a96a]/10 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">Portfolio Intelligence</h2>
              <p className="font-wine mt-3 text-3xl text-[#f5f1eb] sm:text-4xl">
                Your cellar, quantified
              </p>
              <p className="mt-4 text-[#f5f1eb]/55 leading-relaxed">
                Aggregate holdings across regions and vintages. Monitor unrealised
                gains, benchmark against indices, and understand concentration risk —
                the same analytics desk tools used by family offices, now in one view.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-[#f5f1eb]/50">
                {["Vintage-weighted valuations", "Regional exposure breakdown", "Performance vs. Liv-ex 1000"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-[#c4a96a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-[#c4a96a]/20 bg-[#1f1915] p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5f1eb]/35">Sample Portfolio</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {PORTFOLIO_FEATURES.map((feat) => (
                  <div key={feat.label} className="border border-[#c4a96a]/10 bg-[#1a1410] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-[#f5f1eb]/35">{feat.label}</p>
                    <p className="mt-1 font-mono text-lg text-[#c4a96a]">{feat.value}</p>
                    <p className="mt-0.5 text-[10px] text-[#2d5a3d]">{feat.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 border-t border-[#c4a96a]/10 pt-6">
                {[
                  { name: "Château Pétrus 2010", pct: "18%", value: "$84,000" },
                  { name: "DRC Romanée-Conti 2019", pct: "14%", value: "$65,200" },
                  { name: "Screaming Eagle 2016", pct: "9%", value: "$41,800" },
                ].map((holding) => (
                  <div key={holding.name} className="flex items-center justify-between text-sm">
                    <span className="font-wine text-[#f5f1eb]/80">{holding.name}</span>
                    <div className="text-right">
                      <span className="font-mono text-xs text-[#f5f1eb]/50">{holding.pct}</span>
                      <span className="ml-3 font-mono text-xs text-[#c4a96a]">{holding.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#c4a96a]">How It Works</h2>
            <p className="font-wine mt-3 text-3xl text-[#f5f1eb] sm:text-4xl">
              From discovery to allocation
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <div key={item.step} className="relative border border-[#c4a96a]/15 p-6">
                <span className="font-mono text-2xl text-[#c4a96a]/30">{item.step}</span>
                <h3 className="mt-3 text-sm uppercase tracking-[0.15em] text-[#c4a96a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f5f1eb]/50">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/market"
              className="inline-flex h-12 items-center justify-center bg-[#c4a96a] px-8 text-xs uppercase tracking-[0.2em] text-[#1a1410] transition-colors hover:bg-[#d4bc82]"
            >
              Explore Market
            </Link>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center border border-[#c4a96a]/40 px-8 text-xs uppercase tracking-[0.2em] text-[#c4a96a] transition-colors hover:border-[#c4a96a] hover:bg-[#c4a96a]/5"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#c4a96a]/10 px-5 py-6 text-center text-[10px] uppercase tracking-[0.2em] text-[#f5f1eb]/25 sm:px-8">
        Vinoex · London · Hong Kong · New York
      </footer>
    </div>
  );
}
