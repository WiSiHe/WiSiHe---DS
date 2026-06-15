import gsap from 'gsap';

import {
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './HeroPaintingSvgHover';

/** Card grids use thinner, paint-like strokes (not hero-scale neon tubes). */
export const CARD_BRUSH_STROKE_SCALE = 0.4;

function strokeWidths(strokeScale: number) {
  if (strokeScale < 1) {
    // ~30–46px at card size — reads as paint, not outline glow
    const cardRest = 30;
    const cardHover = 46;
    return { rest: cardRest, hover: cardHover };
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

/**
 * Brush-stroke hover — strokes draw like paint being laid on the canvas; metadata fades in above.
 */
export function paintingSvgBrushEnter(root: HTMLElement, strokeScale = 1): gsap.core.Timeline {
  const { rest, hover } = strokeWidths(strokeScale);
  const tl = gsap.timeline();
  const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-hero-svg] path'));

  const vignette = root.querySelector('[data-hero-vignette]');
  if (vignette) {
    tl.to(vignette, { opacity: 0.55, duration: 0.35, ease: 'power1.out' }, 0);
  }

  paths.forEach((path, index) => {
    const len = path.getTotalLength();
    const start = index * 0.22;
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
        opacity: 0.92,
        attr: { 'stroke-width': hover },
        duration: 1.15,
        ease: 'power1.inOut',
      },
      start,
    );
  });

  const overlay = root.querySelector('[data-hero-overlay]');
  if (overlay) {
    tl.fromTo(
      overlay,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      0.45,
    );
  }

  return tl;
}

export function paintingSvgBrushLeave(root: HTMLElement, strokeScale = 1): void {
  const { rest } = strokeWidths(strokeScale);
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');

  const vignette = root.querySelector('[data-hero-vignette]');
  if (vignette) {
    gsap.to(vignette, { opacity: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
  }

  paths.forEach((path, index) => {
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: len,
      opacity: 0,
      attr: { 'stroke-width': rest * 0.85 },
      duration: 0.85,
      ease: 'power2.inOut',
      delay: index * 0.06,
      overwrite: 'auto',
    });
  });

  const overlay = root.querySelector('[data-hero-overlay]');
  if (overlay) fadeOutOverlay(overlay);
}
