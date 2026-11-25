import path from 'node:path';
import { algoliasearch, type SetSettingsProps } from 'algoliasearch';
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

/** Virtual replicas: sort by the attribute even when a query is typed. */
const REPLICAS: Array<{ suffix: string; customRanking: string[] }> = [
  { suffix: 'newest', customRanking: ['desc(createdAt)'] },
  { suffix: 'oldest', customRanking: ['asc(createdAt)'] },
  { suffix: 'views', customRanking: ['desc(views)'] },
  { suffix: 'likes', customRanking: ['desc(likes)'] },
];

async function applySettings(indexName: string, indexSettings: SetSettingsProps['indexSettings']) {
  const { taskID } = await client.setSettings({ indexName, indexSettings });
  await client.waitForTask({ indexName, taskID });
}

async function setSettings() {
  try {
    // Primary first, and wait: replicas must exist before we can configure them.
    await applySettings(INDEX, {
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
      // Keep in sync with PAINTING_HIT_ATTRIBUTES in the portfolio app.
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
        'isFanArt',
        'video',
        'imagesCount',
        'medium',
        'paintedAt',
        'dominantColors',
        '_type',
      ],
      replicas: REPLICAS.map(({ suffix }) => `virtual(${INDEX}_${suffix})`),
    });

    for (const { suffix, customRanking } of REPLICAS) {
      await applySettings(`${INDEX}_${suffix}`, {
        customRanking,
        // Virtual replicas rank by text relevance first by default, which makes "newest" or
        // "most viewed" ignore the sort whenever a query is typed. 0 = sort strictly.
        relevancyStrictness: 0,
      });
    }

    console.log(`Algolia index "${INDEX}" settings and replicas updated successfully!`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setSettings();
