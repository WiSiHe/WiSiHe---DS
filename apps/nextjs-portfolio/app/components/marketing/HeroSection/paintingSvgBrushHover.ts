import gsap from 'gsap';

import {
  type BrushStrokeProfile,
  getBrushProfileConfig,
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './brushStrokeConstants';

export { type BrushStrokeProfile, getBrushProfileConfig } from './brushStrokeConstants';

function strokeWidths(profile: BrushStrokeProfile, strokeScale = 1) {
  if (strokeScale < 1) {
    const config = getBrushProfileConfig(profile);
    return { rest: config.rest, hover: config.hover };
  }
  return {
    rest: HERO_BRUSH_STROKE_WIDTH_REST * strokeScale,
    hover: HERO_BRUSH_STROKE_WIDTH_HOVER * strokeScale,
  };
}

function fadeOutOverlay(el: Element) {
  gsap.to(el, {
    opacity: 0,
    y: 6,
    duration: 0.4,
    ease: 'power2.in',
    overwrite: 'auto',
  });
}

function isReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Prepare paths + wash for dash-offset animation. */
export function initBrushRevealPaths(
  root: HTMLElement | null,
  profile: BrushStrokeProfile = 'masonry',
): void {
  if (!root) return;
  const { rest } = strokeWidths(profile);
  const paths = root.querySelectorAll<SVGPathElement>('[data-brush-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.setAttribute('stroke-width', String(rest * 0.85));
    path.style.opacity = '0';
  });

  const wash = root.querySelector('[data-brush-wash]');
  if (wash instanceof HTMLElement) {
    wash.style.opacity = '0';
  }

  const overlay = root.querySelector('[data-brush-overlay]');
  if (overlay instanceof HTMLElement) {
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(8px)';
  }
}

/** Instant metadata reveal — reduced motion or accessibility fallback. */
export function brushRevealInstant(root: HTMLElement): void {
  const overlay = root.querySelector('[data-brush-overlay]');
  const wash = root.querySelector('[data-brush-wash]');

  if (wash instanceof HTMLElement) {
    gsap.set(wash, { opacity: 1 });
  }
  if (overlay instanceof HTMLElement) {
    gsap.set(overlay, { opacity: 1, y: 0 });
  }
}

export function brushRevealInstantLeave(root: HTMLElement): void {
  const overlay = root.querySelector('[data-brush-overlay]');
  const wash = root.querySelector('[data-brush-wash]');

  if (wash instanceof HTMLElement) {
    gsap.to(wash, { opacity: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
  }
  if (overlay) fadeOutOverlay(overlay);
}

/**
 * Brush-stroke hover — wash covers canvas, strokes draw on, metadata fades in above.
 */
export function paintingSvgBrushEnter(
  root: HTMLElement,
  profile: BrushStrokeProfile = 'masonry',
): gsap.core.Timeline {
  if (isReducedMotion()) {
    brushRevealInstant(root);
    return gsap.timeline();
  }

  const { rest, hover } = strokeWidths(profile);
  const strokeOpacity = getBrushProfileConfig(profile).strokeOpacity;
  const tl = gsap.timeline();
  const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-brush-svg] path'));

  const wash = root.querySelector('[data-brush-wash]');
  if (wash) {
    tl.to(wash, { opacity: 1, duration: 0.52, ease: 'sine.out' }, 0);
  }

  paths.forEach((path, index) => {
    const len = path.getTotalLength();
    const start = 0.1 + index * 0.15;
    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len,
      opacity: 0,
      attr: { 'stroke-width': rest * 0.85 },
    });
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        opacity: strokeOpacity,
        attr: { 'stroke-width': hover },
        duration: profile === 'masonry' ? 1.22 : 1.35,
        ease: 'sine.inOut',
      },
      start,
    );
  });

  const overlay = root.querySelector('[data-brush-overlay]');
  if (overlay) {
    tl.fromTo(
      overlay,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.62, ease: 'sine.out' },
      0.55,
    );
  }

  return tl;
}

export function paintingSvgBrushLeave(
  root: HTMLElement,
  profile: BrushStrokeProfile = 'masonry',
): void {
  if (isReducedMotion()) {
    brushRevealInstantLeave(root);
    return;
  }

  const { rest } = strokeWidths(profile);
  const paths = root.querySelectorAll<SVGPathElement>('[data-brush-svg] path');

  const wash = root.querySelector('[data-brush-wash]');
  if (wash) {
    gsap.to(wash, { opacity: 0, duration: 0.72, ease: 'sine.inOut', overwrite: 'auto' });
  }

  paths.forEach((path, index) => {
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: len,
      opacity: 0,
      attr: { 'stroke-width': rest * 0.85 },
      duration: 1.05,
      ease: 'sine.inOut',
      delay: index * 0.07,
      overwrite: 'auto',
    });
  });

  const overlay = root.querySelector('[data-brush-overlay]');
  if (overlay) fadeOutOverlay(overlay);
}

/** @deprecated Use initBrushRevealPaths — kept for hero section compatibility */
export function initHeroSvgStrokePathsLegacy(root: HTMLElement | null, strokeScale = 1): void {
  initBrushRevealPaths(root, strokeScale < 1 ? 'heroCard' : 'masonry');
}
