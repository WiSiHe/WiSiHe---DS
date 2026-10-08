'use client';

/**
 * Locomotive Scroll v5 + GSAP ScrollTrigger sync.
 * @see https://scroll.locomotive.ca/docs/documentation/options
 */

import { useLocation } from '@tanstack/react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { isPaintingsRoute, setGlobalLenis, setGlobalLocomotive } from '@/lib/lenis-registry';
import { bindScrollTriggerToLenis } from '@/lib/scrollTriggerLenis';

gsap.registerPlugin(ScrollTrigger);

const LISTING_PATHS = new Set(['/projects', '/photography', '/videos']);

function shouldDisableSmoothScroll(pathname: string | null): boolean {
  if (!pathname) return false;
  if (isPaintingsRoute(pathname)) return true;
  if (pathname === '/three-d' || pathname.startsWith('/three-d/')) return true;
  if (pathname.startsWith('/presentations/') && pathname !== '/presentations') return true;
  return false;
}

function shouldDeferSmoothScroll(pathname: string | null): boolean {
  return pathname !== null && LISTING_PATHS.has(pathname);
}

export default function SmoothScroll() {
  const { pathname } = useLocation();
  const disabled = shouldDisableSmoothScroll(pathname);
  const deferInit = shouldDeferSmoothScroll(pathname);

  useEffect(() => {
    if (disabled) {
      setGlobalLenis(null);
      setGlobalLocomotive(null);
      return;
    }

    let locomotiveScroll: import('locomotive-scroll').default | undefined;
    let unbindScrollTrigger: (() => void) | undefined;
    let cancelled = false;
    let idleCallbackId: number | undefined;
    let timeoutId: number | undefined;

    const initSmoothScroll = () => {
      if (cancelled) return;

      import('locomotive-scroll').then(({ default: LocomotiveScroll }) => {
        if (cancelled) return;

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

        // locomotive-scroll bundles its own lenis copy; the registry uses the app's lenis types.
        const lenis = locomotiveScroll.lenisInstance as unknown as Parameters<
          typeof setGlobalLenis
        >[0];
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
    };

    if (deferInit) {
      if (typeof window.requestIdleCallback === 'function') {
        idleCallbackId = window.requestIdleCallback(() => initSmoothScroll(), { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(initSmoothScroll, 1500);
      }
    } else {
      initSmoothScroll();
    }

    return () => {
      cancelled = true;
      if (idleCallbackId !== undefined) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      unbindScrollTrigger?.();
      locomotiveScroll?.destroy();
      setGlobalLenis(null);
      setGlobalLocomotive(null);
    };
  }, [disabled, deferInit]);

  return null;
}
