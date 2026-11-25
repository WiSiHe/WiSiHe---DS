import path from 'node:path';
import { createClient } from '@sanity/client';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';
import {
  ALGOLIA_ALL_DOCUMENTS_QUERY,
  type AlgoliaSourceDocument,
  buildAlgoliaRecord,
} from '../lib/algolia/record';
import {
  algoliaAppId,
  algoliaIndexName,
  algoliaWriteKey,
  sanityReadToken,
  studioDataset,
  studioProjectId,
} from '../lib/env';

// Load .env.local specifically
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = studioProjectId();
const dataset = studioDataset();

if (!projectId || !dataset) {
  console.error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET in environment variables.',
  );
  process.exit(1);
}

const sanityToken = sanityReadToken();
if (!sanityToken) {
  console.error('Missing SANITY_API_READ_TOKEN in environment variables.');
  process.exit(1);
}

const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false, // We want the latest published data
  apiVersion: '2024-08-22',
  token: sanityToken,
});

const ALGOLIA_APP_ID = algoliaAppId();
const ALGOLIA_WRITE_KEY = algoliaWriteKey();

if (!ALGOLIA_APP_ID || !ALGOLIA_WRITE_KEY) {
  console.error('Missing ALGOLIA_APP_ID or ALGOLIA_WRITE_KEY in environment variables.');
  process.exit(1);
}

const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);
const ALGOLIA_INDEX_NAME = algoliaIndexName();

async function syncToAlgolia() {
  console.log('Fetching documents from Sanity...');
  try {
    const documents = await sanityClient.fetch<AlgoliaSourceDocument[]>(
      ALGOLIA_ALL_DOCUMENTS_QUERY,
    );
    console.log(`Found ${documents.length} documents. Preparing for Algolia...`);

    const objects = documents.map(buildAlgoliaRecord);

    // replaceAllObjects swaps atomically through a temp index and keeps the existing
    // settings, replicas, synonyms and rules, and removes items deleted in Sanity.
    console.log(`Uploading ${objects.length} objects to Algolia index '${ALGOLIA_INDEX_NAME}'...`);
    await algolia.replaceAllObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects,
    });

    console.log('Successfully synced to Algolia!');
  } catch (err) {
    console.error('Error syncing to Algolia:', err);
    process.exit(1);
  }
}

syncToAlgolia();
