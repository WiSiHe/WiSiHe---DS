/** Grid band stroke variants — full-canvas curated pairs at classic scale. */

const GRID_BAND_VIEWBOX = '0 0 2453 2535';

const BRUSH_PATH_PRIMARY =
  'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262';

const BRUSH_PATH_SECONDARY =
  'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012';

/** Slash-hatch — fat BL→TR arc with return hook along the diagonal band. */
const BAND_PATH_SLASH =
  'M -200 2680 C 480 2680, 920 2280, 1280 1880 S 1680 1480, 2040 1080 S 2400 680, 2740 280 S 2680 920, 2280 1360 S 1840 1800, 1360 2240 S 880 2580, 360 2680 S -80 2680, -200 2680';

/** Slash-hatch — fat TL→BR arc with return hook crossing the slash. */
const BAND_PATH_HATCH =
  'M -200 -140 C 480 -140, 920 320, 1280 760 S 1680 1200, 2040 1640 S 2400 2080, 2740 2480 S 2680 1840, 2280 1400 S 1840 960, 1360 520 S 880 120, 360 -80 S -80 -140, -200 -140';

/** Loaded — UL corner mass; bleeds past viewBox like classic primary. */
const BAND_PATH_LOADED_CORNER =
  'M -160 140 C 320 80, 720 360, 980 760 S 1140 1360, 980 1860 S 640 2460, 160 2580 S -120 2100, 60 1500 S 340 860, 720 520 S 1180 180, 1760 320 S 2560 680, 2620 1320 S 2280 2280, 1680 2620';

/** Loaded — heavy top-center drag through middle to lower-right. */
const BAND_PATH_LOADED_DRAG =
  'M 1220 -120 C 1320 520, 1420 1120, 1480 1720 S 1620 2380, 2060 2640 S 2520 2180, 2420 1560 S 2100 920, 1720 480 S 1260 120, 780 80 S 240 240, -100 720 S -140 1280, 200 1720 S 560 2180, 1020 2480 S 1680 2620, 2280 2380';

/** Ribbon — lower flowing S-curve. */
const BAND_PATH_RIBBON_A =
  'M 100 2200 C 520 1580, 900 820, 1340 980 S 1940 1620, 2280 2080 S 1380 2480, 100 2200';

/** Ribbon — upper counter S-curve. */
const BAND_PATH_RIBBON_B =
  'M 60 380 C 580 780, 1040 1480, 1640 1120 S 2360 620, 2160 1040 S 1500 1880, 60 380';

/** Spiral — large loop winding across canvas. */
const BAND_PATH_SPIRAL_LOOP =
  'M 160 2520 C 560 2280, 920 1880, 1140 1420 S 1240 920, 980 480 S 560 120, 160 420 S -80 980, 120 1480 S 480 1980, 920 2280 S 1400 2460, 1920 2380 S 2480 2080, 2620 1620 S 2540 1020, 2140 620 S 1680 340, 1180 480 S 680 780, 380 1280 S 160 1880, 360 2420';

/** Spiral — whip flick BL through center to UR. */
const BAND_PATH_SPIRAL_WHIP =
  'M -140 2620 C 520 2120, 1120 1480, 1680 880 S 2240 280, 2660 -100 S 2280 720, 1820 1320 S 1320 1980, 760 2520 S 280 2620, -140 2620';

/** Wave — horizontal meander sweeping full width and vertical span. */
const BAND_PATH_WAVE_MEANDER =
  'M -160 420 C 280 680, 620 980, 980 1280 S 1340 1680, 1720 1980 S 2100 2380, 2520 2480 S 2680 2080, 2620 1680 S 2280 1280, 1920 980 S 1520 680, 1080 480 S 620 320, 200 520 S -140 880, 120 1280 S 480 1680, 920 2080 S 1360 2380, 1800 2520 S 2280 2580, 2660 2280';

/** Wave — broad horizontal wash through center with edge bleed. */
const BAND_PATH_WAVE_BROAD =
  'M -140 1180 C 480 1080, 920 980, 1360 1080 S 1800 1280, 2240 1180 S 2620 1080, 2680 1380 S 2620 1780, 2240 1920 S 1760 1980, 1280 1880 S 720 1780, 240 1880 S -120 1680, -140 1380 S 120 1180, 480 1280 S 920 1380, 1360 1280 S 1800 1180, 2240 1280';

export type BrushStrokeLayer = {
  d: string;
  viewBox: string;
  rotateDeg: number;
  mirror?: boolean;
  flipY?: boolean;
  widthScale?: number;
  opacityScale?: number;
};

/** Light per-variant motion offsets for grid band wipe. */
export type GridBandWipe = { axis: 'horizontal' } | { axis: 'vertical'; from: 'top' | 'bottom' };

export type GridBandDrawEase = 'balanced' | 'snappy' | 'heavy';

export type GridBandVariantTiming = {
  durationScale: number;
  widthScale: number;
  overlayDelayOffset: number;
  /** Delay before the second stroke draws (seconds). */
  strokeStaggerSec: number;
  wipe: GridBandWipe;
  drawEase: GridBandDrawEase;
};

export type GridBandConfig = {
  viewBox: string;
  layers: readonly [BrushStrokeLayer, BrushStrokeLayer];
  timing: GridBandVariantTiming;
  /** Short label for Storybook (curated pair). */
  pairLabel: string;
};

export type BrushStrokeVariant = {
  id: string;
  scale: number;
  band: GridBandConfig;
};

function bandLayer(
  d: string,
  rotateDeg = 0,
  opts?: { mirror?: boolean; widthScale?: number },
): BrushStrokeLayer {
  return {
    d,
    viewBox: GRID_BAND_VIEWBOX,
    rotateDeg,
    mirror: opts?.mirror,
    widthScale: opts?.widthScale,
  };
}

/** Six full-canvas pairs — classic anchor + five distinct personalities. */
export const BRUSH_STROKE_VARIANTS: ReadonlyArray<BrushStrokeVariant> = [
  {
    id: 'classic',
    scale: 2,
    band: {
      viewBox: GRID_BAND_VIEWBOX,
      pairLabel: 'primary + secondary',
      layers: [bandLayer(BRUSH_PATH_PRIMARY), bandLayer(BRUSH_PATH_SECONDARY)],
      timing: {
        durationScale: 1,
        widthScale: 1,
        overlayDelayOffset: 0,
        strokeStaggerSec: 0,
        wipe: { axis: 'horizontal' },
        drawEase: 'balanced',
      },
    },
  },
  {
    id: 'slash-hatch',
    scale: 2,
    band: {
      viewBox: GRID_BAND_VIEWBOX,
      pairLabel: 'arc slash + arc hatch',
      layers: [
        bandLayer(BAND_PATH_SLASH, -4, { widthScale: 1.18 }),
        bandLayer(BAND_PATH_HATCH, 8, { widthScale: 1.22 }),
      ],
      timing: {
        durationScale: 0.78,
        widthScale: 1.15,
        overlayDelayOffset: -0.04,
        strokeStaggerSec: 0,
        wipe: { axis: 'horizontal' },
        drawEase: 'snappy',
      },
    },
  },
  {
    id: 'loaded',
    scale: 2,
    band: {
      viewBox: GRID_BAND_VIEWBOX,
      pairLabel: 'corner UL + drag down',
      layers: [
        bandLayer(BAND_PATH_LOADED_CORNER, -3, { widthScale: 1.14 }),
        bandLayer(BAND_PATH_LOADED_DRAG, 5, { widthScale: 1.18 }),
      ],
      timing: {
        durationScale: 1.28,
        widthScale: 1.12,
        overlayDelayOffset: 0.05,
        strokeStaggerSec: 0.14,
        wipe: { axis: 'vertical', from: 'top' },
        drawEase: 'heavy',
      },
    },
  },
  {
    id: 'ribbon',
    scale: 2,
    band: {
      viewBox: GRID_BAND_VIEWBOX,
      pairLabel: 'ribbon A + ribbon B',
      layers: [
        bandLayer(BAND_PATH_RIBBON_A, -6, { widthScale: 1.03 }),
        bandLayer(BAND_PATH_RIBBON_B, 10, { widthScale: 1.02 }),
      ],
      timing: {
        durationScale: 1.05,
        widthScale: 1.04,
        overlayDelayOffset: 0.02,
        strokeStaggerSec: 0,
        wipe: { axis: 'horizontal' },
        drawEase: 'balanced',
      },
    },
  },
  {
    id: 'spiral',
    scale: 2,
    band: {
      viewBox: GRID_BAND_VIEWBOX,
      pairLabel: 'loop + whip',
      layers: [
        bandLayer(BAND_PATH_SPIRAL_LOOP, -8, { widthScale: 1.14 }),
        bandLayer(BAND_PATH_SPIRAL_WHIP, -2, { widthScale: 1.18 }),
      ],
      timing: {
        durationScale: 0.85,
        widthScale: 1.12,
        overlayDelayOffset: -0.02,
        strokeStaggerSec: 0.14,
        wipe: { axis: 'vertical', from: 'bottom' },
        drawEase: 'snappy',
      },
    },
  },
  {
    id: 'wave',
    scale: 2,
    band: {
      viewBox: GRID_BAND_VIEWBOX,
      pairLabel: 'meander + broad H',
      layers: [
        bandLayer(BAND_PATH_WAVE_MEANDER, 2, { widthScale: 1.14 }),
        bandLayer(BAND_PATH_WAVE_BROAD, 0, { widthScale: 1.18 }),
      ],
      timing: {
        durationScale: 1.22,
        widthScale: 1.12,
        overlayDelayOffset: 0.06,
        strokeStaggerSec: 0.14,
        wipe: { axis: 'vertical', from: 'bottom' },
        drawEase: 'heavy',
      },
    },
  },
];

export function getBrushStrokeVariant(index: number): BrushStrokeVariant {
  return BRUSH_STROKE_VARIANTS[index % BRUSH_STROKE_VARIANTS.length] as BrushStrokeVariant;
}

export function getGridBandConfig(variantIndex: number): GridBandConfig {
  return getBrushStrokeVariant(variantIndex).band;
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
