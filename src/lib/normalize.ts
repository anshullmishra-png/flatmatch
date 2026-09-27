export function normalizeArea(area: string): string {
  return area.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function displayArea(area: string): string {
  return area
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeTag(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function dedupeNormalized(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of values) {
    const key = normalizeTag(v);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(v.trim());
  }
  return result;
}
