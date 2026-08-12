import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

let activeLenis: Lenis | null = null;

/** Wire GSAP ScrollTrigger to Lenis (Locomotive Scroll) so triggers match smooth scroll. */
export function bindScrollTriggerToLenis(lenis: Lenis) {
  activeLenis = lenis;

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (typeof value === 'number') {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  ScrollTrigger.refresh();

  return () => {
    lenis.off('scroll', onScroll);
    ScrollTrigger.scrollerProxy(document.documentElement);
    if (activeLenis === lenis) {
      activeLenis = null;
    }
  };
}
