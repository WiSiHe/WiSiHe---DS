/**
 * Locomotive Scroll v5 (Lenis) — shared instance for scroll-linked UI and smooth scrollTo.
 */

import type Lenis from 'lenis';
import type LocomotiveScroll from 'locomotive-scroll';

let lenisInstance: Lenis | null = null;
let locomotiveInstance: LocomotiveScroll | null = null;

export function setGlobalLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getGlobalLenis(): Lenis | null {
  return lenisInstance;
}

export function setGlobalLocomotive(instance: LocomotiveScroll | null) {
  locomotiveInstance = instance;
}

export function getGlobalLocomotive(): LocomotiveScroll | null {
  return locomotiveInstance;
}

/** Document scroll position — prefer Lenis when the app uses smooth scroll */
export function getDocumentScrollTop(): number {
  if (typeof window === 'undefined') return 0;
  const lenis = lenisInstance;
  if (lenis && typeof lenis.scroll === 'number') {
    return lenis.scroll;
  }
  return window.scrollY;
}

/** Register dynamically rendered [data-scroll] nodes with Locomotive Scroll */
export function registerScrollElements(container: HTMLElement) {
  const loco = locomotiveInstance;
  if (!loco) return;
  loco.addScrollElements(container);
  loco.resize();
}
