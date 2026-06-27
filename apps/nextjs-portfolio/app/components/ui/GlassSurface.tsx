'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

type GlassSurfaceVariant = 'default' | 'overlay' | 'backdrop';

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  /** `overlay` — opaque frosted panel; `backdrop` — blurs live content behind the panel */
  variant?: GlassSurfaceVariant;
};

const BACKDROP_FILTER = 'blur(48px) saturate(185%) brightness(1.1)';

const variantClasses: Record<GlassSurfaceVariant, string> = {
  default:
    'border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] before:from-white/10',
  overlay:
    'border-white/20 bg-neutral-950/85 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] before:from-white/8',
  backdrop:
    'border-white/30 bg-black/20 backdrop-blur-[48px] backdrop-saturate-[185%] backdrop-brightness-110 shadow-[0_24px_64px_rgba(0,0,0,0.5)]',
};

/**
 * Premium glassmorphism surface component designed to replace heavily-tinted cards.
 * Backdrop blur lives on the root element so it samples siblings painted behind the panel.
 * Do not wrap in transformed ancestors (CSS translate/scale, Locomotive data-scroll) — browsers
 * clip backdrop-filter to the transformed layer and the frosted effect disappears.
 */
export const GlassSurface = ({ children, className, variant = 'default' }: GlassSurfaceProps) => {
  const isBackdrop = variant === 'backdrop';
  const isLightText = variant === 'overlay' || variant === 'backdrop';

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        !isBackdrop &&
          'before:absolute before:inset-0 before:bg-gradient-to-br before:to-transparent before:pointer-events-none before:z-0',
        variantClasses[variant],
        isBackdrop && 'before:absolute before:inset-0 before:z-0 before:rounded-[inherit]',
        isBackdrop &&
          'before:bg-gradient-to-br before:from-white/14 before:via-white/5 before:to-transparent before:pointer-events-none',
        isBackdrop &&
          'after:pointer-events-none after:absolute after:inset-0 after:z-0 after:rounded-[inherit]',
        isBackdrop &&
          'after:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(255,255,255,0.06),inset_1px_0_0_rgba(255,255,255,0.1)]',
        className,
      )}
      style={
        isBackdrop
          ? {
              backdropFilter: BACKDROP_FILTER,
              WebkitBackdropFilter: BACKDROP_FILTER,
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
            }
          : variant === 'default'
            ? {
                boxShadow:
                  '0 16px 40px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.4)',
              }
            : {
                boxShadow:
                  '0 24px 64px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
              }
      }
    >
      <div
        className={clsx(
          'relative z-10 w-full h-full',
          isLightText ? 'text-white' : 'text-foreground',
        )}
      >
        {children}
      </div>
    </div>
  );
};
