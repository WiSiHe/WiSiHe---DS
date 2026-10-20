'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { LifeJourneyMapProps } from './LifeJourneyMap';

// mapbox-gl (~525 KB gzipped) and its CSS live in this chunk, so they stay out of the /about critical path.
const LifeJourneyMap = lazy(() =>
  import('./LifeJourneyMap').then(module => ({ default: module.LifeJourneyMap })),
);

function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ background: 'var(--color-surface-subtle, rgba(127,127,127,0.12))' }}
      aria-hidden
    />
  );
}

/**
 * Renders the map only once its container is near the viewport. The parent supplies a fixed height, so the
 * placeholder and the loaded map occupy the same box (no layout shift).
 */
export function LazyLifeJourneyMap(props: LifeJourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={props.className}>
      {shouldLoad ? (
        <Suspense fallback={<MapPlaceholder className={props.className} />}>
          <LifeJourneyMap {...props} />
        </Suspense>
      ) : (
        <MapPlaceholder className={props.className} />
      )}
    </div>
  );
}
