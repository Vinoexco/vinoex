import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";
import type { SourceConfig, SourcesFile } from "./types";

const selectorFieldSchema = z.union([
  z.string(),
  z.object({
    type: z.literal("regex"),
    from: z.string(),
    pattern: z.string(),
  }),
  z.object({
    type: z.literal("static"),
    value: z.string(),
  }),
  z.object({
    type: z.literal("attribute"),
    selector: z.string(),
    attr: z.string(),
  }),
  z.object({
    type: z.literal("text_near"),
    selector: z.string(),
    pattern: z.string(),
  }),
]);

const sourceSelectorsSchema = z.object({
  wine_name: selectorFieldSchema,
  producer: selectorFieldSchema,
  vintage: selectorFieldSchema,
  format: selectorFieldSchema,
  price: selectorFieldSchema,
  currency: selectorFieldSchema,
});

const sourceConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  enabled: z.boolean(),
  permission_ref: z.string().optional(),
  trust_weight: z.number().min(0).max(1).optional(),
  base_url: z.string().url(),
  min_delay_ms: z.number().int().positive().optional(),
  urls: z.array(z.string().url()).min(1),
  selectors: sourceSelectorsSchema,
  blocked_patterns: z.array(z.string()).optional(),
  json_ld: z
    .object({
      enabled: z.boolean(),
      type: z.string(),
      price_path: z.string(),
      currency_path: z.string(),
    })
    .optional(),
});

const sourcesFileSchema = z.object({
  version: z.literal(1),
  defaults: z.object({
    min_delay_ms: z.number().int().positive(),
    page_timeout_ms: z.number().int().positive(),
    max_urls_per_run: z.number().int().positive(),
  }),
  sources: z.array(sourceConfigSchema),
});

const CONFIG_PATH = path.resolve(__dirname, "../../config/sources.json");

export function getConfigPath(): string {
  return CONFIG_PATH;
}

export function loadSources(configPath: string = CONFIG_PATH): SourcesFile {
  const raw = readFileSync(configPath, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  return sourcesFileSchema.parse(parsed);
}

export function getEnabledSources(file: SourcesFile): SourceConfig[] {
  return file.sources.filter((source) => source.enabled);
}
