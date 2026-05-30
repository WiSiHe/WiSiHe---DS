/**
 * Tag taxonomy cleanup:
 * 1. Set isNSFW=true on NSFW-tagged paintings, then remove NSFW tag
 * 2. Set isForSale=true on Store-tagged paintings, then remove Store tag
 * 3. Remove Wallpaper tag from all paintings
 * 4. Remove Fanart tag from all paintings (redundant with isFanArt field)
 * 5. Rename "Conceptart" → "Concept Art"
 * 6. Rename "Scifi" → "Sci-Fi"
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

// Tag IDs
const TAG = {
  nsfw:       '7b3f9ff1-0702-49ef-860a-35744c973e03',
  store:      'c407d79e-f74e-4bd4-a619-9502a2d63187',
  wallpaper:  '3a9ee50f-a8c0-483a-b060-d2240d13566c',
  fanart:     'b5f1a032-c2c3-44f6-9344-97d8a14a387c',
  conceptart: 'd62b8008-3aca-4114-a5d3-13d0301a4f2b',
  scifi:      '7034a8ac-3940-4622-85f2-f335aeacb203',
};

// Paintings to set isNSFW=true
const NSFW_IDS = [
  '0f3aff17-612a-497f-a775-115cf2f07f7e', // Chillin at the beach
  '12f36526-4ea8-44b9-80a3-4012faec3d35', // Woodland Elf
  '20910cfa-90f6-43a8-9ff2-049871f8812e', // Vampire In Drapes
  '4636a241-a1e1-45ef-bdb7-97713c490708', // White Hair
  '4a10ac9a-2d07-41e8-9983-1736c63f90d8', // Aphrodite - Goddess
  '6472e7db-49fe-462a-84f8-a99dd96a842d', // Woman in Bathtub
  '69ab1a47-6834-40b4-8389-473e9000e5b8', // Chaotic Monday
  '6ee5ed31-2e8e-48e4-8d30-231bcf4fd8ba', // Goldie
  '71fe4369-9f12-4c1f-bc7d-980484e343dd', // Lights off
  '7afd94f8-1506-4e28-8f9d-19afcd3ddde3', // Lazy Sunday
  '7b6c48e9-1771-419f-ae8c-9e5dd4ac9204', // Warm Summer
  '8fc244a5-e0da-4368-b824-696572952799', // Stripes
  '960f3c35-5583-4a4e-be6e-33d814d988c2', // Universa
  'bc98e600-a48e-4c82-b6c4-e7312625cebb', // Colour Splash Portrait
  'drafts.cc350e09-0d92-41e8-b3c4-f9c41aef1170', // Bubble Bath Time
];

// Paintings to set isForSale=true
const STORE_IDS = [
  '0229f5db-994b-4ba9-a5bf-f5a73ec404ad', // Hush
  '1217019e-31ff-4fa4-abd5-ad37552a3f4a', // Attitude
  '15c0cb16-8ea2-4815-93a0-6458805c532e', // Over The Garden Wall
  '2a908178-99d4-462d-91dd-6a1e1c113929', // Into The Woods
  '3291dcdc-4857-4cdb-9f82-28c0a625c870', // Slytherin girl
  '478bff3f-16cc-4a2f-9a6e-acef320553af', // Atomic Girl
  '5f082aaf-ac7f-47a8-882d-892033724441', // Stroll Through Hell
  '6472e7db-49fe-462a-84f8-a99dd96a842d', // Woman in Bathtub
  '691a3322-16a9-4d4a-91b6-8a35e1e90168', // Covid19
  '6f231e6b-4209-4659-88a0-3fe6b860762c', // Mountain Giants
  '72da3f07-42bf-4448-a9b8-dfba653ca82f', // Ghibli Clouds
  '778d2873-7355-4b79-aa8f-be986196aece', // Arendal
  '7afd94f8-1506-4e28-8f9d-19afcd3ddde3', // Lazy Sunday
  '857d0e44-7e91-4b60-a198-8171c619ecd3', // The Last of Us
  '910a9574-ccf3-4eee-ac93-546621cc87cb', // Stargazer
  '97749ccf-92a6-4938-9296-6da7ef34cc97', // Guitar Girl
  'a7610faa-7a5e-4565-a89a-34850f4a92ee', // Space Program
  'b36d04f6-e7d2-4bf6-9853-4804de456187', // Venture into the woods
  'b4871ba8-28d5-4c19-8466-2ce903b4f078', // Da Hood
  'b7b30f81-7470-4760-9643-4398eff3b080', // Pokémon
  'c54cf70d-8bcd-4a2b-bf32-87f1250375a0', // Explorer
  'db7160a9-566a-4ea9-a2ff-de167643e06c', // Baby Sloth
  'dcdbe31a-2588-49fb-a404-47efb1b557b1', // Morning Tea
  'e26a98f6-d80a-4648-acce-32308fed1bf4', // Classic
  'e36e777d-a6ae-4638-b674-5b963d9d6eea', // Redhead
  'efa0a4a6-093f-4e02-83d8-a5c29dc282a5', // Feeling Blue
  'f48a13e4-96b7-42f7-bac2-1b21533edd33', // Space Girl
  'fcf5df35-728c-4302-8ae0-385866bc654d', // The Dark Tower
];

async function removeTagFromAllPaintings(tagId, tagName) {
  const paintings = await client.fetch(
    `*[_type == "painting" && count(tagsV2[_ref == $tagId]) > 0]{ _id, tagsV2 }`,
    { tagId }
  );
  if (paintings.length === 0) {
    console.log(`  ℹ️  No paintings with "${tagName}" tag`);
    return;
  }
  await Promise.all(paintings.map(p =>
    client.patch(p._id)
      .unset([`tagsV2[_ref=="${tagId}"]`])
      .commit()
  ));
  console.log(`  ✅ Removed "${tagName}" tag from ${paintings.length} paintings`);
}

async function main() {
  console.log('\n── Step 1: Set isNSFW=true ──────────────────────────────');
  await Promise.all(NSFW_IDS.map(id =>
    client.patch(id).set({ isNSFW: true }).commit()
      .then(() => console.log(`  ✅ isNSFW: ${id.replace('drafts.', '')}`))
      .catch(e => console.error(`  ❌ ${id}: ${e.message}`))
  ));

  console.log('\n── Step 2: Set isForSale=true ───────────────────────────');
  await Promise.all(STORE_IDS.map(id =>
    client.patch(id).set({ isForSale: true }).commit()
      .then(() => console.log(`  ✅ isForSale: ${id}`))
      .catch(e => console.error(`  ❌ ${id}: ${e.message}`))
  ));

  console.log('\n── Step 3: Remove obsolete tags from paintings ──────────');
  await removeTagFromAllPaintings(TAG.nsfw, 'NSFW');
  await removeTagFromAllPaintings(TAG.store, 'Store');
  await removeTagFromAllPaintings(TAG.wallpaper, 'Wallpaper');
  await removeTagFromAllPaintings(TAG.fanart, 'Fanart');

  console.log('\n── Step 4: Rename Conceptart → Concept Art ──────────────');
  await client.patch(TAG.conceptart).set({ name: 'Concept Art' }).commit();
  console.log('  ✅ Conceptart → Concept Art');

  console.log('\n── Step 5: Rename Scifi → Sci-Fi ────────────────────────');
  await client.patch(TAG.scifi).set({ name: 'Sci-Fi' }).commit();
  console.log('  ✅ Scifi → Sci-Fi');

  console.log('\n✨ Done!\n');
}

main().catch(console.error);
