/**
 * @deprecated Use patch-journey-fun-facts.mjs (merge-only) + patch-journey-copy-and-countries.mjs.
 * This script replaces the full journeyItems array and can wipe narrative copy.
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

const JOURNEY_ITEMS = [
  {
    _key: 'journey-hammerfest',
    year: '',
    title: 'Hammerfest',
    content: '',
    placeName: 'Hammerfest, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 70.6634, lng: 23.6821 },
    mapZoom: 11,
    funFact: 'North of the Arctic Circle — one of the northernmost towns in the world.',
    stats: [
      { _key: 'hf-pop', label: 'Population', value: '~11,000' },
      { _key: 'hf-reg', label: 'Region', value: 'Finnmark' },
      { _key: 'hf-lat', label: 'Latitude', value: '70.66° N' },
    ],
  },
  {
    _key: 'journey-haslemoen',
    year: '',
    title: 'Haslemoen',
    content: '',
    placeName: 'Haslemoen, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 60.7167, lng: 11.8333 },
    mapZoom: 11,
    funFact: 'Military camp area in Innlandet, surrounded by forests and river valleys.',
    stats: [
      { _key: 'has-reg', label: 'Region', value: 'Innlandet' },
      { _key: 'has-near', label: 'Near', value: 'Eidsvoll' },
      { _key: 'has-land', label: 'Landscape', value: 'Forest & rivers' },
    ],
  },
  {
    _key: 'journey-setermoen',
    year: '',
    title: 'Setermoen',
    content: '',
    placeName: 'Setermoen, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 68.411, lng: 17.059 },
    mapZoom: 11,
    funFact: 'Village in Troms near Bardufoss, framed by mountains and Arctic wilderness.',
    stats: [
      { _key: 'set-reg', label: 'Region', value: 'Troms' },
      { _key: 'set-near', label: 'Near', value: 'Bardufoss' },
      { _key: 'set-land', label: 'Landscape', value: 'Mountains' },
    ],
  },
  {
    _key: 'journey-baerum',
    year: '',
    title: 'Bærum',
    content: '',
    placeName: 'Bærum, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 59.89, lng: 10.5267 },
    mapZoom: 11,
    funFact: 'Affluent municipality west of Oslo, stretching from the fjord to forested hills.',
    stats: [
      { _key: 'bae-pop', label: 'Population', value: '~130,000' },
      { _key: 'bae-reg', label: 'Region', value: 'Akershus' },
      { _key: 'bae-dist', label: 'From Oslo', value: '~15 min west' },
    ],
  },
  {
    _key: 'journey-arendal',
    year: '',
    title: 'Arendal',
    content: '',
    placeName: 'Arendal, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 58.461, lng: 8.7725 },
    mapZoom: 11,
    funFact: 'Southern coastal town with a lively harbour and skerries along the Skagerrak.',
    stats: [
      { _key: 'are-pop', label: 'Population', value: '~45,000' },
      { _key: 'are-reg', label: 'Region', value: 'Agder' },
      { _key: 'are-coast', label: 'Coast', value: 'Southern Norway' },
    ],
  },
  {
    _key: 'journey-tromso',
    year: '',
    title: 'Tromsø',
    content: '',
    placeName: 'Tromsø, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 69.6492, lng: 18.9553 },
    mapZoom: 11,
    funFact: 'The Arctic capital — northern lights, midnight sun, and a lively university city.',
    stats: [
      { _key: 'tro-pop', label: 'Population', value: '~80,000' },
      { _key: 'tro-lat', label: 'Latitude', value: '69.65° N' },
      { _key: 'tro-nick', label: 'Nickname', value: 'Paris of the North' },
    ],
  },
  {
    _key: 'journey-bergen',
    year: '',
    title: 'Bergen',
    content: '',
    placeName: 'Bergen, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 60.3913, lng: 5.3221 },
    mapZoom: 12,
    funFact: 'Gateway to the fjords — colourful Bryggen wharf and famously rainy weather.',
    stats: [
      { _key: 'ber-pop', label: 'Population', value: '~290,000' },
      { _key: 'ber-reg', label: 'Region', value: 'Vestland' },
      { _key: 'ber-rain', label: 'Rain days', value: '~240 / year' },
    ],
  },
  {
    _key: 'journey-oslo',
    year: '',
    title: 'Oslo',
    content: '',
    placeName: 'Oslo, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 59.9139, lng: 10.7522 },
    mapZoom: 11,
    funFact: "Norway's capital — a green city on the Oslofjord with forests reachable by metro.",
    stats: [
      { _key: 'oslo-pop', label: 'Population', value: '~700,000' },
      { _key: 'oslo-founded', label: 'Founded', value: '~1000 AD' },
      { _key: 'oslo-green', label: 'Known for', value: 'Green capital' },
    ],
  },
];

const BIO =
  'Design engineer, painter, and maker based in Oslo. Born in Hammerfest, raised across Norway — from military towns and the coast to Tromsø, Bergen, and the capital. I build accessible web products and make art on the side.';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  await client
    .patch('about')
    .set({
      bio: BIO,
      journeyItems: JOURNEY_ITEMS,
    })
    .commit();

  console.log(`Patched ${JOURNEY_ITEMS.length} lived places with city facts only.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
