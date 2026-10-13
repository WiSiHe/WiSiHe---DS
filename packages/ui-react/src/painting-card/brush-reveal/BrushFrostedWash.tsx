'use client';

import { motion, type Transition } from 'motion/react';
import type { CSSProperties } from 'react';

type BrushPaletteWashProps = {
  washColor: string;
  washOpacity: number;
  isActive: boolean;
  transition: Transition;
  blendMode?: CSSProperties['mixBlendMode'];
};

/** Semi-transparent palette wash — fades in with the artwork blur. */
export function BrushPaletteWash({
  washColor,
  washOpacity,
  isActive,
  transition,
  blendMode,
}: BrushPaletteWashProps) {
  return (
    <motion.div
      data-brush-wash
      className='pointer-events-none absolute inset-0 z-[6]'
      style={
        {
          backgroundColor: washColor,
          '--brush-wash': washColor,
          ...(blendMode ? { mixBlendMode: blendMode } : {}),
        } as CSSProperties
      }
      aria-hidden
      initial={false}
      animate={{ opacity: isActive ? washOpacity : 0 }}
      transition={transition}
    />
  );
}
