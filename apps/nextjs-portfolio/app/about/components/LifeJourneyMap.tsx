'use client';

import { cn } from '@wisihe/utils';
import type { FilterSpecification } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap, { Layer, Marker, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { buildCountryBoundaryFilter, resolveCountryIsoCode } from './countryCodes';
import { JourneyMapPin } from './JourneyMapPin';
import {
  buildLineFeature,
  collectVisitedCountryPoints,
  journeyRouteCoordinates,
  journeyScrollZoom,
} from './lifeJourneyGeo';
import {
  getJourneyItemsWithCoordinates,
  getLocationMeta,
  type LifeJourneyItem,
  type VisitedCountryItem,
} from './lifeJourneyTypes';

const MAPBOX_TOKEN = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];
const DEFAULT_CENTER = { longitude: 10.75, latitude: 59.91 };
const DEFAULT_ZOOM = 4.8;

export type LifeJourneyMapMode = 'journey' | 'travel';

type LifeJourneyMapProps = {
  items: LifeJourneyItem[];
  visitedCountries?: VisitedCountryItem[];
  activeIndex: number;
  mapMode?: LifeJourneyMapMode;
  onSelectStop?: (index: number) => void;
  className?: string;
  fullBleed?: boolean;
};

function enableMapAtmosphere(map: mapboxgl.Map) {
  if (typeof map.setFog !== 'function') return;

  map.setFog({
    color: 'rgb(10, 14, 22)',
    'high-color': 'rgb(28, 72, 120)',
    'horizon-blend': 0.04,
    'space-color': 'rgb(6, 8, 14)',
    'star-intensity': 0.35,
  });
}

export function LifeJourneyMap({
  items,
  visitedCountries = [],
  activeIndex,
  mapMode = 'journey',
  onSelectStop,
  className,
  fullBleed = false,
}: LifeJourneyMapProps) {
  const mapRef = useRef<MapRef>(null);
  const pendingTargetRef = useRef<string | null>(null);
  const mappedItems = getJourneyItemsWithCoordinates(items);
  const activeItem = mappedItems[activeIndex];
  const routeCoordinates = useMemo(() => journeyRouteCoordinates(mappedItems), [mappedItems]);

  const visitedIsoCodes = useMemo(
    () =>
      visitedCountries
        .map(country => resolveCountryIsoCode(country.country, country.countryCode))
        .filter((code): code is string => Boolean(code)),
    [visitedCountries],
  );

  const visitedBoundaryFilter = useMemo(
    () => buildCountryBoundaryFilter(visitedIsoCodes),
    [visitedIsoCodes],
  );

  const fullRoute = useMemo(() => buildLineFeature(routeCoordinates), [routeCoordinates]);

  const activeRoute = useMemo(() => {
    const coords = routeCoordinates.slice(0, activeIndex + 1);
    return buildLineFeature(coords);
  }, [routeCoordinates, activeIndex]);

  const easeToNorth = useCallback(
    (targetKey: string, options: { center: [number, number]; zoom: number; duration?: number }) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      pendingTargetRef.current = targetKey;
      map.stop();

      map.easeTo({
        center: options.center,
        zoom: options.zoom,
        bearing: 0,
        pitch: 0,
        duration: options.duration ?? 2400,
        essential: true,
        easing: t => t * (2 - t),
        padding: { top: 36, bottom: 36, left: 20, right: 20 },
      });
    },
    [],
  );

  const flyToItem = useCallback(
    (item: LifeJourneyItem | undefined, duration = 2400) => {
      if (!item?.coordinates) return;
      easeToNorth(`journey-${item._key}`, {
        center: [item.coordinates.lng, item.coordinates.lat],
        zoom: journeyScrollZoom(item),
        duration,
      });
    },
    [easeToNorth],
  );

  const fitTravelOverview = useCallback(
    (duration = 2200) => {
      const map = mapRef.current?.getMap();
      const points = collectVisitedCountryPoints(visitedCountries);
      if (!map || points.length === 0) return;

      pendingTargetRef.current = 'travel-overview';
      map.stop();

      const bounds = points.reduce(
        (acc, point) => acc.extend(point),
        new mapboxgl.LngLatBounds(points[0], points[0]),
      );

      map.fitBounds(bounds, {
        padding: { top: 48, bottom: 48, left: 48, right: 48 },
        duration,
        bearing: 0,
        pitch: 0,
        essential: true,
        maxZoom: 5.5,
      });
    },
    [visitedCountries],
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
          'flex h-full min-h-[280px] items-center justify-center border border-dashed border-border bg-surface-subtle p-6 text-center',
          fullBleed ? 'rounded-none' : 'rounded-2xl',
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
        zoom: journeyScrollZoom(initialItem),
        bearing: 0,
        pitch: 0,
      }
    : { ...DEFAULT_CENTER, zoom: DEFAULT_ZOOM, bearing: 0, pitch: 0 };

  const showCountries = mapMode === 'travel' && visitedIsoCodes.length > 0;

  return (
    <div
      className={cn(
        'group/map relative h-full w-full overflow-hidden',
        fullBleed
          ? 'rounded-none border-0'
          : 'rounded-2xl border border-border/50 shadow-2xl shadow-accent/10',
        className,
      )}
    >
      <div
        className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/4 bg-linear-to-t from-background/40 to-transparent'
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
        {showCountries ? (
          <Source id='country-boundaries' type='vector' url='mapbox://mapbox.country-boundaries-v1'>
            <Layer
              id='visited-countries-fill'
              type='fill'
              source-layer='country_boundaries'
              filter={visitedBoundaryFilter as FilterSpecification}
              paint={{
                'fill-color': '#facc15',
                'fill-opacity': 0.32,
              }}
            />
            <Layer
              id='visited-countries-outline'
              type='line'
              source-layer='country_boundaries'
              filter={visitedBoundaryFilter as FilterSpecification}
              paint={{
                'line-color': '#fde047',
                'line-width': 1.4,
                'line-opacity': 0.65,
              }}
            />
          </Source>
        ) : null}

        {fullRoute && mapMode === 'journey' ? (
          <Source id='journey-route-full' type='geojson' data={fullRoute}>
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

        {activeRoute && mapMode === 'journey' ? (
          <Source id='journey-route-active' type='geojson' data={activeRoute}>
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

        {mapMode === 'journey'
          ? mappedItems.map((item, index) => {
              if (!item.coordinates) return null;
              const meta = getLocationMeta(item.locationType);
              const isActive = index === activeIndex;
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
            })
          : null}
      </MapboxMap>

      {activeItem && mapMode === 'journey' ? (
        <motion.div
          key={activeItem._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className='pointer-events-none absolute left-4 right-4 top-4 z-20 rounded-xl border border-border/60 bg-background/88 p-3 backdrop-blur-md sm:max-w-xs'
          aria-live='polite'
        >
          <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent'>
            {activeItem.year}
          </p>
          <p className='mt-1 font-serif text-base font-bold text-foreground sm:text-lg'>
            {activeItem.placeName ?? activeItem.title}
          </p>
        </motion.div>
      ) : mapMode === 'travel' ? (
        <div className='pointer-events-none absolute left-4 right-4 top-4 z-20 rounded-xl border border-neon-yellow-500/30 bg-background/88 p-3 backdrop-blur-md sm:max-w-xs'>
          <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-yellow-500'>
            Travel
          </p>
          <p className='mt-1 font-serif text-base font-bold text-foreground sm:text-lg'>
            {visitedIsoCodes.length} countries
          </p>
        </div>
      ) : null}
    </div>
  );
}
