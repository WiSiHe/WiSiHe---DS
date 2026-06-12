/**
 * Bulk generate painting gallery labels and seoDescriptions using OpenAI.
 *
 * Run: node scripts/bulk-generate-descriptions.mjs
 * Rewrite existing first-person labels: node scripts/bulk-generate-descriptions.mjs --rewrite
 */

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '../apps/sanity-studio');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

const PAINTING_DESCRIPTION_AI_PROMPT = `You write museum wall labels for a digital art portfolio.

Requirements:
- 1–2 sentences, 40–240 characters total
- Third person only (never "I", "my", "we", "me")
- Do not repeat or quote the artwork title
- Describe: subject, composition, colour or light, mood or theme
- Tone: precise and calm, like a curator—not a blog post or social caption
- Present tense; no exclamation marks

Example:
"A figure reclines in a bath, rendered in loose warm strokes. Everyday stillness, unhurried and intimate."`;

// Keep in sync with apps/sanity-studio/schemas/descriptionGuidance.ts

config({ path: path.join(studioRoot, '.env.local') });

const PROJECT_ID = 'cbjsv7wi';
const DATASET = 'production';
const OPENAI_KEY = process.env.SANITY_STUDIO_OPENAI_API_KEY;
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;

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

// Convert Sanity image ref to CDN URL
function imageUrl(ref) {
  // ref: "image-abc123-2160x3840-jpg"
  const [, id, dims, ext] = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
}

// Call OpenAI
async function openai(messages, maxTokens = 600) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: maxTokens,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// Generate curator-style gallery label from image
async function generateDescription(imageRef, title) {
  const url = imageUrl(imageRef);
  const text = await openai(
    [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `${PAINTING_DESCRIPTION_AI_PROMPT}\n\nThe artwork title (do not repeat in the label): "${title}"`,
          },
          { type: 'image_url', image_url: { url, detail: 'low' } },
        ],
      },
    ],
    120,
  );

  return text.replace(/^["']|["']$/g, '').slice(0, 240);
}

// Generate seoDescription from gallery label
async function generateSeoDescription(description, title) {
  const text = `Turn this gallery label into an SEO meta description in 122 characters or less. Keep third person. Return only the meta description, nothing else.

Title: "${title}"
Label: ${description}`;
  const result = await openai([{ role: 'user', content: text }], 100);
  return result.slice(0, 122);
}

// Throttle: run tasks with max N concurrent
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
  const rewriteExisting = process.argv.includes('--rewrite');

  // ── Step 1: Fix missing seoDescriptions ──────────────────────────────────
  console.log('\n📝 Step 1: Generating missing seoDescriptions...\n');

  const missingSeo = await client.fetch(
    `*[_type == "painting" && !defined(seoDescription)] { _id, title, description }`,
  );

  for (const doc of missingSeo) {
    if (!doc.description) {
      console.log(`  ⚠️  Skipping "${doc.title}" — no description to derive from`);
      continue;
    }
    try {
      const seoDescription = await generateSeoDescription(doc.description, doc.title);
      await client.patch(doc._id).set({ seoDescription }).commit();
      console.log(`  ✅ "${doc.title}" → ${seoDescription.length} chars: ${seoDescription}`);
    } catch (e) {
      console.error(`  ❌ "${doc.title}": ${e.message}`);
    }
  }

  // ── Step 2: Generate or rewrite gallery labels ───────────────────────────
  console.log(
    `\n🎨 Step 2: ${rewriteExisting ? 'Rewriting' : 'Generating'} gallery labels...\n`,
  );

  const missingDesc = await client.fetch(
    rewriteExisting
      ? `*[_type == "painting" && defined(image.asset._ref)] { _id, title, description, "imageRef": image.asset._ref } | order(title asc)`
      : `*[_type == "painting" && !defined(description)] { _id, title, "imageRef": image.asset._ref } | order(title asc)`,
  );

  const toProcess = rewriteExisting
    ? missingDesc.filter(
        doc =>
          !doc.description ||
          doc.description.length > 240 ||
          /\b(I|my|me|we)\b/i.test(doc.description),
      )
    : missingDesc;

  console.log(`Found ${toProcess.length} paintings to process.\n`);

  let done = 0;
  let failed = 0;

  await throttle(
    toProcess,
    async (doc, idx) => {
      try {
        const description = await generateDescription(doc.imageRef, doc.title);
        const seoDescription = await generateSeoDescription(description, doc.title);
        await client.patch(doc._id).set({ description, seoDescription }).commit();
        done++;
        console.log(`  ✅ [${done}/${toProcess.length}] "${doc.title}"`);
      } catch (e) {
        failed++;
        console.error(`  ❌ [${idx + 1}/${toProcess.length}] "${doc.title}": ${e.message}`);
      }
    },
    5, // 5 concurrent requests
  );

  console.log(`\n✨ Done! ${done} descriptions generated, ${failed} failed.`);
}

main().catch(console.error);
