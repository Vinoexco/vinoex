import { normalizeText, parseFormatLabel } from "./normalize";
import type { ObservedPrice, WineRow } from "./types";

export interface WineMatch {
  wine: WineRow;
  method: "slug" | "producer_vintage_format" | "producer_vintage_ml";
}

export function matchWine(observation: ObservedPrice, wines: WineRow[]): WineMatch | null {
  if (observation.slug) {
    const bySlug = wines.find((wine) => wine.slug === observation.slug);
    if (bySlug) {
      return { wine: bySlug, method: "slug" };
    }
  }

  const producerKey = normalizeText(observation.producer);
  const formatKey = normalizeText(observation.format_label);
  const { formatMl, packSize } = parseFormatLabel(observation.format_label);

  const candidates = wines.filter((wine) => {
    if (wine.vintage !== observation.vintage) {
      return false;
    }
    return normalizeText(wine.canonical_producer) === producerKey;
  });

  if (candidates.length === 0) {
    return null;
  }

  const exactFormat = candidates.find((wine) => normalizeText(wine.format_label) === formatKey);
  if (exactFormat) {
    return { wine: exactFormat, method: "producer_vintage_format" };
  }

  if (formatMl !== null) {
    const byMl = candidates.filter((wine) => {
      if (wine.format_ml !== formatMl) {
        return false;
      }
      if (packSize !== null) {
        return wine.pack_size === packSize;
      }
      return true;
    });

    if (byMl.length === 1) {
      return { wine: byMl[0], method: "producer_vintage_ml" };
    }
  }

  if (candidates.length === 1) {
    return { wine: candidates[0], method: "producer_vintage_format" };
  }

  return null;
}
