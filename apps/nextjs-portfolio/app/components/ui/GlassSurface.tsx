'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

type GlassSurfaceVariant = 'default' | 'overlay' | 'backdrop';

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  /** `overlay` — frosted panel over imagery; `backdrop` — same, optimized for live content behind */
  variant?: GlassSurfaceVariant;
};

const glassLayerClass: Record<GlassSurfaceVariant, string> = {
  default: 'glass-surface-default',
  overlay: 'glass-surface-overlay',
  backdrop: 'glass-surface-backdrop',
};

const variantClasses: Record<GlassSurfaceVariant, string> = {
  default:
    'border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] before:from-white/10',
  overlay: 'border-white/25 shadow-[0_20px_56px_rgba(0,0,0,0.38)] ring-1 ring-inset ring-white/10',
  backdrop: 'border-white/25 shadow-[0_20px_56px_rgba(0,0,0,0.42)] ring-1 ring-inset ring-white/10',
};

const BACKDROP_FILTER = 'blur(40px) saturate(200%) brightness(1.12)';
const OVERLAY_FILTER = 'blur(32px) saturate(185%) brightness(1.1)';

/**
 * Premium glassmorphism surface component designed to replace heavily-tinted cards.
 * The `backdrop` variant uses a dedicated frosted layer (no transform on the blur
 * element) so backdrop-filter samples the hero image behind the panel correctly.
 * Do not wrap in transformed ancestors — browsers clip backdrop-filter to the
 * transformed layer and the frosted effect disappears.
 */
export const GlassSurface = ({ children, className, variant = 'default' }: GlassSurfaceProps) => {
  const isBackdrop = variant === 'backdrop';
  const isLightText = variant === 'overlay' || variant === 'backdrop';

  if (isBackdrop) {
    return (
      <div className={clsx('relative overflow-hidden', variantClasses.backdrop, className)}>
        {/* Frosted layer — separate from content so transform never blocks backdrop sampling */}
        <div
          className={clsx(
            'glass-surface-backdrop pointer-events-none absolute inset-0 rounded-[inherit]',
            'before:absolute before:inset-0 before:z-0 before:rounded-[inherit]',
            'before:bg-gradient-to-br before:from-white/18 before:via-white/6 before:to-transparent',
            'after:pointer-events-none after:absolute after:inset-0 after:z-0 after:rounded-[inherit]',
            'after:shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-1px_0_rgba(255,255,255,0.08),inset_1px_0_0_rgba(255,255,255,0.12)]',
          )}
          style={{
            backdropFilter: BACKDROP_FILTER,
            WebkitBackdropFilter: BACKDROP_FILTER,
          }}
          aria-hidden
        />
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
  }

  if (variant === 'overlay') {
    return (
      <div className={clsx('relative overflow-hidden', variantClasses.overlay, className)}>
        <div
          className={clsx(
            'glass-surface-overlay pointer-events-none absolute inset-0 rounded-[inherit]',
            'before:absolute before:inset-0 before:z-0 before:rounded-[inherit]',
            'before:bg-gradient-to-br before:from-white/16 before:via-white/5 before:to-transparent',
            'after:pointer-events-none after:absolute after:inset-0 after:z-0 after:rounded-[inherit]',
            'after:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.07),inset_1px_0_0_rgba(255,255,255,0.1)]',
          )}
          style={{
            backdropFilter: OVERLAY_FILTER,
            WebkitBackdropFilter: OVERLAY_FILTER,
          }}
          aria-hidden
        />
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
  }

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        glassLayerClass[variant],
        'before:absolute before:inset-0 before:bg-gradient-to-br before:to-transparent before:pointer-events-none before:z-0',
        variantClasses[variant],
        className,
      )}
      style={{
        boxShadow: '0 16px 40px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.4)',
      }}
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
