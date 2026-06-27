import {
  getBrushStrokeVariant,
  paintingBrushSeed,
} from '@/app/components/marketing/HeroSection/brushStrokeVariants';
import { urlForImage } from '@/sanity/lib/utils';

export { getBrushStrokeVariant, paintingBrushSeed };

export type PaintingFormat = 'square' | 'landscape' | 'portrait';

export type PaintingCardLayout = {
  format: PaintingFormat;
  aspectClass: string;
  aspectRatio: number;
  cropWidth: number;
  cropHeight: number;
};

const FORMAT_LAYOUT: Record<
  PaintingFormat,
  Pick<PaintingCardLayout, 'aspectClass' | 'aspectRatio' | 'cropWidth' | 'cropHeight'>
> = {
  landscape: {
    aspectClass: 'aspect-[4/3]',
    aspectRatio: 4 / 3,
    cropWidth: 900,
    cropHeight: 675,
  },
  portrait: {
    aspectClass: 'aspect-[3/4]',
    aspectRatio: 3 / 4,
    cropWidth: 800,
    cropHeight: 1066,
  },
  square: {
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    cropWidth: 800,
    cropHeight: 800,
  },
};

export function deriveFormatFromAspectRatio(
  aspectRatio: number | null | undefined,
): PaintingFormat {
  if (typeof aspectRatio !== 'number' || !Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    return 'square';
  }
  if (aspectRatio > 1.15) return 'landscape';
  if (aspectRatio < 0.87) return 'portrait';
  return 'square';
}

function normalizeFormat(format: string | null | undefined): PaintingFormat | null {
  if (format === 'landscape' || format === 'portrait' || format === 'square') {
    return format;
  }
  return null;
}

export function resolvePaintingCardLayout(options: {
  format?: string | null;
  aspectRatio?: number | null;
}): PaintingCardLayout {
  const format =
    normalizeFormat(options.format) ?? deriveFormatFromAspectRatio(options.aspectRatio);
  return { format, ...FORMAT_LAYOUT[format] };
}

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
  layout: PaintingCardLayout,
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
