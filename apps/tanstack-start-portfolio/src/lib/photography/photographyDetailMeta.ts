import { urlForImage } from '@/lib/sanity';

export function urlForPhotographyDetail(image: Parameters<typeof urlForImage>[0]): string | null {
  if (!image) return null;

  return urlForImage(image)?.width(1800).fit('max').quality(85).auto('format').url() ?? null;
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
