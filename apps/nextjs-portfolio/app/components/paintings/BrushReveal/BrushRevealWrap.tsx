'use client';

import { cn } from '@wisihe/utils';
import { type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

import {
  brushRevealInstant,
  brushRevealInstantLeave,
  initBrushRevealPaths,
  paintingSvgBrushEnter,
  paintingSvgBrushLeave,
} from '@/app/components/marketing/HeroSection/paintingSvgBrushHover';
import { prefersFinePointerHover, prefersReducedMotion } from '@/lib/paintings/mediaCapabilities';

type BrushRevealWrapProps = {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
};

/**
 * Drives GSAP brush reveal on painting cards (desktop fine pointer only).
 */
export function BrushRevealWrap({ children, className, enabled = true }: BrushRevealWrapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<globalThis.gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!enabled) return;
    initBrushRevealPaths(rootRef.current);
  }, [enabled]);

  const runEnter = useCallback(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    tlRef.current?.kill();
    if (prefersReducedMotion()) {
      brushRevealInstant(root);
      return;
    }
    tlRef.current = paintingSvgBrushEnter(root);
  }, [enabled]);

  const runLeave = useCallback(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    tlRef.current?.kill();
    tlRef.current = null;
    if (prefersReducedMotion()) {
      brushRevealInstantLeave(root);
      return;
    }
    paintingSvgBrushLeave(root);
  }, [enabled]);

  const onPointerEnter = () => {
    if (!prefersFinePointerHover()) return;
    runEnter();
  };

  const onPointerLeave = () => {
    if (!prefersFinePointerHover()) return;
    runLeave();
  };

  if (!enabled) {
    return <div className={cn('h-full w-full', className)}>{children}</div>;
  }

  return (
    <div
      ref={rootRef}
      className={cn('h-full w-full', className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
