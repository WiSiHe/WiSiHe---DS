'use client';

import { IconMapPin } from '@tabler/icons-react';
import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import MapboxMap, { Marker } from 'react-map-gl/mapbox';
import { Link } from '@/app/components/layout/ProgressLink';
import { useTheme } from '@/app/providers';
import type { PhotographyMapPoint } from './photographyMeta';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];
const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v11';
const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';

type PhotographyLocationMapProps = {
  point: PhotographyMapPoint;
};

export function PhotographyLocationMap({ point }: PhotographyLocationMapProps) {
  const { resolvedTheme } = useTheme();

  if (!MAPBOX_TOKEN) return null;

  const zoom = point.precision === 'exact' ? 11.5 : 9;
  const heading = point.precision === 'exact' ? 'Where this was taken' : 'On the travel map';

  return (
    <section className='space-y-3' aria-label='Photo location on map'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted'>
          <IconMapPin className='size-3.5 text-accent' stroke={1.75} aria-hidden />
          {heading}
        </p>
        {point.label ? (
          <p className='text-xs text-foreground-muted text-pretty'>{point.label}</p>
        ) : null}
      </div>

      <div className='relative overflow-hidden rounded-xl border border-border/40 bg-surface/40 aspect-[5/3] min-h-[168px] shadow-sm'>
        <MapboxMap
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: point.longitude,
            latitude: point.latitude,
            zoom,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={resolvedTheme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
          scrollZoom={false}
          dragPan
          attributionControl
          reuseMaps
        >
          <Marker longitude={point.longitude} latitude={point.latitude} anchor='center'>
            <span
              className='block size-3.5 rounded-full bg-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-accent)_28%,transparent)] ring-2 ring-background'
              aria-hidden
            />
          </Marker>
        </MapboxMap>
      </div>

      {ABOUT_PAGE_LINKS_ENABLED ? (
        <p className='text-xs text-foreground-muted'>
          <Link
            href='/about#travel-map-section'
            className='font-medium text-accent hover:underline'
          >
            Explore all places on the about map
          </Link>
        </p>
      ) : null}
    </section>
  );
}
