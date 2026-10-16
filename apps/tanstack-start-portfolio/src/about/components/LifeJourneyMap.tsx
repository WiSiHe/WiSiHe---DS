'use client';

import { cn } from '@wisihe/utils';
import type { FilterSpecification } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap, { Layer, Marker, Source } from 'react-map-gl/mapbox';
import { getMapboxToken } from '@/lib/mapbox';
import { getResolvedTheme, useThemeStore } from '@/lib/store';
import { buildCountryBoundaryFilter, resolveCountryIsoCode } from './countryCodes';
import { JourneyMapPin } from './JourneyMapPin';
import { useJourneyMapColors } from './journeyMapColors';
import { LifeJourneyMapControls } from './LifeJourneyMapControls';
import {
  buildLineFeature,
  collectTravelMapPoints,
  journeyCurvedRouteCoordinates,
  journeyScrollZoom,
} from './lifeJourneyGeo';
import {
  type AdventurePlaceItem,
  flattenVisitedCities,
  getJourneyItemsWithCoordinates,
  LIVED_PLACE_PIN_META,
  type LifeJourneyItem,
  type VisitedCityItem,
  type VisitedCountryItem,
} from './lifeJourneyTypes';
import { MapPlaceSidePanel } from './MapPlaceSidePanel';
import { formatCityLabel } from './PlaceFactsGrid';
import { TravelCityDot } from './TravelCityDot';

const MAPBOX_TOKEN = getMapboxToken();
const DEFAULT_CENTER = { longitude: 10.75, latitude: 59.91 };
const DEFAULT_ZOOM = 4.8;
const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v11';
const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';
const JOURNEY_PAN_DURATION_MS = 700;
const TRAVEL_FLY_DURATION_MS = 650;
const TRAVEL_FIT_DURATION_MS = 1100;

export type LifeJourneyMapMode = 'journey' | 'travel';

export type TravelSelection =
  | { type: 'city'; key: string; placeId?: string }
  | { type: 'adventure'; key: string; placeId?: string }
  | null;

type LifeJourneyMapProps = {
  items: LifeJourneyItem[];
  visitedCountries?: VisitedCountryItem[];
  adventurePlaces?: AdventurePlaceItem[];
  activeIndex: number;
  mapMode?: LifeJourneyMapMode;
  travelSelection?: TravelSelection;
  onTravelSelectionChange?: (selection: TravelSelection) => void;
  onSelectStop?: (index: number) => void;
  className?: string;
  fullBleed?: boolean;
};

function enableMapAtmosphere(map: mapboxgl.Map, isDark: boolean) {
  if (typeof map.setFog !== 'function' || !map.isStyleLoaded()) return;

  const fog = isDark
    ? {
        color: 'rgb(10, 14, 22)',
        'high-color': 'rgb(28, 72, 120)',
        'horizon-blend': 0.04,
        'space-color': 'rgb(6, 8, 14)',
        'star-intensity': 0.35,
      }
    : {
        color: 'rgb(236, 242, 248)',
        'high-color': 'rgb(191, 219, 254)',
        'horizon-blend': 0.06,
        'space-color': 'rgb(248, 250, 252)',
        'star-intensity': 0,
      };

  try {
    map.setFog(fog);
  } catch {
    // Mapbox throws if the style is still loading — handled by applyMapAtmosphereWhenReady.
  }
}

function applyMapAtmosphereWhenReady(map: mapboxgl.Map, isDark: boolean) {
  const apply = () => enableMapAtmosphere(map, isDark);

  if (map.isStyleLoaded()) {
    apply();
    return undefined;
  }

  map.once('style.load', apply);
  return () => {
    map.off('style.load', apply);
  };
}

export function LifeJourneyMap({
  items,
  visitedCountries = [],
  adventurePlaces = [],
  activeIndex,
  mapMode = 'journey',
  travelSelection: travelSelectionProp,
  onTravelSelectionChange,
  onSelectStop,
  className,
  fullBleed = false,
}: LifeJourneyMapProps) {
  const theme = useThemeStore(state => state.theme);
  const [themeMounted, setThemeMounted] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const hasFittedTravelRef = useRef(false);
  const [internalTravelSelection, setInternalTravelSelection] = useState<TravelSelection>(null);
  const travelSelection = travelSelectionProp ?? internalTravelSelection;
  const setTravelSelection = onTravelSelectionChange ?? setInternalTravelSelection;
  const [journeyDetailKey, setJourneyDetailKey] = useState<string | null>(null);
  const isTravel = mapMode === 'travel';
  const resolvedTheme = themeMounted ? getResolvedTheme(theme) : 'dark';
  const isDarkMap = resolvedTheme !== 'light';
  const mapStyle = isDarkMap ? MAP_STYLE_DARK : MAP_STYLE_LIGHT;
  const journeyColors = useJourneyMapColors(resolvedTheme);
  const mappedItems = useMemo(() => getJourneyItemsWithCoordinates(items), [items]);
  const activeItem = mappedItems[activeIndex];

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

  const fadedFullRoute = useMemo(() => {
    if (activeIndex < 1) return null;
    return buildLineFeature(journeyCurvedRouteCoordinates(mappedItems.slice(0, activeIndex + 1)));
  }, [mappedItems, activeIndex]);

  const activeSegmentRoute = useMemo(() => {
    if (activeIndex < 1) return null;
    return buildLineFeature(
      journeyCurvedRouteCoordinates(mappedItems.slice(activeIndex - 1, activeIndex + 1)),
    );
  }, [mappedItems, activeIndex]);

  const [routeGlowPulse, setRouteGlowPulse] = useState(0);

  const visitedCities = useMemo(() => flattenVisitedCities(visitedCountries), [visitedCountries]);

  const selectedJourneyItem = useMemo(() => {
    if (!journeyDetailKey) return null;
    return mappedItems.find(item => item._key === journeyDetailKey) ?? null;
  }, [journeyDetailKey, mappedItems]);

  const hasJourneyPlacePanel = !isTravel && selectedJourneyItem;

  const closePlacePanel = useCallback(() => {
    setTravelSelection(null);
    setJourneyDetailKey(null);
  }, [setTravelSelection]);

  const easeToNorth = useCallback(
    (
      _targetKey: string,
      options: { center: [number, number]; zoom: number; duration?: number },
    ) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      map.stop();

      map.easeTo({
        center: options.center,
        zoom: options.zoom,
        bearing: 0,
        pitch: 0,
        duration: options.duration ?? JOURNEY_PAN_DURATION_MS,
        essential: true,
        easing: t => t * (2 - t),
        padding: { top: 36, bottom: 36, left: 20, right: 20 },
      });
    },
    [],
  );

  const panToJourneyItem = useCallback(
    (item: LifeJourneyItem | undefined, duration = JOURNEY_PAN_DURATION_MS) => {
      if (!item?.coordinates) return;
      easeToNorth(`journey-${item._key}`, {
        center: [item.coordinates.lng, item.coordinates.lat],
        zoom: journeyScrollZoom(item),
        duration,
      });
    },
    [easeToNorth],
  );

  const flyToCoordinates = useCallback(
    (key: string, lng: number, lat: number, zoom = 8.5) => {
      easeToNorth(key, {
        center: [lng, lat],
        zoom,
        duration: TRAVEL_FLY_DURATION_MS,
      });
    },
    [easeToNorth],
  );

  const fitTravelOverview = useCallback(
    (duration = TRAVEL_FIT_DURATION_MS) => {
      const map = mapRef.current?.getMap();
      const points = collectTravelMapPoints(visitedCountries, adventurePlaces);
      if (!map || points.length === 0) return;

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
        maxZoom: 6,
      });
    },
    [adventurePlaces, visitedCountries],
  );

  const selectCity = useCallback(
    (city: VisitedCityItem) => {
      if (!city.coordinates) return;
      setTravelSelection({
        type: 'city',
        key: city._key,
        placeId: city.placeId ?? undefined,
      });
      flyToCoordinates(`city-${city._key}`, city.coordinates.lng, city.coordinates.lat);
    },
    [flyToCoordinates, setTravelSelection],
  );

  const selectAdventure = useCallback(
    (place: AdventurePlaceItem) => {
      if (!place.coordinates) return;
      setTravelSelection({
        type: 'adventure',
        key: place._key,
        placeId: place.placeId ?? undefined,
      });
      flyToCoordinates(
        `adventure-${place._key}`,
        place.coordinates.lng,
        place.coordinates.lat,
        7.5,
      );
    },
    [flyToCoordinates, setTravelSelection],
  );

  const lastPannedIndexRef = useRef(-1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `items` is a trigger — the pan index must reset whenever the journey items change
  useEffect(() => {
    lastPannedIndexRef.current = -1;
  }, [items]);

  useEffect(() => {
    if (isTravel) {
      if (!hasFittedTravelRef.current) {
        fitTravelOverview();
        hasFittedTravelRef.current = true;
      }
      return;
    }

    if (lastPannedIndexRef.current === activeIndex) return;

    const item = mappedItems[activeIndex];
    if (!item?.coordinates) return;

    lastPannedIndexRef.current = activeIndex;
    panToJourneyItem(item);
  }, [activeIndex, fitTravelOverview, isTravel, mappedItems, panToJourneyItem]);

  useEffect(() => {
    if (isTravel) return;

    let frame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const seconds = (now - start) / 1000;
      setRouteGlowPulse((Math.sin(seconds * 2.4) + 1) / 2);
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isTravel]);

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !themeMounted) return;
    return applyMapAtmosphereWhenReady(map, isDarkMap);
  }, [isDarkMap, themeMounted]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `mapMode` is a trigger — selection and fit state must reset when the map mode switches
  useEffect(() => {
    hasFittedTravelRef.current = false;
    setTravelSelection(null);
    setJourneyDetailKey(null);
  }, [mapMode, setTravelSelection]);

  useEffect(() => {
    if (isTravel) return;
    const activeKey = activeItem?._key;
    if (activeKey && journeyDetailKey && journeyDetailKey !== activeKey) {
      setJourneyDetailKey(null);
    }
  }, [activeItem?._key, isTravel, journeyDetailKey]);

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
            Add <code className='text-accent'>VITE_MAPBOX_TOKEN</code> to enable the interactive
            life map.
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

  const showCountries = isTravel && visitedIsoCodes.length > 0;

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
      <MapboxMap
        key={mapStyle}
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialView}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps={false}
        cooperativeGestures
        scrollZoom={false}
        doubleClickZoom={false}
        dragRotate={false}
        touchPitch={false}
        onLoad={event => {
          const map = event.target;
          map.scrollZoom.disable();
          applyMapAtmosphereWhenReady(map, isDarkMap);
          if (isTravel) {
            fitTravelOverview(0);
            hasFittedTravelRef.current = true;
          } else {
            lastPannedIndexRef.current = activeIndex;
            panToJourneyItem(activeItem ?? initialItem, 0);
          }
        }}
        onClick={() => {
          if (isTravel) setTravelSelection(null);
          else closePlacePanel();
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

        {fadedFullRoute && !isTravel ? (
          <Source id='journey-route-faded' type='geojson' data={fadedFullRoute} lineMetrics>
            <Layer
              id='journey-route-faded-shadow'
              type='line'
              paint={{
                'line-color': journeyColors.routeShadow,
                'line-width': 6,
                'line-opacity': 0.2,
                'line-blur': 1,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
            <Layer
              id='journey-route-faded-line'
              type='line'
              paint={{
                'line-color': journeyColors.routeFaded,
                'line-width': 3.5,
                'line-opacity': 0.3,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
          </Source>
        ) : null}

        {activeSegmentRoute && !isTravel ? (
          <Source id='journey-route-segment' type='geojson' data={activeSegmentRoute} lineMetrics>
            <Layer
              id='journey-route-segment-aura'
              type='line'
              paint={{
                'line-color': journeyColors.accent,
                'line-width': 10 + routeGlowPulse * 10,
                'line-opacity': 0.1 + routeGlowPulse * 0.28,
                'line-blur': 2 + routeGlowPulse * 4,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
            <Layer
              id='journey-route-segment-glow'
              type='line'
              paint={{
                'line-color': journeyColors.accentBright,
                'line-width': 7 + routeGlowPulse * 5,
                'line-opacity': 0.22 + routeGlowPulse * 0.38,
                'line-blur': 1 + routeGlowPulse * 2,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
            <Layer
              id='journey-route-segment-line'
              type='line'
              paint={{
                'line-gradient': [
                  'interpolate',
                  ['linear'],
                  ['line-progress'],
                  0,
                  journeyColors.accentSoft,
                  0.35,
                  journeyColors.accent,
                  1,
                  journeyColors.accentBright,
                ],
                'line-width': 4.5 + routeGlowPulse * 1.5,
                'line-opacity': 0.82 + routeGlowPulse * 0.18,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
          </Source>
        ) : null}

        {isTravel
          ? visitedCities.map(city => {
              if (!city.coordinates) return null;
              const label = [city.name, city.country].filter(Boolean).join(', ');
              const isSelected =
                travelSelection?.type === 'city' && travelSelection.key === city._key;

              return (
                <Marker
                  key={city._key}
                  longitude={city.coordinates.lng}
                  latitude={city.coordinates.lat}
                  anchor='center'
                >
                  <TravelCityDot
                    label={label}
                    tooltipDetail={city.funFact ?? city.notes ?? city.stats?.[0]?.value}
                    selected={isSelected}
                    onClick={() => selectCity(city)}
                  />
                </Marker>
              );
            })
          : null}

        {isTravel
          ? adventurePlaces.map(place => {
              if (!place.coordinates) return null;
              const label = place.placeName
                ? `${place.name} — ${place.placeName}`
                : (place.name ?? '');
              const isSelected =
                travelSelection?.type === 'adventure' && travelSelection.key === place._key;

              return (
                <Marker
                  key={place._key}
                  longitude={place.coordinates.lng}
                  latitude={place.coordinates.lat}
                  anchor='center'
                >
                  <TravelCityDot
                    label={label}
                    tooltipDetail={place.funFact ?? place.notes ?? place.stats?.[0]?.value}
                    selected={isSelected}
                    onClick={() => selectAdventure(place)}
                  />
                </Marker>
              );
            })
          : null}

        {!isTravel
          ? mappedItems.map((item, index) => {
              if (!item.coordinates || index > activeIndex) return null;
              const isActive = index === activeIndex;
              const label = formatCityLabel(item.placeName, item.title);

              return (
                <Marker
                  key={item._key}
                  longitude={item.coordinates.lng}
                  latitude={item.coordinates.lat}
                  anchor='center'
                >
                  <JourneyMapPin
                    meta={LIVED_PLACE_PIN_META}
                    isActive={isActive}
                    isPast={index < activeIndex}
                    label={label}
                    tooltipDetail={item.funFact ?? 'Tap for city facts'}
                    onClick={() => {
                      onSelectStop?.(index);
                      setJourneyDetailKey(item._key);
                    }}
                  />
                </Marker>
              );
            })
          : null}
      </MapboxMap>

      {hasJourneyPlacePanel ? (
        <button
          type='button'
          className='absolute inset-0 z-20 bg-background/50 backdrop-blur-[2px] sm:hidden'
          onClick={closePlacePanel}
          aria-label='Close place details'
        />
      ) : null}

      <LifeJourneyMapControls
        mapRef={mapRef}
        showFitOverview={isTravel}
        onFitOverview={() => fitTravelOverview(900)}
        className={cn(
          !isTravel && 'max-lg:top-3 max-lg:bottom-auto max-lg:right-3',
          hasJourneyPlacePanel && 'max-sm:top-3 max-sm:bottom-auto max-sm:right-3',
        )}
      />

      {!isTravel && selectedJourneyItem ? (
        <MapPlaceSidePanel
          title={formatCityLabel(selectedJourneyItem.placeName, selectedJourneyItem.title)}
          subtitle={
            selectedJourneyItem.placeName?.includes(',')
              ? selectedJourneyItem.placeName.split(',')[1]?.trim()
              : 'Norway'
          }
          funFact={selectedJourneyItem.funFact}
          stats={selectedJourneyItem.stats}
          image={selectedJourneyItem.image}
          onClose={() => setJourneyDetailKey(null)}
        />
      ) : null}
    </div>
  );
}
