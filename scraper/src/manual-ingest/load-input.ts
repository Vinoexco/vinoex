import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";
import type { ObservedPricesFile } from "./types";

const observedPriceSchema = z.object({
  source_name: z.string().min(1),
  source_url: z.string().url(),
  raw_title: z.string().min(1),
  producer: z.string().min(1),
  vintage: z.number().int().min(0).max(2100),
  format_label: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().length(3).transform((value) => value.toUpperCase()),
  observed_at: z.string().datetime(),
  slug: z.string().min(1).optional(),
});

const observedPricesFileSchema = z.object({
  observations: z.array(observedPriceSchema).min(1),
});

export function resolveInputPath(inputArg?: string): string {
  if (inputArg) {
    return path.resolve(process.cwd(), inputArg);
  }
  return path.resolve(__dirname, "../../data/observed-prices.json");
}

export function loadObservedPrices(inputPath: string): ObservedPricesFile {
  const raw = readFileSync(inputPath, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  return observedPricesFileSchema.parse(parsed);
}
