'use client';

/**
 * Scroll-stack cards (React Bits–style). The outer `.scroll-stack-card` is layout-only (no min-height
 * / visuals). Sizing, radius, shadow, and transforms live on `.scroll-stack-card-surface` so the whole
 * card moves as one unit - otherwise the stack animates inside a tall empty frame.
 * Document scroll uses global Lenis (`@/app/lib/lenis-registry`).
 */

import clsx from 'clsx';
import gsap from 'gsap';
import { type CSSProperties, type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

import { getDocumentScrollTop, getGlobalLenis } from '@/app/lib/lenis-registry';

export type ScrollStackItemProps = {
  children: ReactNode;
  /** Applied to an inner wrapper; the transformed surface keeps a stable class string for hydration. */
  itemClassName?: string;
};

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
  <div className='scroll-stack-card relative box-border w-full'>
    <div
      className='scroll-stack-card-surface box-border w-full'
      style={{
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        willChange: 'transform, filter',
        transformOrigin: 'top center',
        perspective: '1000px',
        // Same as useLayoutEffect on `.scroll-stack-card-surface` so SSR markup matches first client paint
        transform: 'translateZ(0)',
      }}
    >
      <div className={clsx(itemClassName)}>{children}</div>
    </div>
  </div>
);

export type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  useLenis?: boolean;
  onStackComplete?: () => void;
  onActiveIndexChange?: (index: number) => void;
};

/** Layout offset from `el` up to `ancestor` (offsetParent chain; not affected by transforms on `el`). */
function getOffsetTopToAncestor(el: HTMLElement, ancestor: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  useLenis = false,
  onStackComplete,
  onActiveIndexChange,
}: ScrollStackProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const stackCompletedRef = useRef(false);
  const lenisRef = useRef<{
    on: (event: string, cb: (...args: unknown[]) => void) => void;
    off: (event: string, cb: (...args: unknown[]) => void) => void;
    raf: (t: number) => void;
    destroy: () => void;
  } | null>(null);
  const layoutCardsRef = useRef<HTMLElement[]>([]);
  const surfaceCardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(
    new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>(),
  );
  const lastActiveIndexRef = useRef(-1);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return typeof value === 'number' ? value : parseFloat(String(value));
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: getDocumentScrollTop(),
        containerHeight: window.innerHeight,
      };
    }
    const scroller = scrollerRef.current;
    if (!scroller) {
      return {
        scrollTop: 0,
        containerHeight: window.innerHeight,
      };
    }
    return {
      scrollTop: scroller.scrollTop,
      containerHeight: scroller.clientHeight,
    };
  }, [useWindowScroll]);

  /** Document Y (window) or content Y (container) - layout boxes only; not for transformed nodes. */
  const getLayoutDocumentTop = useCallback(
    (element: HTMLElement, inner: HTMLElement, scrollTop: number): number => {
      if (useWindowScroll) {
        const innerRect = inner.getBoundingClientRect();
        const innerDocTop = innerRect.top + scrollTop;
        return innerDocTop + getOffsetTopToAncestor(element, inner);
      }
      return inner.offsetTop + getOffsetTopToAncestor(element, inner);
    },
    [useWindowScroll],
  );

  const updateCardTransforms = useCallback(() => {
    const layouts = layoutCardsRef.current;
    const surfaces = surfaceCardsRef.current;
    if (!layouts.length || layouts.length !== surfaces.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const root = scrollerRef.current;
    const inner = root?.querySelector('.scroll-stack-inner') as HTMLElement | null;
    const endElement = root?.querySelector('.scroll-stack-end') as HTMLElement | null;

    if (!inner) return;

    const endElementTop = endElement ? getLayoutDocumentTop(endElement, inner, scrollTop) : 0;

    let topCardIndex = 0;

    layouts.forEach((layoutCard, i) => {
      const card = surfaces[i];
      if (!layoutCard || !card) return;

      const cardTop = getLayoutDocumentTop(layoutCard, inner, scrollTop);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let tci = 0;
        for (let j = 0; j < layouts.length; j++) {
          const jLayout = layouts[j];
          if (!jLayout) continue;
          const jCardTop = getLayoutDocumentTop(jLayout, inner, scrollTop);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            tci = j;
          }
        }
        if (i < tci) {
          const depthInStack = tci - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      if (scrollTop >= triggerStart) {
        topCardIndex = i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.05 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.0005 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.05 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.05;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === layouts.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    if (onActiveIndexChange && lastActiveIndexRef.current !== topCardIndex) {
      lastActiveIndexRef.current = topCardIndex;
      onActiveIndexChange(topCardIndex);
    }
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    onActiveIndexChange,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getLayoutDocumentTop,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (!useLenis) return;

    // Re-use the global Lenis instance managed by SmoothScroll - avoids a second instance
    // and removes the need to import lenis directly in this file.
    if (useWindowScroll) {
      const globalLenis = getGlobalLenis();
      if (globalLenis) {
        globalLenis.on('scroll', handleScroll);
        lenisRef.current = {
          on: (event: string, cb: (...args: unknown[]) => void) => globalLenis.on(event, cb),
          off: (event: string, cb: (...args: unknown[]) => void) => globalLenis.off(event, cb),
          raf: () => {},
          destroy: () => {
            globalLenis.off('scroll', handleScroll);
          },
        };
      }
    }
  }, [handleScroll, useWindowScroll, useLenis]);

  useLayoutEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const layouts = Array.from(root.querySelectorAll<HTMLElement>('.scroll-stack-card'));
    const surfaces = Array.from(root.querySelectorAll<HTMLElement>('.scroll-stack-card-surface'));

    layoutCardsRef.current = layouts;
    surfaceCardsRef.current = surfaces;
    const transformsCache = lastTransformsRef.current;

    layouts.forEach((layoutCard, i) => {
      if (i < layouts.length - 1) {
        layoutCard.style.marginBottom = `${itemDistance}px`;
      }
    });

    surfaces.forEach(card => {
      // GPU layer; initial value also set in ScrollStackItem `style` for hydration parity
      card.style.transform = 'translateZ(0)';
    });

    if (useLenis) {
      setupLenis();
    }

    updateCardTransforms();

    const onResize = () => updateCardTransforms();

    let tickerFn: (() => void) | null = null;

    if (useWindowScroll) {
      if (!useLenis || !getGlobalLenis()) {
        /** GSAP ticker drives updates - used when Lenis is absent or unavailable */
        tickerFn = () => {
          updateCardTransforms();
        };
        gsap.ticker.add(tickerFn);
      }
      window.addEventListener('resize', onResize);
    } else {
      root.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', onResize);
    }

    return () => {
      if (tickerFn) {
        gsap.ticker.remove(tickerFn);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      layoutCardsRef.current = [];
      surfaceCardsRef.current = [];
      transformsCache.clear();
      lastActiveIndexRef.current = -1;

      if (useWindowScroll) {
        window.removeEventListener('resize', onResize);
      } else {
        root.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', onResize);
      }
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    useLenis,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    handleScroll,
  ]);

  /**
   * Do not set `transform` on this wrapper when using window scroll: it creates a containing
   * block and breaks `position: fixed` for descendants (e.g. stack counter must live outside).
   */
  const containerStyles: CSSProperties = useWindowScroll
    ? {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }
    : {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        willChange: 'scroll-position',
      };

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative h-full w-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div className={containerClassName} ref={scrollerRef} style={containerStyles}>
      <div className='scroll-stack-inner relative w-full'>
        {children}
        <div className='scroll-stack-end h-px w-full' aria-hidden />
      </div>
    </div>
  );
};

export default ScrollStack;
