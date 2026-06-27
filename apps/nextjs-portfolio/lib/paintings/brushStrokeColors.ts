import { getHeroStrokeColors } from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';

type SanityPaletteSwatch = {
  background?: string;
  population?: number;
};

type SanityPalette = {
  dominant?: SanityPaletteSwatch;
  vibrant?: SanityPaletteSwatch;
  darkVibrant?: SanityPaletteSwatch;
  darkMuted?: SanityPaletteSwatch;
  lightVibrant?: SanityPaletteSwatch;
  lightMuted?: SanityPaletteSwatch;
  muted?: SanityPaletteSwatch;
};

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function isValidHex(hex: string | undefined): hex is string {
  return Boolean(hex?.startsWith('#') && hex.length >= 7);
}

/** Darken a hex colour for wash / dim overlay (amount 0–1). */
export function darkenHex(hex: string, amount: number): string {
  if (!isValidHex(hex)) return '#1a1a1a';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = 1 - amount;
  const dr = clampChannel(r * factor);
  const dg = clampChannel(g * factor);
  const db = clampChannel(b * factor);
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

function lightenHex(hex: string, amount: number): string {
  if (!isValidHex(hex)) return '#e5e5e5';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = clampChannel(r + (255 - r) * amount);
  const lg = clampChannel(g + (255 - g) * amount);
  const lb = clampChannel(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function extractPaletteColors(palette: SanityPalette): string[] {
  const ranked = Object.entries(palette)
    .filter(([key, swatch]) => !key.startsWith('_') && swatch && typeof swatch === 'object')
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

function pickWashFromPalette(palette: SanityPalette, accent: string): string {
  for (const key of ['darkVibrant', 'darkMuted', 'dominant', 'muted'] as const) {
    const hex = palette[key]?.background;
    if (isValidHex(hex)) return darkenHex(hex, 0.12);
  }
  return darkenHex(accent, 0.55);
}

function pickSecondaryColor(colors: string[], accentIdx: number, strokeIndex: number): string {
  const accent = colors[accentIdx] ?? colors[0] ?? '#888888';

  if (colors.length === 1) {
    const light = lightenHex(accent, 0.28);
    return light.toLowerCase() === accent.toLowerCase() ? darkenHex(accent, 0.3) : light;
  }

  const offset = 1 + (strokeIndex % (colors.length - 1));
  const secondaryIdx = (accentIdx + offset) % colors.length;
  const secondary = colors[secondaryIdx] ?? accent;

  if (secondary.toLowerCase() !== accent.toLowerCase()) return secondary;

  for (let i = 1; i < colors.length; i++) {
    const candidate = colors[(accentIdx + i) % colors.length];
    if (candidate && candidate.toLowerCase() !== accent.toLowerCase()) return candidate;
  }

  return lightenHex(accent, 0.28);
}

export type BrushStrokeColorSet = {
  accentColor: string;
  secondaryColor: string;
  washColor: string;
};

/** Image palette when available; hash fallback for missing metadata. */
export function getBrushStrokeColors(
  strokeIndex: number,
  palette?: SanityPalette | null,
): BrushStrokeColorSet {
  const hash = getHeroStrokeColors(strokeIndex);

  if (!palette) {
    return {
      accentColor: hash.accentColor,
      secondaryColor: hash.secondaryColor,
      washColor: darkenHex(hash.accentColor, 0.65),
    };
  }

  const colors = extractPaletteColors(palette);
  if (colors.length === 0) {
    return {
      accentColor: hash.accentColor,
      secondaryColor: hash.secondaryColor,
      washColor: darkenHex(hash.accentColor, 0.65),
    };
  }

  const accentIdx = strokeIndex % colors.length;
  const accentColor = colors[accentIdx] ?? colors[0] ?? hash.accentColor;

  return {
    accentColor,
    secondaryColor: pickSecondaryColor(colors, accentIdx, strokeIndex),
    washColor: pickWashFromPalette(palette, accentColor),
  };
}
