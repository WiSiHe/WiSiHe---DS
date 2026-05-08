import path from 'node:path';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const ALGOLIA_WRITE_KEY = process.env.ALGOLIA_WRITE_KEY || '';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);

async function setSettings() {
  try {
    const INDEX = 'wisihe-search';
    // Base index settings
    await client.setSettings({
      indexName: INDEX,
      indexSettings: {
        attributesForFaceting: [
          'tags',
          'searchable(_type)',
          'filterOnly(status)',
          'filterOnly(projectType)',
        ],
        replicas: [
          `virtual(${INDEX}_newest)`,
          `virtual(${INDEX}_oldest)`,
          `virtual(${INDEX}_views)`,
        ],
      },
    });

    // Replica for Newest (createdAt desc)
    await client.setSettings({
      indexName: `${INDEX}_newest`,
      indexSettings: {
        customRanking: ['desc(createdAt)'],
      },
    });

    // Replica for Oldest (createdAt asc)
    await client.setSettings({
      indexName: `${INDEX}_oldest`,
      indexSettings: {
        customRanking: ['asc(createdAt)'],
      },
    });

    // Replica for Most Viewed (views desc)
    await client.setSettings({
      indexName: `${INDEX}_views`,
      indexSettings: {
        customRanking: ['desc(views)'],
      },
    });

    console.log('Algolia index settings and replicas updated successfully!');
  } catch (err) {
    console.error(err);
  }
}

setSettings();
