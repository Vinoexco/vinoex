export function formatMarketValue(n: number) {
  return n.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

export const EARLY_PREVIEW_MARKET_NOTE =
  "Market values are estimated during early preview.";
