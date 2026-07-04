/**
 * Update WiSiHe portfolio website project copy, SEO, tags, and status.
 * Run: node scripts/patch-wisihe-portfolio-content.mjs
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

const DOCUMENT_ID = '0fe76d1c-539b-48b9-bd5a-f831ad6beb97';

const SITE_URL = 'https://www.wisihe.no';
const STUDIO_URL = 'https://wisihe.sanity.studio/';

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

function codeBlock(key, language, code, filename) {
  return {
    _key: key,
    _type: 'code',
    language,
    filename,
    code,
  };
}

const content = [
  paragraph('intro-1', [
    span(
      'intro-1-span',
      "This one's personal. WiSiHe is my own website — the place where illustration and development share one home that's entirely mine. I started building it in March 2021 with a simple goal: stop renting space on other platforms and make something that actually feels like me. Five years later it's still evolving, and honestly I think it always will be.",
    ),
  ]),
  paragraph('intro-2', [
    span(
      'intro-2-span',
      "There's something uniquely strange about building your own portfolio. You're the client, the designer, the developer, and the critic all at once. Every decision is both a creative choice and a technical one. I've rebuilt whole sections more times than I can count — not because they were broken, but because I got better. That's the point.",
    ),
  ]),

  heading('why-heading', 'Why I built it'),

  paragraph('why-body', [
    span(
      'why-body-span',
      'I wanted one URL that could hold paintings, client work, experiments, recipes, and the occasional WebGL rabbit hole — without forcing everything into separate tools or templates. The site is the portfolio, but it is also where I try ideas first: motion, search, CMS modelling, design tokens, whatever I am learning that week.',
    ),
  ]),

  heading('repo-heading', "What's in the repo"),

  paragraph('repo-intro', [
    span(
      'repo-intro-span',
      'What started as a single Next.js app is now a pnpm monorepo orchestrated with Turborepo. The live site, Sanity Studio, shared packages, and Storybook docs all live in one workspace so changes to tokens or components propagate without copy-paste.',
    ),
  ]),

  codeBlock(
    'repo-tree',
    'text',
    `apps/
  nextjs-portfolio/   # wisihe.no — paintings, projects, recipes, 3D
  sanity-studio/      # content editing + Algolia sync scripts
packages/
  tokens/             # Style Dictionary → CSS + Tailwind v4 themes
  ui-react/           # shared React components (Button, PaintingCard, …)
  sanity-queries/     # typed GROQ for the Next.js app
  utils/              # small shared helpers`,
    'monorepo',
  ),

  bullet(
    'repo-1',
    'apps/nextjs-portfolio — App Router, server components where they help, client islands for search, carousels, and WebGL.',
  ),
  bullet(
    'repo-2',
    'apps/sanity-studio — schemas, editorial workflows, and scripts that patch or sync content (including Algolia indexing).',
  ),
  bullet(
    'repo-3',
    'packages/tokens — semantic colour, type, and spacing tokens compiled to CSS variables and Tailwind.',
  ),
  bullet(
    'repo-4',
    'packages/ui-react — design-system components reused on the site and documented in Storybook.',
  ),

  heading('stack-heading', 'Stack I actually ship with'),

  paragraph('stack-intro', [
    span(
      'stack-intro-span',
      'The stack is deliberately modern — I use this site as a live testbed for tools I care about. A few names that show up in the codebase today:',
    ),
  ]),

  bullet('stack-1', 'Next.js and TypeScript on the frontend, deployed to Vercel.'),
  bullet(
    'stack-2',
    'Sanity as headless CMS — projects, paintings, recipes, and page builder content.',
  ),
  bullet('stack-3', 'Tailwind CSS v4 with tokens from packages/tokens, not one-off hex values.'),
  bullet(
    'stack-4',
    'Motion (motion/react) for page transitions, carousels, and scroll-driven UI — not Framer Motion.',
  ),
  bullet('stack-5', 'Three.js for presentations and experiments where flat design is not enough.'),
  bullet(
    'stack-6',
    'Algolia for paintings search — faceted filters, instant results, synced from Sanity.',
  ),
  bullet(
    'stack-7',
    'Biome for lint and format, Turbo for builds, Changesets when library packages version.',
  ),

  heading('rebuild-heading', 'What I keep rebuilding'),

  paragraph('rebuild-intro', [
    span(
      'rebuild-intro-span',
      'Because the site is never "done", the interesting work is incremental. Recent passes have focused on making the homepage and project pages feel more editorial — tighter cards, better image treatment, case-study typography — while keeping performance sane.',
    ),
  ]),

  bullet(
    'rebuild-1',
    'Home showcase curation — which paintings and projects lead the story, edited in Sanity rather than hard-coded.',
  ),
  bullet(
    'rebuild-2',
    'Project case studies — portable text with in-column code blocks, summary fields for cards, and live demo links.',
  ),
  bullet(
    'rebuild-3',
    'Paintings gallery — Algolia-powered search, brush-reveal interactions, and shared PaintingCard components from the design system.',
  ),
  bullet(
    'rebuild-4',
    'Design tokens and ui-react — when a pattern repeats on the site, it moves into packages/ and gets a Storybook story.',
  ),

  heading('content-heading', 'How content works'),

  paragraph('content-body-1', [
    span(
      'content-body-1-span',
      'Almost everything public-facing is editable in Sanity: project summaries and long-form case studies, painting metadata, homepage sections, SEO fields, and connected live URLs. Shared GROQ lives in packages/sanity-queries so the Next.js app and scripts query the same shapes.',
    ),
  ]),

  linkedParagraph('content-body-2', [
    { text: 'Draft mode and Sanity Live Preview let me review changes on ' },
    { text: 'wisihe.no', link: SITE_URL },
    {
      text: ' before publishing. Studio runs at ',
    },
    { text: 'wisihe.sanity.studio', link: STUDIO_URL },
    {
      text: '. Paintings and projects index to Algolia via studio scripts — search stays fast without loading the entire catalogue into the browser.',
    },
  ]),

  paragraph('outro', [
    span(
      'outro-span',
      "You're looking at a project with no finish line, and I'm completely fine with that. Every time I ship a client design system or a shader demo, something useful tends to flow back here — a component, a content pattern, or a lesson about what not to over-build. The site is the notebook.",
    ),
  ]),
];

const patchPayload = {
  content,
  status: 'inProgress',
  connectedPage: SITE_URL,
  summary: [
    paragraph('wh-s0', [
      span(
        'wh-s0-s',
        'WiSiHe — my portfolio and playground in one. Illustration, client work, and experiments on a Next.js monorepo with Sanity CMS, design tokens, Algolia search, and Motion.',
      ),
    ]),
    paragraph('wh-s1', [
      span(
        'wh-s1-s',
        'Started March 2021, still in progress. I rebuild sections whenever I learn something worth shipping — no finish line, and that is the point.',
      ),
    ]),
  ],
  seo: {
    title: 'WiSiHe — Portfolio Website',
    description:
      'WiSiHe portfolio — Next.js monorepo with Sanity CMS, design tokens, Algolia search, shared React components, and performance-focused UX. Ongoing since 2021.',
  },
  tags: [
    { _type: 'reference', _ref: 'fd4b20a7-0e6f-40c4-a71f-b6ab26156402', _key: 'tag-nextjs' },
    { _type: 'reference', _ref: '970fb442-fa7c-42bb-8cd7-a20bcdbc6f4c', _key: 'tag-typescript' },
    { _type: 'reference', _ref: '5d386adf-54d0-415e-9cfa-38defa2db606', _key: 'tag-react' },
    { _type: 'reference', _ref: '124aa49d-fb22-4a9c-a767-b06a69f75392', _key: 'tag-sanity' },
    { _type: 'reference', _ref: '9ec4dc55-b917-4ee4-a6b6-752379a9d8ef', _key: 'tag-tailwind' },
    { _type: 'reference', _ref: 'a43a0399-00b8-4460-9ce3-2ff957bc211b', _key: 'tag-designsystem' },
    { _type: 'reference', _ref: '8c13d32e-0a6e-46c5-9dd0-975a860d01aa', _key: 'tag-illustration' },
    { _type: 'reference', _ref: 'f183c67b-f706-4442-8f6b-20a330c00b64', _key: 'tag-threejs' },
    { _type: 'reference', _ref: 'cc47af1a-b7e0-401c-a497-7239245dcbab', _key: 'tag-animation' },
  ],
  excludeFromOngoingSpotlight: true,
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

await client.patch(DOCUMENT_ID).set(patchPayload).unset(['projectEnd']).commit();

console.log('Updated WiSiHe portfolio website project content');
