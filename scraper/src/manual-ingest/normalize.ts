/** Lowercase, strip accents, and collapse punctuation for fuzzy text matching. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugifySourceName(name: string): string {
  return normalizeText(name).replace(/\s+/g, "-");
}

export function parseFormatLabel(formatLabel: string): { formatMl: number | null; packSize: number | null } {
  const normalized = formatLabel.toLowerCase();

  const packMatch = normalized.match(/(\d+)\s*ml\s*x\s*(\d+)/);
  if (packMatch) {
    return { formatMl: Number(packMatch[1]), packSize: Number(packMatch[2]) };
  }

  const mlMatch = normalized.match(/(\d+)\s*ml/);
  if (mlMatch) {
    return { formatMl: Number(mlMatch[1]), packSize: 1 };
  }

  return { formatMl: null, packSize: null };
}
