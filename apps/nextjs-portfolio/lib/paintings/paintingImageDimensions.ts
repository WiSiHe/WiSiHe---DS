import type { CSSProperties } from 'react';

export type SanityCrop = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityPaintingImageDimensions = {
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
  crop?: SanityCrop | null;
};

/** Aspect ratio after Sanity editor crop is applied. */
export function getCroppedAspectRatio(
  image: SanityPaintingImageDimensions | null | undefined,
): number | null {
  if (!image) return null;

  const baseAr = image.aspectRatio;
  if (typeof baseAr !== 'number' || !Number.isFinite(baseAr) || baseAr <= 0) {
    return null;
  }

  if (!image.crop) return baseAr;

  const { top = 0, bottom = 0, left = 0, right = 0 } = image.crop;
  const croppedWidth = 1 - left - right;
  const croppedHeight = 1 - top - bottom;
  if (croppedWidth <= 0 || croppedHeight <= 0) return baseAr;

  return baseAr * (croppedWidth / croppedHeight);
}

/** Pixel dimensions after Sanity crop — used for hero frame sizing and morph handoff. */
export function getCroppedDimensions(
  image: SanityPaintingImageDimensions | null | undefined,
): { width: number; height: number } | null {
  if (!image) return null;

  const assetWidth = image.width;
  const assetHeight = image.height;

  if (
    typeof assetWidth !== 'number' ||
    typeof assetHeight !== 'number' ||
    !Number.isFinite(assetWidth) ||
    !Number.isFinite(assetHeight) ||
    assetWidth <= 0 ||
    assetHeight <= 0
  ) {
    const aspectRatio = getCroppedAspectRatio(image);
    if (!aspectRatio) return null;
    const height = 1000;
    return { width: Math.round(aspectRatio * height), height };
  }

  if (!image.crop) {
    return { width: Math.round(assetWidth), height: Math.round(assetHeight) };
  }

  const { top = 0, bottom = 0, left = 0, right = 0 } = image.crop;
  const width = assetWidth * (1 - left - right);
  const height = assetHeight * (1 - top - bottom);

  if (width <= 0 || height <= 0) {
    return { width: Math.round(assetWidth), height: Math.round(assetHeight) };
  }

  return { width: Math.round(width), height: Math.round(height) };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Inline aspect ratio from cropped Sanity dimensions — safe for dynamic values (Tailwind cannot). */
export function resolvePaintingIntrinsicAspectStyle(
  image: SanityPaintingImageDimensions | null | undefined,
): CSSProperties | undefined {
  const dims = getCroppedDimensions(image);
  if (dims) {
    const divisor = gcd(dims.width, dims.height);
    return { aspectRatio: `${dims.width / divisor} / ${dims.height / divisor}` };
  }

  const aspectRatio = getCroppedAspectRatio(image);
  if (aspectRatio) return { aspectRatio: String(aspectRatio) };

  return undefined;
}

/** @deprecated Use resolvePaintingIntrinsicAspectStyle — dynamic Tailwind classes are not compiled. */
export function resolvePaintingIntrinsicAspectClass(
  image: SanityPaintingImageDimensions | null | undefined,
): string | null {
  void image;
  return null;
}
