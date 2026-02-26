import { env } from 'node:process';
import { documentEventHandler } from '@sanity/functions';
import { algoliasearch } from 'algoliasearch';

const { ALGOLIA_APP_ID = '', ALGOLIA_WRITE_KEY = '', ALGOLIA_ENABLE_AUTO_SYNC = 'false' } = env;

// Default index
const ALGOLIA_INDEX_NAME = 'wisihe-search';

export const handler = documentEventHandler(async ({ event }) => {
  // Check our toggle here
  if (ALGOLIA_ENABLE_AUTO_SYNC !== 'true') {
    console.log('Automated Algolia sync is currently disabled. Skipping sync for document update.');
    return;
  }

  const { _id, _type, title, name, description, slug, hideFromSearch, image, operation } =
    event.data as any;

  // fallback for title/name depending on document schema
  const documentTitle = title || name || 'Untitled';

  const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);

  if (operation === 'delete') {
    try {
      await algolia.deleteObject({
        indexName: ALGOLIA_INDEX_NAME,
        objectID: _id,
      });
      console.log(`Successfully deleted document ${_id} ("${documentTitle}") from Algolia`);
    } catch (error) {
      console.error('Error syncing deletion to Algolia:', error);
      throw error;
    }
  } else {
    try {
      await algolia.addOrUpdateObject({
        indexName: ALGOLIA_INDEX_NAME,
        objectID: _id,
        body: {
          title: documentTitle,
          _type,
          description,
          slug,
          hideFromSearch,
          image,
          // Tags fetched dynamically via GROQ on manual sync
          // Blueprint event projections don't currently support deep dereferencing directly
          // So if auto-sync is enabled later, you may want to refine the function projection or re-fetch.
        },
      });
      console.log(`Successfully synced document ${_id} ("${documentTitle}") to Algolia`);
    } catch (error) {
      console.error('Error syncing addition/update to Algolia:', error);
      throw error;
    }
  }
});
