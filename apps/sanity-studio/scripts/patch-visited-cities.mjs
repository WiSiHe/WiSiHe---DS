/**
 * Add city dots per visited country + adventure places (Svalbard).
 * Run: node scripts/patch-visited-cities.mjs
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

const geo = (lat, lng) => ({ _type: 'geopoint', lat, lng });

const CITIES_BY_COUNTRY = {
  France: [
    ['Paris', geo(48.8566, 2.3522)],
    ['Blois', geo(47.5861, 1.3359)],
    ['Annecy', geo(45.8992, 6.1294)],
    ['Bordeaux', geo(44.8378, -0.5792)],
    ['Toulouse', geo(43.6047, 1.4442)],
    ['Poitiers', geo(46.5802, 0.3404)],
    ['Strasbourg', geo(48.5734, 7.7521)],
    ['Narbonne', geo(43.1836, 3.0042)],
    ['Grasse', geo(43.6584, 6.9226)],
    ['Nice', geo(43.7102, 7.262)],
  ],
  'United Kingdom': [
    ['London', geo(51.5074, -0.1278)],
    ['Edinburgh', geo(55.9533, -3.1883)],
    ['Glasgow', geo(55.8642, -4.2518)],
    ['York', geo(53.959, -1.0815)],
  ],
  Belgium: [
    ['Brussels', geo(50.8503, 4.3517)],
    ['Bruges', geo(51.2093, 3.2247)],
  ],
  Monaco: [['Monaco', geo(43.7384, 7.4246)]],
  Luxembourg: [['Luxembourg City', geo(49.6116, 6.1319)]],
  Netherlands: [
    ['Rotterdam', geo(51.9244, 4.4777)],
    ['Amsterdam', geo(52.3676, 4.9041)],
  ],
  Denmark: [['Copenhagen', geo(55.6761, 12.5683)]],
  Sweden: [
    ['Gothenburg', geo(57.7089, 11.9746)],
    ['Stockholm', geo(59.3293, 18.0686)],
  ],
  Germany: [
    ['Hamburg', geo(53.5511, 9.9937)],
    ['Berlin', geo(52.52, 13.405)],
    ['Dresden', geo(51.0504, 13.7373)],
  ],
  'Czech Republic': [['Prague', geo(50.0755, 14.4378)]],
  Hungary: [['Budapest', geo(47.4979, 19.0402)]],
  Italy: [
    ['Rome', geo(41.9028, 12.4964)],
    ['Napoli', geo(40.8518, 14.2681)],
  ],
  Spain: [
    ['Barcelona', geo(41.3851, 2.1734)],
    ['Granada', geo(37.1773, -3.5986)],
  ],
  Portugal: [['Lisbon', geo(38.7223, -9.1393)]],
  Greece: [
    ['Athens', geo(37.9838, 23.7275)],
    ['Nafplio', geo(37.5673, 22.8016)],
    ['Sparta', geo(37.0745, 22.4302)],
  ],
  Turkey: [['Istanbul', geo(41.0082, 28.9784)]],
  Ukraine: [
    ['Kyiv', geo(50.4501, 30.5234)],
    ['Chernobyl', geo(51.389, 30.0994)],
  ],
  Poland: [
    ['Krakow', geo(50.0647, 19.945)],
    ['Poznan', geo(52.4064, 16.9252)],
  ],
  Canada: [
    ['Montreal', geo(45.5017, -73.5673)],
    ['Ottawa', geo(45.4215, -75.6972)],
  ],
  'United States': [
    ['New York', geo(40.7128, -74.006)],
    ['Tampa', geo(27.9506, -82.4572)],
    ['Washington D.C.', geo(38.9072, -77.0369)],
    ['Orlando', geo(28.5383, -81.3792)],
  ],
  Norway: [
    ['Oslo', geo(59.9139, 10.7522)],
    ['Bergen', geo(60.3913, 5.3221)],
    ['Trondheim', geo(63.4305, 10.3951)],
    ['Kristiansand', geo(58.1467, 7.9956)],
    ['Tromsø', geo(69.6492, 18.9553)],
  ],
};

const ADVENTURE_PLACES = [
  {
    _key: 'adv-svalbard',
    name: 'Svalbard',
    placeName: 'Longyearbyen',
    coordinates: geo(78.2232, 15.6267),
    notes: 'Arctic adventure — one of the coolest places I have been.',
  },
];

function normalizeCountry(name) {
  return name?.trim().toLowerCase() ?? '';
}

function buildCities(countryName) {
  const entries = CITIES_BY_COUNTRY[countryName];
  if (!entries) return [];

  return entries.map(([name, coordinates, highlight], index) => ({
    _key: `city-${normalizeCountry(countryName).replace(/\s+/g, '-')}-${index}`,
    name,
    coordinates,
    isHighlight: Boolean(highlight),
  }));
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const doc = await client.fetch('*[_id == "about"][0]{ visitedCountries }');
  if (!doc?.visitedCountries?.length) {
    throw new Error('About document or visitedCountries not found');
  }

  const visitedCountries = doc.visitedCountries.map(entry => {
    const countryName = entry.country?.trim();
    const cities = countryName ? buildCities(countryName) : [];
    return cities.length > 0 ? { ...entry, cities } : entry;
  });

  await client
    .patch('about')
    .set({ visitedCountries, adventurePlaces: ADVENTURE_PLACES })
    .commit();

  const cityCount = visitedCountries.reduce(
    (sum, country) => sum + (country.cities?.length ?? 0),
    0,
  );
  console.log(
    `Patched ${cityCount} city markers across ${visitedCountries.length} countries + ${ADVENTURE_PLACES.length} adventure places.`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
