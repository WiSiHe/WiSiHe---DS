/**
 * Append missing visited countries to about.visitedCountries.
 * Run: node scripts/patch-add-visited-countries.mjs
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '..');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

config({ path: path.join(studioRoot, '.env.local') });

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || 'cbjsv7wi';
const DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;

if (!WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN with write access)');
}

const COUNTRY_NAME_TO_ISO = {
  Portugal: 'PT',
  USA: 'US',
  'United States': 'US',
  Canada: 'CA',
  Greece: 'GR',
  Turkey: 'TR',
};

const TO_ADD = [
  {
    _key: 'visit-portugal',
    country: 'Portugal',
    countryCode: 'PT',
    placeName: 'Lisbon',
    coordinates: { _type: 'geopoint', lat: 38.7223, lng: -9.1393 },
  },
  {
    _key: 'visit-usa',
    country: 'United States',
    countryCode: 'US',
    placeName: 'New York',
    coordinates: { _type: 'geopoint', lat: 40.7128, lng: -74.006 },
  },
  {
    _key: 'visit-canada',
    country: 'Canada',
    countryCode: 'CA',
    placeName: 'Toronto',
    coordinates: { _type: 'geopoint', lat: 43.6532, lng: -79.3832 },
  },
  {
    _key: 'visit-greece',
    country: 'Greece',
    countryCode: 'GR',
    placeName: 'Athens',
    coordinates: { _type: 'geopoint', lat: 37.9838, lng: 23.7275 },
  },
  {
    _key: 'visit-turkey',
    country: 'Turkey',
    countryCode: 'TR',
    placeName: 'Istanbul',
    coordinates: { _type: 'geopoint', lat: 41.0082, lng: 28.9784 },
  },
];

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

function normalizeName(name) {
  return name?.trim().toLowerCase() ?? '';
}

async function main() {
  const doc = await client.fetch('*[_id == "about"][0]{ visitedCountries }');
  if (!doc) throw new Error('About document not found');

  const existing = doc.visitedCountries ?? [];
  const existingNames = new Set(existing.map(entry => normalizeName(entry.country)));

  const additions = TO_ADD.filter(entry => !existingNames.has(normalizeName(entry.country)));

  if (additions.length === 0) {
    console.log('All requested countries already present — nothing to add.');
    return;
  }

  const visitedCountries = [...existing, ...additions].map(entry => {
    const code =
      entry.countryCode ??
      COUNTRY_NAME_TO_ISO[entry.country?.trim()] ??
      COUNTRY_NAME_TO_ISO[entry.country];
    return code ? { ...entry, countryCode: code } : entry;
  });

  await client.patch('about').set({ visitedCountries }).commit();

  console.log(
    `Added ${additions.length} countries: ${additions.map(a => a.country).join(', ')}. Total: ${visitedCountries.length}.`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
