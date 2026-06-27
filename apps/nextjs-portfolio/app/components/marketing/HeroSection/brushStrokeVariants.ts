/** Organic stroke paths + layout presets for painting card brush reveal. */

const BRUSH_PATH_PRIMARY =
  'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262';

const BRUSH_PATH_SECONDARY =
  'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012';

const BRUSH_PATH_RIBBON_A = 'M 60 940 C 280 80, 520 880, 760 120 S 980 720, 940 40';

const BRUSH_PATH_RIBBON_B = 'M 40 60 C 420 320, 580 680, 960 940 S 720 520, 80 880';

const BRUSH_PATH_WAVE_A = 'M 0 520 C 220 80, 780 920, 1000 480';

const BRUSH_PATH_WAVE_B = 'M 0 380 C 360 860, 640 140, 1000 620';

const BRUSH_PATH_SPIRAL_A = 'M 120 880 C 400 200, 600 800, 880 120 S 200 400, 520 920';

const BRUSH_PATH_SPIRAL_B = 'M 880 80 C 600 360, 400 640, 120 920 S 800 600, 480 100';

const BRUSH_PATH_CROSS_A = 'M 80 200 C 320 900, 680 100, 920 800';

const BRUSH_PATH_CROSS_B = 'M 920 200 C 680 900, 320 100, 80 800';

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
      { d: BRUSH_PATH_WAVE_A, viewBox: '0 0 1000 1000', rotateDeg: -8 },
      { d: BRUSH_PATH_RIBBON_B, viewBox: '0 0 1000 1000', rotateDeg: 12 },
    ],
    scale: 2,
  },
  {
    id: 'classic-tilt',
    layers: [
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: -16 },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: 12 },
      { d: BRUSH_PATH_SPIRAL_A, viewBox: '0 0 1000 1000', rotateDeg: 6 },
      { d: BRUSH_PATH_CROSS_B, viewBox: '0 0 1000 1000', rotateDeg: -4, mirror: true },
    ],
    scale: 2.25,
  },
  {
    id: 'classic-wide',
    layers: [
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: 10, mirror: true },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: -8 },
      { d: BRUSH_PATH_WAVE_B, viewBox: '0 0 1000 1000', rotateDeg: -14 },
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
      { d: BRUSH_PATH_WAVE_A, viewBox: '0 0 1000 1000', rotateDeg: 8 },
    ],
    scale: 2.35,
  },
  {
    id: 'wave',
    layers: [
      { d: BRUSH_PATH_WAVE_A, viewBox: '0 0 1000 1000', rotateDeg: 4 },
      { d: BRUSH_PATH_WAVE_B, viewBox: '0 0 1000 1000', rotateDeg: -10 },
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: 16 },
      { d: BRUSH_PATH_SPIRAL_B, viewBox: '0 0 1000 1000', rotateDeg: -6 },
    ],
    scale: 2.5,
  },
  {
    id: 'spiral',
    layers: [
      { d: BRUSH_PATH_SPIRAL_A, viewBox: '0 0 1000 1000', rotateDeg: -12 },
      { d: BRUSH_PATH_SPIRAL_B, viewBox: '0 0 1000 1000', rotateDeg: 18 },
      { d: BRUSH_PATH_CROSS_A, viewBox: '0 0 1000 1000', rotateDeg: 0 },
      { d: BRUSH_PATH_RIBBON_B, viewBox: '0 0 1000 1000', rotateDeg: -10 },
    ],
    scale: 2.3,
  },
  {
    id: 'cross',
    layers: [
      { d: BRUSH_PATH_CROSS_A, viewBox: '0 0 1000 1000', rotateDeg: 0 },
      { d: BRUSH_PATH_CROSS_B, viewBox: '0 0 1000 1000', rotateDeg: 0, mirror: true },
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: -12 },
      { d: BRUSH_PATH_WAVE_B, viewBox: '0 0 1000 1000', rotateDeg: 20 },
    ],
    scale: 2.45,
  },
  {
    id: 'classic-deep',
    layers: [
      { d: BRUSH_PATH_SECONDARY, viewBox: '0 0 2250 2535', rotateDeg: -20 },
      { d: BRUSH_PATH_PRIMARY, viewBox: '0 0 2453 2273', rotateDeg: 15 },
      { d: BRUSH_PATH_SPIRAL_A, viewBox: '0 0 1000 1000', rotateDeg: 8 },
      { d: BRUSH_PATH_RIBBON_A, viewBox: '0 0 1000 1000', rotateDeg: -16, mirror: true },
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
