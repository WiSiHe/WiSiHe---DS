import { getHeroStrokeColors } from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';

type SanityPalette = {
  dominant?: { background?: string };
  vibrant?: { background?: string };
  darkVibrant?: { background?: string };
  muted?: { background?: string };
};

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/** Darken a hex colour for wash / dim overlay (amount 0–1). */
export function darkenHex(hex: string, amount: number): string {
  if (!hex.startsWith('#') || hex.length < 7) return '#1a1a1a';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = 1 - amount;
  const dr = clampChannel(r * factor);
  const dg = clampChannel(g * factor);
  const db = clampChannel(b * factor);
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

function pickPaletteHex(palette: SanityPalette | null | undefined): string | null {
  if (!palette) return null;
  const candidates = [
    palette.dominant?.background,
    palette.vibrant?.background,
    palette.darkVibrant?.background,
    palette.muted?.background,
  ];
  for (const hex of candidates) {
    if (hex && hex.startsWith('#') && hex.length >= 7) return hex;
  }
  return null;
}

export type BrushStrokeColorSet = {
  accentColor: string;
  secondaryColor: string;
  washColor: string;
};

/** Palette primary + hash secondary (decision #8 D). */
export function getBrushStrokeColors(
  strokeIndex: number,
  palette?: SanityPalette | null,
): BrushStrokeColorSet {
  const hash = getHeroStrokeColors(strokeIndex);
  const primary = pickPaletteHex(palette);

  if (primary) {
    return {
      accentColor: primary,
      secondaryColor: hash.secondaryColor,
      washColor: darkenHex(primary, 0.55),
    };
  }

  return {
    accentColor: hash.accentColor,
    secondaryColor: hash.secondaryColor,
    washColor: darkenHex(hash.accentColor, 0.65),
  };
}
