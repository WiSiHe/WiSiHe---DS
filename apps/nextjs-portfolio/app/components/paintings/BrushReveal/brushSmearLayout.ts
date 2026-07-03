import type { CSSProperties } from 'react';
import type { PaintingFormat } from '@/lib/paintings/paintingCardImage';

export type WedgeCorner = 'bottom-left' | 'bottom-right';

export type SmearSweep = {
  angle: number;
  direction: 1 | -1;
};

const PORTRAIT_SWEEPS: SmearSweep[] = [
  { angle: -88, direction: 1 },
  { angle: 92, direction: 1 },
  { angle: -128, direction: 1 },
  { angle: 138, direction: -1 },
];

const LANDSCAPE_SWEEPS: SmearSweep[] = [
  { angle: 0, direction: 1 },
  { angle: 2, direction: -1 },
  { angle: -32, direction: 1 },
  { angle: 28, direction: -1 },
  { angle: -18, direction: 1 },
];

const SQUARE_SWEEPS: SmearSweep[] = [
  { angle: -42, direction: 1 },
  { angle: 48, direction: -1 },
  { angle: -8, direction: 1 },
  { angle: 12, direction: -1 },
];

const SWEEP_POOL: Record<PaintingFormat, SmearSweep[]> = {
  portrait: PORTRAIT_SWEEPS,
  landscape: LANDSCAPE_SWEEPS,
  square: SQUARE_SWEEPS,
};

/** Seeded bottom corner (stable per painting). */
export function pickWedgeCorner(seed: number): WedgeCorner {
  return seed % 2 === 0 ? 'bottom-left' : 'bottom-right';
}

export function wedgeTitleAlignment(corner: WedgeCorner): {
  className: string;
  style: CSSProperties;
} {
  if (corner === 'bottom-left') {
    return {
      className: 'left-0 items-start text-left',
      style: { transformOrigin: '0% 100%' },
    };
  }
  return {
    className: 'right-0 items-end text-right',
    style: { transformOrigin: '100% 100%' },
  };
}

export function smearPassCount(format: PaintingFormat): number {
  return format === 'landscape' ? 4 : 3;
}

export function loadedTipSmearGradient(): string {
  return `linear-gradient(90deg, transparent 0%, transparent 18%, rgba(255,255,255,0.08) 32%, rgba(255,255,255,0.22) 48%, rgba(255,255,255,0.55) 58%, rgba(255,255,255,0.92) 66%, white 72%, white 76%, transparent 84%, transparent 100%)`;
}

export function pickSmearSweeps(format: PaintingFormat, seed: number): SmearSweep[] {
  const pool = SWEEP_POOL[format];
  const count = smearPassCount(format);
  const order = seededOrder(pool.length, seed);
  const picked: SmearSweep[] = [];

  for (let i = 0; i < count; i++) {
    const idx = order[i % order.length] ?? i % pool.length;
    picked.push(pool[idx] ?? pool[0]!);
  }
  return picked;
}

function seededOrder(length: number, seed: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  let state = seed;
  for (let i = order.length - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const j = state % (i + 1);
    const tmp = order[i];
    order[i] = order[j]!;
    order[j] = tmp!;
  }
  return order;
}
