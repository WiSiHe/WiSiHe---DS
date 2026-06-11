import clsx from 'clsx';
import type { ReactNode } from 'react';

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Premium glassmorphism surface component designed to replace heavily-tinted cards.
 * Provides high contrast, strong background blur, and soft inner lighting.
 */
export const GlassSurface = ({ children, className }: GlassSurfaceProps) => {
  return (
    <div
      className={clsx(
        'relative rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none before:z-0',
        className,
      )}
      style={{
        boxShadow: '0 16px 40px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.4)',
      }}
    >
      <div className='relative z-10 w-full h-full text-foreground'>{children}</div>
    </div>
  );
};
