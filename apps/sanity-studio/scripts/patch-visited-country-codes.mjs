/**
 * Backfill ISO country codes on about.visitedCountries for map boundary highlighting.
 * Run: node scripts/patch-visited-country-codes.mjs
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
  Greece: 'GR',
  Luxembourg: 'LU',
  Norway: 'NO',
  Portugal: 'PT',
  'United States': 'US',
  Canada: 'CA',
};

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

function resolveCode(country, existingCode) {
  const explicit = existingCode?.trim().toUpperCase();
  if (explicit && /^[A-Z]{2}$/.test(explicit)) return explicit;
  if (!country) return null;
  return COUNTRY_NAME_TO_ISO[country.trim()] ?? null;
}

async function main() {
  const doc = await client.fetch('*[_id == "about"][0]{ visitedCountries }');
  if (!doc?.visitedCountries?.length) {
    throw new Error('About document or visitedCountries not found');
  }

  const visitedCountries = doc.visitedCountries.map(entry => {
    const countryCode = resolveCode(entry.country, entry.countryCode);
    return countryCode ? { ...entry, countryCode } : entry;
  });

  await client.patch('about').set({ visitedCountries }).commit();

  const coded = visitedCountries.filter(entry => entry.countryCode).length;
  console.log(`Patched ${coded}/${visitedCountries.length} visited countries with ISO codes.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
