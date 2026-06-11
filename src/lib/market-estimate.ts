/** FNV-1a-style hash for stable, slug-derived placeholders. */
function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Temporary deterministic GBP estimate until scraper pricing is live. */
export function estimatedMarketValueGbp(slug: string): number {
  const h = hashSlug(slug);
  return 750 + (h % 1921) * 25;
}

/** Placeholder source count until scrape aggregation exists. */
export function placeholderSourceCount(slug: string): number {
  return 2 + (hashSlug(`${slug}:sources`) % 9);
}

/** Placeholder last-updated label, stable per slug. */
export function placeholderLastUpdated(slug: string): string {
  const daysAgo = hashSlug(`${slug}:updated`) % 14;
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "1d ago";
  return `${daysAgo}d ago`;
}
