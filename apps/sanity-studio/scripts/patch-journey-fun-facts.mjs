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

const FACTS_BY_KEY = {
  'journey-hammerfest': {
    funFact:
      'North of the Arctic Circle — among the northernmost towns on Earth, with midnight sun in summer.',
    stats: [
      { _key: 'hf-pop', label: 'Population', value: '~11,000' },
      { _key: 'hf-reg', label: 'Region', value: 'Finnmark' },
      { _key: 'hf-lat', label: 'Latitude', value: '70.66° N' },
    ],
  },
  'journey-haslemoen': {
    funFact:
      'Innlandet military country — forests, river valleys, and wide skies in eastern Norway.',
    stats: [
      { _key: 'has-reg', label: 'Region', value: 'Innlandet' },
      { _key: 'has-near', label: 'Near', value: 'Eidsvoll' },
      { _key: 'has-land', label: 'Landscape', value: 'Forest & rivers' },
    ],
  },
  'journey-setermoen': {
    funFact:
      'Village in Troms near Bardufoss — mountains on every horizon and short hops to Arctic wilderness.',
    stats: [
      { _key: 'set-reg', label: 'Region', value: 'Troms' },
      { _key: 'set-near', label: 'Near', value: 'Bardufoss' },
      { _key: 'set-land', label: 'Landscape', value: 'Mountains' },
    ],
  },
  'journey-baerum': {
    funFact:
      'Affluent municipality west of Oslo — fjord shoreline on one side, forested hills on the other.',
    stats: [
      { _key: 'bae-pop', label: 'Population', value: '~130,000' },
      { _key: 'bae-reg', label: 'Region', value: 'Akershus' },
      { _key: 'bae-dist', label: 'From Oslo', value: '~15 min west' },
    ],
  },
  'journey-arendal': {
    funFact:
      'Southern coastal town with a lively harbour, wooden houses, and skerries along the Skagerrak.',
    stats: [
      { _key: 'are-pop', label: 'Population', value: '~45,000' },
      { _key: 'are-reg', label: 'Region', value: 'Agder' },
      { _key: 'are-coast', label: 'Coast', value: 'Southern Norway' },
    ],
  },
  'journey-tromso': {
    funFact:
      'The Arctic capital — northern lights, midnight sun, and the world’s northernmost university city.',
    stats: [
      { _key: 'tro-pop', label: 'Population', value: '~80,000' },
      { _key: 'tro-lat', label: 'Latitude', value: '69.65° N' },
      { _key: 'tro-nick', label: 'Nickname', value: 'Paris of the North' },
    ],
  },
  'journey-bergen': {
    funFact:
      'Gateway to the fjords — UNESCO Bryggen wharf, seven mountains, and famously rainy weather.',
    stats: [
      { _key: 'ber-pop', label: 'Population', value: '~290,000' },
      { _key: 'ber-reg', label: 'Region', value: 'Vestland' },
      { _key: 'ber-rain', label: 'Rain days', value: '~240 / year' },
    ],
  },
  'journey-oslo': {
    funFact:
      "Norway's capital on the Oslofjord — Viking-age roots and forests you can reach by metro.",
    stats: [
      { _key: 'oslo-pop', label: 'Population', value: '~700,000' },
      { _key: 'oslo-founded', label: 'Founded', value: '~1000 AD' },
      { _key: 'oslo-green', label: 'Known for', value: 'Green capital' },
    ],
  },
};

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const doc = await client.fetch('*[_id == "about"][0]{ journeyItems }');
  if (!doc) throw new Error('About document not found');

  const journeyItems = (doc.journeyItems ?? []).map(item => {
    const facts = FACTS_BY_KEY[item._key];
    if (!facts) return item;
    return {
      ...item,
      funFact: facts.funFact,
      stats: facts.stats,
    };
  });

  await client.patch('about').set({ journeyItems }).commit();
  console.log(`Merged fun facts into ${journeyItems.length} journey stops.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
