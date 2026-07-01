/**
 * Audit project content quality for portfolio case studies.
 * Run: node scripts/audit-project-content.mjs
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

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-28',
  useCdn: false,
});

const HEADING = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function plainText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter(b => b?._type === 'block')
    .flatMap(b => b.children ?? [])
    .map(c => c.text ?? '')
    .join(' ')
    .trim();
}

function countHeadings(blocks) {
  if (!Array.isArray(blocks)) return 0;
  return blocks.filter(b => b?._type === 'block' && HEADING.has(b.style ?? '')).length;
}

function countBlocks(blocks) {
  return Array.isArray(blocks) ? blocks.length : 0;
}

function countImages(blocks) {
  if (!Array.isArray(blocks)) return 0;
  return blocks.filter(b => b?._type === 'image').length;
}

function countCode(blocks) {
  if (!Array.isArray(blocks)) return 0;
  return blocks.filter(b => b?._type === 'code' || b?._type === 'codeBlock').length;
}

function issuesFor(p) {
  const issues = [];
  const summaryChars = plainText(p.summary).length;
  const contentChars = plainText(p.content).length;
  const contentBlocks = countBlocks(p.content);
  const headings = countHeadings(p.content);
  const seoLen = (p.seoDescription ?? '').trim().length;

  if (!p.summary?.length) {
    issues.push({
      severity: 'high',
      msg: 'Missing summary — sidebar intro empty unless content splits at first h2',
    });
  } else if (summaryChars > 500) {
    issues.push({ severity: 'medium', msg: `Summary too long (${summaryChars}/500 chars)` });
  } else if (summaryChars < 80) {
    issues.push({ severity: 'low', msg: `Summary very short (${summaryChars} chars)` });
  }

  if (!p.content?.length) {
    issues.push({ severity: 'high', msg: 'No case study body' });
  } else {
    if (contentChars < 300) {
      issues.push({
        severity: 'high',
        msg: `Very thin case study (${contentChars} chars, ${contentBlocks} blocks)`,
      });
    } else if (contentChars < 800) {
      issues.push({
        severity: 'medium',
        msg: `Light case study (${contentChars} chars) — could use more depth`,
      });
    }
    if (headings === 0) {
      issues.push({ severity: 'medium', msg: 'No headings — hard to scan' });
    } else if (headings === 1) {
      issues.push({ severity: 'low', msg: 'Only one heading — consider more structure' });
    }
  }

  if (seoLen === 0) {
    issues.push({ severity: 'medium', msg: 'Missing SEO description (listing cards)' });
  } else if (seoLen < 80) {
    issues.push({ severity: 'low', msg: `SEO description short (${seoLen} chars)` });
  }

  if (!p.image?.asset) {
    issues.push({ severity: 'high', msg: 'Missing hero image' });
  }

  if (!p.connectedPage && !p.connectedVideo && !(p.connectedPaintings > 0)) {
    issues.push({ severity: 'low', msg: 'No connected page, video, or paintings' });
  }

  const tags = p.tagCount ?? 0;
  if (tags === 0) {
    issues.push({ severity: 'medium', msg: 'No tags' });
  } else if (tags < 2) {
    issues.push({ severity: 'low', msg: `Only ${tags} tag(s)` });
  }

  return {
    summaryChars,
    contentChars,
    contentBlocks,
    headings,
    seoLen,
    images: countImages(p.content),
    code: countCode(p.content),
    issues,
  };
}

const projects = await client.fetch(`*[_type == "project" && defined(slug.current)] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  status,
  projectType,
  summary,
  content,
  "seoDescription": coalesce(seo.description, ""),
  "tagCount": count(tags),
  image,
  connectedPage,
  "connectedVideo": defined(connectedVideo),
  "connectedPaintings": count(connectedPaintings)
}`);

const severityScore = { high: 3, medium: 2, low: 1 };
const score = p => p.audit.issues.reduce((s, i) => s + severityScore[i.severity], 0);

const audited = projects
  .map(p => ({ ...p, audit: issuesFor(p) }))
  .sort((a, b) => score(b) - score(a) || (a.name ?? '').localeCompare(b.name ?? ''));

for (const p of audited) {
  if (p.audit.issues.length === 0) continue;
  console.log(`\n${p.name} (${p.slug}) [${p.status ?? '?'} / ${p.projectType ?? '?'}]`);
  console.log(
    `  summary: ${p.audit.summaryChars} chars | body: ${p.audit.contentChars} chars, ${p.audit.contentBlocks} blocks, ${p.audit.headings} headings, ${p.audit.images} images`,
  );
  for (const issue of p.audit.issues) {
    console.log(`  [${issue.severity}] ${issue.msg}`);
  }
}

const needsWork = audited.filter(p =>
  p.audit.issues.some(i => i.severity === 'high' || i.severity === 'medium'),
);
const solid = audited.filter(p => p.audit.issues.length === 0);

console.log(`\n---`);
console.log(`Total: ${audited.length} | Needs work: ${needsWork.length} | Solid: ${solid.length}`);
if (solid.length) {
  console.log(`\nSolid projects:`);
  for (const p of solid) console.log(`  • ${p.name}`);
}
