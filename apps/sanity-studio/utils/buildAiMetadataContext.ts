import type { SanityClient } from '@sanity/client';
import {
  extractPhotographyFileMetadata,
  fetchImageAssetMetadata,
  formatCameraFromExif,
  summarizeAssetMetadata,
} from './photographyFileMetadata';

type GeopointValue = { lat?: number; lng?: number; alt?: number };

function formatGeopoint(coords: GeopointValue | null | undefined): string | undefined {
  if (typeof coords?.lat !== 'number' || typeof coords?.lng !== 'number') return undefined;
  const alt = typeof coords.alt === 'number' ? `, alt ${coords.alt.toFixed(0)}m` : '';
  return `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}${alt}`;
}

function formatCapturedAt(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/** Text block injected into AI prompts — document fields + asset EXIF/GPS when available. */
export async function buildAiMetadataContext(
  client: SanityClient,
  document: Record<string, unknown> | undefined,
  imageAssetRef: string | undefined,
): Promise<string> {
  const lines: string[] = [];

  const coords = formatGeopoint(document?.coordinates as GeopointValue);
  if (coords) lines.push(`GPS coordinates: ${coords}`);

  const captured = formatCapturedAt(document?.capturedAt as string | undefined);
  if (captured) lines.push(`Capture date/time: ${captured}`);

  const camera = document?.camera as string | undefined;
  if (camera?.trim()) lines.push(`Camera: ${camera.trim()}`);

  const country = document?.country as string | undefined;
  const countryCode = document?.countryCode as string | undefined;
  if (country?.trim()) {
    lines.push(`Country (editor): ${country.trim()}${countryCode ? ` (${countryCode})` : ''}`);
  }

  const placeName = document?.placeName as string | undefined;
  if (placeName?.trim()) lines.push(`Place (editor): ${placeName.trim()}`);

  const region = document?.region as string | undefined;
  if (region?.trim()) lines.push(`Region (editor): ${region.trim()}`);

  if (imageAssetRef) {
    const asset = await fetchImageAssetMetadata(client, imageAssetRef);
    const extract = extractPhotographyFileMetadata(asset);

    if (extract.coordinates) {
      lines.push(
        `GPS from file: ${extract.coordinates.lat.toFixed(5)}, ${extract.coordinates.lng.toFixed(5)}`,
      );
    }
    if (extract.capturedAt) {
      lines.push(`Capture date from file: ${formatCapturedAt(extract.capturedAt)}`);
    }
    if (extract.camera) lines.push(`Camera from file: ${extract.camera}`);

    const exifCamera = formatCameraFromExif(asset?.metadata?.exif);
    if (exifCamera && !extract.camera) lines.push(`Camera from file EXIF: ${exifCamera}`);

    if (extract.dimensions) {
      lines.push(`Image size: ${extract.dimensions.width}×${extract.dimensions.height}px`);
    }

    const summary = summarizeAssetMetadata(asset);
    const technical = summary.find(l => l.startsWith('Exposure:'));
    if (technical) lines.push(technical);
  }

  if (lines.length === 0) {
    return 'No EXIF, GPS, or location fields on this document yet.';
  }

  return lines.join('\n');
}
