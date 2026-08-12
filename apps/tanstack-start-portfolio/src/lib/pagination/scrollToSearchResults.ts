import { getGlobalLenis } from '@/lib/lenis-registry';

const HEADER_OFFSET_PX = 120;

function prefersReducedMotion(): boolean {
  if (typeof globalThis.window === 'undefined') return false;
  return globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resolveResultsAnchor(targetId?: string): HTMLElement | null {
  if (!targetId) return null;
  return document.getElementById(`${targetId}-top`) ?? document.getElementById(targetId);
}

/** Scroll listing results into view after pagination. Uses Lenis only when it is active. */
export function scrollToSearchResults(targetId?: string) {
  if (typeof globalThis.window === 'undefined') return;

  const target = resolveResultsAnchor(targetId);
  if (!target) return;

  const reducedMotion = prefersReducedMotion();
  const lenis = getGlobalLenis();

  if (lenis) {
    lenis.scrollTo(target, {
      offset: -HEADER_OFFSET_PX,
      immediate: reducedMotion,
      duration: reducedMotion ? 0 : 0.85,
    });
    return;
  }

  target.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}
