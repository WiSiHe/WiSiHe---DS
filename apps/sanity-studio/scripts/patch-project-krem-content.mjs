/**
 * Update KREM (TINE design system) copy, SEO, and Storybook link.
 * Run: node scripts/patch-project-krem-content.mjs
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
const DATASET =
  process.env.SANITY_STUDIO_API_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
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

const DOCUMENT_ID = '7ea4c1a3-1780-4a29-b3d5-bc1229725aef';
const STORYBOOK_URL =
  'https://main--65aef5010dff543cab28da32.chromatic.com/?path=/docs/welcome-tine-design-system--docs';

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

const summary = [
  paragraph('krem-s0', [
    span(
      'krem-s0-s',
      'TINE had an estimated 20–30 different button implementations across brands and repos — same intent, different code every time. KREM was TINE’s initiative to regain control, keep UI consistent, and speed up delivery. I was frontend lead from Nov 2023 to Sep 2024 (a lighter stretch over summer), working målstyrt with the internal team: workshops and content inventory first, then tokens, then Button in production by end of Q1 2024.',
    ),
  ]),
  paragraph('krem-s1', [
    span(
      'krem-s1-s',
      'Turborepo monorepo — tokens, React components, shared TypeScript and ESLint packages — with Figma as token source of truth, three brand themes (TINE Handel, Fjordland, Diplom-Is Handel), trunk-based dev, Changesets releases to Azure Artifacts, Chromatic on every PR, and public Storybook. Not every product ran React; the token layer still gave value. Early adopters tested preview packages before stable releases — surfacing real issues like CSS cascade layers on older Chrome builds outside our test matrix.',
    ),
  ]),
];

const content = [
  linkedParagraph('krem-intro', [
    {
      text: 'KREM is TINE’s multi-brand design system — named through an internal democratic competition (K.R.E.M; the acronym expansion was chosen by TINE). I led frontend for roughly ten months on the calendar, with a quieter summer in the middle. The ',
    },
    { text: 'public Storybook', link: STORYBOOK_URL },
    {
      text: ' is still the best place to browse what we shipped: tokens, components, and three brand themes side by side.',
    },
  ]),

  heading('krem-problem-h', 'The problem'),
  paragraph('krem-problem', [
    span(
      'krem-problem-s',
      'TINE runs many brands and many codebases. Buttons alone had an estimated 20–30 implementations — built differently, styled differently, maintained separately. That cost speed, consistency, and confidence. The initiative came from TINE itself: one shared foundation instead of reinventing UI per team and per brand.',
    ),
  ]),

  heading('krem-discovery-h', 'Discovery'),
  paragraph('krem-discovery', [
    span(
      'krem-discovery-s',
      'We ran workshops and a content inventory with TINE’s internal team — designers, developers, and stakeholders — to learn what mattered most and catalog what already existed. That shaped a pragmatic backlog: critical components first, not the full wish list sitting in the corner of someone’s Figma file.',
    ),
  ]),

  heading('krem-approach-h', 'Målstyrt delivery'),
  paragraph('krem-approach', [
    span(
      'krem-approach-s',
      'Ship value early, iterate in production. Foundations first — global tokens plus per-brand themes covering color, spacing, radius, shadow, semantic component tokens, and breakpoints. Then Button in production by end of Q1 2024. Then core components and replacement in selected target TINE projects. Early adopters got preview packages (Pokémon codenames) before we promoted stable releases through Changesets.',
    ),
  ]),

  heading('krem-arch-h', 'Multi-brand architecture'),
  paragraph('krem-arch', [
    span(
      'krem-arch-s',
      'One component API, three brand token modes on top of shared global tokens: TINE Handel, Fjordland, and Diplom-Is Handel. Figma was the source of truth for tokens — designer changes opened a PR into code. Token modes per brand; components consumed the same typed token layer.',
    ),
  ]),

  heading('krem-eng-h', 'Engineering'),
  bullet(
    'krem-eng-1',
    'Turborepo monorepo — tokens, React components, TypeScript config package, ESLint package; packages depended on each other in a clear graph.',
  ),
  bullet(
    'krem-eng-2',
    'Trunk-based development; Changesets for versioning, changelogs, and coordinated releases to Azure Artifacts on merge.',
  ),
  bullet(
    'krem-eng-3',
    'Chromatic on every PR for visual regression; Storybook hosted publicly for docs and design review.',
  ),
  bullet(
    'krem-eng-4',
    'Strict TypeScript with shared types between tokens and components so API drift showed up at compile time, not in production.',
  ),

  heading('krem-adoption-h', 'Adoption and lessons'),
  paragraph('krem-adoption', [
    span(
      'krem-adoption-s',
      'Not every brand or repo could adopt React components — legacy stacks and older browsers were real constraints. Those teams could still get value from the token layer: shared colors, spacing, radius, and semantic CSS without a full component migration. Preview packages surfaced integration pain early — including CSS cascade layers breaking on a Chrome ~2020 build that was not in our test suite. We fixed forward and tightened what “supported” meant.',
    ),
  ]),

  heading('krem-outro-h', 'Outcome'),
  paragraph('krem-outro', [
    span(
      'krem-outro-s',
      'KREM gave TINE a shared foundation for React teams, while non-React products could still adopt the token layer. What I am proudest of is the iteration rhythm: go to production early, learn from real adopters, release again. Less catalogue, more shipping.',
    ),
  ]),
];

await client
  .patch(DOCUMENT_ID)
  .set({
    summary,
    content,
    connectedPage: STORYBOOK_URL,
    'seo.title': 'TINE — KREM Design System',
    'seo.description':
      'Multi-brand React design system for TINE — Figma token pipeline, three brand themes, Turborepo monorepo, Changesets releases, Chromatic + Storybook, and goal-driven rollout from Button to production by end of Q1 2024.',
  })
  .commit();

console.log('Updated KREM project content');
