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

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type ScrollDocumentOptions = {
  /** Jump instantly — default for route changes and when reduced motion is on. */
  immediate?: boolean;
};

/** Scroll the document to top — uses Lenis when smooth scroll is active. */
export function scrollDocumentToTop(options: ScrollDocumentOptions = {}): void {
  if (typeof window === 'undefined') return;

  const immediate = options.immediate ?? prefersReducedMotion();
  const lenis = lenisInstance;

  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: immediate ? 'auto' : 'smooth',
  });
}

/** Routes that use a nested scroll container instead of the document. */
export function shouldSkipDocumentScrollRestoration(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/three-d' || pathname.startsWith('/three-d/')) return true;
  if (pathname.startsWith('/presentations/') && pathname !== '/presentations') return true;
  return false;
}

/** Register dynamically rendered [data-scroll] nodes with Locomotive Scroll */
export function registerScrollElements(container: HTMLElement) {
  const loco = locomotiveInstance;
  if (!loco) return;
  loco.addScrollElements(container);
  loco.resize();
}
