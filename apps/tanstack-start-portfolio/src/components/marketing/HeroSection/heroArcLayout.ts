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

export type HeroViewport = 'mobile' | 'tablet' | 'desktop' | 'wide' | 'ultraWide';

export type HeroViewportSize = {
  width: number;
  height: number;
};

/**
 * First-render viewport values. Server and client must both start from these (never from `window`)
 * so hydration matches; the real size is applied in a mount effect.
 */
export const HERO_INITIAL_VIEWPORT: HeroViewport = 'desktop';
export const HERO_INITIAL_VIEWPORT_SIZE: HeroViewportSize = { width: 0, height: 0 };

/** Copy dead zone — cards stay outside this box (viewport %). */
const CLEAR_ZONE = {
  leftMin: 28,
  leftMax: 72,
  topMin: 24,
  topMax: 68,
};

/**
 * Mobile keeps a taller dead zone so cards clear the copy/CTA vertically and
 * float in the bands above and below it rather than crowding the sides.
 */
const MOBILE_CLEAR_ZONE = {
  leftMin: 14,
  leftMax: 86,
  topMin: 28,
  topMax: 70,
};

type ArcConfig = {
  rx: number;
  ry: number;
  centerX: number;
  centerY: number;
  baseScale: number;
  clearZone: typeof CLEAR_ZONE;
};

/** Wing layout — left angles mirrored to the right (desktop / tablet fan). */
const ORBIT_WING_ANGLES: Record<Exclude<HeroViewport, 'ultraWide'>, number[]> = {
  // Mobile: one upper pair + two lower pairs so cards fill the space below copy/CTA.
  mobile: [228, 155, 138],
  tablet: [210, 158],
  desktop: [200, 238, 162],
  wide: [198, 222, 246, 158],
};

/**
 * Ring layout — cards distributed around the center (ultrawide + wide 21:9).
 * Angles are intentionally uneven for an organic, hand-placed feel.
 */
const ORBIT_RING_ANGLES: number[] = [92, 124, 156, 196, 232, 264, 298, 328, 356, 28, 52, 74];

function arcConfigForViewport(viewport: HeroViewport, size?: HeroViewportSize): ArcConfig {
  const aspect = size?.width && size?.height ? size.width / size.height : 1.78;

  switch (viewport) {
    case 'mobile':
      return {
        rx: 40,
        ry: 44,
        centerX: 50,
        centerY: 58,
        baseScale: 0.86,
        clearZone: MOBILE_CLEAR_ZONE,
      };
    case 'tablet':
      return {
        rx: 34,
        ry: 38,
        centerX: 50,
        centerY: 50,
        baseScale: 0.82,
        clearZone: CLEAR_ZONE,
      };
    case 'desktop':
      return {
        rx: 40,
        ry: 44,
        centerX: 50,
        centerY: 50,
        baseScale: 0.9,
        clearZone: CLEAR_ZONE,
      };
    case 'wide':
      return {
        rx: usesRingLayout('wide', size) ? 44 + Math.min((aspect - 2) * 4, 6) : 42,
        ry: usesRingLayout('wide', size) ? 40 : 46,
        centerX: 50,
        centerY: 50,
        baseScale: 0.94,
        clearZone: CLEAR_ZONE,
      };
    case 'ultraWide':
      return {
        rx: 44 + Math.min(Math.max(aspect - 2.1, 0) * 5, 8),
        ry: 38,
        centerX: 50,
        centerY: 50,
        baseScale: 0.9,
        clearZone: CLEAR_ZONE,
      };
  }
}

export function usesRingLayout(viewport: HeroViewport, size?: HeroViewportSize): boolean {
  if (viewport === 'ultraWide') return true;
  if (viewport !== 'wide' || !size?.width || !size?.height) return false;
  return size.width / size.height >= 2.05;
}

/** Push wing cards toward the sides on 16:9+ (ring layouts skip this). */
function adjustConfigForViewportSize(
  config: ArcConfig,
  viewport: HeroViewport,
  size?: HeroViewportSize,
): ArcConfig {
  if (usesRingLayout(viewport, size) || !size?.width || !size?.height) return config;

  const aspect = size.width / size.height;
  if (aspect < 1.9) return config;

  const aspectBoost = Math.min((aspect - 1.78) * 5.5, 7);
  return {
    ...config,
    rx: Math.min(50, config.rx + aspectBoost),
    ry: Math.max(36, config.ry - aspectBoost * 0.35),
  };
}

type OrbitClamp = { topMin: number; topMax: number };

const DEFAULT_ORBIT_CLAMP: OrbitClamp = { topMin: 6, topMax: 94 };

/**
 * Mobile keeps card centers away from the top corners (logo + theme toggle at
 * top-4) and the fixed bottom dock nav so no card floats over the chrome.
 */
const MOBILE_ORBIT_CLAMP: OrbitClamp = { topMin: 14, topMax: 82 };

function clampOrbitPoint(
  left: number,
  top: number,
  clamp: OrbitClamp = DEFAULT_ORBIT_CLAMP,
): { left: number; top: number } {
  return {
    left: Math.max(3, Math.min(97, left)),
    top: Math.max(clamp.topMin, Math.min(clamp.topMax, top)),
  };
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

function isInClearZone(left: number, top: number, clearZone: ArcConfig['clearZone']): boolean {
  return (
    left > clearZone.leftMin &&
    left < clearZone.leftMax &&
    top > clearZone.topMin &&
    top < clearZone.topMax
  );
}

function orbitRotation(deg: number, config: ArcConfig, pairIndex: number, ring: boolean): number {
  if (ring) {
    const towardCenter = deg + 90;
    const tilt = ((towardCenter % 360) - 180) * 0.04;
    return Math.max(-8, Math.min(8, tilt + (pairIndex % 2 === 0 ? -1.5 : 1.5)));
  }

  const rad = (deg * Math.PI) / 180;
  const tangent = Math.atan2(config.ry * Math.cos(rad), -config.rx * Math.sin(rad));
  const tangentDeg = (tangent * 180) / Math.PI;
  const lean = Math.max(-5, Math.min(5, tangentDeg * 0.12));
  return lean + (pairIndex % 2 === 0 ? -1 : 1);
}

function pseudoRandom(seed: number, salt: number): number {
  return (((seed * 1103515245 + salt * 12345) & 0x7fffffff) % 1000) / 1000;
}

/** Per-card wobble so the ring feels hand-placed, not geometric. */
function organicJitter(index: number, seed = 42) {
  const base = seed + index * 97;
  return {
    angle: (pseudoRandom(base, 13) - 0.5) * 24,
    rx: (pseudoRandom(base, 17) - 0.5) * 7,
    ry: (pseudoRandom(base, 23) - 0.5) * 6,
    rotation: (pseudoRandom(base, 29) - 0.5) * 10,
    scale: (pseudoRandom(base, 31) - 0.5) * 0.08,
  };
}

function buildWingOrbitAngles(
  viewport: Exclude<HeroViewport, 'ultraWide'>,
  config: ArcConfig,
): number[] {
  const wingAngles = ORBIT_WING_ANGLES[viewport].filter(deg => {
    const { left, top } = pointFromAngle(deg, config);
    const mirrored = pointFromAngle(mirrorAngle(deg), config);
    return (
      !isInClearZone(left, top, config.clearZone) &&
      !isInClearZone(mirrored.left, mirrored.top, config.clearZone)
    );
  });

  const angles: number[] = [];
  for (const wing of wingAngles) {
    angles.push(wing);
    angles.push(mirrorAngle(wing));
  }
  return angles;
}

function buildRingOrbitAngles(config: ArcConfig, count: number): number[] {
  const valid = ORBIT_RING_ANGLES.filter(deg => {
    const { left, top } = pointFromAngle(deg, config);
    return !isInClearZone(left, top, config.clearZone);
  });

  if (valid.length >= count) return valid.slice(0, count);

  const fallback: number[] = [];
  for (let i = 0; i < count; i++) {
    fallback.push((360 / count) * i + 18);
  }
  return fallback;
}

export function resolveHeroViewport(width: number): HeroViewport {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'desktop';
  if (width < 1920) return 'wide';
  return 'ultraWide';
}

export function heroVisibleCount(viewport: HeroViewport): number {
  switch (viewport) {
    case 'mobile':
      return 6;
    case 'tablet':
      return 4;
    case 'desktop':
      return 6;
    case 'wide':
      return 8;
    case 'ultraWide':
      return 10;
  }
}

export function buildArcPositions(
  count: number,
  viewport: HeroViewport,
  viewportSize?: HeroViewportSize,
): HeroCardPosition[] {
  const ring = usesRingLayout(viewport, viewportSize);
  const config = adjustConfigForViewportSize(
    arcConfigForViewport(viewport, viewportSize),
    viewport,
    viewportSize,
  );

  const angles = ring
    ? buildRingOrbitAngles(config, count)
    : buildWingOrbitAngles(viewport as Exclude<HeroViewport, 'ultraWide'>, config).slice(0, count);

  return angles.slice(0, count).map((deg, index) => {
    const jitter = ring
      ? organicJitter(index)
      : viewport === 'mobile'
        ? {
            angle: (pseudoRandom(index * 97, 13) - 0.5) * 10,
            rx: 0,
            ry: 0,
            rotation: (pseudoRandom(index * 97, 29) - 0.5) * 4,
            scale: 0,
          }
        : organicJitter(index, 7);
    const jitteredConfig = ring
      ? { ...config, rx: config.rx + jitter.rx, ry: config.ry + jitter.ry }
      : config;
    const raw = pointFromAngle(deg + jitter.angle, jitteredConfig);
    const orbitClamp = viewport === 'mobile' ? MOBILE_ORBIT_CLAMP : DEFAULT_ORBIT_CLAMP;
    const { left, top } = clampOrbitPoint(raw.left, raw.top, orbitClamp);
    const side: HeroCardSide = left < config.centerX ? 'left' : 'right';
    const band: HeroCardBand = top < config.centerY ? 'top' : 'bottom';
    const pairIndex = Math.floor(index / 2);

    return {
      top: `${top.toFixed(1)}%`,
      left: `${left.toFixed(1)}%`,
      rotation: orbitRotation(deg, config, pairIndex, ring) + jitter.rotation,
      scale: config.baseScale + (pairIndex % 3) * 0.02 + jitter.scale,
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

/** Wing-layout scatter — biased toward outer quadrants. */
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

/** Tighter scatter on mobile — keeps a little organic wobble without stacking cards. */
export function heroCardScatterMobile(
  seed: number,
  side: HeroCardSide,
  band: HeroCardBand,
): { x: number; y: number; rotate: number } {
  const r1 = (seed % 997) / 997;
  const r2 = ((seed * 17) % 991) / 991;
  const r3 = ((seed * 31) % 983) / 983;

  return {
    x: (side === 'left' ? -1 : 1) * (1 + r1 * 2),
    y: (band === 'top' ? -1 : 1) * (band === 'bottom' ? 2 + r2 * 4 : 0.5 + r2 * 1.5),
    rotate: (r3 - 0.5) * 0.8,
  };
}

/** Ring-layout scatter — omnidirectional wobble. */
export function heroCardOrganicScatter(seed: number): { x: number; y: number; rotate: number } {
  const r1 = (seed % 997) / 997;
  const r2 = ((seed * 17) % 991) / 991;
  const r3 = ((seed * 31) % 983) / 983;
  const angle = r1 * Math.PI * 2;
  const dist = 1.5 + r2 * 5;

  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: (r3 - 0.5) * 6,
  };
}
