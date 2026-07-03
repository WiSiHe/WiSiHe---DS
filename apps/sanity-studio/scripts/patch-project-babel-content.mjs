/**
 * Update Project Babel — short portfolio story, honest abandoned-game narrative.
 * Run: node scripts/patch-project-babel-content.mjs
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

const DOCUMENT_ID = '03f8855c-bbfc-4933-a862-c49c0f8a47e4';
const TEASER_URL = 'https://youtu.be/_vomTdWqdP8';
const HULDRA_URL = 'https://www.wisihe.no/projects/project-huldra';

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
  linkedParagraph('intro-1', [
    {
      text: 'Project Babel was the most ambitious thing I have attempted — a two-person 3D adventure in Unreal Engine 4 with Fabien Guillaume, built remotely from 2016 to 2019. We restarted more than once as we levelled up, shipped a playable vertical slice and a ',
    },
    { text: 'teaser trailer', link: TEASER_URL },
    {
      text: ', then shelved the full game. It never released. It was still my end-to-end education in game development.',
    },
  ]),

  heading('pitch-heading', 'The pitch'),

  paragraph('pitch-body', [
    span(
      'pitch-body-span',
      'A lone wanderer crosses a frozen world of ruins and silence — no dialogue, no hand-holding. Environmental puzzles block the path: rooms that shift layout, labyrinths that punish assumptions, spaces meant to feel oppressive and beautiful at once. The goal is the Tower of Babel at the heart of it all, where the secret to restoring life on the planet waits at the top.',
    ),
  ]),

  heading('team-heading', 'Two people, every hat'),

  paragraph('team-body', [
    span(
      'team-body-span',
      'Fabien and I split everything — concept, blockouts, 3D models, materials, textures, rigging, level design, lighting, and Blueprint gameplay. Remote collaboration worked fine for logic and blueprints; syncing multi-gigabyte art files across time zones did not. That pipeline friction was as much a lesson as the game design.',
    ),
  ]),

  heading('built-heading', 'What we actually built'),

  paragraph('built-body', [
    span(
      'built-body-span',
      'Not a shipped game — but tangible output: a third-person vertical slice you could run through, a teaser trailer, and a large body of environment art and systems. The slice is where the design was most honest: less about world scale, more about what playing Babel actually felt like.',
    ),
  ]),

  bullet(
    'built-1',
    'Third-person traversal through frozen ruins and puzzle-dense interiors — mood over open-world sprawl.',
  ),
  bullet(
    'built-2',
    'Shifting rooms and labyrinths — disorientation as a deliberate mechanic.',
  ),
  bullet(
    'built-3',
    'Concept art made physical — sketches and paintings turned into in-engine geometry, materials, and light.',
  ),
  bullet(
    'built-4',
    'Blueprint gameplay — interaction triggers, puzzle logic, and prototyping without a dedicated programmer.',
  ),

  heading('stack-heading', 'Stack'),

  paragraph('stack-body', [
    span(
      'stack-body-span',
      'Unreal Engine 4 and Blueprints for gameplay. Blender and ZBrush for modelling, Substance Painter for textures, SpeedTree for frozen exteriors. Grey-box blockouts before polish — especially for puzzle rooms and labyrinth flow.',
    ),
  ]),

  heading('stopped-heading', 'Why we stopped'),

  paragraph('stopped-body', [
    span(
      'stopped-body-span',
      'The open world was the mistake — not the frozen setting, not the Tower, not the puzzles. Two people cannot sustainably own an open-world pipeline remotely. Every new area multiplied art debt; every restart reset progress; every large asset sync ate time we did not have. We stopped in mid-2019.',
    ),
  ]),

  paragraph('stopped-body-2', [
    span(
      'stopped-body-2-span',
      'If I started again tomorrow, the open world goes first. A tight labyrinth adventure with shifting rooms and one clear goal — reach the top of Babel — would have been the right scope. We proved the atmosphere and the craft; we never proved the product at open-world scale.',
    ),
  ]),

  heading('lessons-heading', 'What Babel taught me'),

  paragraph('lessons-body', [
    span(
      'lessons-body-span',
      'This is why an abandoned project sits on my portfolio: Babel was a full-stack game-dev bootcamp I ran on myself. Scope discipline, end-to-end 3D pipeline work, Blueprint prototyping, and the hard rule that remote teams need a pipeline sized to the team — not the dream. Every client project since inherits the same instinct: prove the loop, size the pipeline, then polish.',
    ),
  ]),

  linkedParagraph('trailer-body', [
    { text: 'The ' },
    { text: 'teaser trailer', link: TEASER_URL },
    {
      text: ' is mood and scale — the Tower on the horizon. The embed on this page is the same clip; the carousel shows in-engine work: frozen exteriors, shifting interiors, concept art in Unreal.',
    },
  ]),

  linkedParagraph('outro', [
    { text: 'Game dev is still in the picture. ' },
    { text: 'Project Huldra', link: HULDRA_URL },
    {
      text: ' is the next chapter — solo UE5 forest horror with the scope lessons Babel taught the expensive way.',
    },
  ]),
];

const patchPayload = {
  content,
  client: 'Personal',
  status: 'abandoned',
  projectStart: '2016-02-01',
  projectEnd: '2019-06-12',
  connectedPage: TEASER_URL,
  summary: [
    paragraph('babel-s0', [
      span(
        'babel-s0-s',
        'Two-person UE4 adventure with Fabien Guillaume (2016–2019): frozen-world exploration, shifting puzzle rooms, Tower of Babel finale. Shipped a vertical slice and teaser; shelved the full game. Never released — but it taught me end-to-end game dev and scope discipline.',
      ),
    ]),
  ],
  seo: {
    title: 'Project Babel',
    description:
      'Project Babel (2016–2019): UE4 frozen-world adventure with Fabien Guillaume — shifting puzzle rooms, vertical slice, teaser trailer, and hard-won scope lessons from an unreleased game.',
  },
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

console.log('Updated Project Babel content');
