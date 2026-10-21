'use client';

import { AnimatePresence, motion } from 'motion/react';

type PaintingFrameGlowProps = {
  /** Tiny blurred preview of the active painting (data URI). */
  lqip?: string | null;
};

/** Blurred, saturated copy of the painting bleeding just past the frame edges. */
export function PaintingFrameGlow({ lqip }: PaintingFrameGlowProps) {
  return (
    <AnimatePresence initial={false}>
      {lqip ? (
        <motion.div
          key={lqip}
          aria-hidden
          className='pointer-events-none absolute -inset-3 z-0 rounded-3xl md:-inset-6'
          style={{
            backgroundImage: `url("${lqip}")`,
            backgroundSize: '100% 100%',
            filter: 'blur(28px) saturate(1.5)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
    </AnimatePresence>
  );
}
