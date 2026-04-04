'use client';

import { type ReactNode, useLayoutEffect, useRef } from 'react';

import { initHeroSvgStrokePaths } from '@/app/components/HeroSection/HeroPaintingSvgHover';
import {
  paintingSvgBrushEnter,
  paintingSvgBrushLeave,
} from '@/app/components/HeroSection/paintingSvgBrushHover';

type PaintingCardSvgHoverWrapProps = {
  children: ReactNode;
};

/**
 * Wraps a {@link PaintingCard} that includes {@link HeroPaintingSvgHover} on the image so brush
 * strokes + title animate on hover (same GSAP behavior as the home hero).
 */
export function PaintingCardSvgHoverWrap({ children }: PaintingCardSvgHoverWrapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<globalThis.gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    initHeroSvgStrokePaths(rootRef.current);
  }, []);

  const onEnter = () => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    tlRef.current?.kill();
    tlRef.current = paintingSvgBrushEnter(root);
  };

  const onLeave = () => {
    const root = rootRef.current;
    if (!root) return;
    tlRef.current?.kill();
    tlRef.current = null;
    paintingSvgBrushLeave(root);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Hover-only wrapper for GSAP brush animation; not a separate control.
    <div ref={rootRef} className='h-full w-full' onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
