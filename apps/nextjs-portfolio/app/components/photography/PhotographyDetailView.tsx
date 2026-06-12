import type { PhotographyQueryResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Breadcrumbs from '@/app/components/layout/Breadcrumbs/Breadcrumbs';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForFullImage } from '@/sanity/lib/utils';
import { PhotographyLocationMapSlot } from './PhotographyLocationMapSlot';
import {
  buildPhotographyMetaRows,
  extractPaletteSwatches,
  resolvePhotographyMapPoint,
} from './photographyMeta';

type PhotographyDetailViewProps = {
  photo: NonNullable<PhotographyQueryResult>;
};

function MetaGrid({ rows }: { rows: { label: string; value: string }[] }) {
  if (!rows.length) return null;

  return (
    <dl className='grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
      {rows.map(row => (
        <div key={`${row.label}-${row.value}`} className='space-y-1'>
          <dt className='font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted'>
            {row.label}
          </dt>
          <dd className='text-sm font-medium leading-snug text-foreground text-pretty'>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PhotographyDetailView({ photo }: PhotographyDetailViewProps) {
  const image = photo.image;
  const width = image?.width ?? undefined;
  const height = image?.height ?? undefined;

  const imageUrl = image ? urlForFullImage(image)?.width(2400).quality(92).url() : null;

  const paletteSwatches = extractPaletteSwatches(
    image?.palette as Record<string, unknown> | undefined,
  );
  const dominantColor = paletteSwatches[0]?.color;

  const place = photo.place;
  const mapPoint = resolvePhotographyMapPoint({
    imageLocation: image?.location,
    placeName: place?.name,
    placeCountry: place?.countryName,
    placeCoordinates: place?.coordinates,
  });

  const metaRows = buildPhotographyMetaRows({
    capturedAt: photo.capturedAt,
    camera: photo.camera,
    width: image?.width,
    height: image?.height,
    mimeType: image?.mimeType,
    fileSize: image?.fileSize,
    hasAlpha: image?.hasAlpha,
    exif: (image?.exif as Record<string, unknown> | null) ?? undefined,
    imageLocation: image?.location,
    includeGps: !mapPoint,
  });

  return (
    <div className='min-h-screen bg-background pt-28 pb-20 sm:pt-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Breadcrumbs
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Photography', href: '/photography' },
            { label: photo.title ?? 'Photo' },
          ]}
        />

        <div className='mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start lg:gap-10 xl:gap-12'>
          {imageUrl ? (
            <div
              className={cn(
                'flex items-center justify-center overflow-hidden rounded-2xl border border-border/40 p-3 shadow-lg shadow-black/[0.04] sm:p-4 lg:sticky lg:top-28',
              )}
              style={{
                backgroundColor: dominantColor
                  ? `color-mix(in srgb, ${dominantColor} 14%, var(--color-surface))`
                  : undefined,
              }}
            >
              <Image
                src={imageUrl}
                alt={image?.alt ?? photo.title ?? 'Photograph'}
                width={width ?? 1600}
                height={height ?? 1200}
                className='h-auto max-h-[min(88vh,calc(100vh-9rem))] w-auto max-w-full object-contain'
                sizes='(max-width: 1024px) 100vw, 70vw'
                priority
                placeholder={image?.lqip ? 'blur' : 'empty'}
                blurDataURL={image?.lqip ?? undefined}
              />
            </div>
          ) : null}

          <div className='min-w-0 space-y-6 lg:py-1'>
            <header className='space-y-3'>
              <h1 className='font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-pretty'>
                {photo.title}
              </h1>
              {place?.name ? (
                <p className='text-foreground-subtle'>
                  <Link
                    href='/about#travel-map-section'
                    className='font-medium text-foreground transition-colors hover:text-accent'
                  >
                    {place.name}
                  </Link>
                  {place.countryName ? (
                    <span className='text-foreground-muted'> · {place.countryName}</span>
                  ) : null}
                </p>
              ) : null}
            </header>

            {photo.caption ? (
              <p className='text-base leading-relaxed text-foreground-subtle text-pretty'>
                {photo.caption}
              </p>
            ) : null}

            {mapPoint ? <PhotographyLocationMapSlot point={mapPoint} /> : null}

            {paletteSwatches.length > 0 ? (
              <section className='space-y-3' aria-label='Colour palette'>
                <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted'>
                  Colours in this photo
                </p>
                <div className='flex flex-wrap gap-3'>
                  {paletteSwatches.map(swatch => (
                    <div key={swatch.key} className='group flex flex-col items-center gap-1.5'>
                      <div
                        className='size-11 rounded-xl border border-border/50 shadow-sm transition-transform duration-200 group-hover:scale-105'
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.label}: ${swatch.color.toUpperCase()}`}
                        aria-label={swatch.color}
                      />
                      <span className='text-[10px] text-foreground-muted'>{swatch.label}</span>
                      <span className='font-mono text-[9px] text-foreground-muted/70'>
                        {swatch.color.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {metaRows.length > 0 ? (
              <section
                className='rounded-2xl border border-border/40 bg-surface/40 p-5 sm:p-6'
                aria-label='Photo details'
              >
                <p className='mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted'>
                  Details
                </p>
                <MetaGrid rows={metaRows} />
              </section>
            ) : null}

            {photo.tagsV2?.length ? (
              <div className='flex flex-wrap gap-2'>
                {photo.tagsV2.map(tag =>
                  tag.name ? (
                    <Chip
                      key={tag._id}
                      label={tag.name}
                      size='small'
                      outlined
                      interactive={false}
                    />
                  ) : null,
                )}
              </div>
            ) : null}

            <div className='flex flex-wrap gap-3 pt-2'>
              <Link
                href='/photography'
                className='rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent'
              >
                All photos
              </Link>
              {place?.name && !mapPoint ? (
                <Link
                  href='/about#travel-map-section'
                  className='rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent'
                >
                  View on map
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
