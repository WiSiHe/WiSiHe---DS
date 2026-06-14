import gsap from 'gsap';

import {
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './HeroPaintingSvgHover';

export const CARD_BRUSH_STROKE_SCALE = 0.4;

function strokeWidths(strokeScale: number) {
  return {
    rest: HERO_BRUSH_STROKE_WIDTH_REST * strokeScale,
    hover: HERO_BRUSH_STROKE_WIDTH_HOVER * strokeScale,
  };
}

function fadeOutOverlay(el: Element) {
  gsap.to(el, {
    opacity: 0,
    y: 6,
    duration: 0.35,
    ease: 'power2.in',
    overwrite: 'auto',
  });
}

/**
 * Brush-stroke hover (paths + title) — same motion as the hero floating images, without hero-only scale/z-index.
 */
export function paintingSvgBrushEnter(root: HTMLElement, strokeScale = 1): gsap.core.Timeline {
  const { rest, hover } = strokeWidths(strokeScale);
  const tl = gsap.timeline();
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, attr: { 'stroke-width': rest } });
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        opacity: 1,
        attr: { 'stroke-width': hover },
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
  const tagsEl = root.querySelector('[data-hero-tags]');
  if (tagsEl) {
    tl.fromTo(
      tagsEl,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
      0.2,
    );
  }
  return tl;
}

export function paintingSvgBrushLeave(root: HTMLElement, strokeScale = 1): void {
  const { rest } = strokeWidths(strokeScale);
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: len,
      opacity: 0,
      attr: { 'stroke-width': rest },
      duration: 1,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });
  const titleEl = root.querySelector('[data-hero-title]');
  if (titleEl) fadeOutOverlay(titleEl);
  const tagsEl = root.querySelector('[data-hero-tags]');
  if (tagsEl) fadeOutOverlay(tagsEl);
}
