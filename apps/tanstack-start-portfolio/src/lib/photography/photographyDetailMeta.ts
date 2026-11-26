import { urlForImage } from '@/lib/sanity';
import { buildSrcSet } from '@/lib/sanityImageSrcSet';

const DETAIL_WIDTH = 1800;
const DETAIL_SRCSET_WIDTHS = [900, 1350, DETAIL_WIDTH];

/** Height cap of the detail frame; the image is `object-contain`, so it also bounds the rendered width. */
export const PHOTOGRAPHY_DETAIL_MAX_HEIGHT = 'min(88vh, calc(100vh - 9rem))';

type PhotographyDetailSource = Parameters<typeof urlForImage>[0];

function buildPhotographyDetailUrl(image: PhotographyDetailSource, width: number): string | null {
  if (!image) return null;

  return urlForImage(image)?.width(width).fit('max').quality(85).auto('format').url() ?? null;
}

export function urlForPhotographyDetail(image: PhotographyDetailSource): string | null {
  return buildPhotographyDetailUrl(image, DETAIL_WIDTH);
}

/**
 * Responsive candidates for `urlForPhotographyDetail`. Sanity's `fit('max')` never upscales, so a
 * candidate wider than the original would deliver less than its `w` descriptor declares; widths are
 * capped at `originalWidth` (and de-duplicated) to keep descriptor and delivered width equal. When
 * the original width is unknown there is nothing to cap against, so no `srcset` is emitted and the
 * plain `src` is used.
 */
export function srcSetForPhotographyDetail(
  image: PhotographyDetailSource,
  originalWidth?: number | null,
): string | undefined {
  if (typeof originalWidth !== 'number' || !(originalWidth > 0)) return undefined;

  const widths = DETAIL_SRCSET_WIDTHS.map(width => Math.min(width, Math.round(originalWidth)));
  return buildSrcSet(widths, width => buildPhotographyDetailUrl(image, width));
}

/**
 * `sizes` for the detail `<img>`: the layout width (100vw below 1024px, 72vw above) bounded by the
 * width the height-capped frame can reach (`maxHeight * aspectRatio`). Portrait photos render
 * narrower than the layout width, so without the bound the browser picks a larger candidate than
 * the box needs.
 */
export function sizesForPhotographyDetail(aspectRatio: number): string {
  const heightBound = `calc(${PHOTOGRAPHY_DETAIL_MAX_HEIGHT} * ${aspectRatio})`;
  return `(max-width: 1024px) min(100vw, ${heightBound}), min(72vw, ${heightBound})`;
}

export function extractPaletteSwatches(
  palette: Record<string, unknown> | null | undefined,
): Array<{ key: string; color: string; population: number; label: string }> {
  if (!palette) return [];

  return Object.entries(palette)
    .filter(([key]) => !key.startsWith('_'))
    .flatMap(([key, swatch]) => {
      const color = (swatch as { background?: string; population?: number })?.background;
      if (!color) return [];
      return [
        {
          key,
          color,
          population: (swatch as { population?: number })?.population ?? 0,
          label: key,
        },
      ];
    })
    .toSorted((a, b) => b.population - a.population)
    .slice(0, 5);
}

export function buildPhotographyMetaRows({
  capturedAt,
  camera,
  width,
  height,
  mimeType,
  hasAlpha,
}: {
  capturedAt?: string | null;
  camera?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  hasAlpha?: boolean | null;
}): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];

  if (capturedAt) {
    rows.push({
      label: 'Captured',
      value: new Date(capturedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  }

  if (camera) rows.push({ label: 'Camera', value: camera });
  if (width && height) {
    rows.push({
      label: 'Resolution',
      value: `${width.toLocaleString()} × ${height.toLocaleString()} px`,
    });
  }
  if (mimeType) rows.push({ label: 'Format', value: mimeType.toUpperCase() });
  if (hasAlpha) rows.push({ label: 'Background', value: 'Transparent' });

  return rows;
}
