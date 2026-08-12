import { urlForImage } from '@/lib/sanity';

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

export function urlForPaintingCard(
  image: SanityImageLike | null | undefined,
  layout: import('@wisihe/ui-react/painting-card/layout').PaintingCardAspectLayout,
  quality = 80,
): string | null {
  if (!image?.asset?._ref) return null;

  return (
    urlForImage(image as Parameters<typeof urlForImage>[0])
      ?.width(layout.cropWidth)
      .height(layout.cropHeight)
      .fit('crop')
      .quality(quality)
      .auto('format')
      .url() ?? null
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
