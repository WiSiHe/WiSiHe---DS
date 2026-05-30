/**
 * Bulk generate painting descriptions and seoDescriptions using OpenAI.
 *
 * - Generates `description` (150-300 words, vision) for all paintings missing it
 * - Generates `seoDescription` (≤122 chars) for paintings missing it
 *
 * Run: node scripts/bulk-generate-descriptions.mjs
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env.local') });

const PROJECT_ID = 'cbjsv7wi';
const DATASET = 'production';
const OPENAI_KEY = process.env.SANITY_STUDIO_OPENAI_API_KEY;
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!OPENAI_KEY) throw new Error('Missing SANITY_STUDIO_OPENAI_API_KEY');
if (!WRITE_TOKEN) throw new Error('Missing SANITY_API_WRITE_TOKEN');

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

// Generate long description from image
async function generateDescription(imageRef, title) {
  const url = imageUrl(imageRef);
  return openai([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `You are an AI expert at describing images, vividly describe this image, be as creative as you would like. Describe the style, colors, characters, what the motive might be and so on.

Requirements:
- 150-300 words maximum
- Use present tense
- Be objective and descriptive
- Write in clear, flowing paragraphs
- Focus on visual elements and artistic choices

The painting is titled: "${title}"`,
        },
        { type: 'image_url', image_url: { url, detail: 'low' } },
      ],
    },
  ]);
}

// Generate seoDescription from existing description text
async function generateSeoDescription(description, title) {
  const text = `You are an AI SEO expert writer. Re-write the following text into a good SEO description in 122 characters or less, it should never exceed 122 characters. Just return the SEO description, nothing else.

Title: "${title}"
Description: ${description}`;
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
  // ── Step 1: Fix 2 missing seoDescriptions ──────────────────────────────────
  console.log('\n📝 Step 1: Generating missing seoDescriptions...\n');

  const missingSeo = await client.fetch(
    `*[_type == "painting" && !defined(seoDescription)] { _id, title, description }`
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

  // ── Step 2: Bulk-generate descriptions for 163 paintings ───────────────────
  console.log('\n🎨 Step 2: Bulk-generating descriptions for paintings...\n');

  const missingDesc = await client.fetch(
    `*[_type == "painting" && !defined(description)] { _id, title, "imageRef": image.asset._ref } | order(title asc)`
  );

  console.log(`Found ${missingDesc.length} paintings to process.\n`);

  let done = 0;
  let failed = 0;

  await throttle(
    missingDesc,
    async (doc, idx) => {
      try {
        const description = await generateDescription(doc.imageRef, doc.title);
        const seoDescription = await generateSeoDescription(description, doc.title);
        await client.patch(doc._id).set({ description, seoDescription }).commit();
        done++;
        console.log(`  ✅ [${done}/${missingDesc.length}] "${doc.title}"`);
      } catch (e) {
        failed++;
        console.error(`  ❌ [${idx + 1}/${missingDesc.length}] "${doc.title}": ${e.message}`);
      }
    },
    5 // 5 concurrent requests
  );

  console.log(`\n✨ Done! ${done} descriptions generated, ${failed} failed.`);
}

main().catch(console.error);
