import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints';
import 'dotenv/config';
import process from 'node:process';

const { ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY, ALGOLIA_ENABLE_AUTO_SYNC, ALGOLIA_INDEX_NAME } =
  process.env;

if (typeof ALGOLIA_APP_ID !== 'string' || typeof ALGOLIA_WRITE_KEY !== 'string') {
  throw new Error('ALGOLIA_APP_ID and ALGOLIA_WRITE_KEY must be set');
}

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'algolia-document-sync',
      memory: 1,
      timeout: 10,
      src: './functions/algolia-document-sync',
      event: {
        on: ['create', 'update', 'delete'],
        filter: "_type in ['painting', 'recipe']",
        // The function re-fetches the document with the shared Algolia query, so the
        // projection only needs the id and the operation.
        projection: "{_id, 'operation': delta::operation()}",
      },
      env: {
        ALGOLIA_APP_ID,
        ALGOLIA_WRITE_KEY,
        ALGOLIA_INDEX_NAME: ALGOLIA_INDEX_NAME || 'wisihe-search',
        ALGOLIA_ENABLE_AUTO_SYNC: ALGOLIA_ENABLE_AUTO_SYNC || 'false',
      },
    }),
  ],
});
