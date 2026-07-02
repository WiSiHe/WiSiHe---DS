import type { CSSProperties } from 'react';

type SanityPaletteSwatch = {
  background?: string;
  population?: number;
};

export type SanityPalette = Record<string, SanityPaletteSwatch | undefined>;

function isValidHex(hex: string | undefined): hex is string {
  return Boolean(hex?.startsWith('#') && hex.length >= 7);
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function lightenHex(hex: string, amount: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const lr = clampChannel(r + (255 - r) * amount);
  const lg = clampChannel(g + (255 - g) * amount);
  const lb = clampChannel(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function extractPaletteColors(palette: SanityPalette): string[] {
  const ranked = Object.entries(palette)
    .filter(
      (entry): entry is [string, SanityPaletteSwatch] =>
        !entry[0].startsWith('_') && entry[1] != null && typeof entry[1] === 'object',
    )
    .flatMap(([, swatch]) => {
      const hex = swatch.background;
      if (!isValidHex(hex)) return [];
      return [{ hex, population: swatch.population ?? 0 }];
    })
    .reduce<{ hex: string; population: number }[]>((acc, entry) => {
      const normalized = entry.hex.toLowerCase();
      if (acc.some(item => item.hex.toLowerCase() === normalized)) return acc;
      acc.push(entry);
      return acc;
    }, []);

  return ranked.toSorted((a, b) => b.population - a.population).map(entry => entry.hex);
}

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const NEUTRAL_GLOW = '#8a9bab';

/** Dominant palette colour for a soft blurred halo blob. */
export function paintingAmbientGlowColor(palette?: SanityPalette | null): string {
  const colors = palette ? extractPaletteColors(palette) : [];
  return colors[0] ?? NEUTRAL_GLOW;
}

/** Secondary palette colour for a layered halo. */
export function paintingAmbientGlowSecondary(palette?: SanityPalette | null): string {
  const colors = palette ? extractPaletteColors(palette) : [];
  const primary = colors[0] ?? NEUTRAL_GLOW;
  return colors[1] ?? lightenHex(primary, 0.18);
}

/** Soft palette halo — kept for optional use; prefer paintingAmbientGlowColor + blur. */
export function paintingAmbientHaloStyle(palette?: SanityPalette | null): CSSProperties {
  const primary = paintingAmbientGlowColor(palette);
  const secondary = extractPaletteColors(palette ?? {})[1] ?? lightenHex(primary, 0.18);

  return {
    backgroundImage: `radial-gradient(ellipse 80% 75% at 50% 50%, ${hexToRgba(primary, 0.35)} 0%, ${hexToRgba(secondary, 0.12)} 45%, transparent 72%)`,
  };
}

/** Lift shadow with a subtle palette tint in both themes. */
export function paintingAmbientFrameShadow(
  palette?: SanityPalette | null,
  options?: { dark?: boolean },
): string {
  const colors = palette ? extractPaletteColors(palette) : [];
  const primary = colors[0] ?? NEUTRAL_GLOW;
  const secondary = colors[1] ?? lightenHex(primary, 0.18);

  if (!options?.dark) {
    return [
      `0 28px 60px -14px ${hexToRgba(primary, 0.26)}`,
      `0 12px 28px -10px ${hexToRgba(secondary, 0.16)}`,
      '0 4px 12px -4px rgba(0,0,0,0.08)',
    ].join(', ');
  }

  return [
    `0 32px 64px -16px ${hexToRgba(primary, 0.44)}`,
    `0 14px 32px -12px ${hexToRgba(secondary, 0.28)}`,
    '0 2px 8px -2px rgba(0,0,0,0.2)',
  ].join(', ');
}
