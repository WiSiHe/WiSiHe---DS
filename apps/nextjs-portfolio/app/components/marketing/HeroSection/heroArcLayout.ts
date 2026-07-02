export type HeroCardSide = 'left' | 'right';
export type HeroCardBand = 'top' | 'bottom';

export type HeroCardPosition = {
  top: string;
  left: string;
  rotation: number;
  scale: number;
  side: HeroCardSide;
  band: HeroCardBand;
};

export type HeroViewport = 'mobile' | 'tablet' | 'desktop' | 'wide';

export function resolveHeroViewport(width: number): HeroViewport {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'desktop';
  return 'wide';
}

export function heroVisibleCount(viewport: HeroViewport): number {
  switch (viewport) {
    case 'mobile':
      return 4;
    case 'tablet':
      return 4;
    case 'desktop':
      return 6;
    case 'wide':
      return 8;
  }
}

type ArcConfig = {
  rx: number;
  ry: number;
  centerY: number;
  baseScale: number;
};

function arcConfigForViewport(viewport: HeroViewport): ArcConfig {
  switch (viewport) {
    case 'tablet':
      return { rx: 36, ry: 32, centerY: 46, baseScale: 0.74 };
    case 'desktop':
      return { rx: 41, ry: 37, centerY: 46, baseScale: 0.84 };
    case 'wide':
      return { rx: 45, ry: 40, centerY: 46, baseScale: 0.88 };
    default:
      return { rx: 41, ry: 37, centerY: 46, baseScale: 0.84 };
  }
}

/** Evenly spaced orbit angles — gaps at top/bottom center for hero copy. */
const ORBIT_ANGLES: Record<number, number[]> = {
  4: [225, 315, 35, 125],
  6: [210, 248, 286, 32, 70, 108],
  8: [205, 235, 265, 295, 325, 355, 25, 55],
};

export function buildArcPositions(count: number, viewport: HeroViewport): HeroCardPosition[] {
  const config = arcConfigForViewport(viewport);
  const angles = ORBIT_ANGLES[count] ?? ORBIT_ANGLES[6]!;

  return angles.slice(0, count).map((deg, index) => {
    const rad = (deg * Math.PI) / 180;
    const left = 50 + config.rx * Math.cos(rad);
    const top = config.centerY + config.ry * Math.sin(rad);
    const side: HeroCardSide = left < 50 ? 'left' : 'right';
    const band: HeroCardBand = top < config.centerY ? 'top' : 'bottom';
    const tangent = deg + (side === 'left' ? -8 : 8);

    return {
      top: `${top.toFixed(1)}%`,
      left: `${left.toFixed(1)}%`,
      rotation: tangent * 0.12 + (index % 2 === 0 ? -4 : 4),
      scale: config.baseScale + (index % 3) * 0.03,
      side,
      band,
    };
  });
}

export function seededSlotOrder(count: number, seed = 42): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  let state = seed;
  for (let i = order.length - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const j = state % (i + 1);
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order;
}

export function heroCardScatter(
  seed: number,
  side: HeroCardSide,
  band: HeroCardBand,
): { x: number; y: number; rotate: number } {
  const r1 = (seed % 997) / 997;
  const r2 = ((seed * 17) % 991) / 991;
  const r3 = ((seed * 31) % 983) / 983;

  return {
    x: (side === 'left' ? -1 : 1) * (4 + r1 * 10),
    y: (band === 'top' ? -1 : 1) * (3 + r2 * 8),
    rotate: (r3 - 0.5) * 8,
  };
}
