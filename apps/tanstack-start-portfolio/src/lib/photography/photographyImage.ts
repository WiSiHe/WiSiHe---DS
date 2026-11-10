import { urlForImage } from '@/lib/sanity';
import { buildSrcSet } from '@/lib/sanityImageSrcSet';

export const PHOTOGRAPHY_IMAGE_QUALITY = 80;

type PhotographyImageSource = Parameters<typeof urlForImage>[0];

export function getPhotographyAspectRatio(
  image:
    | {
        width?: number | null;
        height?: number | null;
        aspectRatio?: number | null;
      }
    | null
    | undefined,
): number {
  const width = image?.width;
  const height = image?.height;
  if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
    return width / height;
  }

  const rawRatio = image?.aspectRatio;
  return typeof rawRatio === 'number' && rawRatio > 0
    ? Math.min(1.9, Math.max(0.62, rawRatio))
    : 4 / 3;
}

function buildPhotographyUrl(
  image: PhotographyImageSource,
  { width, height }: { width: number; height: number },
): string | null {
  if (!image) return null;

  return (
    urlForImage(image)
      ?.width(width)
      .height(height)
      .fit('max')
      .quality(PHOTOGRAPHY_IMAGE_QUALITY)
      .auto('format')
      .url() ?? null
  );
}

export function urlForPhotographyCard(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | null {
  const width = 720;
  const height = Math.min(1200, Math.max(360, Math.round(width / aspectRatio)));
  return buildPhotographyUrl(image, { width, height });
}

/** Responsive candidates for the same crop as `urlForPhotographyCard`. */
export function srcSetForPhotographyCard(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | undefined {
  return buildSrcSet([360, 540, 720], width =>
    buildPhotographyUrl(image, {
      width,
      height: Math.min(1200, Math.max(360, Math.round(width / aspectRatio))),
    }),
  );
}

const FEATURED_WIDTH = 1400;

function featuredHeight(aspectRatio: number): number {
  return Math.min(900, Math.max(480, Math.round(FEATURED_WIDTH / aspectRatio)));
}

export function urlForPhotographyFeatured(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | null {
  return buildPhotographyUrl(image, {
    width: FEATURED_WIDTH,
    height: featuredHeight(aspectRatio),
  });
}

/**
 * Responsive candidates for `urlForPhotographyFeatured`. Each box height is `width / aspectRatio`
 * (no clamp), so Sanity's `fit('max')` delivers exactly the width each `w` descriptor declares, even
 * for tall photos where the single-URL crop is height-clamped.
 */
export function srcSetForPhotographyFeatured(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | undefined {
  return buildSrcSet([700, 1050, FEATURED_WIDTH], width =>
    buildPhotographyUrl(image, { width, height: Math.round(width / aspectRatio) }),
  );
}

export function isValidPhotographyLqip(lqip: string | null | undefined): lqip is string {
  return typeof lqip === 'string' && lqip.startsWith('data:image/') && lqip.length > 64;
}
