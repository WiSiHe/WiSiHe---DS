/**
 * Update journey copy, ensure visited country ISO codes, add Norway.
 * Run: node scripts/patch-journey-copy-and-countries.mjs
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
  Belgium: 'BE',
  Netherlands: 'NL',
  'Czech Republic': 'CZ',
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

const JOURNEY_COPY = {
  'journey-hammerfest': {
    year: 'Youth',
    title: 'Born in the Arctic',
    content:
      'Born in Hammerfest — one of the northernmost towns in the world. Arctic light, harsh weather, and a small-town rhythm shaped how I notice contrast, colour, and mood.',
  },
  'journey-setermoen': {
    year: 'Youth',
    title: 'Setermoen',
    content:
      'Childhood in Setermoen — military-family postings and quiet Nordland landscapes. Room to explore outdoors and build things with my hands.',
  },
  'journey-haslemoen': {
    year: 'Youth',
    title: 'Haslemoen',
    content:
      'A stint at Haslemoen in inland Norway — more moving, adapting, and hobbies that stuck: drawing, games, and tinkering with computers.',
  },
  'journey-baerum': {
    year: 'Youth',
    title: 'Bærum',
    content:
      'Time near Oslo in Bærum brought culture, tech, and creative communities into reach — still part of the restless childhood years before the coast became home.',
  },
  'journey-arendal': {
    year: 'Youth',
    title: 'Arendal & Agder',
    content:
      'Arendal became home for my later childhood — summers by the sea, curiosity for games and art, and the southern-coast sensibility that still shows up in my palette.',
  },
  'journey-tromso': {
    year: 'Studies',
    title: 'Tromsø & UiT',
    content:
      'After leaving Arendal I headed north again for a year course in informatics at UiT. Tromsø meant polar nights, sharp focus, and proof that good work happens off the beaten path.',
  },
  'journey-bergen': {
    year: 'University',
    title: 'Bergen',
    content:
      'At the University of Bergen I studied information and communication technologies — learning to think in systems, ship software, and collaborate across design and engineering.',
  },
  'journey-oslo': {
    year: 'Since 2016',
    title: 'Oslo',
    content:
      'I moved to Oslo in 2016 and still live here. By day I build products — design systems, performance, accessibility — and by night I paint, experiment in 3D, and ship side projects.',
  },
};

const NORWAY_ENTRY = {
  _key: 'visit-norway',
  country: 'Norway',
  countryCode: 'NO',
  placeName: 'Oslo',
  coordinates: { _type: 'geopoint', lat: 59.9139, lng: 10.7522 },
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
  const doc = await client.fetch('*[_id == "about"][0]{ journeyItems, visitedCountries }');
  if (!doc) throw new Error('About document not found');

  const journeyItems = (doc.journeyItems ?? []).map(item => {
    const patch = JOURNEY_COPY[item._key];
    return patch ? { ...item, ...patch } : item;
  });

  let visitedCountries = [...(doc.visitedCountries ?? [])];
  const hasNorway = visitedCountries.some(
    entry => entry.country?.trim().toLowerCase() === 'norway',
  );
  if (!hasNorway) {
    visitedCountries.push(NORWAY_ENTRY);
  }

  visitedCountries = visitedCountries.map(entry => {
    const countryCode = resolveCode(entry.country, entry.countryCode);
    return countryCode ? { ...entry, countryCode } : entry;
  });

  await client.patch('about').set({ journeyItems, visitedCountries }).commit();

  const coded = visitedCountries.filter(entry => entry.countryCode).length;
  console.log(
    `Patched journey copy (${journeyItems.length} stops), visited countries (${coded}/${visitedCountries.length} with ISO codes).`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
