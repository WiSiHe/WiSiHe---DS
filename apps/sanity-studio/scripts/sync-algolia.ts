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

const sanityToken = process.env.SANITY_API_READ_TOKEN;
if (!sanityToken) {
  console.error('Missing SANITY_API_READ_TOKEN in environment variables.');
  process.exit(1);
}

const sanityClient = createClient({
  projectId: projectId,
  dataset: dataset,
  useCdn: false, // We want the latest published data
  apiVersion: '2024-08-22',
  token: sanityToken,
});

// 2. Initialize Algolia Client
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_WRITE_KEY = process.env.ALGOLIA_WRITE_KEY;

if (!ALGOLIA_APP_ID || !ALGOLIA_WRITE_KEY) {
  console.error('Missing ALGOLIA_APP_ID or ALGOLIA_WRITE_KEY in environment variables.');
  process.exit(1);
}

const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME?.trim() || 'wisihe-search';

// 3. Define the GROQ Query
// Projects are server-rendered via GROQ — not synced to Algolia.
// Exclude drafts and noIndex. NSFW paintings are indexed but blurred on /paintings until filtered.
const query = `
  *[
    _type in ["painting", "recipe"]
    && !(_id in path("drafts.**"))
    && defined(slug.current)
    && coalesce(seo.noIndex, false) != true
  ] {
    _id,
    _type,
    _createdAt,
    title,
    name,
    "description": coalesce(description, seo.description),
    "slug": slug.current,
    "views": coalesce(viewsCount, 0),
    "tags": coalesce(tagsV2[]->name, tags[]->name, []),
    isNSFW,
    isForSale,
    redbubbleUrl,
    gelatoUrl,
    format,
    medium,
    paintedAt,
    isFeatured,
    "palette": image.asset->metadata.palette,
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

// ── Colour extraction ─────────────────────────────────────────────────────

/** Convert hex colour string to [H, S, L] (0-360, 0-100, 0-100) */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** Map a hex colour to a broad human-readable colour family */
function hexToColorName(hex: string): string {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return 'Other';
  try {
    const [h, s, l] = hexToHsl(hex);
    if (l < 12) return 'Black';
    if (l > 88) return 'White';
    if (s < 15) return 'Grey';
    if (h < 15 || h >= 345) return 'Red';
    if (h < 40) return 'Orange';
    if (h < 65) return 'Yellow';
    if (h < 150) return 'Green';
    if (h < 195) return 'Teal';
    if (h < 255) return 'Blue';
    if (h < 290) return 'Purple';
    return 'Pink';
  } catch {
    return 'Other';
  }
}

/** Extract unique colour names from a Sanity palette object */
function extractColors(palette: Record<string, any> | null | undefined): string[] {
  if (!palette) return [];
  const swatches = ['dominant', 'vibrant', 'lightVibrant', 'darkVibrant', 'muted'];
  const colorNames = new Set<string>();
  for (const key of swatches) {
    const bg = palette[key]?.background;
    if (bg) {
      const name = hexToColorName(bg);
      if (name !== 'Other') colorNames.add(name);
    }
  }
  return [...colorNames];
}

async function syncToAlgolia() {
  console.log('Fetching documents from Sanity...');
  try {
    const documents = await sanityClient.fetch(query);
    console.log(`Found ${documents.length} documents. Preparing for Algolia...`);

    // 4. Map Sanity data to Algolia objects
    // biome-ignore lint/suspicious/noExplicitAny: Document type is dynamic from Sanity query
    const objects = documents.map((doc: any) => {
      const createdAtDate = doc._createdAt ? new Date(doc._createdAt).getTime() : 0;
      const views = typeof doc.views === 'number' ? doc.views : 0;
      const isNsfw = doc._type === 'painting' && doc.isNSFW === true;
      const hasStoreLink = Boolean(doc.redbubbleUrl || doc.gelatoUrl);
      const isForSale = doc._type === 'painting' && (doc.isForSale === true || hasStoreLink);
      const baseTags: string[] = Array.isArray(doc.tags) ? doc.tags : [];
      let tags = [...baseTags];
      if (isForSale && !tags.some((t: string) => ['STORE', 'FOR SALE'].includes(t.toUpperCase()))) {
        tags = [...tags, 'Store'];
      }
      if (isNsfw && !tags.some((t: string) => t.toUpperCase() === 'NSFW')) {
        tags = [...tags, 'NSFW'];
      }

      return {
        objectID: doc._id,
        _type: doc._type,
        title: doc.title || doc.name || 'Untitled',
        description: doc.description || '',
        slug: doc.slug,
        tags,
        isNSFW: isNsfw,
        isForSale,
        hasStoreLink,
        format: doc.format || 'square',
        medium: doc.medium || null,
        paintedAt: doc.paintedAt || null,
        isFeatured: doc.isFeatured === true,
        dominantColors: extractColors(doc.palette),
        image: doc.image || null,
        views,
        createdAt: createdAtDate,
      };
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
