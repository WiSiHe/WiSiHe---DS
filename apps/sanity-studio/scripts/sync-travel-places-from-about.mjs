/**
 * Create travelPlace documents from about visited cities & adventures, link refs on about + photography.
 * Run: node scripts/sync-travel-places-from-about.mjs
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
config({ path: path.join(studioRoot, '../nextjs-portfolio/.env') });

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || 'cbjsv7wi';
const DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;

if (!WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-28',
  token: WRITE_TOKEN,
  useCdn: false,
});

const COUNTRY_ISO = {
  France: 'FR',
  'United Kingdom': 'GB',
  Belgium: 'BE',
  Norway: 'NO',
  Germany: 'DE',
  Spain: 'ES',
  // extend as needed — script also reads countryCode from about country row
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function placeDocId(countryCode, name) {
  return `travelPlace.${countryCode.toLowerCase()}-${slugify(name)}`;
}

async function ensurePlace({
  name,
  countryName,
  countryCode,
  coordinates,
  kind,
  isHighlight,
  funFact,
  notes,
  stats,
}) {
  const code = countryCode || COUNTRY_ISO[countryName] || 'XX';
  const id = placeDocId(code, name);
  const existing = await client.getDocument(id);
  const fields = {
    name,
    slug: { _type: 'slug', current: `${code.toLowerCase()}-${slugify(name)}` },
    kind,
    countryName,
    countryCode: code,
    coordinates,
    isHighlight: isHighlight ?? false,
  };
  if (funFact) fields.funFact = funFact;
  if (notes) fields.notes = notes;
  if (stats?.length) fields.stats = stats;

  if (existing) {
    await client.patch(id).set(fields).commit();
    console.log(`Updated place: ${name} (${code})`);
  } else {
    await client.create({ _id: id, _type: 'travelPlace', ...fields });
    console.log(`Created place: ${name} (${code})`);
  }
  return id;
}

const about = await client.fetch(`*[_id == "about"][0]{
  visitedCountries,
  adventurePlaces
}`);

if (!about) throw new Error('about document not found');

const placeIdByCityKey = new Map();

for (const country of about.visitedCountries ?? []) {
  const countryCode = country.countryCode || COUNTRY_ISO[country.country] || null;
  for (const city of country.cities ?? []) {
    if (!city.name || !city.coordinates) continue;
    const id = await ensurePlace({
      name: city.name,
      countryName: country.country,
      countryCode,
      coordinates: city.coordinates,
      kind: 'city',
      isHighlight: city.isHighlight,
      funFact: city.funFact,
      notes: city.notes,
      stats: city.stats,
    });
    placeIdByCityKey.set(city._key, id);
  }
}

const adventurePlaceIds = new Map();
const ADVENTURE_COUNTRY = {
  'adv-svalbard': { countryName: 'Norway', countryCode: 'NO' },
};

for (const adventure of about.adventurePlaces ?? []) {
  if (!adventure.name || !adventure.coordinates) continue;
  const adventureCountry = ADVENTURE_COUNTRY[adventure._key];
  const id = await ensurePlace({
    name: adventure.name,
    countryName: adventureCountry?.countryName ?? adventure.countryName ?? 'Adventure',
    countryCode: adventureCountry?.countryCode,
    coordinates: adventure.coordinates,
    kind: 'adventure',
    funFact: adventure.funFact,
    notes: adventure.notes,
    stats: adventure.stats,
  });
  adventurePlaceIds.set(adventure._key, id);
}

// Patch about with place references
let aboutPatch = client.patch('about');
for (const country of about.visitedCountries ?? []) {
  for (const city of country.cities ?? []) {
    const placeId = placeIdByCityKey.get(city._key);
    if (!placeId || !country._key) continue;
    aboutPatch = aboutPatch.set(
      {
        [`visitedCountries[_key=="${country._key}"].cities[_key=="${city._key}"].place`]: {
          _type: 'reference',
          _ref: placeId,
        },
      },
    );
  }
}
for (const adventure of about.adventurePlaces ?? []) {
  const placeId = adventurePlaceIds.get(adventure._key);
  if (!placeId) continue;
  aboutPatch = aboutPatch.set(
    { [`adventurePlaces[_key=="${adventure._key}"].place`]: { _type: 'reference', _ref: placeId } },
  );
}
await aboutPatch.commit();
console.log('Patched about with travel place references');

// Link photography by placeName + country
const photos = await client.fetch(
  `*[_type == "photography" && !defined(place)]{ _id, country, countryCode, placeName }`,
);
for (const photo of photos) {
  const placeName = photo.placeName?.trim();
  if (!placeName) continue;
  const code = (photo.countryCode || COUNTRY_ISO[photo.country] || '').toUpperCase();
  const candidates = await client.fetch(
    `*[_type == "travelPlace" && name == $name && ($code == "" || countryCode == $code)][0]._id`,
    { name: placeName, code },
  );
  if (!candidates) continue;
  await client.patch(photo._id).set({ place: { _type: 'reference', _ref: candidates } }).commit();
  console.log(`Linked photo ${photo._id} → ${candidates}`);
}

console.log('Done.');
