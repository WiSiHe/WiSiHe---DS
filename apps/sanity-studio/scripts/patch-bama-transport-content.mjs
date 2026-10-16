/**
 * Update Bama Transport Optimisation Dashboard case study.
 * Run: node scripts/patch-bama-transport-content.mjs
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

const DOCUMENT_ID = '2d707aac-070a-4fb7-bf72-b8cbf37a0e13';

const TAG_NEXTJS = 'fd4b20a7-0e6f-40c4-a71f-b6ab26156402';
const TAG_GRAPHQL = '61f568fb-45b3-4fc8-a7d9-88523d84ec37';
const TAG_TAILWIND = '9ec4dc55-b917-4ee4-a6b6-752379a9d8ef';
const TAG_HTML = 'e94ad9a6-540d-478b-ab91-95ca3371950f';
const TAG_CSS = 'd9873b4e-eb99-498f-8a74-7290652928a9';
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
      'Bama moves a lot of produce around Norway. From August to October 2023 I worked on the frontend for an internal transport optimisation dashboard — a routing and planning view for logistics operators who need to trust what is on screen before trucks roll.',
    ),
  ]),

  paragraph('intro-2', [
    span(
      'intro-2-span',
      'This was not a customer-facing product. It was ops software — the kind where a confusing column header wastes someone’s morning and a wrong route costs real money. Internal tools deserve the same clarity as public sites; they just optimise for decision speed instead of marketing.',
    ),
  ]),

  heading('problem-heading', 'The problem'),

  paragraph('problem-body', [
    span(
      'problem-body-span',
      'Bama’s logistics tooling had grown messy over time — different UIs, unclear data ownership, and people doing workarounds in spreadsheets because the software did not show them what they needed in one place. The new dashboard had to pull transport data into a single view operators could actually use during planning.',
    ),
  ]),

  heading('built-heading', 'What I built'),

  bullet(
    'built-1',
    'Routing and planning views — map and table layouts tuned for comparing routes, stops, and assignments at a glance.',
  ),
  bullet(
    'built-2',
    'GraphQL data layer — typed queries against Bama’s transport API so the UI fetched only what each screen needed.',
  ),
  bullet(
    'built-3',
    'Performance-aware tables — large datasets that stay scrollable and readable without turning every row into a wall of numbers.',
  ),
  bullet(
    'built-4',
    'Operator-first interaction patterns — filters, drill-down, and hierarchy that assume someone is in a hurry, not browsing.',
  ),

  heading('stack-heading', 'Stack'),

  paragraph('stack-body', [
    span(
      'stack-body-span',
      'Next.js, TypeScript, and TailwindCSS on the frontend. GraphQL for transport data. The interesting engineering was not drawing a map — it was deciding what to hide so an operator could make a call in seconds instead of hunting through panels.',
    ),
  ]),

  heading('hard-heading', 'The hard part'),

  paragraph('hard-body', [
    span(
      'hard-body-span',
      'Information density is the whole game in logistics UI. Show too little and people reopen Excel. Show too much and nobody trusts the screen. I spent most of the project on hierarchy — which metrics belong above the fold, which details wait for drill-down, and how map and table views stay in sync when the dataset grows.',
    ),
  ]),

  heading('lesson-heading', 'What I took away'),

  paragraph('lesson-body', [
    span(
      'lesson-body-span',
      'Internal software, real users who do not care about your component library. If the route view is wrong, trucks are wrong. Screenshots on this page are from the shipped dashboard — no public URL, but the constraints were sharper than many consumer projects I have worked on since.',
    ),
  ]),
];

const patchPayload = {
  content,
  name: 'Transport Optimisation Dashboard',
  client: 'Bama',
  projectType: 'development',
  status: 'completed',
  projectStart: '2023-08-10',
  projectEnd: '2023-10-10',
  summary: [
    paragraph('bama-s0', [
      span(
        'bama-s0-s',
        'Internal transport dashboard for Bama (Aug–Oct 2023) — Next.js, GraphQL, and Tailwind for logistics routing and planning. Maps and tables built for operators, not demos.',
      ),
    ]),
    paragraph('bama-s1', [
      span(
        'bama-s1-s',
        'The hard part was information density: show enough to decide fast, hide the rest. If the route view is wrong, trucks are wrong.',
      ),
    ]),
  ],
  seo: {
    title: 'Bama — Transport Optimisation Dashboard',
    description:
      'Bama internal logistics dashboard — GraphQL transport data and Next.js + Tailwind UI for ops teams making routing decisions at scale.',
  },
  tags: [
    { _type: 'reference', _ref: TAG_NEXTJS, _key: 'tag-nextjs' },
    { _type: 'reference', _ref: TAG_GRAPHQL, _key: 'tag-graphql' },
    { _type: 'reference', _ref: TAG_TAILWIND, _key: 'tag-tailwind' },
    { _type: 'reference', _ref: TAG_HTML, _key: 'tag-html' },
    { _type: 'reference', _ref: TAG_CSS, _key: 'tag-css' },
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

console.log('Updated Bama Transport Optimisation Dashboard content');
