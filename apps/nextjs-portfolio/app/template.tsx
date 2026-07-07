'use client';

/**
 * template.tsx re-mounts on every navigation (unlike layout.tsx which persists).
 * Detail routes skip the fade so shared layout morphs (list → hero) aren't interrupted.
 */

import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { SHARED_LAYOUT_DETAIL_ROUTE } from '@/lib/motion/sharedLayout';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isSharedLayoutDetail = SHARED_LAYOUT_DETAIL_ROUTE.test(pathname ?? '');

  if (reduceMotion || isSharedLayoutDetail) {
    return <>{children}</>;
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
