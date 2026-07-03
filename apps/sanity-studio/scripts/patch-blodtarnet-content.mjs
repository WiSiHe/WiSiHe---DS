/**
 * Update Blodtårnet game jam project copy.
 * Run: node scripts/patch-blodtarnet-content.mjs
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

const DOCUMENT_ID = '5e65b3fc-fbf3-481f-a777-22573220d887';
const PLAY_URL =
  'https://play.unity.com/en/games/29bffa25-928f-4283-b5ef-97cc5c1f5a0a/game-web';

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
      'Blodtårnet was a weekend game jam I organised and led in August 2025 — not client work, just for fun. Ten-plus people, one team, one playable game by Sunday 18:00. The theme came from an old Norse saga tied to tapestries: Blodtårnet — the blood tower.',
    ),
  ]),
  paragraph('intro-2', [
    span(
      'intro-2-span',
      'I booked the office, set the rules, ran the schedule, pitched Unity to people who had never shipped a game, and then spent the rest of the weekend doing the unglamorous job of making everyone’s ideas fit into something you could actually press Play on.',
    ),
  ]),

  heading('jam-heading', 'Running the jam'),

  paragraph('jam-body', [
    span(
      'jam-body-span',
      'Before anyone opened the editor I handled the boring parts that make a jam work: gathering game ideas, locking a theme, writing constraints, reserving space, and setting boundaries so we would ship instead of debate. I walked the group through what Unity is and how you go from empty project to something playable in a weekend.',
    ),
  ]),

  bullet('jam-1', 'Theme: Blodtårnet — Norse saga material, loosely rooted in old tapestry storytelling.'),
  bullet('jam-2', 'Hard deadline: playable in the browser by Sunday 18:00 — no extensions.'),
  bullet('jam-3', 'One game, one team — not a room full of separate prototypes.'),
  bullet('jam-4', 'Assignments so artists, musicians, and minigame makers knew what to build toward.'),

  heading('game-heading', 'The game'),

  paragraph('game-body', [
    span(
      'game-body-span',
      'What we shipped is a 2D platformer with isometric maps, a string of minigames, a boss fight, and an ethics beat that still makes people uncomfortable: save the children, or consume them. It is horror-tinged, overstuffed, and very much a jam game — which is the point.',
    ),
  ]),

  bullet('game-1', 'Core loop: platform through the tower, hit minigame rooms, survive the boss, face the moral choice.'),
  bullet('game-2', 'Contributors built minigames, soundtracks, and art in parallel while I held the spine together.'),
  bullet('game-3', 'Unity 6.3, shipped as a WebGL build on Unity Play.'),

  heading('my-role-heading', 'What I built'),

  paragraph('role-body', [
    span(
      'role-body-span',
      'Leadership and craft blurred together. I scoped the game, designed levels, drew art where we had gaps, implemented gameplay, and spent the last hours wiring other people’s work into one coherent build. Saying yes to every cool idea felt generous on Saturday and expensive on Sunday.',
    ),
  ]),

  heading('hard-heading', 'What was hard'),

  paragraph('hard-body', [
    span(
      'hard-body-span',
      'The hardest part was integration — ten people generating ideas and code at once, all of them reasonable in isolation. Connecting minigames, audio, and level flow without a month of polish is where jams are won or lost. I wanted to include everything; the tower almost collapsed under its own ambition.',
    ),
  ]),

  heading('win-heading', 'The moment that mattered'),

  paragraph('win-body', [
    span(
      'win-body-span',
      'Sunday at 18:00 we had an audience. People actually played it — laughed, groaned at the ethics screen, died in the boss. That beat any feature I cut at the last minute.',
    ),
  ]),

  linkedParagraph('play-link', [
    { text: 'Play ' },
    { text: 'Blodtårnet on Unity Play', link: PLAY_URL },
    { text: ' in the browser. Bring headphones; it is a jam game, not a AAA trailer.' },
  ]),

  heading('learned-heading', 'Next time'),

  paragraph('learned-body', [
    span(
      'learned-body-span',
      'I would prepare more before the clock starts — starter scenes, shared input, a stricter rule on scope — and be firmer about saying no when the tower does not need another minigame. Fun does not mean boundaryless.',
    ),
  ]),
];

const patchPayload = {
  content,
  status: 'completed',
  projectType: 'gameDevelopment',
  projectStart: '2025-08-22',
  projectEnd: '2025-08-24',
  connectedPage: PLAY_URL,
  summary: [
    paragraph('bt-s0', [
      span(
        'bt-s0-s',
        'Weekend game jam I organised and led — theme Blodtårnet from Norse saga, ten-plus people, one playable Unity game by Sunday 18:00. 2D platformer with isometric maps, minigames, boss fight, and a save-or-consume-the-children ethics beat.',
      ),
    ]),
    paragraph('bt-s1', [
      span(
        'bt-s1-s',
        'I ran schedule, rules, and Unity onboarding, then scoped gameplay, levels, and art while wiring everyone’s contributions together. Shipped on Unity Play — played live at launch with an audience.',
      ),
    ]),
  ],
  seo: {
    title: 'Blodtårnet — Game Jam',
    description:
      'Blodtårnet — weekend Unity game jam: 2D platformer with minigames, boss fight, and Norse horror ethics. Organised and led for 10+ people; playable on Unity Play.',
  },
  tags: [
    { _type: 'reference', _ref: '15f3bcf2-1782-4f8a-94e1-e849ec30c469', _key: 'tag-gamejam' },
    { _type: 'reference', _ref: 'adacd617-694b-440f-b275-ba3a83df0a06', _key: 'tag-gamedev' },
    { _type: 'reference', _ref: 'a01536e0-2186-40f9-9b54-d47473964d2c', _key: 'tag-unity' },
    { _type: 'reference', _ref: '6c9bc456-af5e-41b4-aba7-87066e96d927', _key: 'tag-game' },
    { _type: 'reference', _ref: '0615d553-3951-4e34-aaf8-9b4ea8ba1103', _key: 'tag-horror' },
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

console.log('Updated Blodtårnet game jam project content');
