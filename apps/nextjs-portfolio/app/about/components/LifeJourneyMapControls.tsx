'use client';

import { IconMinus, IconPlus, IconZoomReset } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import type { RefObject } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

type LifeJourneyMapControlsProps = {
  mapRef: RefObject<MapRef | null>;
  className?: string;
  onFitOverview?: () => void;
  showFitOverview?: boolean;
};

function controlButtonClassName() {
  return cn(
    'flex size-9 items-center justify-center rounded-md text-foreground-muted transition-colors',
    'hover:bg-surface hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
  );
}

export function LifeJourneyMapControls({
  mapRef,
  className,
  onFitOverview,
  showFitOverview = false,
}: LifeJourneyMapControlsProps) {
  const adjustZoom = (delta: number) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.stop();
    map.zoomTo(map.getZoom() + delta, { duration: 280, essential: true });
  };

  return (
    <div
      className={cn(
        'absolute bottom-4 right-4 z-10 flex flex-col gap-0.5 rounded-lg border border-border/60 bg-background/92 p-1 shadow-lg backdrop-blur-md',
        className,
      )}
      aria-label='Map controls'
    >
      <button
        type='button'
        className={controlButtonClassName()}
        aria-label='Zoom in'
        onClick={() => adjustZoom(1)}
      >
        <IconPlus className='size-4' stroke={2} aria-hidden />
      </button>
      <button
        type='button'
        className={controlButtonClassName()}
        aria-label='Zoom out'
        onClick={() => adjustZoom(-1)}
      >
        <IconMinus className='size-4' stroke={2} aria-hidden />
      </button>
      {showFitOverview && onFitOverview ? (
        <button
          type='button'
          className={controlButtonClassName()}
          aria-label='Show all places'
          onClick={onFitOverview}
        >
          <IconZoomReset className='size-4' stroke={2} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
