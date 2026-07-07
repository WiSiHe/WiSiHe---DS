'use client';

import { motion } from 'motion/react';
import { type RefObject, useLayoutEffect, useState } from 'react';
import type { SafariPaintingMorphPayload } from '@/lib/motion/safariPaintingMorph';
import { sharedLayoutTransition } from '@/lib/motion/sharedLayout';

type SafariPaintingMorphOverlayProps = {
  payload: SafariPaintingMorphPayload;
  targetRef: RefObject<HTMLElement | null>;
  onComplete: () => void;
};

const HERO_BORDER_RADIUS = 16;

export function SafariPaintingMorphOverlay({
  payload,
  targetRef,
  onComplete,
}: SafariPaintingMorphOverlayProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const element = targetRef.current;
      if (element) setTargetRect(element.getBoundingClientRect());
    };

    measure();
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    return () => cancelAnimationFrame(frame);
  }, [targetRef]);

  if (!targetRect) return null;

  return (
    <motion.div
      aria-hidden
      className='pointer-events-none fixed z-[100] overflow-hidden bg-surface ring-1 ring-border/20'
      initial={{
        top: payload.rect.top,
        left: payload.rect.left,
        width: payload.rect.width,
        height: payload.rect.height,
        borderRadius: payload.borderRadius,
      }}
      animate={{
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: HERO_BORDER_RADIUS,
      }}
      transition={sharedLayoutTransition.layout}
      onAnimationComplete={onComplete}
    >
      {/* Sharp card crop — no LQIP blur during the morph */}
      {/* biome-ignore lint/performance/noImgElement: native img avoids Next Image blur pipeline during fixed-position morph */}
      <img src={payload.imageSrc} alt='' className='h-full w-full object-cover' decoding='sync' />
    </motion.div>
  );
}
