import type { FilterSpecification } from 'mapbox-gl';

/** ISO 3166-1 alpha-2 codes for Mapbox country-boundaries filtering. */
export const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  Ukraine: 'UA',
  Denmark: 'DK',
  Sweden: 'SE',
  Monaco: 'MC',
  France: 'FR',
  Spain: 'ES',
  Poland: 'PL',
  Germany: 'DE',
  'United Kingdom': 'GB',
  UK: 'GB',
  Belgium: 'BE',
  Netherlands: 'NL',
  'Czech Republic': 'CZ',
  Czechia: 'CZ',
  Italy: 'IT',
  Hungary: 'HU',
  Turkey: 'TR',
  Türkiye: 'TR',
  Greece: 'GR',
  Luxembourg: 'LU',
  Norway: 'NO',
  Finland: 'FI',
  Iceland: 'IS',
  Portugal: 'PT',
  USA: 'US',
  'United States': 'US',
  'United States of America': 'US',
  Canada: 'CA',
  Austria: 'AT',
  Switzerland: 'CH',
  Ireland: 'IE',
  Croatia: 'HR',
  Slovenia: 'SI',
  Slovakia: 'SK',
  Romania: 'RO',
  Bulgaria: 'BG',
  Estonia: 'EE',
  Latvia: 'LV',
  Lithuania: 'LT',
};

export function resolveCountryIsoCode(
  countryName: string | null | undefined,
  countryCode?: string | null,
): string | null {
  const explicit = countryCode?.trim().toUpperCase();
  if (explicit && /^[A-Z]{2}$/.test(explicit)) return explicit;
  if (!countryName) return null;
  return COUNTRY_NAME_TO_ISO[countryName.trim()] ?? null;
}

/**
 * Mapbox country-boundaries-v1 filter.
 * Uses multiple worldviews so UA / GR / TR polygons are not dropped by US-only + disputed rules.
 */
export function buildCountryBoundaryFilter(isoCodes: string[]): FilterSpecification {
  if (isoCodes.length === 0) {
    return ['boolean', false];
  }

  return [
    'all',
    [
      'any',
      ['==', ['get', 'worldview'], 'all'],
      ['in', 'US', ['get', 'worldview']],
      ['in', 'TR', ['get', 'worldview']],
      ['in', 'RU', ['get', 'worldview']],
    ],
    ['in', ['get', 'iso_3166_1'], ['literal', isoCodes]],
  ];
}
