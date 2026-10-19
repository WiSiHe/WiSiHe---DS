/**
 * Update Gi Av Deg Selv (Ruter) — holiday campaign site case study.
 * Run: node scripts/patch-gi-av-deg-selv-content.mjs
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

const DOCUMENT_ID = 'c6c7060d-0313-4ef0-bf60-bea88a1eff66';
const CAMPAIGN_URL = 'https://ruter.no/gave';

const TAG_HTML = 'e94ad9a6-540d-478b-ab91-95ca3371950f';
const TAG_TAILWIND = '9ec4dc55-b917-4ee4-a6b6-752379a9d8ef';
const TAG_CSS = 'd9873b4e-eb99-498f-8a74-7290652928a9';
const TAG_NEXTJS = 'fd4b20a7-0e6f-40c4-a71f-b6ab26156402';
const TAG_WORK = 'f276ca21-f9ba-40e5-9231-9842d6d64137';

function span(key, text, marks = []) {
  return { _key: key, _type: 'span', marks, text };
}

function linkDef(key, href) {
  return {
    _key: key,
    _type: 'link',
    linkType: 'href',
    href,
    openInNewTab: true,
  };
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

function linkedParagraph(key, parts) {
  const markDefs = [];
  const children = parts.map((part, index) => {
    if (part.link) {
      const linkKey = `${key}-link-${index}`;
      markDefs.push(linkDef(linkKey, part.link));
      return span(`${key}-span-${index}`, part.text, [linkKey]);
    }
    return span(`${key}-span-${index}`, part.text);
  });
  return paragraph(key, children, markDefs);
}

const content = [
  paragraph('intro-1', [
    span(
      'intro-1-span',
      'Gi Av Deg Selv was Ruter’s Christmas 2023 campaign — a push to give time together instead of expensive gifts during a winter when everyone had less to spend. I built the campaign site at NoA Ignite from November to December 2023, under two months from brief to bus ads.',
    ),
  ]),

  paragraph('intro-2', [
    span(
      'intro-2-span',
      'The idea from Anorak NoA: wrap a meeting as a present. Pick someone, suggest an activity, offer a few dates, and send it digitally. The recipient opens the gift on Christmas Eve and chooses when to meet. Ruter’s angle was simple — the best trips are the ones you take with people you care about.',
    ),
  ]),

  heading('built-heading', 'What I built'),

  paragraph('built-body', [
    span(
      'built-body-span',
      'The public-facing site at ruter.no/gave — campaign landing, the gift-creation flow, and the screens that made a digital invite feel like opening a present. Everything had to work on mobile first, load fast, and survive the traffic spike when TV, cinema, and outdoor creative went live across Oslo.',
    ),
  ]),

  bullet(
    'built-1',
    'Gift flow — recipient, activity idea, date options, and a shareable digital present.',
  ),
  bullet(
    'built-2',
    'Campaign pages tuned for seasonal creative — hero, explainer content, and CTA paths that matched the film and out-of-home work.',
  ),
  bullet(
    'built-3',
    'Production polish under deadline — responsive layouts, accessible type, and a stack chosen for iteration speed.',
  ),

  heading('stack-heading', 'Stack'),

  paragraph('stack-body', [
    span(
      'stack-body-span',
      'Next.js and TailwindCSS. Campaign sites do not get six months — the stack was picked so design tweaks and new sections could ship daily as feedback came in from client and agency. No exotic dependencies; just a reliable pipeline for a hard launch date.',
    ),
  ]),

  heading('pressure-heading', 'The deadline'),

  paragraph('pressure-body', [
    span(
      'pressure-body-span',
      'Public-facing work for a brand everyone in Oslo recognises hits different. Out-of-home was already booked, the film was in cinemas, and the physical activation at Oslo S needed the digital flow to work when people scanned QR codes on-site. You feel the deadline when the bus ads go up before your last CSS tweak lands.',
    ),
  ]),

  heading('lesson-heading', 'What I took away'),

  paragraph('lesson-body', [
    span(
      'lesson-body-span',
      'Short campaigns teach you to cut scope without cutting quality — every page has to earn its place, and “we will fix it after launch” is not an option when the media plan starts on a fixed date. Screenshots on this page are from the shipped site; the seasonal URL may redirect now, but the work ran live through Christmas 2023.',
    ),
  ]),

  linkedParagraph('campaign-link', [
    { text: 'Campaign URL (seasonal): ' },
    { text: 'ruter.no/gave', link: CAMPAIGN_URL },
  ]),
];

const patchPayload = {
  content,
  name: 'Gi Av Deg Selv',
  client: 'Ruter',
  projectType: 'development',
  status: 'completed',
  projectStart: '2023-11-01',
  projectEnd: '2023-12-24',
  connectedPage: CAMPAIGN_URL,
  summary: [
    paragraph('ruter-s0', [
      span(
        'ruter-s0-s',
        'Gi Av Deg Selv — Ruter Christmas 2023 campaign site at NoA Ignite. Next.js + Tailwind, built in under two months (Nov–Dec). Digital gift flow: wrap a meeting as a present at ruter.no/gave.',
      ),
    ]),
    paragraph('ruter-s1', [
      span(
        'ruter-s1-s',
        'High-visibility holiday work for Oslo public transport — TV, cinema, outdoor, and a live activation at Oslo S. Deadline-driven from day one.',
      ),
    ]),
  ],
  seo: {
    title: 'Ruter — Gi Av Deg Selv',
    description:
      'Gi Av Deg Selv: Ruter Christmas 2023 campaign site — Next.js + Tailwind gift flow at ruter.no/gave, built in two months at NoA Ignite.',
  },
  tags: [
    { _type: 'reference', _ref: TAG_NEXTJS, _key: 'tag-nextjs' },
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

console.log('Updated Gi Av Deg Selv (Ruter) content');
