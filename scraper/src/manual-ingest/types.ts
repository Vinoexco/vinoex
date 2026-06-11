export type AggregateMethod = "median" | "average";

export interface ObservedPrice {
  source_name: string;
  source_url: string;
  raw_title: string;
  producer: string;
  vintage: number;
  format_label: string;
  price: number;
  currency: string;
  observed_at: string;
  /** Optional direct wine slug match (e.g. chateau-lafite-rothschild-2018-750ml). */
  slug?: string;
}

export interface ObservedPricesFile {
  observations: ObservedPrice[];
}

export interface WineRow {
  id: string;
  slug: string;
  canonical_producer: string;
  vintage: number;
  format_ml: number;
  pack_size: number;
  format_label: string;
}

export interface IngestStats {
  total: number;
  inserted: number;
  matched: number;
  unmatched: number;
  gbpConverted: number;
  fxConverted: number;
  failed: number;
  winesUpdated: number;
}

export interface IngestResult {
  stats: IngestStats;
  unmatched: Array<{ raw_title: string; producer: string; reason: string }>;
}
