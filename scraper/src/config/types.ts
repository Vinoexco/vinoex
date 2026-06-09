export type SelectorField =
  | string
  | { type: "regex"; from: string; pattern: string }
  | { type: "static"; value: string }
  | { type: "attribute"; selector: string; attr: string }
  | { type: "text_near"; selector: string; pattern: string };

export interface SourceSelectors {
  wine_name: SelectorField;
  producer: SelectorField;
  vintage: SelectorField;
  format: SelectorField;
  price: SelectorField;
  currency: SelectorField;
}

export interface JsonLdConfig {
  enabled: boolean;
  type: string;
  price_path: string;
  currency_path: string;
}

export interface SourceConfig {
  id: string;
  name: string;
  enabled: boolean;
  permission_ref?: string;
  trust_weight?: number;
  base_url: string;
  min_delay_ms?: number;
  urls: string[];
  selectors: SourceSelectors;
  blocked_patterns?: string[];
  json_ld?: JsonLdConfig;
}

export interface SourcesDefaults {
  min_delay_ms: number;
  page_timeout_ms: number;
  max_urls_per_run: number;
}

export interface SourcesFile {
  version: number;
  defaults: SourcesDefaults;
  sources: SourceConfig[];
}
