/** WCAG relative luminance of a #rrggbb colour. */
export function relativeLuminance(hex: string): number {
  const channel = (offset: number) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const INK = '#12100e';
const PAPER = '#fbf8f3';
/** The title is small text (< 18.66px bold), so WCAG AA asks for 4.5:1. */
const MIN_RATIO = 4.5;

const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

export type TitleTreatment = {
  color: string;
  /** Set when neither ink nor paper reads on every stroke; the title then sits on this solid plate. */
  plate?: string;
};

function mixHex(a: string, b: string, t: number): string {
  const part = (hex: string, offset: number) => Number.parseInt(hex.slice(offset, offset + 2), 16);
  const out = [1, 3, 5].map(offset =>
    Math.round(part(a, offset) + (part(b, offset) - part(a, offset)) * t)
      .toString(16)
      .padStart(2, '0'),
  );
  return `#${out.join('')}`;
}

/** A tint that stays distinct from `base`: lighter on dark colours, deeper on light ones. */
export function contrastingTint(base: string, amount = 0.42): string {
  if (!isHex(base)) return base;
  return mixHex(base, relativeLuminance(base) > 0.4 ? INK : PAPER, amount);
}

/**
 * The title lands over every stroke, so it has to read on all of them. Pick ink or paper by the worst contrast
 * across the strokes; when even the better choice falls short, fall back to a plate in the darkest stroke.
 */
export function resolveTitleTreatment(colors: readonly string[]): TitleTreatment {
  const valid = colors.filter(isHex);
  if (valid.length === 0) return { color: PAPER };
  const worst = (text: string) => Math.min(...valid.map(c => contrastRatio(c, text)));
  const paper = worst(PAPER);
  const ink = worst(INK);
  const best = paper >= ink ? PAPER : INK;
  if (Math.max(paper, ink) >= MIN_RATIO) return { color: best };

  const darkest = valid.reduce((a, b) => (relativeLuminance(a) <= relativeLuminance(b) ? a : b));
  const plate = contrastRatio(darkest, PAPER) >= MIN_RATIO ? darkest : INK;
  return { color: PAPER, plate };
}
