'use client';

import { cn } from '@wisihe/utils';
import mapboxgl from 'mapbox-gl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap, { Layer, Marker, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { JourneyMapPin } from './JourneyMapPin';
import {
  bearingBetween,
  buildLineFeature,
  collectMapPoints,
  journeyRouteCoordinates,
} from './lifeJourneyGeo';
import {
  getJourneyItemsWithCoordinates,
  getLocationMeta,
  getVisitedCountriesWithCoordinates,
  type LifeJourneyItem,
  type VisitedCountryItem,
} from './lifeJourneyTypes';

const MAPBOX_TOKEN = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];
const DEFAULT_CENTER = { longitude: 10.75, latitude: 59.91 };
const DEFAULT_ZOOM = 4.2;
const visitedMeta = getLocationMeta('visited');

export type LifeJourneyMapMode = 'journey' | 'travel';

type LifeJourneyMapProps = {
  items: LifeJourneyItem[];
  visitedCountries?: VisitedCountryItem[];
  activeIndex: number;
  mapMode?: LifeJourneyMapMode;
  onSelectStop?: (index: number) => void;
  className?: string;
};

function enableMapAtmosphere(map: mapboxgl.Map) {
  if (typeof map.setFog !== 'function') return;

  map.setFog({
    color: 'rgb(10, 14, 22)',
    'high-color': 'rgb(28, 72, 120)',
    'horizon-blend': 0.06,
    'space-color': 'rgb(6, 8, 14)',
    'star-intensity': 0.45,
  });
}

export function LifeJourneyMap({
  items,
  visitedCountries = [],
  activeIndex,
  mapMode = 'journey',
  onSelectStop,
  className,
}: LifeJourneyMapProps) {
  const mapRef = useRef<MapRef>(null);
  const prefersReducedMotion = useReducedMotion();
  const mappedItems = getJourneyItemsWithCoordinates(items);
  const visitedWithCoords = getVisitedCountriesWithCoordinates(visitedCountries);
  const activeItem = mappedItems[activeIndex];
  const routeCoordinates = useMemo(() => journeyRouteCoordinates(mappedItems), [mappedItems]);

  const fullRoute = useMemo(() => buildLineFeature(routeCoordinates), [routeCoordinates]);

  const activeRoute = useMemo(() => {
    const coords = routeCoordinates.slice(0, activeIndex + 1);
    return buildLineFeature(coords);
  }, [routeCoordinates, activeIndex]);

  const flyToItem = useCallback(
    (item: LifeJourneyItem | undefined, duration = 2200) => {
      if (!item?.coordinates || !mapRef.current) return;

      const itemIndex = mappedItems.findIndex(entry => entry._key === item._key);
      const prev = itemIndex > 0 ? mappedItems[itemIndex - 1] : undefined;
      const bearing =
        prev?.coordinates && item.coordinates
          ? bearingBetween(prev.coordinates, item.coordinates)
          : 0;

      mapRef.current.flyTo({
        center: [item.coordinates.lng, item.coordinates.lat],
        zoom: item.mapZoom ?? 10,
        pitch: prefersReducedMotion ? 0 : 52,
        bearing: prefersReducedMotion ? 0 : bearing * 0.35,
        duration: prefersReducedMotion ? 0 : duration,
        essential: true,
        padding: { top: 56, bottom: 96, left: 32, right: 32 },
      });
    },
    [mappedItems, prefersReducedMotion],
  );

  const fitTravelOverview = useCallback(
    (duration = 2400) => {
      const map = mapRef.current?.getMap();
      const points = collectMapPoints(mappedItems, visitedWithCoords);
      if (!map || points.length === 0) return;

      const bounds = points.reduce(
        (acc, point) => acc.extend(point),
        new mapboxgl.LngLatBounds(points[0], points[0]),
      );

      map.fitBounds(bounds, {
        padding: { top: 72, bottom: 72, left: 48, right: 48 },
        duration: prefersReducedMotion ? 0 : duration,
        pitch: prefersReducedMotion ? 0 : 28,
        bearing: prefersReducedMotion ? 0 : -8,
        essential: true,
      });
    },
    [mappedItems, visitedWithCoords, prefersReducedMotion],
  );

  useEffect(() => {
    if (mapMode === 'travel') {
      fitTravelOverview();
      return;
    }
    flyToItem(activeItem);
  }, [activeItem, flyToItem, fitTravelOverview, mapMode]);

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
        pitch: prefersReducedMotion ? 0 : 40,
      }
    : { ...DEFAULT_CENTER, zoom: DEFAULT_ZOOM, pitch: 0 };

  return (
    <div
      className={cn(
        'group/map relative h-full w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-accent/10',
        className,
      )}
    >
      <div
        className='pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,68,0,0.12),transparent_55%)]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/5'
        aria-hidden
      />

      <MapboxMap
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialView}
        mapStyle='mapbox://styles/mapbox/dark-v11'
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
        onLoad={event => {
          enableMapAtmosphere(event.target);
          if (mapMode === 'travel') {
            fitTravelOverview(0);
          } else {
            flyToItem(activeItem ?? initialItem, 0);
          }
        }}
      >
        {fullRoute ? (
          <Source id='journey-route-full' type='geojson' data={fullRoute}>
            <Layer
              id='journey-route-glow'
              type='line'
              paint={{
                'line-color': '#ff4400',
                'line-width': 10,
                'line-opacity': 0.12,
                'line-blur': 6,
              }}
            />
            <Layer
              id='journey-route-dim'
              type='line'
              paint={{
                'line-color': '#94a3b8',
                'line-width': 2,
                'line-opacity': 0.35,
                'line-dasharray': [2, 2],
              }}
            />
          </Source>
        ) : null}

        {activeRoute ? (
          <Source id='journey-route-active' type='geojson' data={activeRoute}>
            <Layer
              id='journey-route-active-glow'
              type='line'
              paint={{
                'line-color': '#ff4400',
                'line-width': 8,
                'line-opacity': 0.35,
                'line-blur': 3,
              }}
            />
            <Layer
              id='journey-route-active-line'
              type='line'
              paint={{
                'line-color': '#ff7442',
                'line-width': 3,
                'line-opacity': 0.95,
              }}
            />
          </Source>
        ) : null}

        {visitedWithCoords.map((country, index) => {
          if (!country.coordinates) return null;
          const label = [country.country, country.placeName].filter(Boolean).join(', ');

          return (
            <Marker
              key={country._key}
              longitude={country.coordinates.lng}
              latitude={country.coordinates.lat}
              anchor='center'
            >
              <JourneyMapPin
                meta={visitedMeta}
                isActive={false}
                label={label}
                size='visited'
                pulseDelay={(index % 5) * 0.4}
              />
            </Marker>
          );
        })}

        {mappedItems.map((item, index) => {
          if (!item.coordinates) return null;
          const meta = getLocationMeta(item.locationType);
          const isActive = mapMode === 'journey' && index === activeIndex;
          const label = item.placeName ?? item.title ?? 'Location';

          return (
            <Marker
              key={item._key}
              longitude={item.coordinates.lng}
              latitude={item.coordinates.lat}
              anchor='center'
            >
              <JourneyMapPin
                meta={meta}
                isActive={isActive}
                label={label}
                onClick={() => onSelectStop?.(index)}
              />
            </Marker>
          );
        })}
      </MapboxMap>

      <AnimatePresence mode='wait'>
        {activeItem && mapMode === 'journey' ? (
          <motion.div
            key={activeItem._key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className='pointer-events-none absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-border/60 bg-background/88 p-4 backdrop-blur-md sm:left-5 sm:right-auto sm:max-w-xs'
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
          </motion.div>
        ) : mapMode === 'travel' ? (
          <motion.div
            key='travel-overview'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className='pointer-events-none absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-neon-yellow-500/30 bg-background/88 p-4 backdrop-blur-md sm:left-5 sm:right-auto sm:max-w-xs'
          >
            <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-yellow-500'>
              Travel
            </p>
            <p className='mt-1 font-serif text-lg font-bold text-foreground'>
              {visitedWithCoords.length} countries explored
            </p>
            <p className='mt-0.5 text-sm text-foreground-muted'>
              Yellow pins mark places I&apos;ve visited across Europe and beyond.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className='pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2'>
        <span className='rounded-full border border-accent/30 bg-background/75 px-2.5 py-1 text-[10px] font-medium text-accent backdrop-blur-sm'>
          {mapMode === 'travel' ? 'Overview' : 'Following route'}
        </span>
      </div>
    </div>
  );
}
