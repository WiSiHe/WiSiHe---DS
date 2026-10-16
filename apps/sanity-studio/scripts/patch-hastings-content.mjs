/**
 * Update Hastings (First House) — media-tracking dashboard case study.
 * Run: node scripts/patch-hastings-content.mjs
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '..');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

config({ path: path.join(studioRoot, '.env.local'), quiet: true });
config({ path: path.join(studioRoot, '.env'), quiet: true });
config({ path: path.join(studioRoot, '../nextjs-portfolio/.env.local'), quiet: true });

const PROJECT_ID =
  process.env.SANITY_STUDIO_API_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET =
  process.env.SANITY_STUDIO_API_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const DOCUMENT_ID = 'cb42f323-4d88-402e-91da-f729403ec045';

const TAG_REACT = '5d386adf-54d0-415e-9cfa-38defa2db606';
const TAG_TAILWIND = '9ec4dc55-b917-4ee4-a6b6-752379a9d8ef';
const TAG_VITE = '1f95073f-9359-442a-a80d-05dfdc76d725';
const TAG_TYPESCRIPT = '970fb442-fa7c-42bb-8cd7-a20bcdbc6f4c';
const TAG_REDUX = 'f51bea14-6acc-485f-b818-9a1d0e43cc2c';
const TAG_WORK = 'f276ca21-f9ba-40e5-9231-9842d6d64137';

function span(key, text, marks = []) {
  return { _key: key, _type: 'span', marks, text };
}

function paragraph(key, children, markDefs = []) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs,
    children,
  };
}

function heading(key, text, level = 'h2') {
  return {
    _key: key,
    _type: 'block',
    style: level,
    markDefs: [],
    children: [span(`${key}-span`, text)],
  };
}

function bullet(key, text) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [span(`${key}-span`, text)],
  };
}

const content = [
  paragraph('intro-1', [
    span(
      'intro-1-span',
      'Hastings is a media-tracking dashboard I built for First House — a communications firm working with property-sector clients. The project ran from August to October 2022: three months to turn AI-processed coverage data into something account teams could actually open in a client meeting.',
    ),
  ]),

  paragraph('intro-2', [
    span(
      'intro-2-span',
      'First House already had the pipeline behind the scenes. The gap was the front end — a calm, readable view of brand mentions, sentiment, and trends without making strategists feel like they had logged into a trading terminal.',
    ),
  ]),

  heading('brief-heading', 'The brief'),

  paragraph('brief-body', [
    span(
      'brief-body-span',
      'Property clients care about reputation in print, online, and social — but raw feeds and spreadsheet exports do not survive a boardroom. Hastings needed custom widgets, interactive charts, and layouts that highlighted what mattered for each account without burying the story in noise.',
    ),
  ]),

  heading('built-heading', 'What I built'),

  bullet(
    'built-1',
    'Dashboard shell — account views, filters, and navigation sized for daily use by non-developers.',
  ),
  bullet(
    'built-2',
    'Custom widgets and charts — coverage summaries, trend lines, and comparisons tuned to how First House presents work to clients.',
  ),
  bullet(
    'built-3',
    'Live data layer — REST API integration with RTK Query for caching, background refresh, and predictable loading states.',
  ),

  heading('stack-heading', 'Stack'),

  paragraph('stack-body', [
    span(
      'stack-body-span',
      'React and Vite for the app shell, TypeScript throughout, TailwindCSS for layout and theming. Redux Toolkit and RTK Query handled server state — the gnarly part was keeping widgets responsive while data refreshed in the background without the whole page feeling like it was pulsing.',
    ),
  ]),

  heading('hard-heading', 'The hard part'),

  paragraph('hard-body', [
    span(
      'hard-body-span',
      'Data-heavy products fail when every new metric adds another panel. I spent a lot of time on hierarchy — what updates live, what stays stable, what only appears on drill-down — so the UI stayed legible even when the API kept pushing fresh rows. One client was waiting on it; there was no room for “we will polish later.”',
    ),
  ]),

  heading('lesson-heading', 'What I took away'),

  paragraph('lesson-body', [
    span(
      'lesson-body-span',
      'Hastings reinforced a rule I still use on client dashboards: density is a design choice, not a default. RTK Query made the data layer honest; the product work was deciding what not to show. Screenshots on this page are from the shipped dashboard — internal tool, no public URL.',
    ),
  ]),
];

const patchPayload = {
  content,
  name: 'Hastings',
  client: 'First House',
  projectType: 'development',
  status: 'completed',
  projectStart: '2022-08-01',
  projectEnd: '2022-10-31',
  summary: [
    paragraph('fh-s0', [
      span(
        'fh-s0-s',
        'Hastings — media-tracking dashboard for First House (Aug–Oct 2022). React, Vite, TypeScript, Tailwind, RTK Query. Turned AI-processed brand coverage into client-ready widgets and charts.',
      ),
    ]),
    paragraph('fh-s1', [
      span(
        'fh-s1-s',
        'Three-month build for property-sector comms clients. The hard part: live data without making the UI feel like a Bloomberg terminal.',
      ),
    ]),
  ],
  seo: {
    title: 'First House — Hastings',
    description:
      'Hastings media-tracking dashboard for First House — React, RTK Query, and live AI-processed brand coverage for property clients.',
  },
  tags: [
    { _type: 'reference', _ref: TAG_REACT, _key: 'tag-react' },
    { _type: 'reference', _ref: TAG_TAILWIND, _key: 'tag-tailwind' },
    { _type: 'reference', _ref: TAG_VITE, _key: 'tag-vite' },
    { _type: 'reference', _ref: TAG_TYPESCRIPT, _key: 'tag-typescript' },
    { _type: 'reference', _ref: TAG_REDUX, _key: 'tag-redux' },
    { _type: 'reference', _ref: TAG_WORK, _key: 'tag-work' },
  ],
};

if (process.argv.includes('--print-json')) {
  process.stdout.write(JSON.stringify(patchPayload));
  process.exit(0);
}

const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_STUDIO_WRITE_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || !WRITE_TOKEN) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_WRITE_TOKEN');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-28',
  token: WRITE_TOKEN,
  useCdn: false,
});

await client.patch(DOCUMENT_ID).set(patchPayload).commit();

console.log('Updated Hastings (First House) content');
