import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { PhotographyQueryResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForPhotographyDetail } from '@/lib/photography/photographyImage';
import { PhotographyActions } from './PhotographyActions';
import { PhotographyDetailImage } from './PhotographyDetailImage';
import { PhotographyDetailNav } from './PhotographyDetailNav';
import { PhotographyLocationMapSlot } from './PhotographyLocationMapSlot';
import {
  buildPhotographyMetaRows,
  extractPaletteSwatches,
  resolvePhotographyMapPoint,
} from './photographyMeta';
import { photographyGlassPanelClass, photographySectionLabelClass } from './photographyStyles';

type PhotographyDetailViewProps = {
  photo: NonNullable<PhotographyQueryResult>;
};

const SWATCH_LABELS: Record<string, string> = {
  dominant: 'Dominant',
  vibrant: 'Vibrant',
  lightVibrant: 'Light',
  darkVibrant: 'Dark',
  muted: 'Muted',
  lightMuted: 'Lt. Muted',
  darkMuted: 'Dk. Muted',
};

function resolveDetailImageDimensions(image: NonNullable<PhotographyQueryResult>['image']): {
  width: number;
  height: number;
} {
  const width = image?.width;
  const height = image?.height;
  if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
    return { width, height };
  }

  const rawRatio = image?.aspectRatio;
  const aspectRatio = typeof rawRatio === 'number' && rawRatio > 0 ? rawRatio : 4 / 3;

  return { width: 1600, height: Math.round(1600 / aspectRatio) };
}

export function PhotographyDetailView({ photo }: PhotographyDetailViewProps) {
  const image = photo.image;
  const { width: imageWidth, height: imageHeight } = resolveDetailImageDimensions(image);
  const imageAspectRatio = imageWidth / imageHeight;

  const imageUrl = image ? urlForPhotographyDetail(image) : null;

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
    <div className='relative z-10 overflow-visible pb-16 pt-32 md:pb-20 md:pt-36 lg:pt-40'>
      {dominantColor ? (
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[min(75vh,780px)] opacity-70'
          style={{
            background: `radial-gradient(ellipse 85% 65% at 28% 8%, color-mix(in srgb, ${dominantColor} 28%, transparent), transparent 70%)`,
          }}
        />
      ) : null}

      <PhotographyDetailNav title={photo.title ?? 'Photo'} />

      <section className='relative mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-x-6 gap-y-8 overflow-visible px-4 text-foreground lg:grid-cols-[minmax(0,1fr)_clamp(17.5rem,30vw,24rem)] lg:gap-x-10 lg:gap-y-8 lg:px-8 xl:gap-x-12'>
        {imageUrl && photo.slug ? (
          <PhotographyDetailImage
            slug={photo.slug}
            imageUrl={imageUrl}
            alt={image?.alt ?? photo.title ?? 'Photograph'}
            lqip={image?.lqip}
            aspectRatio={imageAspectRatio}
          />
        ) : null}

        <aside className='min-w-0 lg:sticky lg:top-36 lg:col-start-2 lg:row-start-1 lg:self-start xl:top-40'>
          <div className={photographyGlassPanelClass}>
            <div className='flex flex-col gap-5 sm:gap-6'>
              <header className='space-y-3 border-b border-border/30 pb-5'>
                {place?.name ? (
                  <p className={photographySectionLabelClass}>
                    {place.countryName ? `${place.name} · ${place.countryName}` : place.name}
                  </p>
                ) : null}
                <h1 className='font-serif text-[1.85rem] font-bold leading-[1.1] tracking-tight text-foreground text-pretty sm:text-[2rem] lg:text-[2.1rem]'>
                  {photo.title}
                </h1>
                {place?.name && ABOUT_PAGE_LINKS_ENABLED ? (
                  <Link
                    href='/about#travel-map-section'
                    className='inline-flex text-sm font-medium text-accent transition-colors hover:text-foreground'
                  >
                    View on travel map →
                  </Link>
                ) : null}
              </header>

              {photo.caption ? (
                <figure className='space-y-3'>
                  <blockquote className='border-l-2 border-accent/40 pl-4 font-serif text-base italic leading-relaxed text-foreground-subtle text-pretty'>
                    {photo.caption}
                  </blockquote>
                </figure>
              ) : null}

              <PhotographyActions
                photoId={photo._id}
                title={photo.title ?? 'Photograph'}
                viewsCount={photo.viewsCount ?? 0}
                likesCount={photo.likesCount ?? 0}
                layout='sidebar'
              />

              {mapPoint ? (
                <div className='space-y-2.5'>
                  <p className={photographySectionLabelClass}>Location</p>
                  <PhotographyLocationMapSlot point={mapPoint} />
                </div>
              ) : null}

              {paletteSwatches.length > 0 ? (
                <div className='space-y-2.5'>
                  <p className={photographySectionLabelClass}>Palette</p>
                  <div className='flex overflow-hidden rounded-xl border border-border/40 shadow-sm'>
                    {paletteSwatches.map(swatch => (
                      <div
                        key={swatch.key}
                        className='group relative flex-1 h-12 cursor-default transition-[flex,background-color] duration-700 ease-out hover:flex-[1.6]'
                        style={{ backgroundColor: swatch.color }}
                        title={`${SWATCH_LABELS[swatch.key] ?? swatch.label}: ${swatch.color.toUpperCase()}`}
                        role='img'
                        aria-label={`${SWATCH_LABELS[swatch.key] ?? swatch.label}: ${swatch.color}`}
                      >
                        <span className='pointer-events-none absolute inset-x-0 bottom-1 text-center text-[9px] font-mono font-medium text-white opacity-0 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] transition-opacity duration-200 group-hover:opacity-100'>
                          {swatch.color.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {metaRows.length > 0 ? (
                <dl className='divide-y divide-border/40 border-y border-border/40'>
                  {metaRows.map(row => (
                    <div
                      key={`${row.label}-${row.value}`}
                      className='flex items-baseline justify-between gap-4 py-2.5'
                    >
                      <dt className={photographySectionLabelClass}>{row.label}</dt>
                      <dd className='text-right text-sm font-semibold text-foreground [overflow-wrap:anywhere] sm:overflow-visible sm:[overflow-wrap:normal]'>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {photo.tagsV2?.length ? (
                <div className='flex flex-wrap gap-2 pt-1'>
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

              {place?.name && !mapPoint && ABOUT_PAGE_LINKS_ENABLED ? (
                <Link
                  href='/about#travel-map-section'
                  className='inline-flex w-full items-center justify-center rounded-full border border-border/50 bg-surface/50 px-4 py-2.5 text-sm font-semibold text-foreground-subtle transition-colors hover:border-accent-border hover:bg-surface-hover hover:text-foreground'
                >
                  View on travel map
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
