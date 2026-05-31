'use client';

/**
 * template.tsx re-mounts on every navigation (unlike layout.tsx which persists).
 * This gives Framer Motion's AnimatePresence a real mount/unmount cycle to animate.
 *
 * Transition: subtle fade + upward drift — fast enough not to feel sluggish,
 * slow enough to feel polished.
 */

import { motion } from 'motion/react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier — snappy but smooth
      }}
    >
      {children}
    </motion.div>
  );
}
