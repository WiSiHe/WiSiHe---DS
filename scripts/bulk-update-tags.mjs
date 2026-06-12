/**
 * Bulk refresh tag editor descriptions and painting tagsV2 using OpenAI.
 *
 * Run (under-tagged paintings + stale tag descriptions):
 *   node scripts/bulk-update-tags.mjs
 *
 * Rewrite all painting tags and all painting-related tag descriptions:
 *   node scripts/bulk-update-tags.mjs --rewrite
 *
 * Tags only / paintings only:
 *   node scripts/bulk-update-tags.mjs --tags-only
 *   node scripts/bulk-update-tags.mjs --paintings-only
 */

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '../apps/sanity-studio');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

// Keep in sync with apps/sanity-studio/schemas/tagGuidance.ts
const TAG_DESCRIPTION_AI_PROMPT = `Write a short editor note for a portfolio tag (under 150 characters).
Explain what paintings, projects, or recipes belong under this tag.
Third person, factual tone — not marketing copy.
Do NOT use phrases like "Explore my", "Discover my art", or "Discover more today".
Return only the description text.`;

const PAINTING_TAG_RULES = `Return JSON: { "suggestedTagIds": ["id1", "id2", ...] }
Rules:
- ONLY use ids from the catalog below (exact match).
- Pick 3–5 tag ids when possible (minimum 2 if only two clearly apply).
- 1–2 subject or theme; 1 medium/style when relevant; 1 mood or technique when helpful.
- Do NOT pick framework/stack tags (NextJS, Sanity, React, TypeScript, etc.) unless the artwork is literally about that topic.
- Do NOT pick generic project/work tags (Design System, Hackathon, Workshop, E-commerce) unless clearly relevant.
- NEVER pick these framework/stack tags for paintings: NextJS, Sanity, React, TypeScript, JavaScript, CSS, Redux, NextAuth, GraphQL, PHP, HTML, EnonicXP, Figma, Framer Motion, Headlesss UI.`;

config({ path: path.join(studioRoot, '.env.local') });

const PROJECT_ID = 'cbjsv7wi';
const DATASET = 'production';
const OPENAI_KEY = process.env.SANITY_STUDIO_OPENAI_API_KEY;
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;
const MODEL = process.env.OPENAI_TAG_SUGGEST_MODEL || 'gpt-4o';

if (!OPENAI_KEY) throw new Error('Missing SANITY_STUDIO_OPENAI_API_KEY');
if (!WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN with write access)');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

const SPAMMY_TAG_RE =
  /Explore my|Discover my art|Discover more today|Discover more!/i;

function imageUrl(ref) {
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) throw new Error(`Invalid image ref: ${ref}`);
  const [, id, dims, ext] = match;
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
}

function parseJsonObject(raw) {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const parsed = JSON.parse(s);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Response was not a JSON object');
  }
  return parsed;
}

async function openaiChat(messages, maxTokens = 400) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim?.() ?? '';
  if (!raw) throw new Error('Empty OpenAI response');
  return raw;
}

async function openaiText(messages, maxTokens = 200) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim?.() ?? '';
  if (!raw) throw new Error('Empty OpenAI response');
  return raw;
}

const PROJECT_STACK_TAG_NAMES = new Set([
  'NextJS',
  'Sanity',
  'React',
  'TypeScript',
  'JavaScript',
  'CSS',
  'Redux',
  'NextAuth',
  'GraphQL',
  'PHP',
  'HTML',
  'EnonicXP',
  'Figma',
  'Framer Motion',
  'Headlesss UI',
  'C#',
  'Designsystem',
  'Hackathon',
  'Workshop',
]);
  return text
    .replace(/^["']|["']$/g, '')
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 150);
}

async function generateTagDescription(tagName) {
  const text = await openaiText([
    {
      role: 'user',
      content: `${TAG_DESCRIPTION_AI_PROMPT}\n\nTag name: "${tagName}"`,
    },
  ]);
  return normalizeTagDescription(text);
}

async function suggestPaintingTags({ title, description, medium, isFanArt, imageRef, catalog }) {
  const allowed = new Set(catalog.map(t => t.id));
  const catalogLines = catalog.map(t => `- ${t.id}: ${t.name}`).join('\n');
  const context = [
    `Title: ${title}`,
    medium ? `Medium: ${medium}` : null,
    isFanArt === true ? 'Fan art: yes' : isFanArt === false ? 'Fan art: no' : null,
    description ? `Gallery label: ${description}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const content = [
    {
      type: 'text',
      text: `${PAINTING_TAG_RULES}\n\n${context}\n\nCatalog (id: name):\n${catalogLines}`,
    },
    { type: 'image_url', image_url: { url: imageUrl(imageRef), detail: 'low' } },
  ];

  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const raw = await openaiChat([{ role: 'user', content }], 300);
      const parsed = parseJsonObject(raw);
      const ids = Array.isArray(parsed.suggestedTagIds)
        ? parsed.suggestedTagIds.filter(id => {
            if (typeof id !== 'string' || !allowed.has(id)) return false;
            const name = catalog.find(t => t.id === id)?.name;
            return name && !PROJECT_STACK_TAG_NAMES.has(name);
          })
        : [];
      return ids;
    } catch (e) {
      lastError = e;
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw lastError;
}

function tagsToReferences(tagIds) {
  return tagIds.map((ref, index) => ({
    _type: 'reference',
    _ref: ref,
    _key: `bulk-tag-${ref.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}-${index}`,
  }));
}

async function throttle(items, fn, concurrency = 5) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  const rewrite = process.argv.includes('--rewrite');
  const tagsOnly = process.argv.includes('--tags-only');
  const paintingsOnly = process.argv.includes('--paintings-only');

  // ── Step 1: Tag descriptions ─────────────────────────────────────────────
  if (!paintingsOnly) {
    console.log('\n🏷️  Step 1: Refreshing tag descriptions...\n');

    const tags = await client.fetch(
      rewrite
        ? `*[_type == "tag" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(name asc) { _id, name, description }`
        : `*[_type == "tag" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && (
            !defined(description) ||
            description match "Explore my*" ||
            description match "Discover my*" ||
            description match "Discover more*" ||
            count(*[_type == "painting" && references(^._id)]) > 0 && (
              length(description) > 160 ||
              description match "*portfolio site*"
            )
          )] | order(name asc) { _id, name, description }`,
    );

    console.log(`Found ${tags.length} tags to process.\n`);

    let tagDone = 0;
    let tagFailed = 0;

    await throttle(
      tags,
      async tag => {
        try {
          const description = await generateTagDescription(tag.name);
          await client.patch(tag._id).set({ description }).commit();
          tagDone++;
          console.log(`  ✅ [${tagDone}/${tags.length}] "${tag.name}" → ${description}`);
        } catch (e) {
          tagFailed++;
          console.error(`  ❌ "${tag.name}": ${e.message}`);
        }
      },
      5,
    );

    console.log(`\nTag descriptions: ${tagDone} updated, ${tagFailed} failed.`);
  }

  // ── Step 2: Painting tagsV2 ──────────────────────────────────────────────
  if (!tagsOnly) {
    console.log(`\n🎨 Step 2: ${rewrite ? 'Rewriting' : 'Updating'} painting tags...\n`);

    const catalog = await client.fetch(
      `*[_type == "tag" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(name asc) { "id": _id, name }`,
    );

    const paintings = await client.fetch(
      `*[_type == "painting" && defined(image.asset._ref)] {
        _id,
        title,
        description,
        medium,
        isFanArt,
        "imageRef": image.asset._ref,
        "tagCount": count(tagsV2),
        "currentTags": tagsV2[]->name
      } | order(title asc)`,
    );

    const toProcess = rewrite
      ? paintings
      : paintings.filter(p => p.tagCount < 3 || SPAMMY_TAG_RE.test((p.currentTags || []).join(' ')));

    console.log(`Catalog: ${catalog.length} tags. Paintings to process: ${toProcess.length}.\n`);

    let paintDone = 0;
    let paintFailed = 0;
    let paintSkipped = 0;

    await throttle(
      toProcess,
      async doc => {
        try {
          const suggested = await suggestPaintingTags({
            title: doc.title,
            description: doc.description,
            medium: doc.medium,
            isFanArt: doc.isFanArt,
            imageRef: doc.imageRef,
            catalog,
          });

          if (suggested.length < 2) {
            paintSkipped++;
            console.log(
              `  ⚠️  "${doc.title}" — only ${suggested.length} tag(s) suggested, keeping existing (${(doc.currentTags || []).join(', ')})`,
            );
            return;
          }

          const tagNames = suggested
            .map(id => catalog.find(t => t.id === id)?.name)
            .filter(Boolean)
            .join(', ');

          await client.patch(doc._id).set({ tagsV2: tagsToReferences(suggested) }).commit();
          paintDone++;
          console.log(`  ✅ [${paintDone}/${toProcess.length}] "${doc.title}" → ${tagNames}`);
        } catch (e) {
          paintFailed++;
          console.error(`  ❌ "${doc.title}": ${e.message}`);
        }
      },
      3,
    );

    console.log(
      `\nPainting tags: ${paintDone} updated, ${paintSkipped} skipped, ${paintFailed} failed.`,
    );
  }

  console.log('\n✨ Bulk tag update complete.');
}

main().catch(console.error);
