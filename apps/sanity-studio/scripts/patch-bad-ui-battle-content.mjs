/**
 * Update BAD UI BATTLE project copy (v1 + 2.0), SEO, tags, and gallery URL.
 * Run: node scripts/patch-bad-ui-battle-content.mjs
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

const GALLERY_URL = 'https://bad-ui-battle-signup.vercel.app/gallery';
const EVENT_URL = 'https://bad-ui-battle-signup.vercel.app/';

const TAG_DESIGN = 'd0ef5082-3ade-4d85-81ab-a6fbf91f6ccc';
const TAG_WORKSHOP = '27026017-4989-406f-b90e-42051f6a7c96';
const TAG_HACKATHON = '98fabd36-4c62-4f97-ac68-0759c7fd7d27';
const TAG_WORK = 'f276ca21-f9ba-40e5-9231-9842d64137';

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

function buildV1Content() {
  return [
    linkedParagraph('intro-hook', [
      {
        text: 'BAD UI BATTLE is a one-day design hackathon at NoA Ignite where the only winning move is to build something spectacularly, deliberately terrible. I took part in the first edition on 19 September 2024 — browse every submission in the ',
      },
      { text: 'Bad UI Gallery', link: GALLERY_URL },
      { text: ' (linked below) or read on for how the event works and what I learned from breaking every UX rule on purpose.' },
    ]),

    heading('tldr-heading', 'TL;DR'),

    bullet('tldr-1', 'Goal: create a UI that technically works but is hilariously frustrating — then demo it live and win crowd votes for being the worst.'),
    bullet('tldr-2', 'Format: team up, build from 17:00–19:00, three-minute demos, QR-code voting at the NoA Ignite office in Oslo.'),
    bullet('tldr-3', 'Tools: anything goes — Figma prototypes, code, or whatever your team is fastest with. No coding required.'),
    bullet('tldr-4', 'Strategy: weaponise real anti-patterns — mystery navigation, moving buttons, hostile confirmations, contrast that hurts.'),
    bullet('tldr-5', 'Payoff: breaking rules on purpose is one of the fastest ways to remember why accessibility, hierarchy, and affordance matter.'),
    linkedBullet('tldr-6', [
      { text: 'See the entries: ' },
      { text: 'open the gallery', link: GALLERY_URL },
    ]),

    paragraph('intro-2', [
      span(
        'intro-2-span',
        'Most hackathons reward polish. BAD UI BATTLE inverts that completely. Good taste is forbidden. The brief is to out-awful each other with interfaces that are confusing, absurd, and still just functional enough to demo. It sounds like a joke — and it is — but it is also one of the sharpest design exercises I have done at work.',
      ),
    ]),

    heading('how-heading', 'How the hackathon works'),

    linkedParagraph('how-intro', [
      { text: 'The event site at ' },
      { text: 'bad-ui-battle-signup.vercel.app', link: EVENT_URL },
      { text: ' lays out the format. In the room, it plays out like this:' },
    ]),

    bullet('how-1', 'Form teams and pick a concept — the worse the idea, the better the starting point.'),
    bullet('how-2', 'Build window: roughly two hours (17:00–19:00) to prototype or code something demo-ready.'),
    bullet('how-3', 'Present: each team gets about three minutes to show off their bad UI and explain the chaos.'),
    bullet('how-4', 'Vote: audience scans a QR code and picks the best (worst) design. One vote per person.'),
    bullet('how-5', 'Win: the team that gets the strongest reaction — groans, laughter, disbelief — takes the prize.'),

    heading('anti-patterns-heading', 'Anti-patterns worth stealing', 'h3'),

    paragraph('anti-patterns-body', [
      span(
        'anti-patterns-body-span',
        'The fun part is that you are not inventing new failures — you are amplifying patterns every designer has fought in production. These were the moves I leaned into hardest:',
      ),
    ]),

    bullet('ap-1', 'Mystery meat navigation — icons and labels that reveal nothing until you click the wrong thing.'),
    bullet('ap-2', 'Buttons that move when you hover — punishment for trying to tap the target.'),
    bullet('ap-3', 'Colour contrast that fails every accessibility check — neon on neon, low-contrast greys on white.'),
    bullet('ap-4', 'Hostile confirmations — guilt-trip copy, fake urgency, or dialogs that block the actual task.'),
    bullet('ap-5', 'Broken hierarchy — everything screams at the same volume so nothing is findable.'),

    heading('my-entry-heading', 'My entry', 'h3'),

    paragraph('my-entry-body', [
      span(
        'my-entry-body-span',
        'I spent the afternoon treating UX guidelines like a bingo card. Every anti-pattern I have had to remove from a real product went back in — on purpose. The result was intentionally unusable, demo-friendly, and funny in a room full of designers who immediately recognised what I had done.',
      ),
    ]),
    paragraph('my-entry-body-2', [
      span(
        'my-entry-body-2-span',
        'Screenshots from the session are in the carousel on this page. For every team submission from the hackathon — including mine — visit the gallery link below.',
      ),
    ]),

    heading('gallery-heading', 'Gallery'),

    linkedParagraph('gallery-body', [
      { text: 'All hackathon submissions live in the ' },
      { text: 'Bad UI Gallery', link: GALLERY_URL },
      {
        text: '. It is the best way to experience the chaos: misaligned layouts, hostile flows, and interfaces that technically work while actively fighting the user. Proceed with low expectations and a high tolerance for visual suffering.',
      },
    ]),

    linkedParagraph('outro', [
      { text: 'BAD UI BATTLE returned in 2025 as ' },
      { text: 'BAD UI BATTLE 2.0', link: 'https://www.wisihe.no/projects/bad-ui-battle-2-0-hackathon' },
      {
        text: ' — same spirit, new round of awful interfaces. If you run a design team, I cannot recommend this format enough: it is chaotic, hilarious, and weirdly effective at sharpening instincts.',
      },
    ]),
  ];
}

function buildV2Content() {
  return [
    linkedParagraph('intro-hook', [
      {
        text: 'BAD UI BATTLE 2.0 was the second round of NoA Ignite\'s deliberately terrible UI hackathon — same inverted brief, new teams, new levels of hostility. I joined on 18 November 2025. Every submission from both editions is collected in the ',
      },
      { text: 'Bad UI Gallery', link: GALLERY_URL },
      { text: ' (also linked in the Live project section below).' },
    ]),

    heading('tldr-heading', 'TL;DR'),

    bullet('tldr-1', 'Same rules as v1: build the worst UI you can, demo it live, win votes for being gloriously bad.'),
    bullet('tldr-2', 'Good taste is still forbidden — misalignment, illegible type, and interactions that fight the user are features, not bugs.'),
    bullet('tldr-3', 'Two-hour build, three-minute demos, crowd voting — Figma, code, or any tool your team prefers.'),
    bullet('tldr-4', 'The real lesson: you feel accessibility, hierarchy, and affordance the moment you remove them on purpose.'),
    linkedBullet('tldr-5', [
      { text: 'Browse all entries: ' },
      { text: 'Bad UI Gallery', link: GALLERY_URL },
    ]),
    linkedBullet('tldr-6', [
      { text: 'Missed the first round? Read about ' },
      { text: 'BAD UI BATTLE (2024)', link: 'https://www.wisihe.no/projects/bad-ui-battle-hackathon' },
    ]),

    paragraph('intro-2', [
      span(
        'intro-2-span',
        'What if the goal was to make the worst possible interface — on purpose? That was the brief again for 2.0. I leaned in hard: misaligned buttons, illegible colour combos, mystery navigation, and flows that punish curiosity. The worse the reaction in the room, the better I was doing.',
      ),
    ]),

    heading('what-changed-heading', 'What 2.0 brought'),

    paragraph('what-changed-body', [
      span(
        'what-changed-body-span',
        'The format did not change — teams, timed build, live demos, QR voting — but the bar had been raised. Everyone had seen the first gallery. New entries had to be more creative, more hostile, and more confidently awful. The extra images on this page are from the 2.0 session: more teams, more screenshots, more evidence that designers enjoy breaking things when they are allowed to.',
      ),
    ]),

    heading('how-heading', 'How it works'),

    linkedParagraph('how-intro', [
      { text: 'Full event details are on ' },
      { text: 'the BAD UI BATTLE site', link: EVENT_URL },
      { text: '. Quick recap:' },
    ]),

    bullet('how-1', 'Teams form and pick a concept designed to frustrate.'),
    bullet('how-2', 'Build phase: prototype or code something demo-ready in a single afternoon session.'),
    bullet('how-3', 'Each team presents for ~3 minutes — the demo is half the entertainment.'),
    bullet('how-4', 'Audience votes via QR code for the best (worst) UI.'),
    bullet('how-5', 'Winning team takes the prize. Everyone else takes new respect for WCAG.'),

    heading('design-lessons-heading', 'Why this is a serious design exercise', 'h3'),

    paragraph('lessons-body', [
      span(
        'lessons-body-span',
        'It sounds like a joke, and the room treats it like one — until you start building. Breaking every rule forces you to understand exactly why those rules exist. When you remove contrast, you feel readability die. When you hide navigation, you feel discoverability collapse. When you add motion to buttons, you feel motor accessibility disappear.',
      ),
    ]),
    paragraph('lessons-body-2', [
      span(
        'lessons-body-2-span',
        'That is the hidden value: BAD UI BATTLE is competitive anti-pattern practice. You leave with sharper instincts for real client work — and a gallery full of cautionary tales.',
      ),
    ]),

    heading('anti-patterns-heading', 'Anti-patterns on the bingo card', 'h3'),

    bullet('ap-1', 'Misaligned controls — buttons and inputs that refuse to line up.'),
    bullet('ap-2', 'Clashing palettes — colours that vibrate against each other.'),
    bullet('ap-3', 'Mystery navigation — no clear path, no clear labels.'),
    bullet('ap-4', 'Hostile interactions — confirmations, traps, and fake errors.'),
    bullet('ap-5', 'Typography crimes — illegible sizes, weights, and line lengths.'),

    heading('gallery-heading', 'Gallery'),

    linkedParagraph('gallery-body', [
      { text: 'The gallery is live at ' },
      { text: 'bad-ui-battle-signup.vercel.app/gallery', link: GALLERY_URL },
      {
        text: ' — submissions from both 2024 and 2025. Scroll through, cringe, laugh, and steal ideas for your own internal design critique sessions. It is the most honest museum of what-not-to-do I know.',
      },
    ]),
  ];
}

const patches = [
  {
    id: '037afd2c-3c85-4d30-b964-7444eb903a2c',
    content: buildV1Content(),
    seo: {
      title: 'BAD UI BATTLE | Hackathon',
      description:
        'NoA Ignite BAD UI BATTLE (2024): TL;DR, hackathon format, anti-pattern playbook, and link to the Bad UI Gallery — deliberately terrible UIs judged by crowd vote.',
    },
    tags: [
      { _type: 'reference', _ref: TAG_DESIGN, _key: 'tag-design' },
      { _type: 'reference', _ref: TAG_HACKATHON, _key: 'tag-hackathon' },
      { _type: 'reference', _ref: TAG_WORK, _key: 'tag-work' },
    ],
  },
  {
    id: 'f7b13fe2-566b-483e-855b-766521bbb64e',
    content: buildV2Content(),
    seo: {
      title: 'BAD UI BATTLE 2.0 | Hackathon',
      description:
        'BAD UI BATTLE 2.0 (Nov 2025): second round of NoA Ignite\'s awful-UI hackathon — format, design lessons, anti-patterns, and link to the live submission gallery.',
    },
    tags: [
      { _type: 'reference', _ref: TAG_DESIGN, _key: 'tag-design' },
      { _type: 'reference', _ref: TAG_HACKATHON, _key: 'tag-hackathon' },
      { _type: 'reference', _ref: TAG_WORK, _key: 'tag-work' },
    ],
  },
];

for (const patch of patches) {
  await client
    .patch(patch.id)
    .set({
      content: patch.content,
      connectedPage: GALLERY_URL,
      seo: patch.seo,
    })
    .commit();
  console.log(`Updated ${patch.seo.title}`);
}

console.log('Done — BAD UI BATTLE v1 and 2.0');
