import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';

export type PhotographyCountryFilterItem = {
  code: string;
  name: string;
  count: number;
};

export function buildPhotographyCountryFilters(
  photos: PhotographyListQueryResult,
): PhotographyCountryFilterItem[] {
  const counts = new Map<string, PhotographyCountryFilterItem>();

  for (const photo of photos) {
    const code = photo.place?.countryCode?.trim().toUpperCase();
    const name = photo.place?.countryName?.trim();
    if (!code || !name) continue;

    const existing = counts.get(code);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(code, { code, name, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
