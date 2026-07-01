/**
 * Backfill project `summary` from content blocks before the first heading.
 * When a split is found, also trims those blocks from `content` to avoid duplication.
 *
 * Dry run (default):
 *   node scripts/backfill-project-summaries.mjs
 *
 * Apply patches:
 *   node scripts/backfill-project-summaries.mjs --apply
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

const HEADING_STYLES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function splitContentAtFirstHeading(content) {
  if (!Array.isArray(content) || content.length === 0) {
    return { intro: [], body: [], hasSplit: false };
  }

  const firstHeadingIndex = content.findIndex(
    block => block?._type === 'block' && HEADING_STYLES.has(block.style ?? ''),
  );

  if (firstHeadingIndex <= 0) {
    return { intro: [], body: content, hasSplit: false };
  }

  return {
    intro: content.slice(0, firstHeadingIndex),
    body: content.slice(firstHeadingIndex),
    hasSplit: true,
  };
}

function toSummaryBlocks(intro) {
  return intro.filter(block => block?._type === 'block' && (block.style ?? 'normal') === 'normal');
}

function plainTextLength(blocks) {
  return blocks
    .flatMap(block => block.children ?? [])
    .map(child => child.text ?? '')
    .join(' ')
    .trim().length;
}

const projects = await client.fetch(
  `*[_type == "project" && defined(content)]{
    _id,
    name,
    "slug": slug.current,
    summary,
    content
  }`,
);

let candidateCount = 0;
let patchCount = 0;

for (const project of projects) {
  if (Array.isArray(project.summary) && project.summary.length > 0) {
    continue;
  }

  const { intro, body, hasSplit } = splitContentAtFirstHeading(project.content ?? []);
  if (!hasSplit) continue;

  const summary = toSummaryBlocks(intro);
  if (summary.length === 0 || plainTextLength(summary) === 0) continue;

  candidateCount += 1;
  const charCount = plainTextLength(summary);

  console.log(`\n• ${project.name ?? project._id} (${project.slug ?? 'no-slug'})`);
  console.log(`  summary: ${summary.length} block(s), ${charCount} chars`);
  console.log(`  body: ${body.length} block(s) remain`);

  if (APPLY) {
    await client
      .patch(project._id)
      .set({ summary, content: body })
      .commit({ autoGenerateArrayKeys: true });
    patchCount += 1;
    console.log('  ✓ patched');
  }
}

console.log(
  `\n${APPLY ? 'Patched' : 'Would patch'} ${APPLY ? patchCount : candidateCount} project(s).`,
);

if (!APPLY && candidateCount > 0) {
  console.log('Re-run with --apply to write changes.');
}
