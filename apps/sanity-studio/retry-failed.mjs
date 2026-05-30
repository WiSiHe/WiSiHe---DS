import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: 'cbjsv7wi', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false,
});

const OPENAI_KEY = process.env.SANITY_STUDIO_OPENAI_API_KEY;

async function openai(messages, maxTokens = 600) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o', max_tokens: maxTokens, messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data.error));
  return data.choices[0].message.content.trim();
}

// Use ?w=800 to get a smaller image that won't timeout
function imageUrl(ref) {
  const [, id, dims, ext] = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  return `https://cdn.sanity.io/images/cbjsv7wi/production/${id}-${dims}.${ext}?w=800`;
}

const failed = await client.fetch(
  `*[_type == "painting" && title in ["Stroll though hell", "Vive La France", "Woodland Elf"]] { _id, title, "imageRef": image.asset._ref }`
);

console.log(`Retrying ${failed.length} paintings...\n`);

for (const doc of failed) {
  try {
    const url = imageUrl(doc.imageRef);
    const description = await openai([{ role: 'user', content: [
      { type: 'text', text: `Vividly describe this painting titled "${doc.title}". 150-300 words, present tense, clear paragraphs, focus on style, colors, characters, and artistic choices.` },
      { type: 'image_url', image_url: { url, detail: 'low' } },
    ]}]);
    const seoDescription = (await openai([{ role: 'user', content: `Write an SEO meta description of max 122 characters for a painting titled "${doc.title}": ${description.slice(0, 200)}` }], 80)).slice(0, 122);
    await client.patch(doc._id).set({ description, seoDescription }).commit();
    console.log('✅', doc.title);
  } catch(e) {
    console.error('❌', doc.title, e.message);
  }
}

console.log('\nDone!');
