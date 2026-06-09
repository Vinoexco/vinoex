"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Market", href: "/market" },
  { label: "Portfolio", href: "#portfolio-intelligence" },
  { label: "Watchlist", href: "#live-market" },
  { label: "Insights", href: "#why-wine" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#c4a96a]/20 bg-[#1a1410]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-wine text-2xl tracking-wide text-[#c4a96a] sm:text-3xl">
          Vinoex
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-[#f5f1eb]/60 transition-colors hover:text-[#c4a96a]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded border border-[#c4a96a]/25 text-[#c4a96a] md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#c4a96a]/15 px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block text-sm uppercase tracking-[0.2em] text-[#f5f1eb]/70 transition-colors hover:text-[#c4a96a]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
