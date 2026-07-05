type SanityPaletteSwatch = {
  background?: string;
  population?: number;
};

export type BrushPalette = {
  dominant?: SanityPaletteSwatch;
  vibrant?: SanityPaletteSwatch;
  darkVibrant?: SanityPaletteSwatch;
  darkMuted?: SanityPaletteSwatch;
  lightVibrant?: SanityPaletteSwatch;
  lightMuted?: SanityPaletteSwatch;
  muted?: SanityPaletteSwatch;
};

export type BrushStrokeColorSet = {
  accentColor: string;
  secondaryColor: string;
  washColor: string;
};

const HERO_STROKE_COLOR_PAIRS: ReadonlyArray<{ accent: string; secondary: string }> = [
  { accent: '#ff4400', secondary: '#8b5cf6' },
  { accent: '#ff007f', secondary: '#14b8a6' },
  { accent: '#3b82f6', secondary: '#ff7442' },
  { accent: '#7c3aed', secondary: '#eab308' },
  { accent: '#14b8a6', secondary: '#ec4899' },
  { accent: '#10b981', secondary: '#ff54b0' },
  { accent: '#d97706', secondary: '#60a5fa' },
  { accent: '#ef4444', secondary: '#2dd4bf' },
  { accent: '#e02e00', secondary: '#93c5fd' },
  { accent: '#a78bfa', secondary: '#ff4400' },
  { accent: '#facc15', secondary: '#0f766e' },
  { accent: '#f472b6', secondary: '#2563eb' },
  { accent: '#ff54b0', secondary: '#059669' },
  { accent: '#c4b5fd', secondary: '#e02e00' },
  { accent: '#99f6e4', secondary: '#db2777' },
  { accent: '#fde047', secondary: '#7c3aed' },
  { accent: '#ff91cc', secondary: '#1d4ed8' },
  { accent: '#ffa379', secondary: '#5b21b6' },
  { accent: '#5eead4', secondary: '#f87171' },
  { accent: '#fbbf24', secondary: '#6d28d9' },
  { accent: '#6ee7b7', secondary: '#be185d' },
  { accent: '#fca5a5', secondary: '#0d9488' },
  { accent: '#bfdbfe', secondary: '#b5005a' },
  { accent: '#f9a8d4', secondary: '#115e59' },
  { accent: '#ca8a04', secondary: '#1e40af' },
  { accent: '#fecaca', secondary: '#047857' },
  { accent: '#ede9fe', secondary: '#b82000' },
  { accent: '#ccfbf1', secondary: '#831843' },
  { accent: '#fcd34d', secondary: '#4c1d95' },
  { accent: '#34d399', secondary: '#ff007f' },
  { accent: '#60a5fa', secondary: '#941b06' },
  { accent: '#a78bfa', secondary: '#ca8a04' },
  { accent: '#2dd4bf', secondary: '#b91c1c' },
  { accent: '#fef08a', secondary: '#6d28d9' },
  { accent: '#fbcfe8', secondary: '#0f766e' },
  { accent: '#ffbee0', secondary: '#1e3a8a' },
  { accent: '#ffccaa', secondary: '#9d174d' },
  { accent: '#ddd6fe', secondary: '#e02e00' },
  { accent: '#a7f3d0', secondary: '#7c3aed' },
  { accent: '#93c5fd', secondary: '#db006d' },
  { accent: '#5eead4', secondary: '#92400e' },
  { accent: '#f472b6', secondary: '#115e59' },
  { accent: '#eab308', secondary: '#4c1d95' },
  { accent: '#2563eb', secondary: '#ff7442' },
  { accent: '#8b5cf6', secondary: '#10b981' },
  { accent: '#0d9488', secondary: '#f59e0b' },
  { accent: '#ec4899', secondary: '#34d399' },
  { accent: '#b82000', secondary: '#93c5fd' },
  { accent: '#172554', secondary: '#fde047' },
];

const DEFAULT_HERO_STROKE_COLOR_PAIR = { accent: '#ff4400', secondary: '#8b5cf6' } as const;

export function getHeroStrokeColors(index: number): {
  accentColor: string;
  secondaryColor: string;
} {
  const pair =
    HERO_STROKE_COLOR_PAIRS[index % HERO_STROKE_COLOR_PAIRS.length] ??
    DEFAULT_HERO_STROKE_COLOR_PAIR;
  return { accentColor: pair.accent, secondaryColor: pair.secondary };
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function isValidHex(hex: string | undefined): hex is string {
  return Boolean(hex?.startsWith('#') && hex.length >= 7);
}

function hexByte(value: number): string {
  const s = clampChannel(value).toString(16);
  return s.length === 1 ? `0${s}` : s;
}

/** Darken a hex colour for wash / dim overlay (amount 0–1). */
export function darkenHex(hex: string, amount: number): string {
  if (!isValidHex(hex)) return '#1a1a1a';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = 1 - amount;
  return `#${hexByte(r * factor)}${hexByte(g * factor)}${hexByte(b * factor)}`;
}

function lightenHex(hex: string, amount: number): string {
  if (!isValidHex(hex)) return '#e5e5e5';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${hexByte(r + (255 - r) * amount)}${hexByte(g + (255 - g) * amount)}${hexByte(b + (255 - b) * amount)}`;
}

function extractPaletteColors(palette: BrushPalette): string[] {
  const entries: { hex: string; population: number }[] = [];

  for (const key of Object.keys(palette) as (keyof BrushPalette)[]) {
    const swatch = palette[key];
    if (!swatch || typeof swatch !== 'object') continue;
    const hex = swatch.background;
    if (!isValidHex(hex)) continue;
    entries.push({ hex, population: swatch.population ?? 0 });
  }

  const unique: { hex: string; population: number }[] = [];
  for (const entry of entries) {
    const normalized = entry.hex.toLowerCase();
    if (unique.some(item => item.hex.toLowerCase() === normalized)) continue;
    unique.push(entry);
  }

  unique.sort((a, b) => b.population - a.population);
  return unique.map(entry => entry.hex);
}

function pickWashFromPalette(palette: BrushPalette, accent: string): string {
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

/** Image palette when available; hash fallback for missing metadata. */
export function getBrushStrokeColors(
  strokeIndex: number,
  palette?: BrushPalette | null,
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
