'use client';

import { IconX } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import mapboxgl from 'mapbox-gl';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapboxMap, { type MapRef, Marker, Popup } from 'react-map-gl/mapbox';
import { Link } from '@/app/components/layout/ProgressLink';
import { useTheme } from '@/app/providers';
import type { PhotographyMapMarker } from '@/lib/photography/photographyMapMarkers';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v11';
const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';
const FIT_PADDING = { top: 56, bottom: 56, left: 48, right: 48 } as const;
const FIT_DURATION_MS = 900;

type PhotographyMapViewProps = {
  markers: PhotographyMapMarker[];
  fitBoundsKey: string;
  activeCountry: string | null;
  filteredPhotoCount: number;
  onClearCountry: () => void;
  onSwitchToGallery: () => void;
};

export function PhotographyMapView({
  markers,
  fitBoundsKey,
  activeCountry,
  filteredPhotoCount,
  onClearCountry,
  onSwitchToGallery,
}: PhotographyMapViewProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const closePopup = useCallback(() => {
    setSelectedMarkerId(null);
  }, []);

  const toggleMarker = useCallback((photoId: string) => {
    setSelectedMarkerId(prev => (prev === photoId ? null : photoId));
  }, []);

  const selectedMarker = useMemo(
    () => markers.find(marker => marker.photoId === selectedMarkerId) ?? null,
    [markers, selectedMarkerId],
  );

  const fitVisibleMarkers = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map || markers.length === 0) return;

    map.stop();

    if (markers.length === 1) {
      const only = markers[0];
      if (!only) return;
      map.easeTo({
        center: [only.point.longitude, only.point.latitude],
        zoom: only.point.precision === 'exact' ? 11 : 9,
        duration: FIT_DURATION_MS,
        bearing: 0,
        pitch: 0,
        essential: true,
      });
      return;
    }

    const first = markers[0];
    if (!first) return;

    const bounds = markers.reduce(
      (acc, marker) => acc.extend([marker.point.longitude, marker.point.latitude]),
      new mapboxgl.LngLatBounds(
        [first.point.longitude, first.point.latitude],
        [first.point.longitude, first.point.latitude],
      ),
    );

    map.fitBounds(bounds, {
      padding: FIT_PADDING,
      duration: FIT_DURATION_MS,
      bearing: 0,
      pitch: 0,
      essential: true,
      maxZoom: 8,
    });
  }, [markers]);

  // fitBoundsKey retriggers fit when tab or country filter changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: explicit remount key for map bounds
  useEffect(() => {
    setSelectedMarkerId(null);
    if (markers.length === 0) return;
    fitVisibleMarkers();
  }, [fitBoundsKey, fitVisibleMarkers, markers.length]);

  useEffect(() => {
    if (selectedMarkerId && !markers.some(marker => marker.photoId === selectedMarkerId)) {
      setSelectedMarkerId(null);
    }
  }, [markers, selectedMarkerId]);

  useEffect(() => {
    if (!selectedMarkerId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopup();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePopup, selectedMarkerId]);

  if (!MAPBOX_TOKEN) return null;

  const hasMarkers = markers.length > 0;

  return (
    <div className='relative min-h-[55vh] overflow-hidden rounded-xl border border-border/40 bg-surface/40 shadow-sm md:min-h-[70vh]'>
      <div className='absolute inset-0'>
        <MapboxMap
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 10,
            latitude: 54,
            zoom: 3.5,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={resolvedTheme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
          scrollZoom
          dragPan
          attributionControl
          reuseMaps
          onLoad={() => {
            if (hasMarkers) fitVisibleMarkers();
          }}
          onClick={closePopup}
        >
          {markers.map(marker => (
            <Marker
              key={marker.photoId}
              longitude={marker.point.longitude}
              latitude={marker.point.latitude}
              anchor='center'
            >
              <button
                type='button'
                aria-label={marker.title}
                aria-pressed={selectedMarkerId === marker.photoId}
                onClick={event => {
                  event.stopPropagation();
                  toggleMarker(marker.photoId);
                }}
                className={cn(
                  'block size-3.5 rounded-full bg-accent ring-2 ring-background transition-transform hover:scale-125',
                  selectedMarkerId === marker.photoId
                    ? 'shadow-[0_0_0_8px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]'
                    : 'shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-accent)_28%,transparent)]',
                )}
              />
            </Marker>
          ))}

          {selectedMarker ? (
            <Popup
              longitude={selectedMarker.point.longitude}
              latitude={selectedMarker.point.latitude}
              anchor='bottom'
              offset={12}
              closeButton={false}
              closeOnClick
              onClose={closePopup}
              className='photography-map-popup'
              maxWidth='280px'
            >
              <div className='relative flex flex-col gap-3 overflow-hidden rounded-xl bg-background p-3 text-foreground shadow-lg ring-1 ring-border/50'>
                <button
                  type='button'
                  onClick={closePopup}
                  className={cn(
                    'absolute right-2 top-2 z-20 flex size-10 items-center justify-center rounded-full',
                    'border border-border/60 bg-background text-foreground shadow-md',
                    'transition-colors hover:border-accent/40 hover:bg-surface-hover',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                  )}
                  aria-label='Close photo preview'
                >
                  <IconX className='size-5' stroke={2.25} aria-hidden />
                </button>

                {selectedMarker.thumbnailUrl ? (
                  <div className='relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-subtle'>
                    <Image
                      src={selectedMarker.thumbnailUrl}
                      alt={selectedMarker.title}
                      fill
                      className='object-cover'
                      sizes='280px'
                      unoptimized
                    />
                  </div>
                ) : null}
                <div className='space-y-1 pr-10'>
                  <p className='font-serif text-base font-bold leading-snug text-foreground'>
                    {selectedMarker.title}
                  </p>
                  {selectedMarker.placeLabel ? (
                    <p className='text-xs text-foreground-muted'>{selectedMarker.placeLabel}</p>
                  ) : null}
                </div>
                <div className='flex flex-col gap-2'>
                  <Link
                    href={`/photography/${selectedMarker.slug}`}
                    className='inline-flex w-full items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90'
                  >
                    View photo
                  </Link>
                  <button
                    type='button'
                    onClick={closePopup}
                    className='inline-flex w-full items-center justify-center rounded-lg border border-border/60 bg-surface/50 px-3 py-2.5 text-sm font-medium text-foreground-subtle transition-colors hover:border-border hover:bg-surface hover:text-foreground'
                  >
                    Close
                  </button>
                </div>
              </div>
            </Popup>
          ) : null}
        </MapboxMap>
      </div>

      {!hasMarkers ? (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center p-6'>
          <div className='pointer-events-auto max-w-md rounded-xl border border-border/50 bg-background/90 p-6 text-center shadow-lg backdrop-blur-sm'>
            <p className='font-serif text-xl font-bold text-foreground'>
              {filteredPhotoCount > 0 ? 'No mapped photos for this filter' : 'No mapped photos yet'}
            </p>
            <p className='mt-2 text-sm text-foreground-muted'>
              {filteredPhotoCount > 0
                ? 'These photos don’t have coordinates yet. Browse them in the gallery or try another place.'
                : 'Add place coordinates or GPS data in Sanity to show pins on the map.'}
            </p>
            <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
              {activeCountry ? (
                <button
                  type='button'
                  onClick={onClearCountry}
                  className='text-sm font-semibold text-accent hover:underline'
                >
                  Clear filter
                </button>
              ) : null}
              <button
                type='button'
                onClick={onSwitchToGallery}
                className='text-sm font-semibold text-accent hover:underline'
              >
                View in Gallery
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
