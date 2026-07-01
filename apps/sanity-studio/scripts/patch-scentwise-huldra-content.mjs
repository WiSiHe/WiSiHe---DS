/**
 * Restructure Scentwise and Project Huldra copy (summary + case study).
 * Run: node scripts/patch-scentwise-huldra-content.mjs
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

const SCENTWISE_ID = '2d0db8b0-a222-4bce-8e30-23c5ce2d1cde';
const HULDRA_ID = '37b22ba7-f453-4ab2-a04f-d4241f178509';

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

const scentwiseSummary = [
  paragraph('sw-sum-1', [
    span(
      'sw-sum-1-span',
      'Scentwise is a side project I started in 2025 — a fragrance discovery platform built with Next.js and Supabase. The goal is to help people explore perfumes without the usual noise: clearer context, better discovery, and an experience that feels fast and considered.',
    ),
  ]),
  paragraph('sw-sum-2', [
    span(
      'sw-sum-2-span',
      "It's still early days. I'm shaping the product in public — figuring out what features earn their place and what gets in the way. This page is a living record of that build.",
    ),
  ]),
];

const scentwiseContent = [
  heading('sw-tldr-heading', 'TL;DR'),
  bullet(
    'sw-tldr-1',
    'Concept: a fragrance discovery platform — search, explore, and understand scents without the usual retail clutter.',
  ),
  bullet('sw-tldr-2', 'Status: in progress since August 2025. MVP-first — ship small, learn fast.'),
  bullet('sw-tldr-3', 'Stack: Next.js, Supabase, TypeScript, deployed on a modern serverless pipeline.'),
  bullet(
    'sw-tldr-4',
    'Audience: fragrance lovers who want better tools, and curious newcomers who need a gentler on-ramp.',
  ),
  bullet(
    'sw-tldr-5',
    'Current focus: core data model, search, and a UI that feels calm — not another loud e-commerce clone.',
  ),

  heading('sw-idea-heading', 'The idea', 'h3'),
  paragraph('sw-idea-body', [
    span(
      'sw-idea-body-span',
      'Fragrance discovery is broken in a specific way: too much marketing language, too little useful context, and almost no tooling that treats scent exploration like a craft rather than a checkout funnel. Scentwise is my attempt to fix the slice I care about — helping someone answer "what might I like?" and "why?" without drowning in brand copy.',
    ),
  ]),

  heading('sw-building-heading', 'What I am building', 'h3'),
  paragraph('sw-building-body', [
    span(
      'sw-building-body-span',
      'The first version is deliberately narrow. I am not trying to be a full retailer or a social network on day one. The MVP is about discovery mechanics: structured fragrance data, search that respects how people actually talk about scent, and pages that explain a fragrance in plain language.',
    ),
  ]),
  bullet('sw-build-1', 'Fragrance catalog with consistent metadata — notes, families, and context that survives a search.'),
  bullet('sw-build-2', 'Discovery flows tuned for browsing, not just filtering by brand.'),
  bullet('sw-build-3', 'A fast, readable UI — mobile-first, minimal chrome, no dark patterns.'),
  bullet('sw-build-4', 'Auth and user data via Supabase — lightweight accounts when they earn their keep.'),

  heading('sw-stack-heading', 'Stack & approach', 'h3'),
  paragraph('sw-stack-body', [
    span(
      'sw-stack-body-span',
      'Next.js for the app shell and rendering strategy, Supabase for database and auth, TypeScript throughout. The architecture bias is boring on purpose: fewer moving parts, easier to iterate while the product shape is still fluid.',
    ),
  ]),

  heading('sw-status-heading', 'Where it is now', 'h3'),
  paragraph('sw-status-body', [
    span(
      'sw-status-body-span',
      'Active development. The product surface is still shifting — some features will ship, others will get cut once real usage proves they do not matter. I would rather publish an honest in-progress case study than pretend the scope is frozen.',
    ),
  ]),

  heading('sw-next-heading', 'What is next', 'h3'),
  bullet('sw-next-1', 'Tighten the core search and detail experience before adding social or recommendation layers.'),
  bullet('sw-next-2', 'Validate the data model against real catalog imports — edge cases always show up late.'),
  bullet('sw-next-3', 'Ship a usable MVP, then decide what "version two" actually needs based on feedback, not assumptions.'),
];

const huldraSummary = [
  paragraph('h-sum-1', [
    span(
      'h-sum-1-span',
      'Project Huldra is a solo Unreal Engine 5 prototype rooted in Norwegian folklore — forest horror where you outsmart the Huldra rather than fight her. Since 2022 I have been building Nordic environments, environmental storytelling, and behaviour that feels emergent instead of scripted.',
    ),
  ]),
  paragraph('h-sum-2', [
    span(
      'h-sum-2-span',
      'The project is on hold, but it is the honest follow-up to Project Babel — better scope instincts and a clearer antagonist. This page documents what exists and what the build taught me.',
    ),
  ]),
];

const huldraContent = [
  heading('h-tldr-heading', 'TL;DR'),
  bullet(
    'h-tldr-1',
    'Concept: first-person forest horror inspired by the Huldra — a seductive forest spirit from Norwegian folklore who lures you deeper until escape is the only win condition.',
  ),
  bullet('h-tldr-2', 'Role: solo developer — design, environment art, systems, and prototyping.'),
  bullet('h-tldr-3', 'Stack: Unreal Engine 5 (Lumen, Nanite), Blender, ZBrush, Substance Painter.'),
  bullet('h-tldr-4', 'Status: on hold since mid-2024. Active development ran from June 2022; the prototype is not abandoned, but paused deliberately.'),
  bullet(
    'h-tldr-5',
    'Design pillar: the Huldra is not a boss fight — she is a presence you read, evade, and outthink.',
  ),
  bullet(
    'h-tldr-6',
    'Relation to Babel: smaller scope, stronger horror fantasy, and a pipeline sized for one person instead of two.',
  ),

  heading('h-pitch-heading', 'The pitch', 'h3'),
  paragraph('h-pitch-body', [
    span(
      'h-pitch-body-span',
      'You are alone in a photoreal Nordic forest that feels wrong in quiet ways — light that does not reach the ground, paths that seem to rearrange, sounds that mimic something familiar. The Huldra watches. She does not announce herself with a health bar. She tests whether you notice the trap before you walk into it. Survival is navigation, observation, and nerve.',
    ),
  ]),

  heading('h-design-heading', 'Design goals', 'h3'),
  bullet(
    'h-design-1',
    'Understated Scandinavian horror — dread from folklore and environment, not jump-scare wallpaper.',
  ),
  bullet(
    'h-design-2',
    'Environmental storytelling — ruins, objects, and forest layout do the narrative work before any explicit exposition.',
  ),
  bullet(
    'h-design-3',
    'Puzzles and pressure — spaces that force attention, memory, and risk assessment under stress.',
  ),
  bullet(
    'h-design-4',
    'An antagonist with agency — the Huldra should feel like she is choosing, not cycling animations.',
  ),

  heading('h-tech-heading', 'Technical approach', 'h3'),
  paragraph('h-tech-body', [
    span(
      'h-tech-body-span',
      'Unreal Engine 5 is the backbone — Lumen for dynamic lighting in dense forest scenes, Nanite for high-fidelity geometry without hand-authoring every LOD transition. Assets move through a familiar pipeline: sculpt and block in Blender and ZBrush, surface in Substance Painter, assemble and light in-engine.',
    ),
  ]),
  bullet('h-tech-1', 'Forest biome: photoreal trees, ground cover, and fog volumes tuned for oppressive readability.'),
  bullet('h-tech-2', 'Modular ruins and props — reusable kits for faster iteration on puzzle spaces.'),
  bullet('h-tech-3', 'Huldra behaviour prototyping — steering, stalking, and lure logic that can surprise during playtests.'),
  bullet('h-tech-4', 'Performance discipline — a solo project dies when every scene is a tech demo; budgets matter.'),

  heading('h-antagonist-heading', 'The Huldra as antagonist', 'h3'),
  paragraph('h-antagonist-body', [
    span(
      'h-antagonist-body-span',
      'In folklore the Huldra is beautiful from the front and hollow from behind — a metaphor for temptation and consequence. In the prototype that translates to mechanics: she draws you toward shortcuts, sounds, or glimpses that feel like progress but cost distance from safety. The design question is never "can you shoot her?" It is "did you understand what she wanted you to do?"',
    ),
  ]),

  heading('h-timeline-heading', 'Timeline & status', 'h3'),
  paragraph('h-timeline-body', [
    span(
      'h-timeline-body-span',
      'Development started in June 2022. For two years it was my primary personal game project — learning UE5 as the engine matured, rebuilding environments as the art bar moved, and prototyping the core loop in parallel. It went on hold in mid-2024 when client work and life bandwidth made a solo horror prototype hard to sustain at the pace it deserved.',
    ),
  ]),
  paragraph('h-timeline-body-2', [
    span(
      'h-timeline-body-2-span',
      'Pausing was the right call. Huldra is not cancelled — the folio, the assets, and the design notes stay. When it resumes, it resumes with a vertical slice mindset, not an open-world one. Project Babel taught me that lesson the expensive way.',
    ),
  ]),

  heading('h-lessons-heading', 'What Huldra taught me', 'h3'),
  bullet('h-lesson-1', 'Scope: one strong forest biome beats three half-finished ones.'),
  bullet('h-lesson-2', 'Horror is systems — lighting, audio, and pathing carry as much weight as the monster.'),
  bullet('h-lesson-3', 'Solo pipelines need reusable kits — modular ruins and vegetation saved more time than hero assets.'),
  bullet('h-lesson-4', 'On hold is not failure — it is scheduling honesty for a project that still has a point.'),
  bullet(
    'h-lesson-5',
    'Craft compounds — every ZBrush pass and Substance layer from Babel shows up here with sharper intent.',
  ),

  heading('h-next-heading', 'If it comes back', 'h3'),
  paragraph('h-next-body', [
    span(
      'h-next-body-span',
      'The next chapter, whenever there is room for it, is a playable vertical slice: one forest route, one Huldra behaviour set that feels unfair in the right way, and one escape sequence that proves the loop. Everything else waits until that loop is fun to lose in.',
    ),
  ]),
];

await client
  .patch(SCENTWISE_ID)
  .set({
    summary: scentwiseSummary,
    content: scentwiseContent,
    seo: {
      title: 'Scentwise',
      description:
        'Scentwise (2025–): a Next.js and Supabase fragrance discovery platform — MVP-first side project for calmer search, clearer context, and better scent exploration.',
    },
  })
  .commit();

await client
  .patch(HULDRA_ID)
  .set({
    summary: huldraSummary,
    content: huldraContent,
    seo: {
      title: 'Project Huldra',
      description:
        'Project Huldra (2022–): solo UE5 forest horror prototype inspired by Norwegian folklore — outsmart the Huldra, survive the Nordic woods, and learn scope the hard way after Project Babel.',
    },
  })
  .commit();

console.log('Updated Scentwise and Project Huldra content');
