export type ColorPalette = 'gargantua';
export type ShapePreset = 'gargantua';

export interface BenchmarkConfig {
  count: number;
  palette: ColorPalette;
  shape: ShapePreset;
  particleSize: number; // Orb particle glow diameter scale (0.8 - 4.5px)
  speed: number; // Orb rotation & pulse speed (0.2 - 2.5x)
  orbRadius: number; // Orb radius scale (8 - 24)
}

export interface BenchmarkMetrics {
  fps: number;
  frameTime: number; // in ms
  drawCalls: number;
  triangles: number;
  backend: string;
  isWebGPU: boolean;
}

export const COUNT_PRESETS = [
  { label: '25K', value: 25_000 },
  { label: '50K', value: 50_000 },
  { label: '100K', value: 100_000 },
  { label: '250K', value: 250_000 },
  { label: '500K', value: 500_000 },
  { label: '1M', value: 1_000_000 },
] as const;

export const SHAPE_PRESETS = [
  {
    id: 'gargantua' as const,
    name: 'Gargantua',
    tag: 'Particle Orb',
    desc: 'A glowing sphere of particles, animated entirely on the GPU — WebGPU compute storage buffers vs. a plain WebGL vertex shader.',
  },
];

export interface PaletteData {
  name: string;
  primary: string; // Mid-gradient plasma color
  secondary: string; // Cool edge of the gradient
  hot: string; // Hottest core color
  bg: string; // Deep cosmic void background
  groundGrid: string; // Unused accent, kept for palette shape compatibility
}

export const PALETTES: Record<ColorPalette, PaletteData> = {
  gargantua: {
    name: 'Gargantua Gold',
    primary: '#ff5600', // Fiery plasma orange
    secondary: '#7b2cff', // Cool violet edge
    hot: '#fffbf9', // Incandescent white core
    bg: '#040206',
    groundGrid: '#cc00ff',
  },
};

const LIGHT_PALETTE: PaletteData = {
  name: 'Halcyon Daybreak',
  primary: '#2f6bff', // Vivid azure plasma
  secondary: '#ff3ea5', // Magenta-pink edge
  hot: '#ffd76b', // Warm gold core
  bg: '#dce4f4', // Soft daylight periwinkle — not paper-white, so the
  // additive-blended glow still reads as brighter than the backdrop
  groundGrid: '#2f6bff',
};

/** Picks the orb's color palette to match the site's current light/dark theme. */
export function getThemedPalette(isDark: boolean): PaletteData {
  return isDark ? PALETTES.gargantua : LIGHT_PALETTE;
}

export const DEFAULT_CONFIG: BenchmarkConfig = {
  count: 50_000,
  palette: 'gargantua',
  shape: 'gargantua',
  particleSize: 3.0,
  speed: 1.0,
  orbRadius: 15.0,
};

export function normalizePalette(_palette?: string | null): ColorPalette {
  return 'gargantua';
}

export function normalizeShape(_shape?: string | null): ShapePreset {
  return 'gargantua';
}

export function getPalette(_paletteKey?: string | null): PaletteData {
  return PALETTES.gargantua;
}
