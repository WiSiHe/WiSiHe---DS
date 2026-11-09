'use client';

import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconEye,
  IconMask,
  IconShoppingBag,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button, Chip, getNsfwImageBlurClass } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { DetailNav } from '@/components/detail/DetailNav';
import { LikeButton } from '@/components/detail/LikeButton';
import { ShareButton } from '@/components/detail/ShareButton';
import { SharedLayoutFrame } from '@/components/motion/SharedLayoutFrame';
import Image from '@/components/ui/Image';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import {
  paintingAmbientFrameShadow,
  type SanityPalette,
} from '@/lib/paintings/paintingPaletteGlow';
import { usePaintingsGalleryReturnUrl } from '@/lib/paintings/usePaintingsGalleryReturnUrl';
import { getResolvedTheme, useThemeStore } from '@/lib/store';
import { incrementPaintingView } from '@/server/engagement';
import type { PaintingDetailData } from '@/server/fns';
import { PaintingFrameGlow } from './PaintingFrameGlow';

type PaintingDetailViewProps = {
  painting: PaintingDetailData;
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

const carouselNavClass = cn(
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full touch-manipulation',
  'text-foreground-muted transition-colors',
  'hover:bg-surface-hover hover:text-foreground',
);

const PAINTING_MAX_HEIGHT = 'min(78vh, 920px)';

export function PaintingDetailView({ painting }: PaintingDetailViewProps) {
  const { theme } = useThemeStore();
  const isDark = getResolvedTheme(theme) === 'dark';
  const galleryHref = usePaintingsGalleryReturnUrl();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [nsfwRevealed, setNsfwRevealed] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const {
    title,
    slug,
    _id,
    description,
    tagsV2,
    paintedAt,
    viewsCount,
    likesCount,
    images,
    video,
    redbubbleUrl,
    gelatoUrl,
    format,
    isNSFW,
    isFanArt,
    relatedPaintings,
  } = painting;

  const storeLinks = [
    ...(redbubbleUrl
      ? [{ label: 'Redbubble', url: redbubbleUrl, description: 'Prints, stickers & apparel' }]
      : []),
    ...(gelatoUrl
      ? [{ label: 'Gelato', url: gelatoUrl, description: 'Museum-quality fine art prints' }]
      : []),
  ];

  const formatLabel =
    format === 'portrait' ? 'Portrait' : format === 'landscape' ? 'Landscape' : 'Square';

  const formattedPaintedAt = paintedAt
    ? new Date(paintedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const activeImage = images[selectedIndex] ?? images[0];
  const activePalette = (activeImage?.palette ?? null) as SanityPalette | null;
  const showNsfwBlur = isNSFW && !nsfwRevealed;

  const detailRows = [
    { label: 'Date', value: formattedPaintedAt },
    { label: 'Format', value: formatLabel },
    ...(activeImage?.width && activeImage?.height
      ? [
          {
            label: 'Resolution',
            value: `${activeImage.width.toLocaleString()} × ${activeImage.height.toLocaleString()} px`,
          },
        ]
      : []),
    ...(activeImage?.hasAlpha ? [{ label: 'Background', value: 'Transparent' }] : []),
  ].filter(row => row.value);

  const paletteSwatches = activePalette
    ? Object.entries(activePalette)
        .filter(([key]) => !key.startsWith('_'))
        .flatMap(([key, swatch]) => {
          const color = (swatch as { background?: string; population?: number })?.background;
          if (!color) return [];
          return [{ key, color, population: (swatch as { population?: number })?.population ?? 0 }];
        })
        .toSorted((a, b) => b.population - a.population)
        .slice(0, 5)
    : [];

  const paintingFrameStyle = useMemo((): CSSProperties => {
    const w = activeImage?.width;
    const h = activeImage?.height;
    if (w && h) {
      const ratio = w / h;
      return {
        aspectRatio: `${w} / ${h}`,
        width: `min(100%, calc(${PAINTING_MAX_HEIGHT} * ${ratio}))`,
        maxHeight: PAINTING_MAX_HEIGHT,
        minHeight: '12rem',
      };
    }
    return { maxHeight: PAINTING_MAX_HEIGHT, minHeight: '12rem', width: '100%' };
  }, [activeImage?.width, activeImage?.height]);

  const ambientFrameShadow = useMemo(
    () => paintingAmbientFrameShadow(activePalette, { dark: isDark }),
    [activePalette, isDark],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!_id) return;

    const storageKey = `painting-view-${_id}`;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      // ignore
    }

    trackEvent(AnalyticsEvent.PAINTING_VIEWED, { painting_id: _id, title });

    void incrementPaintingView({ data: { documentId: _id } }).then(result => {
      if (!result.success) return;
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        // ignore
      }
    });
  }, [_id, title]);

  return (
    <div className='relative min-h-screen overflow-x-clip'>
      <div className='relative z-10 overflow-visible pb-16 pt-32 md:pb-20 md:pt-36 lg:pt-40'>
        <DetailNav
          backHref={galleryHref}
          backLabel='Back to gallery'
          ariaLabel='Painting navigation'
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Paintings', href: galleryHref },
            { label: title },
          ]}
        />

        <section className='mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-x-6 gap-y-10 overflow-visible px-4 text-foreground lg:grid-cols-[minmax(0,1fr)_clamp(17.5rem,30vw,24rem)] lg:gap-x-10 lg:gap-y-8 lg:px-8 xl:gap-x-12'>
          <section className='relative flex w-full min-w-0 flex-col items-center overflow-visible'>
            <div
              className='relative mx-auto w-full max-w-full overflow-visible'
              style={paintingFrameStyle}
            >
              <PaintingFrameGlow glowUrl={activeImage?.glowUrl} lqip={activeImage?.lqip} />
              <SharedLayoutFrame
                slug={typeof slug === 'string' ? slug : ''}
                className={cn(
                  'relative z-10 block h-full w-full overflow-hidden rounded-2xl ring-1 ring-border/20',
                  activeImage?.hasAlpha ? 'bg-neutral-950' : 'bg-background',
                )}
              >
                <motion.div
                  className='pointer-events-none absolute inset-0 z-[5] rounded-2xl'
                  animate={{ boxShadow: ambientFrameShadow }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden
                />
                <div ref={emblaRef} className='relative z-10 h-full w-full overflow-hidden'>
                  <div className='flex h-full w-full touch-pan-y'>
                    {images.map((img, index) => (
                      <div
                        key={img.assetRef ?? index}
                        className={cn(
                          'relative h-full min-w-0 w-full flex-[0_0_100%]',
                          activeImage?.hasAlpha ? 'bg-neutral-950' : 'bg-background',
                        )}
                      >
                        <Image
                          src={img.url}
                          srcSet={img.srcSet}
                          alt={`${title} - Image ${index + 1}`}
                          fill
                          priority={index === 0}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : 'auto'}
                          className={cn(
                            'object-contain',
                            showNsfwBlur && getNsfwImageBlurClass('card'),
                          )}
                          sizes='(max-width: 1024px) 100vw, 72vw'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </SharedLayoutFrame>
            </div>

            {isNSFW && !nsfwRevealed ? (
              <div className='z-10 mt-4 flex flex-col items-center gap-3'>
                <p className='text-sm text-foreground-muted'>
                  Mature content — viewer discretion advised
                </p>
                <Button
                  variant='secondary'
                  className='rounded-full'
                  onClick={() => setNsfwRevealed(true)}
                >
                  Show artwork
                </Button>
              </div>
            ) : null}

            {images.length > 1 ? (
              <div className='z-10 mt-6 flex flex-col items-center gap-2.5'>
                <div className='flex items-center gap-3 sm:gap-2'>
                  <button
                    type='button'
                    onClick={() => emblaApi?.scrollPrev()}
                    className={carouselNavClass}
                    aria-label='Previous image'
                  >
                    <IconChevronLeft className='size-5 sm:size-4' stroke={2} aria-hidden />
                  </button>
                  <div className='flex max-w-[min(calc(100vw-7rem),18rem)] items-center gap-2.5 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] sm:max-w-[min(calc(100vw-5rem),18rem)] [&::-webkit-scrollbar]:hidden'>
                    {images.map((img, index) => (
                      <button
                        key={`${img.assetRef ?? index}-thumb`}
                        type='button'
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                          'relative size-12 shrink-0 overflow-hidden rounded-md border-2 transition-all sm:size-14',
                          index === selectedIndex
                            ? 'border-accent opacity-100 shadow-sm'
                            : 'border-transparent opacity-50 hover:opacity-85',
                        )}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={img.thumbUrl}
                          alt=''
                          fill
                          className='object-cover'
                          sizes='56px'
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type='button'
                    onClick={() => emblaApi?.scrollNext()}
                    className={carouselNavClass}
                    aria-label='Next image'
                  >
                    <IconChevronRight className='size-5 sm:size-4' stroke={2} aria-hidden />
                  </button>
                </div>
                <p className='text-xs tabular-nums text-foreground-muted'>
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            ) : null}

            {video ? (
              <div className='z-10 mt-10 w-full max-w-4xl'>
                <h3 className='mb-3 text-lg font-bold'>Process video</h3>
                <div className='aspect-video overflow-hidden rounded-2xl border border-border bg-black'>
                  <iframe
                    src={`https://www.youtube.com/embed/${new URL(video).pathname.slice(1)}`}
                    className='h-full w-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    title={`${title} process video`}
                  />
                </div>
              </div>
            ) : null}
          </section>

          <aside className='relative z-10 flex w-full min-w-0 flex-col lg:sticky lg:top-32 lg:self-start xl:top-36'>
            <div className='painting-detail-sidebar-glass h-fit w-full rounded-xl p-0 lg:border lg:border-border/30 lg:bg-background/35 lg:p-6 lg:backdrop-blur-xl lg:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:lg:bg-background/25'>
              <div className='flex flex-col gap-5 sm:gap-6'>
                <header className='space-y-4'>
                  <div className='space-y-2.5'>
                    {isFanArt ? (
                      <span className='inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent'>
                        <IconMask className='size-3.5' stroke={2} aria-hidden /> Fan Art
                      </span>
                    ) : null}
                    <h1 className='text-balance text-[1.65rem] font-bold leading-[1.12] tracking-tight sm:text-2xl lg:text-[1.75rem]'>
                      {title}
                    </h1>
                    <div className='flex items-center gap-4 text-sm text-foreground-muted'>
                      <span className='flex items-center gap-1.5'>
                        <IconEye className='size-4' stroke={2} aria-hidden />
                        {viewsCount}
                      </span>
                    </div>
                  </div>
                  <div className='flex w-full max-w-xs flex-col gap-2'>
                    <LikeButton
                      kind='painting'
                      documentId={_id}
                      title={title}
                      likesCount={likesCount}
                      fullWidth
                    />
                    <ShareButton title={title} fullWidth size='medium' className='w-full' />
                  </div>
                </header>

                <dl className='divide-y divide-border/40 border-y border-border/40'>
                  {detailRows.map(row => (
                    <div
                      key={row.label}
                      className='flex items-baseline justify-between gap-4 py-2.5'
                    >
                      <dt className='text-xs font-medium uppercase tracking-wider text-foreground-muted'>
                        {row.label}
                      </dt>
                      <dd className='text-right text-sm font-semibold text-foreground'>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {paletteSwatches.length > 0 ? (
                  <div className='space-y-2.5'>
                    <p className='text-xs font-medium uppercase tracking-wider text-foreground-muted'>
                      Palette
                    </p>
                    <div className='flex overflow-hidden rounded-xl border border-border/40 shadow-sm'>
                      {paletteSwatches.map(swatch => (
                        <div
                          key={`${selectedIndex}-${swatch.key}`}
                          className='relative h-12 flex-1'
                          style={{ backgroundColor: swatch.color }}
                          title={`${SWATCH_LABELS[swatch.key] ?? swatch.key} · ${swatch.color.toUpperCase()}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {tagsV2.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {tagsV2.map(tag =>
                      tag.name ? (
                        <Link key={tag.name} to='/paintings' className='inline-flex'>
                          <Chip variation='primary' label={tag.name} size='small' />
                        </Link>
                      ) : null,
                    )}
                  </div>
                ) : null}

                {description ? (
                  <figure className='space-y-2.5 border-t border-border/40 pt-6'>
                    <figcaption className='text-[11px] font-medium uppercase tracking-widest text-foreground-muted'>
                      About the work
                    </figcaption>
                    <blockquote className='font-serif text-base italic leading-relaxed text-foreground-subtle text-pretty'>
                      {description}
                    </blockquote>
                  </figure>
                ) : null}

                {storeLinks.length > 0 ? (
                  <aside
                    className='space-y-4 border-t border-border/40 pt-6'
                    aria-label='Print shop'
                  >
                    <p className='text-[11px] font-medium uppercase tracking-widest text-foreground-muted'>
                      Print shop
                    </p>
                    <ul className='flex flex-col gap-2'>
                      {storeLinks.map(store => (
                        <li key={store.label}>
                          <a
                            href={store.url}
                            target='_blank'
                            rel='noreferrer'
                            className='group flex items-center gap-3 rounded-xl border border-border/50 bg-background/30 px-3.5 py-3 transition-colors hover:border-accent/35 hover:bg-accent/5'
                          >
                            <span className='flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface text-foreground-muted group-hover:text-accent'>
                              <IconShoppingBag className='size-4' stroke={2} aria-hidden />
                            </span>
                            <span className='min-w-0 grow'>
                              <span className='block text-sm font-semibold'>{store.label}</span>
                              <span className='block text-xs text-foreground-muted'>
                                {store.description}
                              </span>
                            </span>
                            <IconExternalLink
                              className='size-4 shrink-0 text-foreground-muted opacity-60 group-hover:opacity-100'
                              stroke={2}
                              aria-hidden
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </aside>
                ) : null}
              </div>
            </div>
          </aside>
        </section>

        {relatedPaintings.length > 0 ? (
          <section
            aria-labelledby='related-paintings-heading'
            className='mx-auto mt-16 max-w-screen-2xl px-4 lg:px-8'
          >
            <div className='mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5'>
              <h2
                id='related-paintings-heading'
                className='font-serif text-2xl font-bold text-foreground sm:text-3xl'
              >
                Related paintings
              </h2>
              <Link
                to='/paintings'
                className='inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
              >
                View all paintings <IconArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {relatedPaintings.map(related => (
                <li key={related._id} className='min-w-0'>
                  <Link
                    to='/paintings/$slug'
                    params={{ slug: related.slug }}
                    className='group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
                  >
                    <span className='flex min-h-11 items-center justify-between gap-2'>
                      <span className='font-serif text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent'>
                        {related.title}
                      </span>
                      <IconArrowRight
                        className='size-4 shrink-0 text-foreground-muted group-hover:text-accent'
                        aria-hidden
                      />
                    </span>
                    {related.imageUrl ? (
                      <span className='block aspect-square overflow-hidden rounded-xl bg-surface-subtle'>
                        <Image
                          src={related.imageUrl}
                          alt=''
                          width={400}
                          height={400}
                          sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
                          className='h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-102'
                        />
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
