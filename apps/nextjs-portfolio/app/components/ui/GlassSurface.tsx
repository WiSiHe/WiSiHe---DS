import clsx from 'clsx';
import type { ReactNode } from 'react';

type GlassSurfaceVariant = 'default' | 'overlay';

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  /** `overlay` — high-contrast frosted panel for text over photos and artwork */
  variant?: GlassSurfaceVariant;
};

const variantClasses: Record<GlassSurfaceVariant, string> = {
  default:
    'border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] before:from-white/10',
  overlay:
    'border-white/20 bg-neutral-950/85 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] before:from-white/8',
};

/**
 * Premium glassmorphism surface component designed to replace heavily-tinted cards.
 * Provides high contrast, strong background blur, and soft inner lighting.
 */
export const GlassSurface = ({ children, className, variant = 'default' }: GlassSurfaceProps) => {
  const isOverlay = variant === 'overlay';

  return (
    <div
      className={clsx(
        'relative rounded-[2rem] overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:to-transparent before:pointer-events-none before:z-0',
        variantClasses[variant],
        className,
      )}
      style={{
        boxShadow: isOverlay
          ? '0 24px 64px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
          : '0 16px 40px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.4)',
      }}
    >
      <div
        className={clsx(
          'relative z-10 w-full h-full',
          isOverlay ? 'text-white' : 'text-foreground',
        )}
      >
        {children}
      </div>
    </div>
  );
};
