'use client';

import { useEffect, useState } from 'react';
import { getDocumentScrollTop, getGlobalLenis } from '@/app/lib/lenis-registry';

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(getDocumentScrollTop());
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, { passive: true });

    let detachLenis: (() => void) | undefined;
    let attachRaf = 0;

    const attachLenis = () => {
      const lenis = getGlobalLenis();
      if (!lenis) return false;

      lenis.on('scroll', updatePosition);
      detachLenis = () => lenis.off('scroll', updatePosition);
      updatePosition();
      return true;
    };

    if (!attachLenis()) {
      const deadline = Date.now() + 2000;
      const tryAttach = () => {
        if (attachLenis() || Date.now() > deadline) return;
        attachRaf = requestAnimationFrame(tryAttach);
      };
      attachRaf = requestAnimationFrame(tryAttach);
    }

    return () => {
      cancelAnimationFrame(attachRaf);
      window.removeEventListener('scroll', updatePosition);
      detachLenis?.();
    };
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
