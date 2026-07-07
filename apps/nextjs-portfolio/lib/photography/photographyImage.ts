import { urlForFullImage } from '@/sanity/lib/utils';

/** Matches next.config `images.qualities` — keep in sync. */
export const PHOTOGRAPHY_IMAGE_QUALITY = 80;

type PhotographyImageSource = Parameters<typeof urlForFullImage>[0];

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
    urlForFullImage(image)
      ?.width(width)
      .height(height)
      .fit('max')
      .quality(PHOTOGRAPHY_IMAGE_QUALITY)
      .auto('format')
      .url() ?? null
  );
}

/** Masonry card — sized for ~33vw column, capped height for tall portraits. */
export function urlForPhotographyCard(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | null {
  const width = 840;
  const height = Math.min(1400, Math.max(420, Math.round(width / aspectRatio)));
  return buildPhotographyUrl(image, { width, height });
}

/** Featured hero — wider frame, capped at 16:9 display box. */
export function urlForPhotographyFeatured(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | null {
  const width = 1600;
  const displayRatio = Math.min(aspectRatio, 16 / 9);
  const height = Math.min(1200, Math.max(480, Math.round(width / displayRatio)));
  return buildPhotographyUrl(image, { width, height });
}

/** Detail view — full frame, bounded so Sanity/Next never fetch multi‑MB originals. */
export function urlForPhotographyDetail(image: PhotographyImageSource): string | null {
  return buildPhotographyUrl(image, { width: 2400, height: 3200 });
}

export function isValidPhotographyLqip(lqip: string | null | undefined): lqip is string {
  return typeof lqip === 'string' && lqip.startsWith('data:image/') && lqip.length > 64;
}
