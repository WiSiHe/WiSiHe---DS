/**
 * Update BAD UI BATTLE v1 + 2.0 — short portfolio copy, host + competitor narrative.
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

const GALLERY_URL = 'https://bad-ui-battle-signup.vercel.app/gallery';
const EVENT_URL = 'https://bad-ui-battle-signup.vercel.app/';
const V1_PROJECT_URL = 'https://www.wisihe.no/projects/bad-ui-battle-hackathon';
const V2_PROJECT_URL = 'https://www.wisihe.no/projects/bad-ui-battle-2-0-hackathon';

const TAG_DESIGN = 'd0ef5082-3ade-4d85-81ab-a6fbf91f6ccc';
const TAG_HACKATHON = '98fabd36-4c62-4f97-ac68-0759c7fd7d27';
const TAG_WORK = 'f276ca21-f9ba-40e5-9231-9842d6d64137';
const TAG_NEXTJS = 'fd4b20a7-0e6f-40c4-a71f-b6ab26156402';

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

function buildV1Content() {
  return [
    paragraph('intro-1', [
      span(
        'intro-1-span',
        'BAD UI BATTLE is a one-afternoon hackathon at NoA Ignite where good taste is forbidden — teams build interfaces that technically work but actively fight the user, then demo them live for crowd votes. I hosted the first edition on 19 September 2024 and still competed myself.',
      ),
    ]),
    paragraph('intro-2', [
      span(
        'intro-2-span',
        'Most hackathons reward polish. This one inverts the brief on purpose. It sounds like a joke, and the room treats it like one — until you realise how fast breaking every UX rule teaches you why those rules exist.',
      ),
    ]),

    heading('host-heading', 'Running the event'),

    paragraph('host-body', [
      span(
        'host-body-span',
        'Hosting meant more than showing up with a slide deck. I built the signup and gallery site in Next.js with Supabase — registrations, submission uploads, and a public gallery so every awful interface outlives the afternoon. In the room: teams, a two-hour build window, three-minute demos, and QR-code voting at the NoA Ignite office in Oslo.',
      ),
    ]),

    linkedParagraph('host-link', [
      { text: 'Event site and gallery: ' },
      { text: 'bad-ui-battle-signup.vercel.app', link: EVENT_URL },
    ]),

    heading('entry-heading', 'My entry — Figma'),

    paragraph('entry-body', [
      span(
        'entry-body-span',
        'I entered on the same terms as everyone else. Year one was a Figma prototype — UX guidelines treated like a bingo card: mystery navigation, moving targets, hostile confirmations, contrast that fails every check. Screenshots from the session are on this page; every team submission from the hackathon lives in the gallery.',
      ),
    ]),

    heading('lesson-heading', 'Why it works'),

    paragraph('lesson-body', [
      span(
        'lesson-body-span',
        'Competitive anti-pattern practice is weirdly effective. When you remove hierarchy and affordance on purpose, you feel discoverability collapse immediately. Designers leave with sharper instincts for real client work — and a shared vocabulary for what not to ship.',
      ),
    ]),

    linkedParagraph('outro', [
      { text: 'We ran it again in November 2025 as ' },
      { text: 'BAD UI BATTLE 2.0', link: V2_PROJECT_URL },
      { text: ' — same spirit, higher bar, and my entry moved from Figma to code.' },
    ]),
  ];
}

function buildV2Content() {
  return [
    paragraph('intro-1', [
      span(
        'intro-1-span',
        'BAD UI BATTLE is a one-afternoon hackathon at NoA Ignite where good taste is forbidden — teams build interfaces that technically work but actively fight the user, then demo them live for crowd votes. I hosted the second edition on 18 November 2025 and competed with a coded entry called Worst Authenticator.',
      ),
    ]),
    paragraph('intro-2', [
      span(
        'intro-2-span',
        'Most hackathons reward polish. This one inverts the brief on purpose. Teams get a two-hour build window, three minutes on stage, and the audience picks the worst UI via QR code. If the room groans during your demo, you are winning.',
      ),
    ]),

    heading('host-heading', 'Running the event'),

    paragraph('host-body', [
      span(
        'host-body-span',
        'Hosting meant organizing teams, keeping time, running demos, and tallying votes — while also building my own entry on the same rules as everyone else. I built the signup and gallery site in Next.js with Supabase: registrations, submission uploads, and a public gallery where every awful interface outlives the afternoon.',
      ),
    ]),

    linkedParagraph('gallery-link', [
      { text: 'Browse every submission from both editions: ' },
      { text: 'Bad UI Gallery', link: GALLERY_URL },
    ]),

    heading('entry-heading', 'My entry — Worst Authenticator'),

    paragraph('entry-body', [
      span(
        'entry-body-span',
        'I entered alongside the other teams with a shipped web app, not a slide deck. Worst Authenticator is a deliberately hostile two-factor flow — illegible type, misaligned controls, guilt-trip copy, and interactions that punish curiosity. Technically demoable, spiritually unusable.',
      ),
    ]),

    bullet('entry-1', 'Built in code — a real auth flow, not a Figma prototype.'),
    bullet(
      'entry-2',
      'Leaned into real anti-patterns: fake urgency, mystery steps, broken hierarchy.',
    ),
    bullet('entry-3', 'The worse the live reaction, the better the score.'),

    heading('lesson-heading', 'Why it works'),

    paragraph('lesson-body', [
      span(
        'lesson-body-span',
        'Competitive anti-pattern practice is weirdly effective. When you remove hierarchy and affordance on purpose, you feel discoverability collapse immediately. Designers leave with sharper instincts for real client work — and a shared vocabulary for what not to ship. More screenshots from 2.0 are in the carousel on this page.',
      ),
    ]),

    linkedParagraph('outro', [
      {
        text: 'This was the second time we ran it. The first edition — September 2024, Figma entry, how the format started — is on the ',
      },
      { text: 'BAD UI BATTLE (2024)', link: V1_PROJECT_URL },
      { text: ' project page.' },
    ]),
  ];
}

const patches = [
  {
    id: '037afd2c-3c85-4d30-b964-7444eb903a2c',
    client: 'NoA Ignite',
    projectStart: '2024-09-19',
    projectEnd: '2024-09-19',
    content: buildV1Content(),
    summary: [
      paragraph('bub1-s0', [
        span(
          'bub1-s0-s',
          'Hosted BAD UI BATTLE at NoA Ignite — a hackathon where teams build deliberately terrible UIs and win crowd votes for the worst. First edition, 19 September 2024. Built the Next.js + Supabase signup and gallery site; entered with a Figma prototype.',
        ),
      ]),
      paragraph('bub1-s1', [
        span(
          'bub1-s1-s',
          'Two-hour build, live demos, QR voting in Oslo. Competitive anti-pattern practice — funny in the room, sharpens real design instincts afterward.',
        ),
      ]),
    ],
    seo: {
      title: 'Bad UI Battle',
      description:
        'Hosted BAD UI BATTLE at NoA Ignite (2024) — awful-UI hackathon with Next.js signup site, public gallery, and a Figma entry. Deliberately terrible interfaces, crowd-voted.',
    },
    tags: [
      { _type: 'reference', _ref: TAG_DESIGN, _key: 'tag-design' },
      { _type: 'reference', _ref: TAG_HACKATHON, _key: 'tag-hackathon' },
      { _type: 'reference', _ref: TAG_WORK, _key: 'tag-work' },
      { _type: 'reference', _ref: TAG_NEXTJS, _key: 'tag-nextjs' },
    ],
  },
  {
    id: 'f7b13fe2-566b-483e-855b-766521bbb64e',
    client: 'NoA Ignite',
    projectStart: '2025-11-18',
    projectEnd: '2025-11-18',
    content: buildV2Content(),
    summary: [
      paragraph('bub2-s0', [
        span(
          'bub2-s0-s',
          'Hosted BAD UI BATTLE at NoA Ignite — a hackathon where teams build deliberately terrible UIs and win crowd votes for the worst. Second edition, 18 November 2025. Built the Next.js + Supabase signup and gallery site; entered with Worst Authenticator, a coded hostile 2FA flow.',
        ),
      ]),
      paragraph('bub2-s1', [
        span(
          'bub2-s1-s',
          'Two-hour build, live demos, QR voting in Oslo. Competitive anti-pattern practice — funny in the room, sharpens real design instincts afterward.',
        ),
      ]),
    ],
    seo: {
      title: 'Bad UI Battle 2.0',
      description:
        'Hosted BAD UI BATTLE at NoA Ignite (2025) — awful-UI hackathon with Next.js signup site, public gallery, and Worst Authenticator (coded entry). Deliberately terrible interfaces, crowd-voted.',
    },
    tags: [
      { _type: 'reference', _ref: TAG_DESIGN, _key: 'tag-design' },
      { _type: 'reference', _ref: TAG_HACKATHON, _key: 'tag-hackathon' },
      { _type: 'reference', _ref: TAG_WORK, _key: 'tag-work' },
      { _type: 'reference', _ref: TAG_NEXTJS, _key: 'tag-nextjs' },
    ],
  },
];

if (process.argv.includes('--print-json')) {
  process.stdout.write(JSON.stringify(patches));
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

for (const patch of patches) {
  await client
    .patch(patch.id)
    .set({
      content: patch.content,
      client: patch.client,
      projectStart: patch.projectStart,
      projectEnd: patch.projectEnd,
      connectedPage: GALLERY_URL,
      summary: patch.summary,
      seo: patch.seo,
      tags: patch.tags,
    })
    .commit();
  console.log(`Updated ${patch.seo.title}`);
}

console.log('Done — BAD UI BATTLE v1 and 2.0');
