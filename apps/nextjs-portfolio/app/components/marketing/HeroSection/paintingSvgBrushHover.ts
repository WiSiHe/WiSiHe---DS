import gsap from 'gsap';

import {
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './HeroPaintingSvgHover';

/** Card grids use paint-like strokes scaled for card frames. */
export const CARD_BRUSH_STROKE_SCALE = 0.4;

function strokeWidths(strokeScale: number) {
  if (strokeScale < 1) {
    return { rest: 72, hover: 112 };
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

function isNsfwBlurredRoot(root: HTMLElement): boolean {
  return root.querySelector('[data-nsfw-blur]') !== null;
}

function isReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Prepare paths + wash for dash-offset animation. */
export function initBrushRevealPaths(root: HTMLElement | null, strokeScale = 1): void {
  if (!root) return;
  const { rest } = strokeWidths(strokeScale);
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
    gsap.set(wash, { opacity: 0.45 });
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
 * Brush-stroke hover — wash dims canvas, thick strokes draw on, metadata fades in above.
 */
export function paintingSvgBrushEnter(root: HTMLElement, strokeScale = 1): gsap.core.Timeline {
  if (isReducedMotion()) {
    brushRevealInstant(root);
    return gsap.timeline();
  }

  const { rest, hover } = strokeWidths(strokeScale);
  const nsfwBlurred = isNsfwBlurredRoot(root);
  const strokeOpacity = nsfwBlurred ? 0.96 : 0.9;
  const tl = gsap.timeline();
  const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-brush-svg] path'));

  const wash = root.querySelector('[data-brush-wash]');
  if (wash) {
    tl.to(wash, { opacity: 0.48, duration: 0.28, ease: 'power1.out' }, 0);
  }

  paths.forEach((path, index) => {
    const len = path.getTotalLength();
    const start = index * 0.14;
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
        duration: 1.05,
        ease: 'power1.inOut',
      },
      start,
    );
  });

  const overlay = root.querySelector('[data-brush-overlay]');
  if (overlay) {
    tl.fromTo(
      overlay,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      0.4,
    );
  }

  return tl;
}

export function paintingSvgBrushLeave(root: HTMLElement, strokeScale = 1): void {
  if (isReducedMotion()) {
    brushRevealInstantLeave(root);
    return;
  }

  const { rest } = strokeWidths(strokeScale);
  const paths = root.querySelectorAll<SVGPathElement>('[data-brush-svg] path');

  const wash = root.querySelector('[data-brush-wash]');
  if (wash) {
    gsap.to(wash, { opacity: 0, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
  }

  paths.forEach((path, index) => {
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: len,
      opacity: 0,
      attr: { 'stroke-width': rest * 0.85 },
      duration: 0.8,
      ease: 'power2.inOut',
      delay: index * 0.05,
      overwrite: 'auto',
    });
  });

  const overlay = root.querySelector('[data-brush-overlay]');
  if (overlay) fadeOutOverlay(overlay);
}

/** @deprecated Use initBrushRevealPaths — kept for hero section compatibility */
export function initHeroSvgStrokePathsLegacy(root: HTMLElement | null, strokeScale = 1): void {
  initBrushRevealPaths(root, strokeScale);
}
