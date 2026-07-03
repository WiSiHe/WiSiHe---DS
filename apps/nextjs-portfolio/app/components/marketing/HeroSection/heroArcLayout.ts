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

/** Copy dead zone — cards stay outside this box (viewport %). */
const CLEAR_ZONE = {
  leftMin: 28,
  leftMax: 72,
  topMin: 24,
  topMax: 68,
};

type ArcConfig = {
  rx: number;
  ry: number;
  centerX: number;
  centerY: number;
  baseScale: number;
};

/** Left-wing orbit angles — each is mirrored to the right at `180 - angle`. */
const ORBIT_WING_ANGLES: Record<HeroViewport, number[]> = {
  mobile: [218, 162],
  tablet: [210, 158],
  desktop: [200, 238, 162],
  wide: [198, 222, 246, 158],
};

function arcConfigForViewport(viewport: HeroViewport): ArcConfig {
  switch (viewport) {
    case 'mobile':
      return { rx: 44, ry: 46, centerX: 50, centerY: 50, baseScale: 0.74 };
    case 'tablet':
      return { rx: 34, ry: 38, centerX: 50, centerY: 50, baseScale: 0.82 };
    case 'desktop':
      return { rx: 40, ry: 44, centerX: 50, centerY: 50, baseScale: 0.9 };
    case 'wide':
      return { rx: 42, ry: 46, centerX: 50, centerY: 50, baseScale: 0.94 };
  }
}

function mirrorAngle(deg: number): number {
  let mirrored = 180 - deg;
  while (mirrored < 0) mirrored += 360;
  while (mirrored >= 360) mirrored -= 360;
  return mirrored;
}

function pointFromAngle(deg: number, config: ArcConfig): { left: number; top: number } {
  const rad = (deg * Math.PI) / 180;
  return {
    left: config.centerX + config.rx * Math.cos(rad),
    top: config.centerY + config.ry * Math.sin(rad),
  };
}

function isInClearZone(left: number, top: number): boolean {
  return (
    left > CLEAR_ZONE.leftMin &&
    left < CLEAR_ZONE.leftMax &&
    top > CLEAR_ZONE.topMin &&
    top < CLEAR_ZONE.topMax
  );
}

/** Subtle tangent tilt — clamped so cards stay mostly upright. */
function orbitRotation(deg: number, config: ArcConfig, pairIndex: number): number {
  const rad = (deg * Math.PI) / 180;
  const tangent = Math.atan2(config.ry * Math.cos(rad), -config.rx * Math.sin(rad));
  const tangentDeg = (tangent * 180) / Math.PI;
  const lean = Math.max(-5, Math.min(5, tangentDeg * 0.12));
  return lean + (pairIndex % 2 === 0 ? -1 : 1);
}

function buildBalancedOrbitAngles(viewport: HeroViewport, config: ArcConfig): number[] {
  const wingAngles = ORBIT_WING_ANGLES[viewport].filter(deg => {
    const { left, top } = pointFromAngle(deg, config);
    const mirrored = pointFromAngle(mirrorAngle(deg), config);
    return !isInClearZone(left, top) && !isInClearZone(mirrored.left, mirrored.top);
  });

  const angles: number[] = [];
  for (const wing of wingAngles) {
    angles.push(wing);
    angles.push(mirrorAngle(wing));
  }
  return angles;
}

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

export function buildArcPositions(count: number, viewport: HeroViewport): HeroCardPosition[] {
  const config = arcConfigForViewport(viewport);
  const angles = buildBalancedOrbitAngles(viewport, config).slice(0, count);

  return angles.map((deg, index) => {
    const { left, top } = pointFromAngle(deg, config);
    const side: HeroCardSide = left < config.centerX ? 'left' : 'right';
    const band: HeroCardBand = top < config.centerY ? 'top' : 'bottom';
    const pairIndex = Math.floor(index / 2);

    return {
      top: `${top.toFixed(1)}%`,
      left: `${left.toFixed(1)}%`,
      rotation: orbitRotation(deg, config, pairIndex),
      scale: config.baseScale + (pairIndex % 3) * 0.02,
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
    const tmp = order[i];
    const swap = order[j];
    if (tmp === undefined || swap === undefined) continue;
    order[i] = swap;
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
    x: (side === 'left' ? -1 : 1) * (2 + r1 * 5),
    y: (band === 'top' ? -1 : 1) * (1 + r2 * 4),
    rotate: (r3 - 0.5) * 1.5,
  };
}
