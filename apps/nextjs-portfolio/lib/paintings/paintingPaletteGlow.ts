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

/** Dominant palette colour for ambient halo gradients and shadows. */
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

/** Soft palette halo via radial gradient — Safari-safe (no filter blur). */
export function paintingAmbientHaloStyle(
  palette?: SanityPalette | null,
  options?: { dark?: boolean },
): CSSProperties {
  return paintingViewportWashStyle(palette, { ...options, layout: 'frame' });
}

type ViewportWashLayout = 'frame' | 'mobile' | 'desktop';

function washCenter(layout: ViewportWashLayout): string {
  switch (layout) {
    case 'mobile':
      return '50% 32%';
    case 'desktop':
      return '30% 38%';
    default:
      return '50% 50%';
  }
}

/** Full-viewport or frame palette wash — Safari-safe radial gradients only. */
export function paintingViewportWashStyle(
  palette?: SanityPalette | null,
  options?: { dark?: boolean; layout?: ViewportWashLayout },
): CSSProperties {
  const primary = paintingAmbientGlowColor(palette);
  const secondary = extractPaletteColors(palette ?? {})[1] ?? lightenHex(primary, 0.18);
  const dark = options?.dark ?? false;
  const layout = options?.layout ?? 'desktop';
  const center = washCenter(layout);

  if (layout === 'frame') {
    const innerPrimary = dark ? 0.58 : 0.42;
    const innerSecondary = dark ? 0.32 : 0.2;
    const outerPrimary = dark ? 0.28 : 0.18;
    const outerSecondary = dark ? 0.14 : 0.08;

    return {
      backgroundImage: [
        `radial-gradient(ellipse 72% 68% at ${center}, ${hexToRgba(primary, innerPrimary)} 0%, ${hexToRgba(secondary, innerSecondary)} 48%, transparent 76%)`,
        `radial-gradient(ellipse 100% 92% at ${center}, ${hexToRgba(primary, outerPrimary)} 0%, ${hexToRgba(secondary, outerSecondary)} 55%, transparent 82%)`,
      ].join(', '),
    };
  }

  const corePrimary = dark ? 0.52 : 0.4;
  const coreSecondary = dark ? 0.3 : 0.2;
  const midPrimary = dark ? 0.28 : 0.2;
  const midSecondary = dark ? 0.16 : 0.1;
  const edgePrimary = dark ? 0.1 : 0.06;

  return {
    backgroundImage: [
      `radial-gradient(ellipse 52% 44% at ${center}, ${hexToRgba(primary, corePrimary)} 0%, ${hexToRgba(secondary, coreSecondary)} 52%, transparent 74%)`,
      `radial-gradient(ellipse 88% 78% at ${center}, ${hexToRgba(primary, midPrimary)} 0%, ${hexToRgba(secondary, midSecondary)} 48%, transparent 80%)`,
      `radial-gradient(ellipse 140% 115% at ${center}, ${hexToRgba(primary, edgePrimary)} 0%, transparent 68%)`,
    ].join(', '),
  };
}

/** Subtle film grain tile — inline SVG feTurbulence, Safari-safe. */
const PAINTING_GRAIN_TILE_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">',
  '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter>',
  '<rect width="100%" height="100%" filter="url(#n)"/>',
  '</svg>',
].join('');

const PAINTING_GRAIN_TILE_URL = `url("data:image/svg+xml,${encodeURIComponent(PAINTING_GRAIN_TILE_SVG)}")`;

/** Opacity target when mixed with soft-light — very subtle film grain. */
export const PAINTING_VIEWPORT_GRAIN_OPACITY = 0.42;

export function paintingGrainOverlayStyle(): CSSProperties {
  return {
    backgroundImage: PAINTING_GRAIN_TILE_URL,
    backgroundRepeat: 'repeat',
    backgroundSize: '192px 192px',
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
