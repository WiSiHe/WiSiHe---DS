'use client';

import { cn } from '@wisihe/utils';
import { useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { prefersFinePointerHover } from '../hooks/useMediaCapabilities';
import { BrushRevealProvider } from './BrushRevealContext';

type BrushRevealWrapProps = {
  children: ReactNode;
  className?: string;
  /** Opt-in — when false, children render without hover reveal. */
  enabled?: boolean;
  /** When set, pointer handlers are skipped and hover is driven externally (hero cards). */
  hovered?: boolean;
};

/** Provides grid band hover state for `BrushRevealLayer`. */
export function BrushRevealWrap({
  children,
  className,
  enabled = true,
  hovered,
}: BrushRevealWrapProps) {
  const reduceMotion = useReducedMotion();
  const [pointerActive, setPointerActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isControlled = hovered !== undefined;
  const isActive = enabled && (isControlled ? Boolean(hovered) : pointerActive);

  const contextValue = useMemo(
    () => ({
      isActive,
      reduceMotion: Boolean(reduceMotion),
      liteMode: false,
      profile: 'gridCard' as const,
    }),
    [isActive, reduceMotion],
  );

  // Touch has no hover: reveal the card under a thin line through the middle of the screen while scrolling.
  useEffect(() => {
    const element = ref.current;
    if (!enabled || isControlled || reduceMotion || !element) return undefined;
    if (prefersFinePointerHover()) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setPointerActive(Boolean(entry?.isIntersecting)),
      { rootMargin: '-48% 0px -48% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, isControlled, reduceMotion]);

  const activate = () => {
    if (!prefersFinePointerHover()) return;
    setPointerActive(true);
  };

  const deactivate = () => {
    if (!prefersFinePointerHover()) return;
    setPointerActive(false);
  };

  if (!enabled) {
    return <div className={cn('h-full w-full', className)}>{children}</div>;
  }

  return (
    <BrushRevealProvider value={contextValue}>
      <div
        ref={ref}
        className={cn('h-full w-full', className)}
        {...(isControlled
          ? {}
          : {
              onPointerEnter: activate,
              onPointerLeave: deactivate,
            })}
      >
        {children}
      </div>
    </BrushRevealProvider>
  );
}
