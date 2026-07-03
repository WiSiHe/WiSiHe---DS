import { cleanTagName } from '@wisihe/utils';

type PaintingLike = Record<string, unknown> & {
  _id?: string;
  slug?: string | { current?: string } | null;
  title?: string;
  image?: unknown;
  format?: string;
  isNSFW?: boolean | null;
  isForSale?: boolean | null;
  hasStoreLink?: boolean | null;
  redbubbleUrl?: string | null;
  gelatoUrl?: string | null;
  tagsV2?: { name?: string | null }[];
  tags?: string[];
  palette?: unknown;
};

export function paintingSlug(painting: PaintingLike): string {
  const { slug } = painting;
  if (typeof slug === 'string') return slug;
  if (slug && typeof slug === 'object' && 'current' in slug) {
    return typeof slug.current === 'string' ? slug.current : '';
  }
  return '';
}

export function paintingTagNames(painting: PaintingLike): string[] {
  if (Array.isArray(painting.tagsV2) && painting.tagsV2.length > 0) {
    return painting.tagsV2.map(tag => cleanTagName(tag.name ?? '')).filter(Boolean);
  }
  if (Array.isArray(painting.tags)) {
    return painting.tags.map(tag => cleanTagName(tag)).filter(Boolean);
  }
  return [];
}

export function paintingToCompactCardProps(
  painting: PaintingLike,
  index: number,
  options?: { isNsfwFilterActive?: boolean },
) {
  const image = painting.image as
    | {
        aspectRatio?: number | null;
        asset?: { _ref?: string; lqip?: string };
        lqip?: string;
        palette?: unknown;
      }
    | null
    | undefined;

  return {
    title: typeof painting.title === 'string' ? painting.title : '',
    slug: paintingSlug(painting),
    image,
    index,
    format: typeof painting.format === 'string' ? painting.format : undefined,
    isNsfw: painting.isNSFW === true,
    isNsfwFilterActive: options?.isNsfwFilterActive ?? false,
    isForSale: painting.isForSale === true,
    hasStoreLink:
      painting.hasStoreLink === true || Boolean(painting.redbubbleUrl || painting.gelatoUrl),
    paintingId: painting._id,
    tags: paintingTagNames(painting),
    palette: painting.palette ?? image?.palette,
  };
}
