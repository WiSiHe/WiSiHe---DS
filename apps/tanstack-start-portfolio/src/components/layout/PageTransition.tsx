'use client';

/**
 * Matches Next.js `app/template.tsx`: remount on navigation with enter-only fade+y.
 * Detail routes skip the fade so shared layout morphs (list → hero) aren't interrupted.
 */

import { useRouterState } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect } from 'react';
import { SHARED_LAYOUT_DETAIL_ROUTE } from '@/lib/motion/sharedLayout';

const PAGE_ENTER_TRANSITION = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

/**
 * False during SSR and the first client render. The server HTML is already the final page, so the first
 * load must not start from `opacity: 0` (that hides all content until React hydrates, which on phones
 * delays first paint by seconds). Client-side navigations afterwards still fade/slide in.
 */
let hasHydrated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const reduceMotion = useReducedMotion();
  const isSharedLayoutDetail = SHARED_LAYOUT_DETAIL_ROUTE.test(pathname);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  if (reduceMotion || isSharedLayoutDetail) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={hasHydrated ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={PAGE_ENTER_TRANSITION}
    >
      {children}
    </motion.div>
  );
}
