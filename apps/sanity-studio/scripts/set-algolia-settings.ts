import path from 'node:path';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';
import { algoliaAppId, algoliaIndexName, algoliaWriteKey } from '../lib/env';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ALGOLIA_APP_ID = algoliaAppId();
const ALGOLIA_WRITE_KEY = algoliaWriteKey();
const INDEX = algoliaIndexName();

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
        customRanking: [
          'desc(isFeatured)',
          'desc(isForSale)',
          'desc(views)',
          'desc(likes)',
          'desc(createdAt)',
        ],
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
          `virtual(${INDEX}_likes)`,
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

    await client.setSettings({
      indexName: `${INDEX}_likes`,
      indexSettings: {
        customRanking: ['desc(likes)'],
      },
    });

    console.log(`Algolia index "${INDEX}" settings and replicas updated successfully!`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setSettings();
