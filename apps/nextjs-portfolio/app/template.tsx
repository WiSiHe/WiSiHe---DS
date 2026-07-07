'use client';

/**
 * template.tsx re-mounts on every navigation (unlike layout.tsx which persists).
 * Shared-layout detail routes skip fade so list → hero morphs aren't interrupted.
 * List routes keep enter fade only — exit is instant when leaving (no exit prop).
 */

import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { SHARED_LAYOUT_DETAIL_ROUTE, SHARED_LAYOUT_LIST_ROUTE } from '@/lib/motion/sharedLayout';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isSharedLayoutDetail = SHARED_LAYOUT_DETAIL_ROUTE.test(pathname ?? '');
  const isSharedLayoutList = SHARED_LAYOUT_LIST_ROUTE.test(pathname ?? '');

  if (reduceMotion || isSharedLayoutDetail) {
    return <>{children}</>;
  }

  if (isSharedLayoutList) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
