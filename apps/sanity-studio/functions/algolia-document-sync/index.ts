import { env } from 'node:process';
import { createClient } from '@sanity/client';
import { documentEventHandler } from '@sanity/functions';
import { algoliasearch } from 'algoliasearch';
import {
  ALGOLIA_ONE_DOCUMENT_QUERY,
  type AlgoliaSourceDocument,
  buildAlgoliaRecord,
} from '../../lib/algolia/record';

const {
  ALGOLIA_APP_ID = '',
  ALGOLIA_WRITE_KEY = '',
  ALGOLIA_INDEX_NAME = 'wisihe-search',
  ALGOLIA_ENABLE_AUTO_SYNC = 'false',
} = env;

const DRAFT_PREFIX = 'drafts.';

/**
 * Keeps one document in sync with Algolia.
 *
 * Rather than trusting the (shallow) event payload, it re-fetches the document with the
 * same query the full reindex uses and saves the same record shape. A document that is no
 * longer indexable (deleted, unpublished, `seo.noIndex`, or no slug) is removed instead.
 */
export const handler = documentEventHandler(async ({ context, event }) => {
  if (ALGOLIA_ENABLE_AUTO_SYNC !== 'true') {
    console.log('Automated Algolia sync is currently disabled. Skipping.');
    return;
  }

  const { _id, operation } = event.data as { _id: string; operation?: string };

  // Drafts are never indexed; the published document triggers its own event.
  if (_id.startsWith(DRAFT_PREFIX)) return;

  const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);

  let doc: AlgoliaSourceDocument | null = null;
  if (operation !== 'delete') {
    const sanity = createClient({
      apiVersion: '2024-08-22',
      useCdn: false,
      ...context.clientOptions,
    });
    doc = await sanity.fetch<AlgoliaSourceDocument | null>(ALGOLIA_ONE_DOCUMENT_QUERY, {
      id: _id,
    });
  }

  if (!doc) {
    await algolia.deleteObject({ indexName: ALGOLIA_INDEX_NAME, objectID: _id });
    console.log(`Removed ${_id} from Algolia`);
    return;
  }

  // saveObject replaces the whole record, so partial/stale fields can't linger.
  await algolia.saveObject({ indexName: ALGOLIA_INDEX_NAME, body: buildAlgoliaRecord(doc) });
  console.log(`Synced ${_id} ("${doc.title ?? doc.name ?? 'Untitled'}") to Algolia`);
});
