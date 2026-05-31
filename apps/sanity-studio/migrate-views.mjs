/**
 * Migrate view counts from views[] array to viewsCount integer field.
 * Safe to run multiple times — uses setIfMissing so existing counts aren't overwritten.
 *
 * Run: node migrate-views.mjs
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

async function migrate() {
  // Get all paintings/projects that have a views array but no viewsCount yet
  const docs = await client.fetch(`
    *[_type in ["painting", "project"] && count(views) > 0 && !defined(viewsCount)] {
      _id, _type, "count": count(views)
    }
  `);

  console.log(`\nFound ${docs.length} documents to migrate...\n`);

  if (docs.length === 0) {
    console.log('Nothing to migrate — all done!');
    return;
  }

  let done = 0;
  await Promise.all(docs.map(async (doc) => {
    await client.patch(doc._id).set({ viewsCount: doc.count }).commit();
    done++;
    process.stdout.write(`  ✅ [${done}/${docs.length}] ${doc._type} ${doc._id} → viewsCount: ${doc.count}\n`);
  }));

  console.log(`\n✨ Migrated ${done} documents.\n`);
}

migrate().catch(console.error);
