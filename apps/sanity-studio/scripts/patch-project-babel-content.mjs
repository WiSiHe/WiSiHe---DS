/**
 * Update Project Babel copy, SEO, and teaser URL.
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

config({ path: path.join(studioRoot, '.env.local') });
config({ path: path.join(studioRoot, '.env') });

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_API_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

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

const DOCUMENT_ID = '03f8855c-bbfc-4933-a862-c49c0f8a47e4';
const TEASER_URL = 'https://youtu.be/_vomTdWqdP8';

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

function linkedBullet(key, parts) {
  const markDefs = [];
  const children = parts.map((part, index) => {
    if (part.link) {
      const linkKey = `${key}-link-${index}`;
      markDefs.push(linkDef(linkKey, part.link));
      return span(`${key}-span-${index}`, part.text, [linkKey]);
    }
    return span(`${key}-span-${index}`, part.text);
  });
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs,
    children,
  };
}

const content = [
  linkedParagraph('intro-hook', [
    {
      text: 'Project Babel was the most ambitious thing I have attempted — a two-person 3D adventure built in Unreal Engine 4 with Fabien Guillaume from 2016 to 2019. We worked remotely, restarted the project more than once as we levelled up, and eventually shipped a playable vertical slice and a ',
    },
    { text: 'teaser trailer', link: TEASER_URL },
    {
      text: ' before abandoning the full game. It never released — but it was my end-to-end education in game development.',
    },
  ]),

  heading('tldr-heading', 'TL;DR'),

  bullet(
    'tldr-1',
    'Concept: third-person exploration in a frozen world — solve environmental puzzles and labyrinthine rooms on the way to the Tower of Babel, where the secret to restoring life on the planet waits at the top.',
  ),
  bullet(
    'tldr-2',
    'Team: me and Fabien Guillaume — two developers working remotely, building all art, design, and Blueprint gameplay ourselves.',
  ),
  bullet('tldr-3', 'Gameplay: run, explore, solve puzzles — including rooms that shift layout and maze-like spaces that disorient on purpose.'),
  bullet('tldr-4', 'Stack: Unreal Engine 4, Blender, ZBrush, Substance Painter, SpeedTree, UE4 Blueprints.'),
  bullet(
    'tldr-5',
    'Outcome: vertical slice + teaser trailer, then abandoned mid-2019. First thing I would cut if restarting today: the open world.',
  ),
  bullet(
    'tldr-6',
    'What I gained: scope discipline, and hands-on skill across modelling, materials, textures, blockouts, rigging, Blueprints, and gameplay prototyping.',
  ),
  linkedBullet('tldr-7', [
    { text: 'Appendix — watch the ' },
    { text: 'teaser trailer', link: TEASER_URL },
    { text: ' for tone and scale (the case study is the learning; the trailer is the mood reel).' },
  ]),

  heading('pitch-heading', 'The pitch'),

  paragraph('pitch-body', [
    span(
      'pitch-body-span',
      'A lone wanderer crosses a frozen world of ruins and silence. No dialogue, no hand-holding — just atmosphere, exploration, and consequence. Environmental puzzles block the path forward: rooms that change layout, labyrinths that punish assumptions, and spaces designed to feel oppressive and beautiful at once. The goal is the Tower of Babel at the heart of it all. At the top lies the secret that could restore life to the planet.',
    ),
  ]),

  heading('team-heading', 'The team', 'h3'),

  paragraph('team-body', [
    span(
      'team-body-span',
      'Fabien Guillaume and I split everything between us — concept, blockouts, 3D models, materials, textures, rigging, level design, lighting, and Blueprint gameplay. Working across time zones meant version control for logic and blueprints worked fine; syncing multi-gigabyte art files did not. That pipeline friction was as much a lesson as the game design itself.',
    ),
  ]),

  heading('what-we-built-heading', 'What we actually built', 'h3'),

  paragraph('built-body', [
    span(
      'built-body-span',
      'We did not ship a full game. What exists is still tangible: a third-person vertical slice you could run through, a teaser trailer, and a large body of environment art and systems. The slice is where the design was most honest — less about world scale, more about what playing Babel actually felt like.',
    ),
  ]),

  bullet(
    'built-1',
    'Third-person traversal — run through frozen ruins and interior spaces built for mood and puzzle density, not open-world sprawl.',
  ),
  bullet(
    'built-2',
    'Shifting rooms and labyrinths — puzzle spaces that change layout or maze the player, leaning into disorientation as a mechanic.',
  ),
  bullet(
    'built-3',
    'Concept art made physical — the work I am still most proud of: taking sketches and paintings and turning them into real, in-engine geometry, materials, and light.',
  ),
  bullet(
    'built-4',
    'Blueprint gameplay — interaction triggers, puzzle logic, and prototyping without a dedicated programmer on the team.',
  ),
  bullet(
    'built-5',
    'Teaser trailer — an appendix to this case study, not the deliverable. Watch it for tone; read on for what we learned building it.',
  ),

  heading('timeline-heading', 'How the three years actually went', 'h3'),

  paragraph('timeline-body', [
    span(
      'timeline-body-span',
      'We did not build in a straight line. Babel was restarted from scratch more than once — each time because we had learned something new and wanted the game to reflect it. A lot of the calendar went to picking up tricks (better blockouts, cleaner materials, tighter Blueprints) and folding them back into the project. That learning was genuine; the cost was momentum.',
    ),
  ]),

  heading('pipeline-heading', 'Pipeline & tools', 'h3'),

  bullet('pipe-1', 'Blockouts and level design — grey-box spaces before polish, especially for puzzle rooms and labyrinth flow.'),
  bullet('pipe-2', 'Modelling: high and low poly in Blender and ZBrush.'),
  bullet('pipe-3', 'Texturing and materials: Substance Painter, in-engine material work.'),
  bullet('pipe-4', 'Vegetation: SpeedTree for trees and ground cover in the frozen exterior spaces.'),
  bullet('pipe-5', 'Rigging and animation prep for characters and interactive props.'),
  bullet('pipe-6', 'Gameplay: Unreal Engine 4 Blueprints for prototyping and systems.'),

  heading('why-stopped-heading', 'Why we stopped', 'h3'),

  paragraph('stopped-body', [
    span(
      'stopped-body-span',
      'The open world was the mistake — not the frozen setting, not the Tower, not the puzzles. Two people cannot sustainably own an open-world pipeline remotely. Every new area multiplied art debt; every restart reset progress; every large asset sync across continents ate time we did not have.',
    ),
  ]),
  paragraph('stopped-body-2', [
    span(
      'stopped-body-2-span',
      'We stopped in mid-2019. If I started again tomorrow, the open world goes first. A tight labyrinth adventure with shifting rooms and one clear goal — reach the top of Babel — would have been the right scope. We proved the atmosphere and the craft; we never proved the product at open-world scale.',
    ),
  ]),

  heading('lessons-heading', 'What Babel taught me', 'h3'),

  paragraph('lessons-intro', [
    span(
      'lessons-intro-span',
      'This is why an abandoned project sits on my portfolio: Babel was a full-stack game-dev bootcamp I ran on myself. The skills below are the hireable output — not the unreleased EXE.',
    ),
  ]),

  bullet('lesson-1', 'Scope: open world is a multiplier, not a feature. Cut it before it cuts you.'),
  bullet('lesson-2', '3D pipeline: modelling, materials, textures, blockouts, and rigging — end to end, not theoretical.'),
  bullet('lesson-3', 'Gameplay: Blueprint prototyping, puzzle scripting, third-person feel — built, tested, thrown away, rebuilt.'),
  bullet('lesson-4', 'Craft: making concept art real — the bridge from 2D intent to something physical in-engine.'),
  bullet('lesson-5', 'Collaboration: remote game dev needs a pipeline sized to the team, not the dream.'),

  heading('appendix-heading', 'Appendix: teaser trailer', 'h3'),

  linkedParagraph('appendix-body', [
    { text: 'The ' },
    { text: 'Babel teaser trailer', link: TEASER_URL },
    {
      text: ' is best treated as an appendix — mood, scale, and the Tower on the horizon. The project video on this page embeds the same clip. Screenshots in the carousel show the in-engine work: frozen exteriors, shifting interiors, and concept art brought into Unreal.',
    },
  ]),

  paragraph('outro', [
    span(
      'outro-span',
      'Babel did not ship. I am glad we built it anyway — and glad we stopped when the scope math stopped working. Every client project since inherits the same instinct: prove the loop, size the pipeline, then polish. Game dev is still in the picture too — Project Huldra is the next chapter, and that one is moving forward.',
    ),
  ]),
];

await client
  .patch(DOCUMENT_ID)
  .set({
    content,
    connectedPage: TEASER_URL,
    seo: {
      title: 'Project Babel',
      description:
        'Project Babel (2016–2019): UE4 frozen-world adventure with Fabien Guillaume — shifting puzzle rooms, Tower of Babel finale, vertical slice, and lessons in scope, 3D pipeline, and Blueprint gameplay.',
    },
  })
  .commit();

console.log('Updated Project Babel content');
