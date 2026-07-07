import type { CSSProperties } from 'react';

export const PAINTING_HERO_MAX_HEIGHT = 'min(78vh, 920px)';

/** Shared hero chrome — no w-full; width comes from inline frame style. */
export const PAINTING_HERO_FRAME_CLASS =
  'relative z-10 mx-auto max-w-full shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/20';

export function resolvePaintingFormatAspectClass(format?: string | null): string {
  return (
    (
      {
        landscape: 'aspect-video',
        square: 'aspect-square',
        portrait: 'aspect-portrait',
      } as Record<string, string>
    )[format ?? ''] ?? 'aspect-portrait'
  );
}

/** Hero container sizing — matches cropped intrinsic ratio; centered in the column. */
export function resolvePaintingHeroFrameStyle(
  width?: number | null,
  height?: number | null,
): CSSProperties {
  if (width && height) {
    const ratio = width / height;
    return {
      aspectRatio: `${width} / ${height}`,
      width: `min(100%, calc(${PAINTING_HERO_MAX_HEIGHT} * ${ratio}))`,
      maxHeight: PAINTING_HERO_MAX_HEIGHT,
      minHeight: '12rem',
      marginInline: 'auto',
    };
  }

  return {
    maxHeight: PAINTING_HERO_MAX_HEIGHT,
    minHeight: '12rem',
    width: '100%',
    marginInline: 'auto',
  };
}

export function hasPaintingHeroDimensions(width?: number | null, height?: number | null): boolean {
  return Boolean(width && height);
}
