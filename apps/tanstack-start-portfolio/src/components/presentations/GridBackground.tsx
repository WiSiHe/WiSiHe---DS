'use client';

import { cn } from '@wisihe/utils';

type GridBackgroundProps = {
  readonly className?: string;
  readonly opacity?: number;
  readonly size?: number;
  readonly secondarySize?: number;
  readonly secondaryOpacity?: number;
  readonly fixed?: boolean;
};

export function GridBackground({
  className = '',
  opacity = 0.15,
  size = 50,
  secondarySize = 250,
  secondaryOpacity = 0.1,
  fixed = false,
}: GridBackgroundProps) {
  const positionClass = fixed ? 'fixed' : 'absolute';

  return (
    <>
      <div
        className={cn(positionClass, 'pointer-events-none inset-0 z-0', className)}
        style={{
          opacity,
          backgroundImage: 'none',
          backgroundSize: `${size}px ${size}px`,
        }}
        aria-hidden='true'
      />
      <div
        className={cn(positionClass, 'pointer-events-none inset-0 z-0', className)}
        style={{
          opacity: secondaryOpacity,
          backgroundImage: 'none',
          backgroundSize: `${secondarySize}px ${secondarySize}px`,
        }}
        aria-hidden='true'
      />
    </>
  );
}
