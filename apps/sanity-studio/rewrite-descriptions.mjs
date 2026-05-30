/**
 * Rewrite all 179 painting descriptions with a personal, casual tone.
 * Also sets medium = "Digital (Procreate)" on every painting.
 *
 * Run from apps/sanity-studio: node rewrite-descriptions.mjs
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
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

function imageUrl(ref, width = 800) {
  const [, id, dims, ext] = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}?w=${width}`;
}

async function openai(messages, maxTokens = 300) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({ model: 'gpt-4o', max_tokens: maxTokens, messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data.error?.message ?? data));
  return data.choices[0].message.content.trim();
}

async function generateDescription(imageRef, title) {
  const url = imageUrl(imageRef);
  return openai([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `You are a digital artist writing a casual, personal description of your own painting called "${title}".

Write 2–3 short sentences. Sound like a real person — conversational and direct, not flowery or pretentious.
Describe what it looks like (subject, style, key visual details) and hint at what drew you to paint this subject or what makes it interesting to you.
No clichés like "invites the viewer to", "evokes", "enigmatic presence", or "captivating". Just be real.

Return only the description text, nothing else.`,
        },
        { type: 'image_url', image_url: { url, detail: 'low' } },
      ],
    },
  ]);
}

async function generateSeoDescription(description, title) {
  const result = await openai(
    [
      {
        role: 'user',
        content: `Write an SEO meta description of max 122 characters for a digital painting titled "${title}". Base it on this: ${description.slice(0, 300)}. Return only the meta description, nothing else.`,
      },
    ],
    80
  );
  return result.slice(0, 122);
}

async function throttle(items, fn, concurrency = 5) {
  const results = new Array(items.length);
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
  const paintings = await client.fetch(
    `*[_type == "painting"] { _id, title, "imageRef": image.asset._ref } | order(title asc)`
  );

  console.log(`\n🎨 Rewriting descriptions for ${paintings.length} paintings...\n`);

  let done = 0;
  let failed = 0;

  await throttle(
    paintings,
    async (doc) => {
      try {
        const description = await generateDescription(doc.imageRef, doc.title);
        const seoDescription = await generateSeoDescription(description, doc.title);
        await client
          .patch(doc._id)
          .set({ description, seoDescription, medium: 'Digital (Procreate)' })
          .commit();
        done++;
        process.stdout.write(`  ✅ [${done}/${paintings.length}] ${doc.title}\n`);
      } catch (e) {
        failed++;
        process.stdout.write(`  ❌ [${done + failed}/${paintings.length}] ${doc.title}: ${e.message}\n`);
      }
    },
    5
  );

  console.log(`\n✨ Done! ${done} rewritten, ${failed} failed.`);
}

main().catch(console.error);
