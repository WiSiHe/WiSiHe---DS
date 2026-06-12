import path from 'node:path';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const ALGOLIA_WRITE_KEY = process.env.ALGOLIA_WRITE_KEY || '';
const INDEX = process.env.ALGOLIA_INDEX_NAME?.trim() || 'wisihe-search';

if (!ALGOLIA_APP_ID || !ALGOLIA_WRITE_KEY) {
  console.error('Missing ALGOLIA_APP_ID or ALGOLIA_WRITE_KEY in environment variables.');
  process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);

async function setSettings() {
  try {
    await client.setSettings({
      indexName: INDEX,
      indexSettings: {
        searchableAttributes: [
          'title',
          'unordered(description)',
          'unordered(tags)',
          'unordered(medium)',
        ],
        attributesForFaceting: [
          'tags',
          'dominantColors',
          'filterOnly(_type)',
          'filterOnly(isNSFW)',
          'filterOnly(isForSale)',
        ],
        customRanking: ['desc(isFeatured)', 'desc(isForSale)', 'desc(views)', 'desc(createdAt)'],
        attributesToRetrieve: [
          'objectID',
          'title',
          'slug',
          'format',
          'tags',
          'image',
          'isFeatured',
          'isNSFW',
          'isForSale',
          'hasStoreLink',
          'medium',
          'dominantColors',
          '_type',
        ],
        replicas: [
          `virtual(${INDEX}_newest)`,
          `virtual(${INDEX}_oldest)`,
          `virtual(${INDEX}_views)`,
        ],
      },
    });

    await client.setSettings({
      indexName: `${INDEX}_newest`,
      indexSettings: {
        customRanking: ['desc(createdAt)'],
      },
    });

    await client.setSettings({
      indexName: `${INDEX}_oldest`,
      indexSettings: {
        customRanking: ['asc(createdAt)'],
      },
    });

    await client.setSettings({
      indexName: `${INDEX}_views`,
      indexSettings: {
        customRanking: ['desc(views)'],
      },
    });

    console.log(`Algolia index "${INDEX}" settings and replicas updated successfully!`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setSettings();
