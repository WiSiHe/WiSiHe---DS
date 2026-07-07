const PALETTE_LABELS: Record<string, string> = {
  dominant: 'Dominant',
  vibrant: 'Vibrant',
  lightVibrant: 'Light',
  darkVibrant: 'Dark',
  muted: 'Muted',
  lightMuted: 'Lt. muted',
  darkMuted: 'Dk. muted',
};

type PaletteSwatch = {
  key: string;
  label: string;
  color: string;
  population: number;
};

export function extractPaletteSwatches(
  palette: Record<string, unknown> | null | undefined,
  limit = 6,
): PaletteSwatch[] {
  if (!palette) return [];

  return Object.entries(palette)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, swatch]) => {
      const entry = swatch as { background?: string; population?: number } | null;
      return {
        key,
        label: PALETTE_LABELS[key] ?? key,
        color: entry?.background ?? '',
        population: entry?.population ?? 0,
      };
    })
    .filter(s => s.color)
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

function pickExifValue(exif: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = exif[key];
    if (value != null && String(value).trim() !== '') return value;
  }
  return null;
}

function formatExposureTime(raw: unknown): string | null {
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    if (typeof raw === 'string' && raw.trim()) return raw.trim();
    return null;
  }
  if (numeric >= 1) return `${numeric}s`;
  return `1/${Math.round(1 / numeric)}s`;
}

function formatAperture(raw: unknown): string | null {
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return null;
  const rounded = numeric.toFixed(1).replace(/\.0$/, '');
  return `f/${rounded}`;
}

function formatFocalLength(raw: unknown): string | null {
  if (raw == null) return null;
  const text = String(raw).trim();
  if (!text) return null;
  if (text.endsWith('mm')) return text;
  const numeric = Number(text);
  if (Number.isFinite(numeric)) return `${numeric}mm`;
  return text;
}

function formatIso(raw: unknown): string | null {
  if (raw == null) return null;
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) return `ISO ${numeric}`;
  return String(raw).trim() || null;
}

export type PhotographyMetaRow = {
  label: string;
  value: string;
};

export function buildPhotographyMetaRows(input: {
  capturedAt?: string | null;
  camera?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  fileSize?: number | null;
  hasAlpha?: boolean | null;
  exif?: Record<string, unknown> | null;
  imageLocation?: { lat?: number; lng?: number; alt?: number } | null;
  includeGps?: boolean;
}): PhotographyMetaRow[] {
  const rows: PhotographyMetaRow[] = [];

  if (input.capturedAt) {
    const date = new Date(input.capturedAt);
    if (!Number.isNaN(date.getTime())) {
      rows.push({
        label: 'Captured',
        value: date.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    }
  }

  if (input.camera?.trim()) {
    rows.push({ label: 'Camera', value: input.camera.trim() });
  }

  const exif = input.exif ?? {};
  const focal = formatFocalLength(
    pickExifValue(exif, ['FocalLengthIn35mmFilm', 'FocalLength', 'focalLength']),
  );
  if (focal) rows.push({ label: 'Focal length', value: focal });

  const aperture = formatAperture(pickExifValue(exif, ['FNumber', 'ApertureValue', 'fNumber']));
  if (aperture) rows.push({ label: 'Aperture', value: aperture });

  const exposure = formatExposureTime(
    pickExifValue(exif, ['ExposureTime', 'ShutterSpeedValue', 'exposureTime']),
  );
  if (exposure) rows.push({ label: 'Exposure', value: exposure });

  const iso = formatIso(pickExifValue(exif, ['ISO', 'ISOSpeedRatings', 'PhotographicSensitivity']));
  if (iso) rows.push({ label: 'ISO', value: iso });

  const lens = pickExifValue(exif, ['LensModel', 'LensMake']);
  if (lens && !input.camera?.includes(String(lens))) {
    rows.push({ label: 'Lens', value: String(lens).trim() });
  }

  if (input.width && input.height) {
    rows.push({
      label: 'Dimensions',
      value: `${input.width.toLocaleString()} × ${input.height.toLocaleString()} px`,
    });
  }

  if (input.mimeType) {
    const typeLabel = input.mimeType.split('/').pop()?.toUpperCase() ?? input.mimeType;
    rows.push({ label: 'File type', value: typeLabel });
  }

  if (typeof input.fileSize === 'number' && input.fileSize > 0) {
    const mb = input.fileSize / (1024 * 1024);
    rows.push({
      label: 'File size',
      value: mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(input.fileSize / 1024)} KB`,
    });
  }

  if (input.hasAlpha != null) {
    rows.push({
      label: 'Transparency',
      value: input.hasAlpha ? 'Alpha channel' : 'Opaque',
    });
  }

  const loc = input.imageLocation;
  if (input.includeGps && typeof loc?.lat === 'number' && typeof loc?.lng === 'number') {
    const lat = loc.lat.toFixed(4);
    const lng = loc.lng.toFixed(4);
    rows.push({ label: 'GPS', value: `${lat}°, ${lng}°` });
  }

  return rows;
}

export type { PhotographyMapPoint } from '@/lib/photography/photographyMapPoint';
export { resolvePhotographyMapPoint } from '@/lib/photography/photographyMapPoint';
