import gsap from 'gsap';

import {
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './HeroPaintingSvgHover';

/**
 * Brush-stroke hover (paths + title) — same motion as the hero floating images, without hero-only scale/z-index.
 */
export function paintingSvgBrushEnter(root: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        attr: { 'stroke-width': HERO_BRUSH_STROKE_WIDTH_HOVER },
        duration: 1.5,
        ease: 'power2.out',
      },
      0,
    );
  });
  const titleEl = root.querySelector('[data-hero-title]');
  if (titleEl) {
    tl.fromTo(
      titleEl,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      0.25,
    );
  }
  return tl;
}

export function paintingSvgBrushLeave(root: HTMLElement): void {
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: len,
      attr: { 'stroke-width': HERO_BRUSH_STROKE_WIDTH_REST },
      duration: 1,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });
  const titleEl = root.querySelector('[data-hero-title]');
  if (titleEl) {
    gsap.to(titleEl, {
      opacity: 0,
      y: 6,
      duration: 0.35,
      ease: 'power2.in',
      overwrite: 'auto',
    });
  }
}
