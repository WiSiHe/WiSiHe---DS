/** Organic stroke paths + layout presets for painting card brush reveal. */

const BRUSH_PATH_PRIMARY =
  'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262';

const BRUSH_PATH_SECONDARY =
  'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012';

/** Flowing ribbon — multiple soft bends, no straight diagonals. */
const BRUSH_PATH_RIBBON_A =
  'M 60 920 C 220 640, 360 280, 560 420 S 760 720, 680 920 S 420 980, 240 860 S 80 1040, 60 920';

const BRUSH_PATH_RIBBON_B =
  'M 40 120 C 280 360, 520 640, 720 480 S 920 240, 880 520 S 640 820, 420 760 S 120 680, 40 120';

/** Gentle meander across the canvas. */
const BRUSH_PATH_MEANDER_A =
  'M 0 580 C 160 420, 280 220, 460 340 S 640 560, 780 420 S 920 280, 1000 520';

const BRUSH_PATH_MEANDER_B =
  'M 0 420 C 200 620, 320 820, 520 680 S 720 460, 860 620 S 960 780, 1000 360';

/** Playful curls — figure-eight energy. */
const BRUSH_PATH_LOOP_A =
  'M 140 860 C 300 660, 420 340, 620 460 S 860 720, 740 900 S 500 940, 340 780 S 180 980, 140 860';

const BRUSH_PATH_LOOP_B =
  'M 860 140 C 700 340, 580 660, 380 540 S 140 280, 260 100 S 500 60, 660 220 S 920 40, 860 140';

/** Wide swoosh — loose painterly arc. */
const BRUSH_PATH_SWOOSH_A =
  'M 80 900 C 240 520, 420 180, 640 320 S 880 680, 760 900 S 520 980, 320 860 S 120 980, 80 900';

const BRUSH_PATH_SWOOSH_B =
  'M 920 100 C 760 480, 580 820, 360 680 S 120 340, 240 120 S 480 40, 680 200 S 960 20, 920 100';

/** Blobby daub — round, playful stroke. */
const BRUSH_PATH_DAUB_A =
  'M 120 500 C 260 320, 420 680, 560 460 S 760 280, 860 480 S 720 760, 540 820 S 280 760, 120 500';

const BRUSH_PATH_DAUB_B =
  'M 880 500 C 740 680, 580 320, 440 540 S 240 720, 140 520 S 280 240, 460 180 S 720 240, 880 500';

export type BrushStrokeLayer = {
  d: string;
  viewBox: string;
  rotateDeg: number;
  mirror?: boolean;
};

export type BrushStrokeVariant = {
  id: string;
  /** Four overlapping strokes for full card coverage */
  layers: [BrushStrokeLayer, BrushStrokeLayer, BrushStrokeLayer, BrushStrokeLayer];
  /** Extra scale on the cover box so strokes reach card edges */
  scale: number;
};

export const BRUSH_STROKE_VARIANTS: ReadonlyArray<BrushStrokeVariant> = [
  {
    id: 'classic',
    layers: [
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: 0 },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: 0 },
      { d: BRUSH_PATH_MEANDER_A, viewBox: '0 0 1000 1000', rotateDeg: -8 },
      { d: BRUSH_PATH_RIBBON_B, viewBox: '0 0 1000 1000', rotateDeg: 12 },
    ],
    scale: 2,
  },
  {
    id: 'classic-tilt',
    layers: [
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: -16 },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: 12 },
      { d: BRUSH_PATH_LOOP_A, viewBox: '0 0 1000 1000', rotateDeg: 6 },
      { d: BRUSH_PATH_SWOOSH_B, viewBox: '0 0 1000 1000', rotateDeg: -4, mirror: true },
    ],
    scale: 2.25,
  },
  {
    id: 'classic-wide',
    layers: [
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: 10, mirror: true },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: -8 },
      { d: BRUSH_PATH_MEANDER_B, viewBox: '0 0 1000 1000', rotateDeg: -14 },
      { d: BRUSH_PATH_RIBBON_A, viewBox: '0 0 1000 1000', rotateDeg: 18 },
    ],
    scale: 2.4,
  },
  {
    id: 'ribbon',
    layers: [
      { d: BRUSH_PATH_RIBBON_A, viewBox: '0 0 1000 1000', rotateDeg: -6 },
      { d: BRUSH_PATH_RIBBON_B, viewBox: '0 0 1000 1000', rotateDeg: 14 },
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: -22 },
      { d: BRUSH_PATH_MEANDER_A, viewBox: '0 0 1000 1000', rotateDeg: 8 },
    ],
    scale: 2.35,
  },
  {
    id: 'wave',
    layers: [
      { d: BRUSH_PATH_MEANDER_A, viewBox: '0 0 1000 1000', rotateDeg: 4 },
      { d: BRUSH_PATH_MEANDER_B, viewBox: '0 0 1000 1000', rotateDeg: -10 },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: 16 },
      { d: BRUSH_PATH_LOOP_B, viewBox: '0 0 1000 1000', rotateDeg: -6 },
    ],
    scale: 2.5,
  },
  {
    id: 'spiral',
    layers: [
      { d: BRUSH_PATH_LOOP_A, viewBox: '0 0 1000 1000', rotateDeg: -12 },
      { d: BRUSH_PATH_LOOP_B, viewBox: '0 0 1000 1000', rotateDeg: 18 },
      { d: BRUSH_PATH_SWOOSH_A, viewBox: '0 0 1000 1000', rotateDeg: 0 },
      { d: BRUSH_PATH_RIBBON_B, viewBox: '0 0 1000 1000', rotateDeg: -10 },
    ],
    scale: 2.3,
  },
  {
    id: 'swirl',
    layers: [
      { d: BRUSH_PATH_SWOOSH_A, viewBox: '0 0 1000 1000', rotateDeg: 0 },
      { d: BRUSH_PATH_SWOOSH_B, viewBox: '0 0 1000 1000', rotateDeg: 0, mirror: true },
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: -12 },
      { d: BRUSH_PATH_DAUB_A, viewBox: '0 0 1000 1000', rotateDeg: 20 },
    ],
    scale: 2.45,
  },
  {
    id: 'classic-deep',
    layers: [
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: -20 },
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: 15 },
      { d: BRUSH_PATH_LOOP_A, viewBox: '0 0 1000 1000', rotateDeg: 8 },
      { d: BRUSH_PATH_DAUB_B, viewBox: '0 0 1000 1000', rotateDeg: -16, mirror: true },
    ],
    scale: 2.55,
  },
];

export function getBrushStrokeVariant(index: number): BrushStrokeVariant {
  return BRUSH_STROKE_VARIANTS[index % BRUSH_STROKE_VARIANTS.length] as BrushStrokeVariant;
}

/** Stable numeric seed from painting id/slug for color + stroke variant selection. */
export function paintingBrushSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/** Card stroke layer count (hero uses first two only). */
export const CARD_BRUSH_LAYER_COUNT = 4;
