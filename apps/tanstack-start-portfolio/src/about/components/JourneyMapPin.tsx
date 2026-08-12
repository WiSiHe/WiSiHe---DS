'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { LocationMeta } from './lifeJourneyTypes';
import { MapMarkerTooltip } from './MapMarkerTooltip';

type JourneyMapPinProps = {
  meta: LocationMeta;
  isActive: boolean;
  isPast?: boolean;
  label: string;
  tooltipDetail?: string | null;
  onClick?: () => void;
  size?: 'life' | 'visited';
  pulseDelay?: number;
};

export function JourneyMapPin({
  meta,
  isActive,
  isPast = false,
  label,
  tooltipDetail,
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
      aria-pressed={isActive}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isActive ? 1.6 : isPast ? 0.92 : 1,
        opacity: isActive ? 1 : isPast ? 0.38 : 0.85,
      }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 18,
        mass: 0.65,
      }}
      onClick={event => {
        event.stopPropagation();
        onClick?.();
      }}
      className='group/marker relative flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
    >
      <MapMarkerTooltip
        title={label}
        detail={tooltipDetail ?? 'Click for details'}
        className='mb-3'
      />
      {isActive ? (
        <>
          <motion.span
            className='absolute size-12 rounded-full bg-accent-subtle blur-md'
            aria-hidden
            animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
          <span className='absolute size-7 animate-ping rounded-full bg-accent/40' aria-hidden />
        </>
      ) : null}
      <span
        className={cn(
          'relative z-10 block size-3.5 rounded-full ring-2 shadow-lg transition-shadow',
          meta.markerClass,
          isActive && 'ring-accent ring-4 shadow-lg shadow-accent/55',
          isPast && 'shadow-none',
        )}
      />
    </motion.button>
  );
}
