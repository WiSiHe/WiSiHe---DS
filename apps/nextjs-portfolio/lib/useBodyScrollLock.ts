'use client';

import { useEffect } from 'react';
import { getGlobalLenis } from '@/app/lib/lenis-registry';

type ScrollControllableLenis = {
  stop?: () => void;
  start?: () => void;
};

/** Lock page scroll while overlays are open without breaking nested modal scroll. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const lenis = getGlobalLenis() as ScrollControllableLenis | null;
    lenis?.stop?.();

    const { style: htmlStyle } = document.documentElement;
    const { style: bodyStyle } = document.body;
    const scrollbarWidth = globalThis.window.innerWidth - document.documentElement.clientWidth;

    const previous = {
      htmlOverflow: htmlStyle.overflow,
      bodyOverflow: bodyStyle.overflow,
      bodyPaddingRight: bodyStyle.paddingRight,
    };

    htmlStyle.overflow = 'hidden';
    bodyStyle.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      htmlStyle.overflow = previous.htmlOverflow;
      bodyStyle.overflow = previous.bodyOverflow;
      bodyStyle.paddingRight = previous.bodyPaddingRight;

      lenis?.start?.();
    };
  }, [active]);
}
