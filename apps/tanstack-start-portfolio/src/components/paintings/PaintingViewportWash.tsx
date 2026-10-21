'use client';

import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';
import {
  PAINTING_VIEWPORT_GRAIN_OPACITY,
  paintingGrainOverlayStyle,
  paintingViewportWashStyle,
  type SanityPalette,
} from '@/lib/paintings/paintingPaletteGlow';

const viewportWashTransition = { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const };

type PaintingViewportWashProps = {
  palette?: SanityPalette | null;
  dark: boolean;
  slideKey: number;
  layout: 'mobile' | 'desktop';
};

export function PaintingViewportWash({
  palette,
  dark,
  slideKey,
  layout,
}: PaintingViewportWashProps) {
  const washStyle = useMemo(
    () => paintingViewportWashStyle(palette, { dark, layout }),
    [palette, dark, layout],
  );
  const grainStyle = useMemo(() => paintingGrainOverlayStyle(), []);
  const layoutClassName = cn(
    'pointer-events-none z-0',
    layout === 'mobile'
      ? 'absolute inset-x-0 top-0 h-svh w-full lg:hidden'
      : 'fixed inset-0 hidden lg:block',
  );

  return (
    <>
      <AnimatePresence mode='sync'>
        <motion.div
          key={slideKey}
          aria-hidden
          className={layoutClassName}
          style={washStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={viewportWashTransition}
        />
      </AnimatePresence>
      <motion.div
        aria-hidden
        className={cn(layoutClassName, 'mix-blend-soft-light')}
        style={grainStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: PAINTING_VIEWPORT_GRAIN_OPACITY }}
        transition={viewportWashTransition}
      />
    </>
  );
}
