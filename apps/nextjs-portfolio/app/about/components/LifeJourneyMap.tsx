'use client';

import { cn } from '@wisihe/utils';
import { useCallback, useEffect, useRef } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  getJourneyItemsWithCoordinates,
  getLocationMeta,
  type LifeJourneyItem,
} from './lifeJourneyTypes';

const MAPBOX_TOKEN = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];
const DEFAULT_CENTER = { longitude: 10.75, latitude: 59.91 };
const DEFAULT_ZOOM = 4.2;

type LifeJourneyMapProps = {
  items: LifeJourneyItem[];
  activeIndex: number;
  className?: string;
};

export function LifeJourneyMap({ items, activeIndex, className }: LifeJourneyMapProps) {
  const mapRef = useRef<MapRef>(null);
  const mappedItems = getJourneyItemsWithCoordinates(items);
  const activeItem = mappedItems[activeIndex];

  const flyToItem = useCallback((item: LifeJourneyItem | undefined, duration = 1800) => {
    if (!item?.coordinates || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [item.coordinates.lng, item.coordinates.lat],
      zoom: item.mapZoom ?? 10,
      duration,
      essential: true,
      padding: { top: 48, bottom: 48, left: 24, right: 24 },
    });
  }, []);

  useEffect(() => {
    flyToItem(activeItem);
  }, [activeItem, flyToItem]);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={cn(
          'flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-subtle p-6 text-center',
          className,
        )}
      >
        <div className='space-y-2 max-w-sm'>
          <p className='font-mono text-xs uppercase tracking-widest text-accent'>Map preview</p>
          <p className='text-sm text-foreground-muted'>
            Add <code className='text-accent'>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the
            interactive life map.
          </p>
        </div>
      </div>
    );
  }

  const initialItem = mappedItems[0];
  const initialView = initialItem?.coordinates
    ? {
        longitude: initialItem.coordinates.lng,
        latitude: initialItem.coordinates.lat,
        zoom: initialItem.mapZoom ?? DEFAULT_ZOOM,
      }
    : { ...DEFAULT_CENTER, zoom: DEFAULT_ZOOM };

  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-2xl', className)}>
      <MapboxMap
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialView}
        mapStyle='mapbox://styles/mapbox/dark-v11'
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
        onLoad={() => flyToItem(activeItem ?? initialItem, 0)}
      >
        {mappedItems.map((item, index) => {
          if (!item.coordinates) return null;
          const meta = getLocationMeta(item.locationType);
          const isActive = index === activeIndex;

          return (
            <Marker
              key={item._key}
              longitude={item.coordinates.lng}
              latitude={item.coordinates.lat}
              anchor='center'
            >
              <button
                type='button'
                className={cn(
                  'relative flex size-4 items-center justify-center rounded-full ring-2 transition-all duration-300',
                  meta.markerClass,
                  isActive ? 'scale-150 shadow-lg shadow-accent/30' : 'scale-100 opacity-80',
                )}
                aria-label={item.placeName ?? item.title ?? 'Location'}
                onClick={() => flyToItem(item)}
              >
                {isActive ? (
                  <span
                    className='absolute inset-0 animate-ping rounded-full bg-accent/40'
                    aria-hidden
                  />
                ) : null}
              </button>
            </Marker>
          );
        })}
      </MapboxMap>

      {activeItem ? (
        <div
          className='pointer-events-none absolute bottom-4 left-4 right-4 rounded-xl border border-border/60 bg-background/85 p-4 backdrop-blur-md sm:left-6 sm:right-auto sm:max-w-xs'
          aria-live='polite'
        >
          <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent'>
            {activeItem.year}
          </p>
          <p className='mt-1 font-serif text-lg font-bold text-foreground'>
            {activeItem.placeName ?? activeItem.title}
          </p>
          {activeItem.placeName && activeItem.title ? (
            <p className='mt-0.5 text-sm text-foreground-muted'>{activeItem.title}</p>
          ) : null}
        </div>
      ) : null}

      <div className='pointer-events-none absolute right-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[10px] text-foreground-muted backdrop-blur-sm'>
        Mapbox
      </div>
    </div>
  );
}
