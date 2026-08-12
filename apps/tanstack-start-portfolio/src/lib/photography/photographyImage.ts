import { urlForImage } from '@/lib/sanity';

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

export function urlForPhotographyFeatured(
  image: PhotographyImageSource,
  aspectRatio: number,
): string | null {
  const width = 1400;
  const height = Math.min(900, Math.max(480, Math.round(width / aspectRatio)));
  return buildPhotographyUrl(image, { width, height });
}

export function isValidPhotographyLqip(lqip: string | null | undefined): lqip is string {
  return typeof lqip === 'string' && lqip.startsWith('data:image/') && lqip.length > 64;
}
