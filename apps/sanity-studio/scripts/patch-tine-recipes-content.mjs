/**
 * Update TINE Kjøkken Recipes — Next.js frontend rebuild case study.
 * Run: node scripts/patch-tine-recipes-content.mjs
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

const DOCUMENT_ID = 'ab9134d7-c675-4445-b4ce-8af4d5e76c58';
const LIVE_URL = 'https://www.tine.no/kjokken/';

const TAG_NEXTJS = 'fd4b20a7-0e6f-40c4-a71f-b6ab26156402';
const TAG_ENONIC = '235317dc-1b2d-471d-9ee9-b7afa87d4296';
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
      'TINE Kjøkken is where a lot of Norway looks up dinner — thousands of recipes, seasonal campaigns, and editorial pages with serious traffic. From September to December 2024 I rebuilt the frontend in Next.js while Enonic XP stayed the content backend.',
    ),
  ]),

  paragraph('intro-2', [
    span(
      'intro-2-span',
      'The goal was not a greenfield recipe app. Editors already worked in Enonic; the new layer had to respect that workflow, ship on a fixed timeline, and feel faster and more maintainable than what it replaced — without breaking URLs people bookmark.',
    ),
  ]),

  heading('brief-heading', 'The brief'),

  paragraph('brief-body', [
    span(
      'brief-body-span',
      'Replace the old presentation stack with a modern Next.js frontend that talks to Enonic as a headless CMS. Recipe detail pages, category hubs, campaign landings, and all the supporting content types had to render from Enonic data — with performance and SEO appropriate for one of Norway’s most visited food destinations.',
    ),
  ]),

  heading('built-heading', 'What I built'),

  bullet(
    'built-1',
    'Dynamic routing — catch-all paths mapped to Enonic content types so editors can publish new sections without a deploy.',
  ),
  bullet(
    'built-2',
    'ISR and caching — incremental static regeneration so popular recipes stay fast while content updates propagate on a sensible schedule.',
  ),
  bullet(
    'built-3',
    'Structured recipe data — schema markup and typed content models so search engines and on-page UI get consistent ingredients, steps, and metadata.',
  ),
  bullet(
    'built-4',
    'Template system — reusable layouts for recipes, articles, and campaign pages instead of one-off pages per launch.',
  ),

  heading('stack-heading', 'Stack'),

  paragraph('stack-body', [
    span(
      'stack-body-span',
      'Next.js on the frontend, Enonic XP as the headless CMS and API layer. My work sat in the glue between them: fetching, normalising, and rendering Enonic content — plus the routing and caching strategy that keeps thousands of pages from feeling heavy.',
    ),
  ]),

  heading('hard-heading', 'The hard part'),

  paragraph('hard-body', [
    span(
      'hard-body-span',
      'Scale and editorial independence pull in opposite directions. Every shortcut that hard-coded a layout would come back as a support ticket when marketing launched something new. The win was a frontend flexible enough for editors to publish a soup without calling a developer — and fast enough that you never notice the machinery behind tine.no/kjokken.',
    ),
  ]),

  heading('lesson-heading', 'What I took away'),

  paragraph('lesson-body', [
    span(
      'lesson-body-span',
      'Four months, then it went live. Unglamorous work that a lot of people touch every week — and that is the point. Headless rebuilds are less about flashy components and more about routing, cache boundaries, and content contracts that survive the next campaign.',
    ),
  ]),

  linkedParagraph('live-link', [
    { text: 'Live site: ' },
    { text: 'tine.no/kjokken', link: LIVE_URL },
  ]),
];

const patchPayload = {
  content,
  name: 'Recipes',
  client: 'TINE Kjøkken',
  projectType: 'development',
  status: 'completed',
  projectStart: '2024-09-02',
  projectEnd: '2024-12-23',
  connectedPage: LIVE_URL,
  summary: [
    paragraph('tk-s0', [
      span(
        'tk-s0-s',
        'Frontend rebuild for TINE Kjøkken (Sep–Dec 2024) — Next.js on Enonic XP with dynamic routing, ISR, and structured recipe data. One of Norway’s busiest food sites.',
      ),
    ]),
    paragraph('tk-s1', [
      span(
        'tk-s1-s',
        'Editors publish in Enonic; the Next layer handles speed and templates. Live at tine.no/kjokken — unglamorous infrastructure a lot of people use every week.',
      ),
    ]),
  ],
  seo: {
    title: 'TINE Kjøkken — Recipes',
    description:
      'Next.js rebuild for TINE Kjøkken — Enonic XP headless CMS, ISR, dynamic routing, and recipe structured data. Live at tine.no/kjokken.',
  },
  tags: [
    { _type: 'reference', _ref: TAG_NEXTJS, _key: 'tag-nextjs' },
    { _type: 'reference', _ref: TAG_ENONIC, _key: 'tag-enonic' },
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
  process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

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

console.log('Updated TINE Kjøkken Recipes content');
