import { urlForImage } from '@/sanity/lib/utils';

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

type SanityImageLike = {
  asset?: { _ref?: string; lqip?: string };
  lqip?: string;
  hotspot?: unknown;
  crop?: unknown;
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
