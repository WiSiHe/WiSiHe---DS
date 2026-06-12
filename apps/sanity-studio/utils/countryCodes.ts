import { COUNTRIES } from '../constants/countries';

/** ISO 3166-1 alpha-2 — derived from constants/countries.ts (+ aliases for legacy content). */
export const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  ...Object.fromEntries(COUNTRIES.map(c => [c.name, c.code])),
  UK: 'GB',
  USA: 'US',
  'United States of America': 'US',
  'Czech Republic': 'CZ',
  Türkiye: 'TR',
  Korea: 'KR',
};

export function countryNameToIso(countryName: string | null | undefined): string | undefined {
  const trimmed = countryName?.trim();
  if (!trimmed) return undefined;
  return COUNTRY_NAME_TO_ISO[trimmed] ?? undefined;
}
