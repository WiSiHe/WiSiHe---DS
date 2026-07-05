'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { resolveBrushProfile } from '../brush-stroke/brushStrokeConstants';
import { useBrushReveal } from './BrushRevealContext';
import { brushImageBlurTransition, brushImageFadeTransition } from './brushRevealMotion';

type BrushRevealImageBlurProps = {
  children: ReactNode;
  className?: string;
  /** Skip hover blur (e.g. NSFW thumbnails already blurred). */
  disabled?: boolean;
};

/**
 * Blurs or fades the artwork on brush reveal — synced with palette wash timing.
 * Must render inside `BrushRevealWrap`.
 */
export function BrushRevealImageBlur({
  children,
  className,
  disabled = false,
}: BrushRevealImageBlurProps) {
  const { isActive, reduceMotion, profile, liteMode } = useBrushReveal();
  const { imageBlurPx, solidFill } = resolveBrushProfile(profile, liteMode);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  if (solidFill) {
    return (
      <motion.div
        className={cn('h-full w-full will-change-[opacity]', className)}
        initial={false}
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={brushImageFadeTransition(isActive, reduceMotion)}
      >
        {children}
      </motion.div>
    );
  }

  if (imageBlurPx <= 0 || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('h-full w-full will-change-[filter]', className)}
      initial={false}
      animate={{
        filter: isActive ? `blur(${imageBlurPx}px) saturate(0.88)` : 'blur(0px) saturate(1)',
      }}
      transition={brushImageBlurTransition(isActive, false, false)}
    >
      {children}
    </motion.div>
  );
}
