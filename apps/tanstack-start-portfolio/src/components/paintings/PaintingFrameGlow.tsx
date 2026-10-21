'use client';

import { AnimatePresence, motion } from 'motion/react';

type PaintingFrameGlowProps = {
  /** Small, low-quality copy of the active painting. */
  glowUrl?: string | null;
  /** Tiny inline placeholder shown until `glowUrl` has loaded. */
  lqip?: string | null;
};

const fade = 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 25%, transparent 100%)';

/**
 * Album-page style backdrop: a large, soft, saturated blur of the painting centred on it. It is positioned
 * relative to the painting (not the viewport), so it scrolls away with it.
 */
export function PaintingFrameGlow({ glowUrl, lqip }: PaintingFrameGlowProps) {
  const src = glowUrl ?? lqip;
  const backgroundImage = [glowUrl, lqip]
    .filter((value): value is string => Boolean(value))
    .map(value => `url("${value}")`)
    .join(', ');

  return (
    <AnimatePresence initial={false}>
      {src ? (
        <motion.div
          key={src}
          aria-hidden
          className='pointer-events-none absolute left-1/2 top-1/2 z-0 h-svh w-screen -translate-x-1/2 -translate-y-1/2'
          style={{
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(48px) saturate(1.6)',
            maskImage: fade,
            WebkitMaskImage: fade,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
    </AnimatePresence>
  );
}
