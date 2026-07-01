/**
 * Revamp project titles: split pipe-separated names into title + client,
 * normalize casing, and sync SEO titles.
 *
 * Dry run (default):
 *   node scripts/revamp-project-titles.mjs
 *
 * Apply patches:
 *   node scripts/revamp-project-titles.mjs --apply
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
const APPLY = process.argv.includes('--apply');

if (!PROJECT_ID) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID');
}

if (APPLY && !WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN (required with --apply)');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-28',
  token: WRITE_TOKEN,
  useCdn: false,
});

/** @type {Array<{ slug: string; name: string; client?: string; seoTitle?: string }>} */
const TITLE_PATCHES = [
  { slug: '3d-black-hole', name: '3D Black Hole' },
  { slug: 'anton-sport-online-retail', name: 'Online Retail', client: 'Anton Sport' },
  { slug: 'bad-ui-battle-2-0-hackathon', name: 'Bad UI Battle 2.0', client: 'Hackathon', seoTitle: 'Bad UI Battle 2.0' },
  { slug: 'bad-ui-battle-hackathon', name: 'Bad UI Battle', client: 'Hackathon', seoTitle: 'Bad UI Battle' },
  { slug: 'bama-transport-optimisation-dashboard', name: 'Transport Optimisation Dashboard', client: 'Bama' },
  { slug: 'bane-nor-design-system-lead', name: 'Design System Lead', client: 'Bane NOR' },
  { slug: 'blodtarnet', name: 'Blodtårnet' },
  { slug: 'boxboi-unity', name: 'Box Boi' },
  { slug: 'far-erik-christmas-beer', name: 'Christmas Beer', client: 'Far Erik' },
  { slug: 'gi-av-deg-selv-ruter', name: 'Gi Av Deg Selv', client: 'Ruter' },
  { slug: 'hastings', name: 'First House', client: 'Hastings' },
  { slug: 'hove-music-festival-2019', name: 'Hove Music Festival 2019' },
  { slug: 'moldbakken-website-logo', name: 'Website & Logo', client: 'Moldbakken' },
  { slug: 'nixis-album-covers', name: 'Album Covers', client: 'Nixis' },
  { slug: 'nixis-website', name: 'Website', client: 'Nixis' },
  { slug: 'project-babel', name: 'Project Babel' },
  { slug: 'project-huldra', name: 'Project Huldra' },
  { slug: 'scentwise', name: 'Scentwise' },
  { slug: 'sealift-systems', name: 'Sealift Systems' },
  { slug: 'slik-bygger-vi-apper-for-alle-panel-debate', name: 'Slik bygger vi apper for alle', client: 'Panel debate', seoTitle: 'Slik bygger vi apper for alle' },
  { slug: 'spline-workshop', name: 'Spline Workshop' },
  { slug: 'stormhvalen', name: 'Stormhvalen' },
  { slug: 'tine-litago', name: 'Litago', client: 'TINE' },
  { slug: 'tine-designsystem-krem', name: 'KREM Design System', client: 'TINE' },
  { slug: 'tine-kjokken-recipes', name: 'Recipes', client: 'TINE Kjøkken' },
  { slug: 'unge-drabanter', name: 'Unge Drabanter' },
  { slug: 'website-performance-dashboard', name: 'Website Performance Dashboard' },
  { slug: 'wisihe-website', name: 'Portfolio Website', client: 'WiSiHe', seoTitle: 'WiSiHe Portfolio Website' },
];

function buildSeoTitle({ name, client, seoTitle }) {
  if (seoTitle) return seoTitle;
  const context = client?.trim();
  const title = name.trim();
  return context ? `${context} — ${title}` : title;
}

const projects = await client.fetch(
  `*[_type == "project"]{ _id, name, client, "slug": slug.current, "seoTitle": seo.title }`,
);

const patchBySlug = new Map(TITLE_PATCHES.map(p => [p.slug, p]));
const missing = TITLE_PATCHES.filter(p => !projects.some(doc => doc.slug === p.slug));

if (missing.length > 0) {
  console.warn('Warning: patches with no matching project:', missing.map(p => p.slug).join(', '));
}

let changed = 0;

for (const project of projects) {
  const patch = patchBySlug.get(project.slug);
  if (!patch) {
    console.log(`— skip (no patch): ${project.slug}`);
    continue;
  }

  const nextClient = patch.client ?? null;
  const nextSeoTitle = buildSeoTitle(patch);
  const unchanged =
    project.name === patch.name &&
    (project.client ?? null) === nextClient &&
    (project.seoTitle ?? null) === nextSeoTitle;

  if (unchanged) {
    console.log(`✓ unchanged: ${project.slug}`);
    continue;
  }

  changed += 1;
  const display = nextClient ? `${nextClient} — ${patch.name}` : patch.name;
  console.log(`→ ${project.slug}`);
  console.log(`    was: ${JSON.stringify({ name: project.name, client: project.client, seoTitle: project.seoTitle })}`);
  console.log(`    now: ${JSON.stringify({ name: patch.name, client: nextClient, seoTitle: nextSeoTitle, display })}`);

  if (APPLY) {
    await client
      .patch(project._id)
      .set({
        name: patch.name,
        client: nextClient,
        'seo.title': nextSeoTitle,
      })
      .commit({ autoGenerateArrayKeys: true });
  }
}

console.log(`\n${changed} project(s) ${APPLY ? 'updated' : 'would change'}.`);
if (!APPLY && changed > 0) {
  console.log('Run with --apply to write changes.');
}
