/**
 * Single source of truth for what an Algolia record looks like.
 * Used by `scripts/sync-algolia.ts` (full reindex) and the `algolia-document-sync`
 * Sanity Function (incremental), so the two can never drift apart.
 *
 * Keep this file free of env/process access: it is bundled into the Function.
 */

/** Document types that are searchable. Projects are server-rendered via GROQ instead. */
export const ALGOLIA_DOCUMENT_TYPES = ['painting', 'recipe'] as const;

/** Published, indexable documents only (no drafts, no `seo.noIndex`). */
export const ALGOLIA_DOCUMENT_FILTER = `
  _type in ["painting", "recipe"]
  && !(_id in path("drafts.**"))
  && defined(slug.current)
  && coalesce(seo.noIndex, false) != true
`;

const IMAGE_PROJECTION = `{
  ...,
  hotspot,
  crop,
  alt,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "asset": {
    "_ref": asset._ref,
    "_type": "reference"
  }
}`;

export const ALGOLIA_DOCUMENT_PROJECTION = `{
  _id,
  _type,
  _createdAt,
  title,
  name,
  "description": coalesce(description, seo.description),
  "slug": slug.current,
  "views": coalesce(viewsCount, 0),
  "likes": select(_type == "painting" => count(likes), 0),
  "tags": coalesce(tagsV2[]->name, tags[]->name, []),
  isNSFW,
  isForSale,
  redbubbleUrl,
  gelatoUrl,
  format,
  medium,
  paintedAt,
  isFeatured,
  isFanArt,
  video,
  "imagesCount": count(coalesce(images, [])),
  "palette": image.asset->metadata.palette,
  "image": coalesce(image${IMAGE_PROJECTION}, mainImage${IMAGE_PROJECTION})
}`;

/** Full reindex query. */
export const ALGOLIA_ALL_DOCUMENTS_QUERY = `*[${ALGOLIA_DOCUMENT_FILTER}]${ALGOLIA_DOCUMENT_PROJECTION}`;

/** Single-document query for incremental sync. Matches nothing when the doc is not indexable. */
export const ALGOLIA_ONE_DOCUMENT_QUERY = `*[_id == $id && ${ALGOLIA_DOCUMENT_FILTER}][0]${ALGOLIA_DOCUMENT_PROJECTION}`;

// ── Colour extraction ─────────────────────────────────────────────────────

/** Convert hex colour string to [H, S, L] (0-360, 0-100, 0-100) */
function hexToHsl(hex: string): [number, number, number] {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
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
export function hexToColorName(hex: string): string {
  if (!hex?.startsWith('#') || hex.length < 7) return 'Other';
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
}

/** Extract unique colour names from a Sanity palette object */
export function extractColors(
  palette: Record<string, { background?: string } | undefined> | null | undefined,
): string[] {
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

// ── Record building ───────────────────────────────────────────────────────

export type AlgoliaSourceDocument = {
  _id: string;
  _type: string;
  _createdAt?: string;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  views?: number;
  likes?: number;
  tags?: string[];
  isNSFW?: boolean;
  isForSale?: boolean;
  redbubbleUrl?: string;
  gelatoUrl?: string;
  format?: string;
  medium?: string;
  paintedAt?: string;
  isFeatured?: boolean;
  isFanArt?: boolean;
  video?: unknown;
  imagesCount?: number;
  palette?: Record<string, { background?: string } | undefined> | null;
  image?: unknown;
};

/** Algolia caps record size; descriptions are only searched, so a long tail adds nothing. */
const MAX_DESCRIPTION_LENGTH = 1000;

export function buildAlgoliaRecord(doc: AlgoliaSourceDocument) {
  const createdAt = doc._createdAt ? new Date(doc._createdAt).getTime() : 0;
  const isNsfw = doc._type === 'painting' && doc.isNSFW === true;
  const hasStoreLink = Boolean(doc.redbubbleUrl || doc.gelatoUrl);
  const isForSale = doc._type === 'painting' && (doc.isForSale === true || hasStoreLink);

  let tags: string[] = Array.isArray(doc.tags) ? [...doc.tags] : [];
  if (isForSale && !tags.some(t => ['STORE', 'FOR SALE'].includes(t.toUpperCase()))) {
    tags = [...tags, 'Store'];
  }
  if (isNsfw && !tags.some(t => t.toUpperCase() === 'NSFW')) {
    tags = [...tags, 'NSFW'];
  }

  return {
    objectID: doc._id,
    _type: doc._type,
    title: doc.title || doc.name || 'Untitled',
    description: (doc.description || '').slice(0, MAX_DESCRIPTION_LENGTH),
    slug: doc.slug,
    tags,
    isNSFW: isNsfw,
    isForSale,
    hasStoreLink,
    format: doc.format || 'square',
    medium: doc.medium || null,
    paintedAt: doc.paintedAt || null,
    isFeatured: doc.isFeatured === true,
    isFanArt: doc.isFanArt === true,
    video: doc.video || null,
    imagesCount: typeof doc.imagesCount === 'number' ? doc.imagesCount : 0,
    // The raw palette is large and never read by the UI; only the colour families are searchable.
    dominantColors: extractColors(doc.palette),
    image: doc.image || null,
    views: typeof doc.views === 'number' ? doc.views : 0,
    likes: typeof doc.likes === 'number' ? doc.likes : 0,
    createdAt,
  };
}

export type AlgoliaRecord = ReturnType<typeof buildAlgoliaRecord>;
