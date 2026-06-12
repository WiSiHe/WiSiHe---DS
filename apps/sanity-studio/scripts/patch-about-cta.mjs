/**
 * Replace generic about-page CTA copy.
 * Run: node scripts/patch-about-cta.mjs
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

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || 'cbjsv7wi';
const DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;

if (!WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN with write access)');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const CTA = {
  ctaTitle: 'Say hello',
  ctaDescription: 'Questions about the work, licensing, or anything else — I read every message.',
  ctaButtonText: 'Send a message',
};

async function main() {
  const doc = await client.fetch('*[_type == "about"][0]{ _id }');
  if (!doc?._id) {
    throw new Error('No about document found');
  }

  await client.patch(doc._id).set(CTA).commit();
  console.log('Patched about CTA:', doc._id, CTA);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
