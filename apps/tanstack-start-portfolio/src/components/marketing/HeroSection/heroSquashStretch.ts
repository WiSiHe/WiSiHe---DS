/**
 * Subtle squash & stretch motion — inspired by Disney / Josh Comeau.
 * @see https://www.joshwcomeau.com/animation/squash-and-stretch/
 */

export const HERO_SQUASH_SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 12,
};

/** Keep ratios close to 1 — the effect reads better when understated. */
export const HERO_SQUASH_RATIOS = {
  squashX: 1.06,
  squashY: 0.94,
  stretchX: 0.97,
  stretchY: 1.04,
};

/** Squash on impact, brief stretch, settle — for explode landing. */
export const EXPLODE_SQUASH_KEYFRAMES = {
  scaleX: [1, HERO_SQUASH_RATIOS.squashX, HERO_SQUASH_RATIOS.stretchX, 1] as [
    number,
    number,
    number,
    number,
  ],
  scaleY: [1, HERO_SQUASH_RATIOS.squashY, HERO_SQUASH_RATIOS.stretchY, 1] as [
    number,
    number,
    number,
    number,
  ],
};

export const EXPLODE_SQUASH_TRANSITION = {
  duration: 0.55,
  times: [0, 0.14, 0.28, 1] as [number, number, number, number],
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/** Sync scale with vertical float — squash at the low point of each cycle. */
export function heroFloatSquashStretch(yPeak: number) {
  const squashAtPeak = yPeak > 0;
  return {
    scaleX: squashAtPeak
      ? ([1, HERO_SQUASH_RATIOS.squashX, 1] as [number, number, number])
      : ([1, HERO_SQUASH_RATIOS.stretchX, 1] as [number, number, number]),
    scaleY: squashAtPeak
      ? ([1, HERO_SQUASH_RATIOS.squashY, 1] as [number, number, number])
      : ([1, HERO_SQUASH_RATIOS.stretchY, 1] as [number, number, number]),
  };
}
