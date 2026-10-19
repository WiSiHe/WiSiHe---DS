import { urlForImage } from '@/lib/sanity';
import { buildSrcSet } from '@/lib/sanityImageSrcSet';

export {
  getBrushStrokeVariant,
  paintingBrushSeed,
} from '@wisihe/ui-react/painting-card/brush-stroke-variants';
export {
  deriveFormatFromAspectRatio,
  type PaintingCardAspectLayout,
  type PaintingFormat,
  resolvePaintingCardLayout,
} from '@wisihe/ui-react/painting-card/layout';
export {
  getCroppedAspectRatio,
  getCroppedDimensions,
  resolvePaintingIntrinsicAspectClass,
  resolvePaintingIntrinsicAspectStyle,
  type SanityPaintingImageDimensions,
} from './paintingImageDimensions';

import {
  getCroppedDimensions,
  type SanityPaintingImageDimensions,
} from './paintingImageDimensions';

type SanityImageLike = SanityPaintingImageDimensions & {
  asset?: { _ref?: string; lqip?: string };
  lqip?: string;
  hotspot?: unknown;
};

export function getPaintingImageLqip(
  image: SanityImageLike | null | undefined,
): string | undefined {
  if (!image) return undefined;
  return image.lqip ?? image.asset?.lqip ?? undefined;
}

type PaintingCardLayout = import('@wisihe/ui-react/painting-card/layout').PaintingCardAspectLayout;

function urlForPaintingCardSize(
  image: SanityImageLike,
  width: number,
  height: number,
  quality: number,
): string | null {
  return (
    urlForImage(image as Parameters<typeof urlForImage>[0])
      ?.width(width)
      .height(height)
      .fit('crop')
      .quality(quality)
      .auto('format')
      .url() ?? null
  );
}

export function urlForPaintingCard(
  image: SanityImageLike | null | undefined,
  layout: PaintingCardLayout,
  quality = 80,
): string | null {
  if (!image?.asset?._ref) return null;
  return urlForPaintingCardSize(image, layout.cropWidth, layout.cropHeight, quality);
}

/** Responsive candidates for the same crop as `urlForPaintingCard`, so phones don't download the 800-900 px version. */
export function srcSetForPaintingCard(
  image: SanityImageLike | null | undefined,
  layout: PaintingCardLayout,
  quality = 80,
): string | undefined {
  if (!image?.asset?._ref) return undefined;
  const widths = [320, 480, 640, layout.cropWidth].filter(w => w <= layout.cropWidth);
  return buildSrcSet(widths, width =>
    urlForPaintingCardSize(
      image,
      width,
      Math.round((width * layout.cropHeight) / layout.cropWidth),
      quality,
    ),
  );
}

/** Card/thumbnail URL sized to cropped intrinsic ratio — respects Sanity hotspot/crop. */
export function urlForPaintingMorphCard(
  image: SanityImageLike | null | undefined,
  quality = 80,
): string | null {
  if (!image?.asset?._ref) return null;

  const dims = getCroppedDimensions(image);
  if (!dims) return null;

  const maxWidth = 900;
  const scale = dims.width > maxWidth ? maxWidth / dims.width : 1;
  const width = Math.max(1, Math.round(dims.width * scale));
  const height = Math.max(1, Math.round(dims.height * scale));

  return (
    urlForImage(image as Parameters<typeof urlForImage>[0])
      ?.width(width)
      .height(height)
      .fit('crop')
      .quality(quality)
      .auto('format')
      .url() ?? null
  );
}
