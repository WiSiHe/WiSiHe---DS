export type PaintingFormat = 'square' | 'landscape' | 'portrait';

export type PaintingCardAspectLayout = {
  format: PaintingFormat;
  aspectClass: string;
  aspectRatio: number;
  cropWidth: number;
  cropHeight: number;
};

const FORMAT_LAYOUT: Record<
  PaintingFormat,
  Pick<PaintingCardAspectLayout, 'aspectClass' | 'aspectRatio' | 'cropWidth' | 'cropHeight'>
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
}): PaintingCardAspectLayout {
  const format =
    normalizeFormat(options.format) ?? deriveFormatFromAspectRatio(options.aspectRatio);
  return { format, ...FORMAT_LAYOUT[format] };
}
