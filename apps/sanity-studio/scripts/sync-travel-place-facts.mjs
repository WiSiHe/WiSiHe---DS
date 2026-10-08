/**
 * Copy fun facts + stats from about (visited cities & adventures) onto linked travelPlace docs.
 * Source of truth for copy: apps/nextjs-portfolio/app/about/data/visited-city-facts.json
 * merged into about via patch-visited-city-facts.mjs first.
 *
 * Run: node scripts/sync-travel-place-facts.mjs
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

function factsFromCity(city) {
  const entry = factsData.cities[city._key];
  if (entry) {
    return {
      funFact: entry.funFact,
      stats: withStatKeys(city._key, entry.stats),
      isHighlight: city._key === 'city-ukraine-1' ? true : city.isHighlight,
    };
  }
  if (city.funFact && city.stats?.length) {
    return {
      funFact: city.funFact,
      stats: city.stats,
      isHighlight: city.isHighlight,
    };
  }
  return null;
}

function factsFromAdventure(adventure) {
  const entry = factsData.adventures[adventure._key];
  if (entry) {
    return {
      funFact: entry.funFact,
      stats: withStatKeys(adventure._key, entry.stats),
      notes:
        adventure.notes ??
        'Arctic archipelago governed by Norway — polar bear territory with strict visitor rules.',
    };
  }
  if (adventure.funFact && adventure.stats?.length) {
    return {
      funFact: adventure.funFact,
      stats: adventure.stats,
      notes: adventure.notes,
    };
  }
  return null;
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-28',
  token: WRITE_TOKEN,
  useCdn: false,
});

async function patchPlace(placeId, fields) {
  const patch = {};
  if (fields.funFact) patch.funFact = fields.funFact;
  if (fields.stats?.length) patch.stats = fields.stats;
  if (fields.isHighlight != null) patch.isHighlight = fields.isHighlight;
  if (fields.notes) patch.notes = fields.notes;
  if (Object.keys(patch).length === 0) return false;
  await client.patch(placeId).set(patch).commit();
  return true;
}

async function main() {
  const about = await client.fetch(`*[_id == "about"][0]{
    visitedCountries[]{ cities[]{ _key, name, funFact, stats, isHighlight, place{ _ref } } },
    adventurePlaces[]{ _key, name, funFact, stats, notes, place{ _ref } }
  }`);

  if (!about) throw new Error('about document not found');

  let patched = 0;
  let skipped = 0;
  const missing = [];

  for (const country of about.visitedCountries ?? []) {
    for (const city of country.cities ?? []) {
      const placeId = city.place?._ref;
      if (!placeId) {
        missing.push(`city ${city.name} (no place ref)`);
        continue;
      }
      const facts = factsFromCity(city);
      if (!facts) {
        missing.push(`city ${city.name} (${city._key})`);
        skipped++;
        continue;
      }
      const ok = await patchPlace(placeId, facts);
      if (ok) {
        patched++;
        console.log(`Patched ${city.name} → ${placeId}`);
      }
    }
  }

  for (const adventure of about.adventurePlaces ?? []) {
    const placeId = adventure.place?._ref;
    if (!placeId) {
      missing.push(`adventure ${adventure.name} (no place ref)`);
      continue;
    }
    const facts = factsFromAdventure(adventure);
    if (!facts) {
      missing.push(`adventure ${adventure.name} (${adventure._key})`);
      skipped++;
      continue;
    }
    const ok = await patchPlace(placeId, facts);
    if (ok) {
      patched++;
      console.log(`Patched ${adventure.name} → ${placeId}`);
    }
  }

  const orphans = await client.fetch(
    `*[_type == "travelPlace" && (!defined(funFact) || funFact == "" || !defined(stats) || count(stats) < 1)]{ _id, name, countryCode }`,
  );

  for (const place of orphans) {
    missing.push(`orphan ${place.name} (${place._id})`);
  }

  console.log(`\nPatched ${patched} travel places. Skipped ${skipped} without source facts.`);
  if (missing.length) {
    console.log('Still missing fun fact or stats:');
    for (const line of missing) console.log(`  - ${line}`);
  } else {
    console.log('All linked travel places have fun facts and stats.');
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
