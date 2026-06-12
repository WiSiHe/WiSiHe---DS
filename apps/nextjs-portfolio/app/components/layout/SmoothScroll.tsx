'use client';

/**
 * Locomotive Scroll v5 + GSAP ScrollTrigger sync.
 * @see https://scroll.locomotive.ca/docs/documentation/options
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { setGlobalLenis, setGlobalLocomotive } from '@/app/lib/lenis-registry';
import { bindScrollTriggerToLenis } from '@/app/lib/scrollTriggerLenis';

gsap.registerPlugin(ScrollTrigger);

function shouldDisableSmoothScroll(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/three-d' || pathname.startsWith('/three-d/')) return true;
  if (pathname.startsWith('/presentations/') && pathname !== '/presentations') return true;
  return false;
}

export default function SmoothScroll() {
  const pathname = usePathname();
  const disabled = shouldDisableSmoothScroll(pathname);

  useEffect(() => {
    if (disabled) {
      setGlobalLenis(null);
      setGlobalLocomotive(null);
      return;
    }

    let locomotiveScroll: import('locomotive-scroll').default | undefined;
    let unbindScrollTrigger: (() => void) | undefined;

    import('locomotive-scroll').then(({ default: LocomotiveScroll }) => {
      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.1,
          duration: 0.8,
          smoothWheel: true,
          wheelMultiplier: 1.1,
          touchMultiplier: 1.5,
        },
        scrollCallback: () => {
          ScrollTrigger.update();
        },
        initCustomTicker: render => {
          gsap.ticker.add(render);
        },
        destroyCustomTicker: render => {
          gsap.ticker.remove(render);
        },
      });

      const lenis = locomotiveScroll.lenisInstance;
      if (lenis) {
        setGlobalLenis(lenis);
        unbindScrollTrigger = bindScrollTriggerToLenis(lenis);
      }
      setGlobalLocomotive(locomotiveScroll);

      gsap.ticker.lagSmoothing(0);

      requestAnimationFrame(() => {
        locomotiveScroll?.resize();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      unbindScrollTrigger?.();
      locomotiveScroll?.destroy();
      setGlobalLenis(null);
      setGlobalLocomotive(null);
    };
  }, [disabled]);

  return null;
}
