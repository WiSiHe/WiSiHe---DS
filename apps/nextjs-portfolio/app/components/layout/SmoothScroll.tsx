'use client';

/**
 * Locomotive Scroll v5 + GSAP ScrollTrigger sync.
 * Initializes Locomotive Scroll (built on Lenis) on the client side
 * and registers it globally for scroll-linked components.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { setGlobalLenis } from '@/app/lib/lenis-registry';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    let locomotiveScroll: any;

    // Dynamically import to prevent SSR reference errors
    import('locomotive-scroll').then(module => {
      const LocomotiveScroll = module.default;
      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.1,
          duration: 0.8,
          smoothWheel: true,
          wheelMultiplier: 1.1,
          touchMultiplier: 1.5,
          infinite: false,
        },
      });

      // Synchronize GSAP ScrollTrigger with Locomotive Scroll's scroll events
      locomotiveScroll.on('scroll', () => {
        ScrollTrigger.update();
      });

      // Register the underlying Lenis instance globally
      if (locomotiveScroll.lenisInstance) {
        setGlobalLenis(locomotiveScroll.lenisInstance);
      }
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
      setGlobalLenis(null);
    };
  }, []);

  return null;
}
