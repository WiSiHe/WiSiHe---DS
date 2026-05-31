/**
 * Remove the views[] array from all painting and project documents.
 * viewsCount integer already seeded — this just cleans up the bloat.
 *
 * Run: node remove-views-array.mjs
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

async function cleanup() {
  const docs = await client.fetch(
    `*[_type in ["painting", "project"] && defined(views) && count(views) >= 0] { _id, _type, "count": count(views) }`
  );

  console.log(`\nRemoving views[] from ${docs.length} documents...\n`);

  let done = 0;
  // Process in batches of 20 to avoid overwhelming the API
  const batchSize = 20;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    await Promise.all(batch.map(async (doc) => {
      await client.patch(doc._id).unset(['views']).commit();
      done++;
      process.stdout.write(`  ✅ [${done}/${docs.length}] ${doc._type} — removed ${doc.count} view entries\n`);
    }));
  }

  console.log(`\n✨ Done! Removed views[] from ${done} documents.\n`);
}

cleanup().catch(console.error);
