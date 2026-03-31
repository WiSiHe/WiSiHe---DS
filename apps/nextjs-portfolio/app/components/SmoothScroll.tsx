'use client';

/**
 * Lenis smooth scroll + GSAP ScrollTrigger sync.
 * Lenis is loaded dynamically so SSR / Turbopack never evaluate browser-only code at import time.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    let cleanup: (() => void) | undefined;

    void (async () => {
      try {
        const { default: Lenis } = await import('lenis');

        if (cancelledRef.current) return;

        const lenis = new Lenis({
          smoothWheel: true,
          /** Default ~0.1 — slightly softer than stock without feeling “heavy” */
          lerp: 0.085,
        });

        lenis.on('scroll', () => {
          ScrollTrigger.update();
        });

        const onTick = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        if (cancelledRef.current) {
          gsap.ticker.remove(onTick);
          lenis.destroy();
          return;
        }

        cleanup = () => {
          gsap.ticker.remove(onTick);
          lenis.destroy();
        };
      } catch (e) {
        console.error('[SmoothScroll] Failed to init Lenis:', e);
      }
    })();

    return () => {
      cancelledRef.current = true;
      cleanup?.();
    };
  }, []);

  return null;
}
