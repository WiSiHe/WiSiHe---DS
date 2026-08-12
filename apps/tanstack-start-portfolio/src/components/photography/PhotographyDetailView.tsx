'use client';

import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { DetailNav } from '@/components/detail/DetailNav';
import { ShareButton } from '@/components/detail/ShareButton';
import { SharedLayoutFrame } from '@/components/motion/SharedLayoutFrame';
import Image from '@/components/ui/Image';
import {
  buildPhotographyMetaRows,
  extractPaletteSwatches,
  urlForPhotographyDetail,
} from '@/lib/photography/photographyDetailMeta';
import { isValidPhotographyLqip } from '@/lib/photography/photographyImage';

const SWATCH_LABELS: Record<string, string> = {
  dominant: 'Dominant',
  vibrant: 'Vibrant',
  lightVibrant: 'Light',
  darkVibrant: 'Dark',
  muted: 'Muted',
  lightMuted: 'Lt. Muted',
  darkMuted: 'Dk. Muted',
};

const glassPanelClass = cn(
  'rounded-xl lg:border lg:border-border/30 lg:bg-background/35 lg:p-6 lg:backdrop-blur-xl',
  'lg:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:lg:bg-background/25',
);

const sectionLabelClass = 'text-xs font-medium uppercase tracking-wider text-foreground-muted';

type PhotographyDetailViewProps = {
  photo: Record<string, any>;
};

export function PhotographyDetailView({ photo }: PhotographyDetailViewProps) {
  const image = photo.image;
  const imageUrl = image ? urlForPhotographyDetail(image) : null;
  const width = image?.width ?? 1600;
  const height = image?.height ?? Math.round(1600 / (image?.aspectRatio || 4 / 3));
  const aspectRatio = width / height;

  const paletteSwatches = extractPaletteSwatches(image?.palette);
  const dominantColor = paletteSwatches[0]?.color;
  const placeLabel = [photo.place?.name, photo.place?.countryName].filter(Boolean).join(', ');

  const metaRows = buildPhotographyMetaRows({
    capturedAt: photo.capturedAt,
    camera: photo.camera,
    width: image?.width,
    height: image?.height,
    mimeType: image?.mimeType,
    hasAlpha: image?.hasAlpha,
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

      <DetailNav
        backHref='/photography'
        backLabel='Back to photography'
        ariaLabel='Photography navigation'
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Photography', href: '/photography' },
          { label: photo.title ?? 'Photo' },
        ]}
      />

      <section className='relative mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-x-6 gap-y-8 overflow-visible px-4 text-foreground lg:grid-cols-[minmax(0,1fr)_clamp(17.5rem,30vw,24rem)] lg:gap-x-10 lg:px-8 xl:gap-x-12'>
        {imageUrl && photo.slug ? (
          <div className='relative w-full min-w-0 -mx-4 sm:mx-0 lg:col-start-1 lg:row-start-1'>
            <SharedLayoutFrame
              slug={photo.slug}
              className='relative mx-auto w-full overflow-hidden rounded-none bg-surface-subtle sm:rounded-xl'
              style={{
                aspectRatio,
                maxHeight: 'min(88vh, calc(100vh - 9rem))',
              }}
            >
              <motion.div layout='position' className='relative h-full w-full'>
                <Image
                  src={imageUrl}
                  alt={image?.alt ?? photo.title ?? 'Photograph'}
                  fill
                  priority
                  className='object-contain'
                  sizes='(max-width: 1024px) 100vw, 72vw'
                  blurDataURL={isValidPhotographyLqip(image?.lqip) ? image.lqip : undefined}
                />
              </motion.div>
            </SharedLayoutFrame>
          </div>
        ) : null}

        <aside className='min-w-0 lg:sticky lg:top-36 lg:col-start-2 lg:row-start-1 lg:self-start xl:top-40'>
          <div className={glassPanelClass}>
            <div className='flex flex-col gap-5 sm:gap-6'>
              <header className='space-y-3 border-b border-border/30 pb-5'>
                {placeLabel ? <p className={sectionLabelClass}>{placeLabel}</p> : null}
                <h1 className='font-serif text-[1.85rem] font-bold leading-[1.1] tracking-tight text-pretty sm:text-[2rem] lg:text-[2.1rem]'>
                  {photo.title}
                </h1>
              </header>

              {photo.caption ? (
                <blockquote className='border-l-2 border-accent/40 pl-4 font-serif text-base italic leading-relaxed text-foreground-subtle text-pretty'>
                  {photo.caption}
                </blockquote>
              ) : null}

              <ShareButton title={photo.title ?? 'Photograph'} fullWidth size='medium' />

              {paletteSwatches.length > 0 ? (
                <div className='space-y-2.5'>
                  <p className={sectionLabelClass}>Palette</p>
                  <div className='flex overflow-hidden rounded-xl border border-border/40 shadow-sm'>
                    {paletteSwatches.map(swatch => (
                      <div
                        key={swatch.key}
                        className='relative h-12 flex-1'
                        style={{ backgroundColor: swatch.color }}
                        title={`${SWATCH_LABELS[swatch.key] ?? swatch.key}: ${swatch.color.toUpperCase()}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {metaRows.length > 0 ? (
                <dl className='divide-y divide-border/40 border-y border-border/40'>
                  {metaRows.map(row => (
                    <div
                      key={row.label}
                      className='flex items-baseline justify-between gap-4 py-2.5'
                    >
                      <dt className={sectionLabelClass}>{row.label}</dt>
                      <dd className='text-right text-sm font-semibold text-foreground'>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {photo.tagsV2?.length ? (
                <div className='flex flex-wrap gap-2 pt-1'>
                  {photo.tagsV2.map((tag: { _id?: string; name?: string | null }) =>
                    tag.name ? (
                      <Chip
                        key={tag._id || tag.name}
                        label={tag.name}
                        size='small'
                        outlined
                        interactive={false}
                      />
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
