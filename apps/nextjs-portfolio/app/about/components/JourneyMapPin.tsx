'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { LocationMeta } from './lifeJourneyTypes';

type JourneyMapPinProps = {
  meta: LocationMeta;
  isActive: boolean;
  label: string;
  onClick?: () => void;
  size?: 'life' | 'visited';
  pulseDelay?: number;
};

export function JourneyMapPin({
  meta,
  isActive,
  label,
  onClick,
  size = 'life',
  pulseDelay = 0,
}: JourneyMapPinProps) {
  const isVisited = size === 'visited';

  if (isVisited) {
    return (
      <span
        className={cn('relative block size-2 rounded-full ring-1', meta.markerClass, 'opacity-60')}
        aria-hidden
        title={label}
      >
        <span
          className={cn(
            'absolute inset-0 animate-ping rounded-full opacity-40',
            meta.markerClass.split(' ')[0],
          )}
          style={{ animationDuration: '3s', animationDelay: `${pulseDelay}s` }}
        />
      </span>
    );
  }

  return (
    <motion.button
      type='button'
      aria-label={label}
      onClick={onClick}
      animate={{
        scale: isActive ? 1.55 : 1,
        opacity: isActive ? 1 : 0.72,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className='relative flex items-center justify-center'
    >
      {isActive ? (
        <>
          <span className='absolute size-10 rounded-full bg-accent/25 blur-md' aria-hidden />
          <span className='absolute size-6 animate-ping rounded-full bg-accent/35' aria-hidden />
        </>
      ) : null}
      <span
        className={cn(
          'relative z-10 block size-3.5 rounded-full ring-2 shadow-lg',
          meta.markerClass,
          isActive && 'ring-accent shadow-accent/40',
        )}
      />
      {isActive ? (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className='pointer-events-none absolute -top-9 left-1/2 z-20 max-w-[9rem] -translate-x-1/2 truncate rounded-md border border-border/60 bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm'
        >
          {label}
        </motion.span>
      ) : null}
    </motion.button>
  );
}
