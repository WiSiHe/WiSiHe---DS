import path from 'node:path';
import { createClient } from '@sanity/client';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';

// Load .env.local specifically
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 1. Initialize Sanity Client
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

if (!projectId || !dataset) {
  console.error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET in environment variables.',
  );
  process.exit(1);
}

const sanityClient = createClient({
  projectId: projectId,
  dataset: dataset,
  useCdn: false, // We want the latest published data
  apiVersion: '2024-08-22',
  token:
    process.env.SANITY_API_READ_TOKEN ||
    'skCs2t9p0R75ZmajnywXA2winKSYN35rM0tl5ixgrCHp44UUzOKtltufSi9luU4VwuGDxbQZuteL1fagl6w1AbjrcMoI05EMB0e1vdo483D2ankiiZw5J1tSce1hdwA3k6hEG5Qm7W1R0JDXGVWDuN7RXsVKCrKRxNA1PiKH7CcN4uYxQpbN',
});

// 2. Initialize Algolia Client
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_WRITE_KEY = process.env.ALGOLIA_WRITE_KEY;

if (!ALGOLIA_APP_ID || !ALGOLIA_WRITE_KEY) {
  console.error('Missing ALGOLIA_APP_ID or ALGOLIA_WRITE_KEY in environment variables.');
  process.exit(1);
}

const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);
const ALGOLIA_INDEX_NAME = 'wisihe-search';

// 3. Define the GROQ Query
// We fetch paintings, projects, and recipes.
// We coalesce tagsV2 and tags references to get string arrays of tag names
const query = `
  *[_type in ["painting", "project", "recipe"] && !(_id in path("drafts.**")) && hideFromSearch != true && (_type != "project" || defined(slug.current))] {
    _id,
    _type,
    _createdAt,
    title,
    name,
    "description": coalesce(description, seo.description),
    slug,
    views,
    status,
    projectType,
    "tags": coalesce(tagsV2[]->name, tags[]->name, []),
    // Preserve asset._ref so urlForImage works on the client.
    // Only dereference lqip from metadata (needed for blur placeholders).
    "image": coalesce(
      image{
        ...,
        "asset": {
          "_ref": asset._ref,
          "_type": "reference",
          "lqip": asset->metadata.lqip
        }
      },
      mainImage{
        ...,
        "asset": {
          "_ref": asset._ref,
          "_type": "reference",
          "lqip": asset->metadata.lqip
        }
      }
    )
  }
`;

async function syncToAlgolia() {
  console.log('Fetching documents from Sanity...');
  try {
    const documents = await sanityClient.fetch(query);
    console.log(`Found ${documents.length} documents. Preparing for Algolia...`);

    // 4. Map Sanity data to Algolia objects
    // biome-ignore lint/suspicious/noExplicitAny: Document type is dynamic from Sanity query
    const objects = documents.map((doc: any) => {
      // Safely count views if it's an array or number
      let popularity = 0;
      if (typeof doc.views === 'number') {
        popularity = doc.views;
      } else if (Array.isArray(doc.views)) {
        popularity = doc.views.length;
      }

      const createdAtDate = doc._createdAt ? new Date(doc._createdAt).getTime() : 0;

      const base = {
        objectID: doc._id,
        _type: doc._type,
        // use title if it exists, otherwise fall back to name
        title: doc.title || doc.name || 'Untitled',
        description: doc.description || '',
        slug: doc.slug,
        tags: doc.tags,
        image: doc.image || null,
        views: popularity,
        createdAt: createdAtDate,
      };

      if (doc._type === 'project') {
        return {
          ...base,
          ...(doc.status ? { status: doc.status as string } : {}),
          ...(doc.projectType ? { projectType: doc.projectType as string } : {}),
        };
      }

      return base;
    });

    // 5. Replace all objects in the Algolia index
    console.log(`Uploading ${objects.length} objects to Algolia index '${ALGOLIA_INDEX_NAME}'...`);
    // NOTE: replaceAllObjects completely overrides the index, removing old/deleted items.
    // If you only want to add/update, use addOrUpdateObjects() instead, but replaceAllObjects is usually safer
    // for a manual full synchronization to ensure deleted Sanity items are removed from Algolia.
    await algolia.replaceAllObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: objects,
    });

    console.log('Successfully synced to Algolia! 🎉');
  } catch (err) {
    console.error('Error syncing to Algolia:', err);
    process.exit(1);
  }
}

syncToAlgolia();
