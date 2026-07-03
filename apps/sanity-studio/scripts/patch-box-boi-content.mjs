/**
 * Update Box Boi — solo Unity game jam case study.
 * Run: node scripts/patch-box-boi-content.mjs
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

const DOCUMENT_ID = 'e46f4d50-38a1-4d6e-96ab-cb8de2b22bb3';

const TAG_UNITY = 'a01536e0-2186-40f9-9b54-d47473964d2c';
const TAG_GAME = '6c9bc456-af5e-41b4-aba7-87066e96d927';
const TAG_CSHARP = '1840c951-0ba7-496e-9d76-aa7e8231744e';
const TAG_GAMEJAM = '15f3bcf2-1782-4f8a-94e1-e849ec30c469';
const TAG_HACKATHON = '98fabd36-4c62-4f97-ac68-0759c7fd7d27';

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
      'Box Boi was my entry into a 48-hour game jam in November 2019 — one weekend to go from nothing to a playable Unity game. The clock was the enemy just as much as whatever was on screen.',
    ),
  ]),

  paragraph('intro-2', [
    span(
      'intro-2-span',
      'I handled everything solo: visual design, C# gameplay, and whatever weird ideas felt funny at 2 a.m. Game jams are still my favourite way to build — the constraints force you to commit, ship, and move on.',
    ),
  ]),

  heading('concept-heading', 'The concept'),

  paragraph('concept-body', [
    span(
      'concept-body-span',
      'A tiny box character in an endless runner world with hazards that escalate fast. Simple on paper, chaotic in practice — including, somehow, Nicolas Cage’s face as an obstacle. That is what happens when creative decisions get made at jam speed and nobody is there to tell you no.',
    ),
  ]),

  heading('built-heading', 'What I built'),

  bullet(
    'built-1',
    'Endless runner loop — movement, spawning, collision, and difficulty that ramps instead of plateaus.',
  ),
  bullet(
    'built-2',
    'Solo art pass — characters, backgrounds, and UI in Photoshop, then straight into Unity with no time for a proper pipeline.',
  ),
  bullet(
    'built-3',
    'C# gameplay scripts — player control, hazard behaviour, and game-over flow written while the art was still changing.',
  ),
  bullet(
    'built-4',
    'A complete build — menu, play state, fail state, and enough juice that it felt like a game, not a tech demo.',
  ),

  heading('stack-heading', 'Stack'),

  paragraph('stack-body', [
    span(
      'stack-body-span',
      'Unity and C#. Constant context-switching between Photoshop and Visual Studio, with no room to second-guess scope. If a feature did not survive the first implementation pass, it did not ship.',
    ),
  ]),

  heading('jam-heading', 'Jam rules'),

  paragraph('jam-body', [
    span(
      'jam-body-span',
      'Forty-eight hours means ruthless cuts. Polish waits. “Maybe later” means never. Box Boi is scrappy and weird — not portfolio-perfect, but exactly what a jam should be: finished, playable, and honest about the deadline that made it.',
    ),
  ]),

  heading('lesson-heading', 'What I took away'),

  paragraph('lesson-body', [
    span(
      'lesson-body-span',
      'You can ship a complete game in a weekend when you stop overthinking. The gameplay video on this page is from the jam build — proof that a silly idea with a hard deadline beats a perfect idea that never leaves the project folder.',
    ),
  ]),
];

const patchPayload = {
  content,
  name: 'Box Boi',
  client: 'Personal',
  projectType: 'gameDevelopment',
  status: 'completed',
  projectStart: '2019-11-21',
  projectEnd: '2019-11-23',
  summary: [
    paragraph('bb-s0', [
      span(
        'bb-s0-s',
        '48-hour game jam — solo Unity endless runner, November 2019. Tiny box character, escalating hazards, art and C# in one weekend.',
      ),
    ]),
    paragraph('bb-s1', [
      span(
        'bb-s1-s',
        'Scrappy, weird, and finished on time. Proof you can ship a complete playable game when the deadline is the design constraint.',
      ),
    ]),
  ],
  seo: {
    title: 'Box Boi',
    description:
      'Box Boi — solo Unity endless runner game jam. Custom art, C# gameplay, and a Nicolas Cage hazard. Built in 48 hours, November 2019.',
  },
  tags: [
    { _type: 'reference', _ref: TAG_UNITY, _key: 'tag-unity' },
    { _type: 'reference', _ref: TAG_GAME, _key: 'tag-game' },
    { _type: 'reference', _ref: TAG_CSHARP, _key: 'tag-csharp' },
    { _type: 'reference', _ref: TAG_GAMEJAM, _key: 'tag-gamejam' },
    { _type: 'reference', _ref: TAG_HACKATHON, _key: 'tag-hackathon' },
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

console.log('Updated Box Boi content');
