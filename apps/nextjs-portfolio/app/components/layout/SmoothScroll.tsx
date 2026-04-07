'use client';

/**
 * GSAP ScrollTrigger sync.
 * Lenis has been removed — native scroll events drive ScrollTrigger directly.
 * When lenis is available again (package installed), re-introduce it here and
 * call setGlobalLenis(instance) so scroll-linked components can subscribe.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const onScroll = () => ScrollTrigger.update();
    window.addEventListener('scroll', onScroll, { passive: true });
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
