/**
 * Update Bane NOR Design System Lead project copy (successor lead narrative).
 * Run: node scripts/patch-bane-nor-content.mjs
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

const DOCUMENT_ID = '7c2e6663-3d89-4463-b807-45402c101fb7';

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
      "Bane NOR runs Norway's rail infrastructure — track, signals, stations, and the digital products that keep it all moving. I did not start their design system. I stepped in as Design System Lead through NoA Ignite when the previous lead moved to another company, inheriting a live React library already in use across more than twenty internal product teams.",
    ),
  ]),
  paragraph('intro-2', [
    span(
      'intro-2-span',
      'The job was continuity at scale: keep releases moving, answer to stakeholders, absorb feedback from teams with different priorities, and push the system forward without pretending a single person could redesign Norwegian rail UI from scratch in five months.',
    ),
  ]),

  heading('mandate-heading', 'What the role actually was'),

  paragraph('mandate-intro', [
    span(
      'mandate-intro-span',
      'My mandate was operational leadership on a system that already worked — not a greenfield pitch deck. Day to day that meant owning the roadmap, stakeholder reporting, release cadence, and support model, alongside a small core team and contributors from product squads.',
    ),
  ]),

  bullet(
    'mandate-1',
    'Roadmap — what ships next, what waits, and what we deprecate with a clear migration path.',
  ),
  bullet(
    'mandate-2',
    'Stakeholder reporting — regular updates to Bane NOR and NoA leads on progress, risk, and adoption.',
  ),
  bullet(
    'mandate-3',
    'Release cadence — predictable drops through the existing NX monorepo and Azure Artifacts pipeline.',
  ),
  bullet(
    'mandate-4',
    'Support model — triage, DevOps tickets, logging, and the unglamorous work that keeps teams unblocked.',
  ),

  heading('inherited-heading', 'What was already there'),

  paragraph('inherited-body', [
    span(
      'inherited-body-span',
      'Credit where it belongs: the previous lead and core team had already laid the foundation — token structure, CI/CD pipelines, Storybook, and a catalogue of twenty-plus React components published for internal consumers. My job was to maintain momentum, not rebrand the repo.',
    ),
  ]),

  bullet('inherited-1', 'Token architecture and build pipelines were in place before I arrived.'),
  bullet('inherited-2', 'A broad component set was already shipping to active product teams.'),
  bullet(
    'inherited-3',
    'Internal Storybook and package distribution via Azure Artifacts — no public docs site.',
  ),
  bullet(
    'inherited-4',
    'Design support from Bane NOR designers; I focused on delivery, process, and engineering coordination.',
  ),

  heading('process-heading', 'How we ran the system'),

  paragraph('process-intro', [
    span(
      'process-intro-span',
      'A design system at this scale is mostly process. We worked in sprint cadence with regular design–dev sync, backlog grooming, and feedback sessions where product teams could argue about real use cases instead of abstract principles.',
    ),
  ]),

  bullet(
    'process-1',
    'Sprint cadence for the core team — planned work, support load, and space for urgent fixes.',
  ),
  bullet(
    'process-2',
    'Design–dev sync so component APIs matched what designers actually specified.',
  ),
  bullet(
    'process-3',
    'Backlog grooming to separate "nice idea" from "three teams blocked on this".',
  ),
  bullet(
    'process-4',
    'Adoption surveys, tutorials, showcases, and demos to surface friction before it became a fork.',
  ),
  bullet(
    'process-5',
    'Developer feedback sessions — I started recording attendance so we had a paper trail of who was in the room and what was decided.',
  ),

  heading('shipped-heading', 'What I pushed forward'),

  paragraph('shipped-body', [
    span(
      'shipped-body-span',
      'I was hands-on when it counted — new components where gaps showed up in support tickets, rewrites where APIs had drifted, and deliberate deprecations where legacy patterns were costing teams time. A fair chunk of my hours still went to DevOps tickets, logging, and keeping the release train on the rails. That is part of the job at enterprise scale, even if it does not make flashy portfolio screenshots.',
    ),
  ]),

  heading('hard-heading', 'What was hard'),

  paragraph('hard-body', [
    span(
      'hard-body-span',
      'Twenty-plus teams means twenty-plus opinions. Maintenance crews, passenger apps, internal ops tools — they all need buttons, but they rarely agree on what a button should do. Balancing those wants without letting the system become a junk drawer was the constant tension.',
    ),
  ]),

  heading('learned-heading', 'What I would do differently'),

  paragraph('learned-body', [
    span(
      'learned-body-span',
      'With more runway I would push harder on refactors and widen contribution from product teams — federated ownership beats a heroic core team every time. The feedback sessions and recorded attendance helped; I would have doubled down on turning that into a formal contribution model earlier.',
    ),
  ]),

  paragraph('outro', [
    span(
      'outro-span',
      'I left in December 2025 with the system still in active use across Bane NOR. Adoption at national-rail scale is never a checkbox — it is a long negotiation between shared standards and local reality. My five months were about keeping that negotiation productive.',
    ),
  ]),
];

const patchPayload = {
  content,
  status: 'completed',
  summary: [
    paragraph('bn-s0', [
      span(
        'bn-s0-s',
        'Succeeded Design System Lead at Bane NOR through NoA Ignite — a live React library, tokens, and Storybook already serving 20+ internal rail product teams when I took over.',
      ),
    ]),
    paragraph('bn-s1', [
      span(
        'bn-s1-s',
        'Owned roadmap, releases, stakeholder reporting, and support. Shipped components and deprecations, ran feedback loops and design–dev sync, and kept the NX monorepo shipping through Azure Artifacts.',
      ),
    ]),
  ],
  seo: {
    title: 'Bane NOR — Design System Lead',
    description:
      'Succeeded design system lead at Bane NOR — maintaining and growing a live React library across 20+ rail product teams. Roadmap, releases, stakeholder reporting, and support at national-operator scale.',
  },
  tags: [
    { _type: 'reference', _ref: 'a43a0399-00b8-4460-9ce3-2ff957bc211b', _key: 'tag-designsystem' },
    { _type: 'reference', _ref: '5d386adf-54d0-415e-9cfa-38defa2db606', _key: 'tag-react' },
    { _type: 'reference', _ref: '970fb442-fa7c-42bb-8cd7-a20bcdbc6f4c', _key: 'tag-typescript' },
    { _type: 'reference', _ref: 'd9873b4e-eb99-498f-8a74-7290652928a9', _key: 'tag-css' },
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

console.log('Updated Bane NOR Design System Lead project content');
