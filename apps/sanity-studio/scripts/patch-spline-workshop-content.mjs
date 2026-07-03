/**
 * Update Spline Workshop project copy — short portfolio story + Notion link.
 * Run: node scripts/patch-spline-workshop-content.mjs
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

const DOCUMENT_ID = 'ed9b5322-8d87-4441-986b-8861ff3ade7b';

const WORKSHOP_GUIDE_URL =
  'https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5';
const SPLINE_URL = 'https://spline.design/';

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
      'I ran a Spline workshop at NoA Ignite for twenty-plus designers and developers — a two-and-a-half-hour session on getting interactive 3D into real web pages without opening Three.js or Blender.',
    ),
  ]),
  paragraph('intro-2', [
    span(
      'intro-2-span',
      'I like the NoA 3D programme and want to see more dimensional work in everyday products. The pitch was simple: 3D on the web no longer needs to be rocket science — so we literally built a rocket, gave it a lift-off animation, and wired up keyboard controls to prove the point.',
    ),
  ]),

  heading('built-heading', 'What we built'),

  paragraph('built-body', [
    span(
      'built-body-span',
      'Everything happened in Spline — model the rocket from primitives, add particle exhaust and bloom, animate a lift-off on Spacebar and reset on R, then export a scene URL and drop it into a plain HTML page with the spline-viewer embed. No game engine, no custom WebGL.',
    ),
  ]),

  bullet('built-1', 'Spline only — browser-based modelling, materials, animation, and publish.'),
  bullet('built-2', 'Interactive controls so the rocket feels alive, not like a static render.'),
  bullet('built-3', 'Embed workflow — participants left with something that runs in a normal browser tab.'),

  heading('guide-heading', 'Full walkthrough on Notion'),

  linkedParagraph('guide-body', [
    {
      text: 'The step-by-step guide — every click, inspector value, and export screen from the room — lives on ',
    },
    { text: 'Notion: Build & Launch an Animated Rocket', link: WORKSHOP_GUIDE_URL },
    {
      text: '. Parts 0 through 4 walk from signing up at ',
    },
    { text: 'spline.design', link: SPLINE_URL },
    {
      text: ' to a working rocket.html file. That document is the workshop; this page is the why.',
    },
  ]),

  heading('outcome-heading', 'What people took away'),

  paragraph('outcome-body', [
    span(
      'outcome-body-span',
      'The best feedback was quiet confidence — people who had never touched 3D tooling left understanding that interactive scenes are reachable in an afternoon. I did not track formal adoption metrics, but the room clearly learned more about 3D, and several kept experimenting in the #noa-3d channel afterward.',
    ),
  ]),

  paragraph('outro', [
    span(
      'outro-span',
      'If you are a designer who wants dimension without a graphics programming degree, or a developer who wants a fast hero section, Spline is still the friendly on-ramp. The rocket is silly on purpose — it makes the workflow memorable.',
    ),
  ]),
];

const patchPayload = {
  content,
  client: 'NoA Ignite',
  projectType: 'other',
  status: 'completed',
  projectStart: '2025-04-10',
  projectEnd: '2025-04-10',
  connectedPage: WORKSHOP_GUIDE_URL,
  summary: [
    paragraph('sw-s0', [
      span(
        'sw-s0-s',
        'Spline workshop at NoA Ignite — 20+ designers and developers, 2.5 hours. Built an interactive 3D rocket with lift-off controls to show that web 3D does not need to be rocket science.',
      ),
    ]),
    paragraph('sw-s1', [
      span(
        'sw-s1-s',
        'Spline only — model, animate, export, embed. Full step-by-step guide on Notion; participants left with a playable scene in the browser.',
      ),
    ]),
  ],
  seo: {
    title: 'Spline Workshop',
    description:
      'NoA Ignite Spline workshop for 20+ designers and developers — interactive 3D rocket in 2.5 hours, no Three.js. Full Notion guide: model, animate, and embed with Spline.',
  },
  tags: [
    { _type: 'reference', _ref: '27026017-4989-406f-b90e-42051f6a7c96', _key: 'tag-workshop' },
    { _type: 'reference', _ref: '5462d90f-b358-4754-b163-8f450e464f85', _key: 'tag-3d' },
    { _type: 'reference', _ref: 'f276ca21-f9ba-40e5-9231-9842d6d64137', _key: 'tag-work' },
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

console.log('Updated Spline Workshop project content');
