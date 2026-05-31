/**
 * Fix video data:
 * 1. Fix "Box Boy " title (trailing space)
 * 2. Regenerate all descriptions in casual/personal voice
 * 3. Mark good candidates as featured
 */

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

async function openai(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4.1-nano', max_tokens: 80, messages: [{ role: 'user', content: prompt }] }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message ?? JSON.stringify(d));
  return d.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
}

// Videos with their context (title + linked painting + tags + existing description)
const videos = [
  { id: 'e226968e-e66e-4e9f-ac39-d48a855b6cd6', title: 'Animation - Dancing', tags: 'Animation, Rotoscope', painting: 'Dance of Colors', context: 'Rotoscope animation of a woman dancing with colored splashes.' },
  { id: '9fed6833-b843-4923-8a62-c7cd876dbd0e', title: 'Animation - Emily Rudd', tags: 'Animation', painting: 'Emily Rudd Animation', context: 'Rotoscope animation of a woman making a silly face.' },
  { id: 'eed8dbfa-65b6-4d9e-8c62-fd7f94771b6b', title: 'Animation - Nixis Music Video', tags: 'Animation', painting: null, context: 'Animated music video for the song "When You Tell Me" by Nixis.' },
  { id: 'c0c52589-248d-4184-95dd-9a951cc472e4', title: 'Animation - Ramona Flowers', tags: 'Animation, Rotoscope, Comic Book', painting: 'Ramona Flowers', context: 'Rotoscope animation of Ramona Flowers from Scott Pilgrim.' },
  { id: '2e7dbe1e-a0c6-4bd8-beea-d77a28bf7e65', title: 'Babel - Teaser Trailer', tags: 'Unreal Engine 4, Game, Babel', painting: null, context: 'Teaser trailer for the Babel game built in Unreal Engine 4.' },
  { id: 'c9050565-6477-45c7-a513-d9490f73500c', title: 'Box Boy', tags: 'Unity, Game', painting: null, context: 'Gameplay clip of Box Boy, an infinite runner built solo in Unity over a weekend game jam.' },
  { id: 'ce831fcb-4de8-4ae5-8e35-943956420e23', title: 'Bubblebath', tags: 'Time-lapse', painting: 'Bubble Bath', context: 'Time-lapse of painting a woman in a bubble bath.' },
  { id: 'eeaec725-85a7-40b6-8112-b05db63ee095', title: 'Character Animation Test', tags: 'Unreal Engine 4', painting: null, context: 'Character rigging and animation test in Unreal Engine 4 with 3 characters.' },
  { id: 'e870748e-3869-4b12-a5aa-09a0c2a9a40a', title: 'Cloud Generator', tags: 'Unreal Engine 4', painting: null, context: 'Blueprint in Unreal Engine 4 that procedurally generates floating clouds.' },
  { id: '17aba611-cbdd-40c9-8536-e587b9d97109', title: 'Futuristic Office Atmosphere', tags: 'Unreal Engine 4, Game', painting: null, context: 'Volumetric fog and lighting test in a futuristic Unreal Engine 4 environment.' },
  { id: '7e750a31-184d-48ae-a4c7-0ef4b3de5c53', title: 'Futuristic Office Atmosphere 2', tags: 'Unreal Engine 4', painting: null, context: '3D atmosphere with volumetric fog and a large nebula in Unreal Engine 4.' },
  { id: '8213f61d-a5f5-468b-a251-342ebb392d21', title: 'GameJAM TimeLapse', tags: 'Time-lapse', painting: null, context: 'Time-lapse of a GameJAM I hosted at the office.' },
  { id: 'dfc42cc6-6b6e-455f-9c1b-37573ceedf0a', title: 'Material Test', tags: 'Unreal Engine 4', painting: null, context: 'Metallic material and light interaction test in Unreal Engine.' },
  { id: 'c6c347c0-5fc3-4189-b016-b28d1c290b96', title: 'TINE - Litago - Flash', tags: 'Game, Flash', painting: null, context: 'Flash game built for TINE\'s Litago brand — the strawberry cow infinite runner.' },
  { id: '65d65568-685a-4006-86f6-f59bff1a211d', title: 'Time-lapse - Feeling Blue', tags: 'Time-lapse, Animation', painting: 'Feeling Blue', context: 'Time-lapse of painting a monochromatic portrait in yellow and blue.' },
  { id: '55bf2dbc-02aa-4e1b-8f1d-e599de559eba', title: 'Time-lapse - Lil\'Witch', tags: 'Time-lapse, Animation, Portrait', painting: 'Lil\'Witch', context: 'Time-lapse of painting a stylised female witch portrait.' },
  { id: '3a5daaa7-768d-4360-8554-0f63fce5de53', title: 'Time-lapse - War Time', tags: 'Time-lapse', painting: 'Stroll Through Hell', context: 'Time-lapse set to music, created in response to the Ukrainian conflict.' },
  { id: 'bf1bd11a-5fd6-4628-82fe-6d7d83d5e5b7', title: 'Time-lapse - Yennefer of Vengerberg', tags: 'Time-lapse, Portrait', painting: 'Yennefer of Vengerberg', context: 'Time-lapse of painting Yennefer from The Witcher series.' },
  { id: '12cde7cc-8fe3-4255-b14a-6edc542e57c0', title: 'Timelapse - Emma Watson', tags: 'Time-lapse, Portrait', painting: null, context: 'Time-lapse of painting a portrait of Emma Watson.' },
];

// Videos to mark as featured (best representatives of each category)
const FEATURED_IDS = new Set([
  '3a5daaa7-768d-4360-8554-0f63fce5de53', // Time-lapse - War Time (already featured, keep)
  '2e7dbe1e-a0c6-4bd8-beea-d77a28bf7e65', // Babel - Teaser Trailer
  'e226968e-e66e-4e9f-ac39-d48a855b6cd6', // Animation - Dancing
  'bf1bd11a-5fd6-4628-82fe-6d7d83d5e5b7', // Time-lapse - Yennefer
]);

async function throttle(items, fn, concurrency = 4) {
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
}

async function main() {
  console.log('\n── Step 1: Fix "Box Boy " title ──────────────────────────────\n');
  await client.patch('c9050565-6477-45c7-a513-d9490f73500c').set({ title: 'Box Boy' }).commit();
  console.log('  ✅ "Box Boy " → "Box Boy"');

  console.log('\n── Step 2: Regenerate descriptions + set featured ────────────\n');

  let done = 0;
  await throttle(videos, async (video) => {
    try {
      const paintingCtx = video.painting ? ` Linked to the painting "${video.painting}".` : '';
      const description = await openai(
        `You are a digital artist writing a casual 1-2 sentence description of your video called "${video.title}". ` +
        `Tags: ${video.tags}.${paintingCtx} Context: ${video.context} ` +
        `Sound like a real person — conversational, not formal. No clichés. Return only the description.`
      );

      const featured = FEATURED_IDS.has(video.id);
      await client.patch(video.id).set({ description, featured }).commit();
      done++;
      console.log(`  ✅ [${done}/${videos.length}] "${video.title}"${featured ? ' ⭐' : ''}`);
      console.log(`       ${description.slice(0, 90)}...`);
    } catch (e) {
      console.error(`  ❌ "${video.title}": ${e.message}`);
    }
  }, 4);

  console.log(`\n✨ Done! ${done}/${videos.length} videos updated.\n`);
}

main().catch(console.error);
