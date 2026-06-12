/** Canonical country names with ISO 3166-1 alpha-2 codes for Studio pickers and queries. */
export type CountryOption = {
  name: string;
  code: string;
};

/** Sorted by name — expand here; ISO map in utils/countryCodes stays in sync for lookups. */
export const COUNTRIES: CountryOption[] = [
  { name: 'Argentina', code: 'AR' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Canada', code: 'CA' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Czechia', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Egypt', code: 'EG' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'Greece', code: 'GR' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Italy', code: 'IT' },
  { name: 'Japan', code: 'JP' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Norway', code: 'NO' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Romania', code: 'RO' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Vietnam', code: 'VN' },
];

export const COUNTRY_SELECT_OPTIONS = COUNTRIES.map(c => ({ title: c.name, value: c.name }));

const byName = new Map(COUNTRIES.map(c => [c.name.toLowerCase(), c]));
const byCode = new Map(COUNTRIES.map(c => [c.code.toUpperCase(), c]));

export function getCountryByName(name: string | null | undefined): CountryOption | undefined {
  const key = name?.trim().toLowerCase();
  if (!key) return undefined;
  return byName.get(key);
}

export function getCountryByCode(code: string | null | undefined): CountryOption | undefined {
  const key = code?.trim().toUpperCase();
  if (!key) return undefined;
  return byCode.get(key);
}

/** Map AI / legacy labels to a canonical picker option. */
export function matchCountryFromText(text: string | null | undefined): CountryOption | undefined {
  const raw = text?.trim();
  if (!raw || raw.toLowerCase() === 'unknown') return undefined;

  const direct = getCountryByName(raw);
  if (direct) return direct;

  const aliases: Record<string, string> = {
    uk: 'GB',
    usa: 'US',
    'united states of america': 'US',
    'czech republic': 'CZ',
    türkiye: 'TR',
    korea: 'KR',
  };

  const aliasCode = aliases[raw.toLowerCase()];
  if (aliasCode) return getCountryByCode(aliasCode);

  const partial = COUNTRIES.find(c => raw.toLowerCase().includes(c.name.toLowerCase()));
  return partial;
}
