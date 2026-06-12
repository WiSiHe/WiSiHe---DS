import type { SanityClient } from '@sanity/client';
import { countryNameToIso } from './countryCodes';

export type SanityImageAssetMetadata = {
  dimensions?: { width?: number; height?: number; aspectRatio?: number };
  location?: { lat?: number; lng?: number; alt?: number };
  exif?: Record<string, unknown>;
  palette?: unknown;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type SanityImageAssetRecord = {
  originalFilename?: string;
  mimeType?: string;
  size?: number;
  metadata?: SanityImageAssetMetadata;
};

export type PhotographyFileExtract = {
  coordinates?: { _type: 'geopoint'; lat: number; lng: number; alt?: number };
  capturedAt?: string;
  camera?: string;
  dimensions?: { width: number; height: number };
};

export type PhotographyApplyPatch = {
  path: string;
  value: unknown;
  label: string;
};

function parseExifDate(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  const text = String(raw).trim();
  if (!text) return undefined;
  const normalized = text.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function pickExifDate(exif: Record<string, unknown> | undefined): string | undefined {
  if (!exif) return undefined;
  return (
    parseExifDate(exif.DateTimeOriginal) ??
    parseExifDate(exif.CreateDate) ??
    parseExifDate(exif.ModifyDate) ??
    parseExifDate(exif.DateTime)
  );
}

export function formatCameraFromExif(
  exif: Record<string, unknown> | undefined,
): string | undefined {
  if (!exif) return undefined;
  const make = exif.Make ?? exif.make;
  const model = exif.Model ?? exif.model;
  const lens = exif.LensModel ?? exif.LensMake;
  const body = [make, model]
    .filter(v => v != null && String(v).trim())
    .join(' ')
    .trim();
  const lensLabel = lens != null ? String(lens).trim() : '';
  if (body && lensLabel) return `${body} — ${lensLabel}`;
  return body || lensLabel || undefined;
}

export function extractPhotographyFileMetadata(
  asset: SanityImageAssetRecord | null | undefined,
): PhotographyFileExtract {
  const metadata = asset?.metadata;
  const result: PhotographyFileExtract = {};

  const width = metadata?.dimensions?.width;
  const height = metadata?.dimensions?.height;
  if (typeof width === 'number' && typeof height === 'number') {
    result.dimensions = { width, height };
  }

  const loc = metadata?.location;
  if (typeof loc?.lat === 'number' && typeof loc?.lng === 'number') {
    result.coordinates = {
      _type: 'geopoint',
      lat: loc.lat,
      lng: loc.lng,
      ...(typeof loc.alt === 'number' ? { alt: loc.alt } : {}),
    };
  }

  const capturedAt = pickExifDate(metadata?.exif);
  if (capturedAt) result.capturedAt = capturedAt;

  const camera = formatCameraFromExif(metadata?.exif);
  if (camera) result.camera = camera;

  return result;
}

export async function fetchImageAssetMetadata(
  client: SanityClient,
  assetRef: string,
): Promise<SanityImageAssetRecord | null> {
  return client.fetch<SanityImageAssetRecord | null>(
    `*[_id == $id][0]{
      originalFilename,
      mimeType,
      size,
      metadata {
        dimensions,
        location,
        exif,
        palette,
        hasAlpha,
        isOpaque
      }
    }`,
    { id: assetRef },
  );
}

export function buildPhotographyApplyPatches(
  extract: PhotographyFileExtract,
  options: {
    existingCountry?: string | null;
    existingCountryCode?: string | null;
    existingCoordinates?: unknown;
    existingCapturedAt?: string | null;
    existingCamera?: string | null;
    overwrite?: boolean;
    /** Photography only applies EXIF fields — map location lives on travelPlace. */
    exifOnly?: boolean;
  } = {},
): PhotographyApplyPatch[] {
  const patches: PhotographyApplyPatch[] = [];
  const overwrite = options.overwrite ?? false;
  const exifOnly = options.exifOnly ?? false;

  const canSet = (hasExisting: boolean) => overwrite || !hasExisting;

  if (!exifOnly && extract.coordinates && canSet(Boolean(options.existingCoordinates))) {
    patches.push({
      path: 'coordinates',
      value: extract.coordinates,
      label: `GPS (${extract.coordinates.lat.toFixed(4)}, ${extract.coordinates.lng.toFixed(4)})`,
    });
  }

  if (extract.capturedAt && canSet(Boolean(options.existingCapturedAt))) {
    patches.push({
      path: 'capturedAt',
      value: extract.capturedAt,
      label: 'Capture date from EXIF',
    });
  }

  if (extract.camera && canSet(Boolean(options.existingCamera?.trim()))) {
    patches.push({
      path: 'camera',
      value: extract.camera,
      label: 'Camera from EXIF',
    });
  }

  if (exifOnly) return patches;

  const iso =
    options.existingCountryCode?.trim().toUpperCase() || countryNameToIso(options.existingCountry);
  if (iso && canSet(Boolean(options.existingCountryCode?.trim()))) {
    patches.push({
      path: 'countryCode',
      value: iso,
      label: `Country code ${iso} (from country name)`,
    });
  }

  return patches;
}

export function summarizeAssetMetadata(asset: SanityImageAssetRecord | null | undefined): string[] {
  if (!asset) return ['No asset metadata found.'];
  const lines: string[] = [];
  const extract = extractPhotographyFileMetadata(asset);

  if (asset.originalFilename) lines.push(`File: ${asset.originalFilename}`);
  if (extract.dimensions) {
    lines.push(`Dimensions: ${extract.dimensions.width} × ${extract.dimensions.height}`);
  }
  if (extract.coordinates) {
    lines.push(`GPS: ${extract.coordinates.lat.toFixed(5)}, ${extract.coordinates.lng.toFixed(5)}`);
  }
  if (extract.capturedAt) {
    lines.push(`Captured: ${new Date(extract.capturedAt).toLocaleString()}`);
  }
  if (extract.camera) lines.push(`Camera: ${extract.camera}`);

  const exif = asset.metadata?.exif;
  if (exif) {
    const iso = exif.ISO ?? exif.ISOSpeedRatings;
    const focal = exif.FocalLength;
    const aperture = exif.FNumber ?? exif.ApertureValue;
    const exposure = exif.ExposureTime;
    const technical = [
      iso != null ? `ISO ${iso}` : null,
      focal != null ? `${focal}mm` : null,
      aperture != null ? `f/${aperture}` : null,
      exposure != null ? `${exposure}s` : null,
    ]
      .filter(Boolean)
      .join(' · ');
    if (technical) lines.push(`Exposure: ${technical}`);
  }

  if (lines.length === 0) {
    lines.push(
      'No EXIF or GPS in this file. Re-upload after enabling exif/location on the image field, or use AI for place/country.',
    );
  }

  return lines;
}
