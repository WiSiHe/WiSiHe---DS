'use client';

import { cn } from '@wisihe/utils';
import { type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

import { initHeroSvgStrokePaths } from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';
import {
  CARD_BRUSH_STROKE_SCALE,
  paintingSvgBrushEnter,
  paintingSvgBrushLeave,
} from '@/app/components/marketing/HeroSection/paintingSvgBrushHover';

type PaintingCardSvgHoverWrapProps = {
  children: ReactNode;
  className?: string;
  /** Scales stroke width for smaller card frames (hero uses 1). */
  strokeScale?: number;
};

function prefersFinePointerHover(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Overlay that drives GSAP brush reveal on the painting image.
 * Fine-pointer devices: hover in/out. Touch/coarse: brief reveal on tap.
 */
export function PaintingCardSvgHoverWrap({
  children,
  className,
  strokeScale = CARD_BRUSH_STROKE_SCALE,
}: PaintingCardSvgHoverWrapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<globalThis.gsap.core.Timeline | null>(null);
  const touchLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    initHeroSvgStrokePaths(rootRef.current, strokeScale);
  }, [strokeScale]);

  const clearTouchLeaveTimer = useCallback(() => {
    if (touchLeaveTimerRef.current) {
      clearTimeout(touchLeaveTimerRef.current);
      touchLeaveTimerRef.current = null;
    }
  }, []);

  const runEnter = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    tlRef.current?.kill();
    tlRef.current = paintingSvgBrushEnter(root, strokeScale);
  }, [strokeScale]);

  const runLeave = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    tlRef.current?.kill();
    tlRef.current = null;
    paintingSvgBrushLeave(root, strokeScale);
  }, [strokeScale]);

  const scheduleTouchLeave = useCallback(() => {
    clearTouchLeaveTimer();
    touchLeaveTimerRef.current = setTimeout(() => {
      runLeave();
      touchLeaveTimerRef.current = null;
    }, 2800);
  }, [clearTouchLeaveTimer, runLeave]);

  const onPointerEnter = () => {
    if (!prefersFinePointerHover()) return;
    clearTouchLeaveTimer();
    runEnter();
  };

  const onPointerLeave = () => {
    if (!prefersFinePointerHover()) return;
    clearTouchLeaveTimer();
    runLeave();
  };

  const onPointerDown = () => {
    if (prefersFinePointerHover()) return;
    clearTouchLeaveTimer();
    runEnter();
    scheduleTouchLeave();
  };

  useLayoutEffect(() => {
    return () => clearTouchLeaveTimer();
  }, [clearTouchLeaveTimer]);

  return (
    <div
      ref={rootRef}
      className={cn('h-full w-full touch-manipulation', className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
      {children}
    </div>
  );
}
