/**
 * Merge fun facts + stats into visited city dots and adventure places.
 * Data source: apps/nextjs-portfolio/app/about/data/visited-city-facts.json
 * Run: node scripts/patch-visited-city-facts.mjs
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '..');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

config({ path: path.join(studioRoot, '.env.local') });
config({ path: path.join(studioRoot, '../nextjs-portfolio/.env') });

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || 'cbjsv7wi';
const DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;

if (!WRITE_TOKEN) {
  throw new Error('Missing SANITY write token');
}

const factsPath = path.join(
  studioRoot,
  '../nextjs-portfolio/app/about/data/visited-city-facts.json',
);
const factsData = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

function withStatKeys(keyPrefix, stats) {
  return (stats ?? []).map((stat, index) => ({
    _key: `${keyPrefix}-stat-${index}`,
    label: stat.label,
    value: stat.value,
  }));
}

function mergeCityFacts(city) {
  const entry = factsData.cities[city._key];
  if (!entry) return city;

  const isChernobyl = city._key === 'city-ukraine-1';

  return {
    ...city,
    isHighlight: isChernobyl ? true : city.isHighlight,
    funFact: entry.funFact,
    stats: withStatKeys(city._key, entry.stats),
  };
}

function mergeAdventureFacts(place) {
  const entry = factsData.adventures[place._key];
  if (!entry) return place;

  return {
    ...place,
    funFact: entry.funFact,
    stats: withStatKeys(place._key, entry.stats),
    notes: place.notes ?? 'Arctic adventure — one of the coolest places I have been.',
  };
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const doc = await client.fetch('*[_id == "about"][0]{ visitedCountries, adventurePlaces }');
  if (!doc) throw new Error('About document not found');

  const visitedCountries = (doc.visitedCountries ?? []).map(country => ({
    ...country,
    cities: (country.cities ?? []).map(mergeCityFacts),
  }));

  const adventurePlaces = (doc.adventurePlaces ?? []).map(mergeAdventureFacts);

  await client.patch('about').set({ visitedCountries, adventurePlaces }).commit();

  const cityCount = visitedCountries.reduce(
    (sum, country) => sum + (country.cities?.length ?? 0),
    0,
  );
  const patchedCities = visitedCountries.reduce(
    (sum, country) =>
      sum + (country.cities ?? []).filter(city => factsData.cities[city._key]).length,
    0,
  );

  console.log(
    `Merged fun facts into ${patchedCities}/${cityCount} visited cities + ${adventurePlaces.length} adventure places.`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
