'use client';
import {
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconMask,
  IconShare,
  IconShoppingBag,
} from '@tabler/icons-react';
import { Button, Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { incrementPaintingLike, incrementPaintingView, removePaintingLike } from '@/app/actions';
import { SharedLayoutFrame } from '@/app/components/motion/SharedLayoutFrame';
import { PaintingsDetailNav } from '@/app/components/paintings/PaintingDetails/PaintingsDetailNav';
import { useTheme } from '@/app/providers';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { getPaintingImageLqip } from '@/lib/paintings/paintingCardImage';
import {
  PAINTING_VIEWPORT_GRAIN_OPACITY,
  paintingAmbientFrameShadow,
  paintingGrainOverlayStyle,
  paintingViewportWashStyle,
  type SanityPalette,
} from '@/lib/paintings/paintingPaletteGlow';
import { paintingsTagSearchHref } from '@/lib/paintings/paintingsGalleryReturnUrl';
import { urlForImage } from '@/sanity/lib/utils';

// biome-ignore lint/suspicious/noExplicitAny: PaintingQueryResult resolves to null until typegen is fixed
type PaintingDetailProps = {
  paintingData: any;
};

const paintingCarouselNavButtonClass = cn(
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full touch-manipulation',
  'text-foreground-muted transition-colors',
  'hover:bg-surface-hover hover:text-foreground',
  'active:bg-surface-active active:text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

const viewportWashTransition = { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const };

type PaintingViewportWashProps = {
  palette?: SanityPalette | null;
  dark: boolean;
  slideKey: number;
  layout: 'mobile' | 'desktop';
};

function PaintingViewportWash({ palette, dark, slideKey, layout }: PaintingViewportWashProps) {
  const washStyle = useMemo(
    () => paintingViewportWashStyle(palette, { dark, layout }),
    [palette, dark, layout],
  );
  const grainStyle = useMemo(() => paintingGrainOverlayStyle(), []);
  const layoutClassName = cn(
    'pointer-events-none z-0',
    layout === 'mobile'
      ? 'absolute inset-0 min-h-full w-full lg:hidden'
      : 'fixed inset-0 hidden lg:block',
  );

  return (
    <>
      <AnimatePresence mode='sync'>
        <motion.div
          key={slideKey}
          aria-hidden
          className={layoutClassName}
          style={washStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={viewportWashTransition}
        />
      </AnimatePresence>
      <motion.div
        aria-hidden
        className={cn(layoutClassName, 'mix-blend-soft-light')}
        style={grainStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: PAINTING_VIEWPORT_GRAIN_OPACITY }}
        transition={viewportWashTransition}
      />
    </>
  );
}

const PaintingDetail = ({ paintingData }: PaintingDetailProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasAddedView, setHasAddedView] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // biome-ignore lint/suspicious/noExplicitAny: PaintingQueryResult resolves to null until typegen is fixed
  const {
    title,
    slug,
    _id,
    description,
    tagsV2 = [],
    paintedAt,
    viewsCount,
    likesCount,
    image,
    images = [],
    video,
    redbubbleUrl,
    gelatoUrl,
    format,
    isFanArt,
  } = paintingData as any;

  // Build the list of available stores — easy to extend with more platforms
  const storeLinks: {
    label: string;
    url: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    ...(redbubbleUrl
      ? [
          {
            label: 'Redbubble',
            url: redbubbleUrl,
            description: 'Prints, stickers & apparel',
            icon: <IconShoppingBag className='size-4' stroke={2} aria-hidden />,
          },
        ]
      : []),
    ...(gelatoUrl
      ? [
          {
            label: 'Gelato',
            url: gelatoUrl,
            description: 'Museum-quality fine art prints',
            icon: <span className='text-xs font-black leading-none'>G</span>,
          },
        ]
      : []),
  ];

  const imageWidth: number | null = image?.width ?? null;
  const imageHeight: number | null = image?.height ?? null;
  const hasAlpha: boolean = image?.hasAlpha ?? false;
  const formatLabel =
    format === 'portrait' ? 'Portrait' : format === 'landscape' ? 'Landscape' : 'Square';

  // Palette swatch labels for display
  const SWATCH_LABELS: Record<string, string> = {
    dominant: 'Dominant',
    vibrant: 'Vibrant',
    lightVibrant: 'Light',
    darkVibrant: 'Dark',
    muted: 'Muted',
    lightMuted: 'Lt. Muted',
    darkMuted: 'Dk. Muted',
  };

  const formattedPaintedAt = new Date(paintedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Curated definition list — only the fields worth surfacing to a viewer.
  const formatAspectClass = (
    {
      landscape: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-portrait',
    } as Record<string, string>
  )[format as string];

  const PAINTING_MAX_HEIGHT = 'min(78vh, 920px)';

  // Primary image + extras, deduped by asset ref
  const allImages = useMemo(() => {
    const combined = [image, ...(images ?? [])].filter((img): img is NonNullable<typeof image> =>
      Boolean(img?.asset?._ref),
    );
    const seen = new Set<string>();

    return combined.filter(img => {
      const ref = img.asset?._ref;
      if (!ref || seen.has(ref)) return false;
      seen.add(ref);
      return true;
    });
  }, [image, images]);

  const activeImage = allImages[selectedIndex] ?? image;
  const activeWidth: number | null = activeImage?.width ?? imageWidth;
  const activeHeight: number | null = activeImage?.height ?? imageHeight;
  const activeHasAlpha: boolean = activeImage?.hasAlpha ?? hasAlpha;
  const activePalette = activeImage?.palette ?? image?.palette;

  const detailRows: { label: string; value: string }[] = [
    { label: 'Date', value: formattedPaintedAt },
    { label: 'Format', value: formatLabel },
    ...(activeWidth && activeHeight
      ? [
          {
            label: 'Resolution',
            value: `${activeWidth.toLocaleString()} × ${activeHeight.toLocaleString()} px`,
          },
        ]
      : []),
    ...(activeHasAlpha ? [{ label: 'Background', value: 'Transparent' }] : []),
  ];

  const paletteSwatches: { key: string; color: string; population: number }[] = activePalette
    ? Object.entries(activePalette)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, swatch]: [string, any]) => ({
          key,
          color: swatch?.background as string,
          population: (swatch?.population as number) ?? 0,
        }))
        .filter(s => s.color)
        .sort((a, b) => b.population - a.population)
        .slice(0, 5)
    : [];

  const paintingFrameStyle = useMemo((): CSSProperties => {
    if (activeWidth && activeHeight) {
      const ratio = activeWidth / activeHeight;
      return {
        aspectRatio: `${activeWidth} / ${activeHeight}`,
        width: `min(100%, calc(${PAINTING_MAX_HEIGHT} * ${ratio}))`,
        maxHeight: PAINTING_MAX_HEIGHT,
        minHeight: '12rem',
      };
    }
    return { maxHeight: PAINTING_MAX_HEIGHT, minHeight: '12rem', width: '100%' };
  }, [activeWidth, activeHeight]);

  const ambientFrameShadow = useMemo(
    () => paintingAmbientFrameShadow(activePalette, { dark: isDark }),
    [activePalette, isDark],
  );

  const glowTransition = { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  const generateOrRetrieveViewerId = useCallback((): string => {
    try {
      let viewerId = localStorage.getItem('viewerId');
      if (!viewerId) {
        viewerId = crypto.randomUUID();
        localStorage.setItem('viewerId', viewerId);
      }
      return viewerId;
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      // Fallback if localStorage fails
      return crypto.randomUUID();
    }
  }, []);

  const [localLikesCount, setLocalLikesCount] = useState<number>(likesCount ?? 0);
  const [hasLikedLocal, setHasLikedLocal] = useState(false);
  const [shareText, setShareText] = useState('Share');

  // Check if liked previously
  useEffect(() => {
    try {
      const likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '{}');
      if (likedPaintings[_id]) {
        setHasLikedLocal(true);
      }
    } catch (err) {
      console.error('Failed to parse likedPaintings from localStorage', err);
    }
  }, [_id]);

  const handleLike = async () => {
    const likerId = generateOrRetrieveViewerId();

    if (hasLikedLocal) {
      // Optimistic update
      setLocalLikesCount(prev => Math.max(0, prev - 1));
      setHasLikedLocal(false);

      try {
        const likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '{}');
        delete likedPaintings[_id];
        localStorage.setItem('likedPaintings', JSON.stringify(likedPaintings));
      } catch (err) {
        console.error('Failed to update likedPaintings in localStorage', err);
      }

      trackEvent(AnalyticsEvent.PAINTING_UNLIKED, { painting_id: _id, title });
      await removePaintingLike(_id, likerId);
    } else {
      // Optimistic update
      setLocalLikesCount(prev => prev + 1);
      setHasLikedLocal(true);

      try {
        const likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '{}');
        likedPaintings[_id] = true;
        localStorage.setItem('likedPaintings', JSON.stringify(likedPaintings));
      } catch (err) {
        console.error('Failed to update likedPaintings in localStorage', err);
      }

      trackEvent(AnalyticsEvent.PAINTING_LIKED, { painting_id: _id, title });
      await incrementPaintingLike(_id, likerId);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing natively', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2500);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    }
  };

  // On mount, track view via PostHog + increment Sanity counter
  // Deduplication: localStorage key prevents counting the same painting twice per device
  useEffect(() => {
    const addView = async () => {
      if (hasAddedView) return;
      const storageKey = `viewed_${_id}`;
      try {
        if (localStorage.getItem(storageKey)) return;
        setHasAddedView(true);
        localStorage.setItem(storageKey, '1');
        // Track in PostHog for analytics
        trackEvent(AnalyticsEvent.PAINTING_VIEWED, { painting_id: _id, title });
        // Increment counter in Sanity (no array, just inc)
        await incrementPaintingView(_id);
      } catch {
        // localStorage blocked (private browsing etc.) — still track in PostHog
        trackEvent(AnalyticsEvent.PAINTING_VIEWED, { painting_id: _id, title });
        await incrementPaintingView(_id);
      }
    };
    void addView();
  }, [_id, title, hasAddedView]);

  // Provide higher max bounds to allow next/image to serve crisp retina images
  const getImageDimensions = (format: string) => {
    switch (format) {
      case 'landscape':
        return { width: 2400, height: 1350 };
      case 'portrait':
        return { width: 1600, height: 2133 };
      default:
        return { width: 2000, height: 2000 };
    }
  };

  const getThumbUrl = (img: (typeof allImages)[number]) =>
    urlForImage(img)?.width(128).height(128).fit('crop').format('webp').quality(70).url() ?? '';

  return (
    <div className='relative min-h-screen'>
      <PaintingViewportWash
        palette={activePalette}
        dark={isDark}
        slideKey={selectedIndex}
        layout='mobile'
      />
      <PaintingViewportWash
        palette={activePalette}
        dark={isDark}
        slideKey={selectedIndex}
        layout='desktop'
      />

      <div className='relative z-10 overflow-visible pb-16 pt-32 md:pb-20 md:pt-36 lg:pt-40'>
        <PaintingsDetailNav title={title ?? 'Painting'} />
        <section className='mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-x-6 gap-y-10 overflow-visible px-4 text-foreground lg:grid-cols-[minmax(0,1fr)_clamp(17.5rem,30vw,24rem)] lg:gap-x-10 lg:gap-y-8 lg:px-8 xl:gap-x-12'>
          <section className='relative flex w-full min-w-0 flex-col items-center overflow-visible'>
            <div
              className={cn(
                'relative mx-auto w-full max-w-full overflow-visible',
                !(activeWidth && activeHeight) && cn('max-h-[min(78vh,920px)]', formatAspectClass),
              )}
              style={paintingFrameStyle}
            >
              <SharedLayoutFrame
                slug={typeof slug === 'string' ? slug : ''}
                className={cn(
                  'relative z-10 block h-full w-full overflow-hidden rounded-2xl ring-1 ring-border/20',
                  activeHasAlpha ? 'bg-neutral-950' : 'bg-background',
                )}
              >
                <motion.div
                  className='pointer-events-none absolute inset-0 z-[5] rounded-2xl'
                  animate={{ boxShadow: ambientFrameShadow }}
                  transition={glowTransition}
                  aria-hidden
                />
                <div ref={emblaRef} className='relative z-10 h-full w-full overflow-hidden'>
                  <div className='flex h-full w-full touch-pan-y'>
                    {allImages.map((img, index) => {
                      const slideWidth = img?.width ?? imageWidth;
                      const slideHeight = img?.height ?? imageHeight;
                      const fallback = getImageDimensions(format);
                      const width = slideWidth ?? fallback.width;
                      const height = slideHeight ?? fallback.height;
                      const lqip = getPaintingImageLqip(img);
                      const imageUrl =
                        urlForImage(img)
                          ?.width(width)
                          .height(height)
                          .fit('max')
                          .format('webp')
                          .quality(90)
                          .url() ?? '';

                      return (
                        <div
                          key={img?.asset?._ref ?? index}
                          className={cn(
                            'relative h-full min-w-0 w-full flex-[0_0_100%]',
                            activeHasAlpha ? 'bg-neutral-950' : 'bg-background',
                          )}
                        >
                          {!imageUrl && !lqip ? (
                            <div
                              className='absolute inset-0 bg-surface-subtle motion-safe:animate-pulse'
                              aria-hidden
                            />
                          ) : null}
                          {imageUrl ? (
                            <motion.div layout='position' className='relative h-full w-full'>
                              <Image
                                src={imageUrl}
                                alt={`${title} - Image ${index + 1}`}
                                priority={index === 0}
                                fill
                                placeholder='empty'
                                className='object-contain'
                                sizes='(max-width: 1024px) 100vw, 72vw'
                              />
                            </motion.div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SharedLayoutFrame>
            </div>

            {allImages.length > 1 ? (
              <div className='z-10 mt-6 flex flex-col items-center gap-2.5'>
                <div className='flex items-center gap-3 sm:gap-2'>
                  <button
                    type='button'
                    onClick={scrollPrev}
                    className={paintingCarouselNavButtonClass}
                    aria-label='Previous image'
                  >
                    <IconChevronLeft className='size-5 sm:size-4' stroke={2} aria-hidden />
                  </button>

                  <div className='flex max-w-[min(calc(100vw-7rem),18rem)] items-center gap-2.5 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] sm:max-w-[min(calc(100vw-5rem),18rem)] sm:gap-2 sm:py-0.5 [&::-webkit-scrollbar]:hidden'>
                    {allImages.map((img, index) => {
                      const thumbUrl = getThumbUrl(img);
                      const isActive = index === selectedIndex;

                      return (
                        <button
                          key={`${img?.asset?._ref ?? index}-thumb`}
                          type='button'
                          onClick={() => emblaApi?.scrollTo(index)}
                          className={cn(
                            'relative size-12 shrink-0 touch-manipulation overflow-hidden rounded-md border-2 transition-all duration-200 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-14',
                            isActive
                              ? 'border-accent opacity-100 shadow-sm'
                              : 'border-transparent opacity-50 hover:opacity-85',
                          )}
                          aria-label={`View image ${index + 1}`}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          {thumbUrl ? (
                            <Image
                              src={thumbUrl}
                              alt=''
                              fill
                              className='object-cover'
                              sizes='56px'
                            />
                          ) : (
                            <span className='flex size-full items-center justify-center bg-surface-hover text-xs font-medium text-foreground-muted'>
                              {index + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type='button'
                    onClick={scrollNext}
                    className={paintingCarouselNavButtonClass}
                    aria-label='Next image'
                  >
                    <IconChevronRight className='size-5 sm:size-4' stroke={2} aria-hidden />
                  </button>
                </div>

                <p className='text-xs tabular-nums text-foreground-muted'>
                  {selectedIndex + 1} / {allImages.length}
                </p>
              </div>
            ) : null}
          </section>
          <motion.div
            layout
            className='relative z-10 flex w-full min-w-0 flex-col max-lg:pt-2 lg:sticky lg:top-32 lg:self-start xl:top-36'
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'painting-detail-sidebar-glass pointer-events-auto h-fit w-full min-w-0 max-w-none',
                'lg:min-w-[17.5rem] lg:rounded-xl lg:p-6',
                'lg:border lg:border-border/30 lg:ring-1 lg:ring-white/10 dark:lg:ring-white/5',
                'lg:bg-background/35 lg:backdrop-blur-xl lg:backdrop-saturate-[1.4]',
                'lg:shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
                'dark:lg:bg-background/25 dark:lg:shadow-[0_12px_40px_rgba(0,0,0,0.25)]',
              )}
            >
              <div className='flex flex-col gap-5 sm:gap-6'>
                {/* Header — title, stats, actions */}
                <header className='space-y-4'>
                  <div className='space-y-2.5'>
                    {isFanArt && (
                      <span className='inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent'>
                        <IconMask className='size-3.5' stroke={2} aria-hidden /> Fan Art
                      </span>
                    )}
                    <h1 className='text-balance text-[1.65rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-2xl lg:text-[1.75rem]'>
                      {title}
                    </h1>
                    <div className='flex items-center gap-4 text-sm text-foreground-muted'>
                      <span className='flex items-center gap-1.5'>
                        <IconEye className='size-4' stroke={2} aria-hidden />
                        {viewsCount?.toString() ?? '0'}
                      </span>
                      <span
                        className={cn('flex items-center gap-1.5', hasLikedLocal && 'text-accent')}
                      >
                        {hasLikedLocal ? (
                          <IconHeartFilled className='size-4' stroke={2} aria-hidden />
                        ) : (
                          <IconHeart className='size-4' stroke={2} aria-hidden />
                        )}
                        {localLikesCount}
                      </span>
                    </div>
                  </div>

                  {/* Primary actions */}
                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={handleLike}
                      variant='secondary'
                      className={cn(
                        'flex-1 gap-2 rounded-full transition-colors max-lg:shadow-none',
                        hasLikedLocal
                          ? 'border-accent/20 bg-accent/10 text-accent hover:bg-accent/20 hover:text-accent'
                          : '',
                      )}
                    >
                      {hasLikedLocal ? (
                        <IconHeartFilled className='size-4' stroke={2} aria-hidden />
                      ) : (
                        <IconHeart className='size-4' stroke={2} aria-hidden />
                      )}
                      {hasLikedLocal ? 'Liked' : 'Like'}
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant='secondary'
                      className='flex-1 gap-2 rounded-full max-lg:shadow-none'
                    >
                      <IconShare className='size-4' stroke={2} aria-hidden />
                      {shareText}
                    </Button>
                  </div>
                </header>

                {/* Details — hairline definition list */}
                <dl className='divide-y divide-border/40 border-y border-border/40'>
                  {detailRows.map(row => (
                    <div
                      key={row.label}
                      className='flex items-baseline justify-between gap-4 py-2.5'
                    >
                      <dt className='text-xs font-medium uppercase tracking-wider text-foreground-muted'>
                        {row.label}
                      </dt>
                      <dd className='text-right text-sm font-semibold text-foreground [overflow-wrap:anywhere] sm:overflow-visible sm:[overflow-wrap:normal]'>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Colour palette — connected swatch bar */}
                {paletteSwatches.length > 0 && (
                  <div className='space-y-2.5'>
                    <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                      Palette
                    </p>
                    <div className='flex overflow-hidden rounded-xl border border-border/40 shadow-sm'>
                      {paletteSwatches.map(swatch => (
                        <div
                          key={`${selectedIndex}-${swatch.key}`}
                          className='group relative flex-1 h-12 cursor-default transition-[flex,background-color] duration-700 ease-out hover:flex-[1.6]'
                          style={{ backgroundColor: swatch.color }}
                          title={`${SWATCH_LABELS[swatch.key] ?? swatch.key} · ${swatch.color.toUpperCase()}`}
                          aria-label={`${SWATCH_LABELS[swatch.key] ?? swatch.key}: ${swatch.color}`}
                        >
                          <span className='pointer-events-none absolute inset-x-0 bottom-1 text-center text-[9px] font-mono font-medium text-white opacity-0 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] transition-opacity duration-200 group-hover:opacity-100'>
                            {swatch.color.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tagsV2.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {tagsV2.map((tag: { name?: string | null }) => {
                      const { name } = tag;
                      if (!name) return null;
                      return (
                        <Link
                          key={name}
                          href={paintingsTagSearchHref(name)}
                          className='inline-flex'
                        >
                          <Chip
                            variation='primary'
                            label={name}
                            size='small'
                            className='max-lg:text-xs'
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* About the work */}
                {description && (
                  <figure className='space-y-2.5 border-t border-border/40 pt-6'>
                    <figcaption className='text-[11px] font-medium uppercase tracking-widest text-foreground-muted'>
                      About the work
                    </figcaption>
                    <blockquote className='font-serif text-base italic leading-relaxed text-foreground-subtle text-pretty'>
                      {description}
                    </blockquote>
                  </figure>
                )}

                {/* Buy CTA — shows when at least one store is configured */}
                {storeLinks.length > 0 && (
                  <motion.aside
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    aria-label='Print shop'
                    className='space-y-4 border-t border-border/40 pt-6'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='space-y-1.5'>
                        <p className='text-[11px] font-medium uppercase tracking-widest text-foreground-muted'>
                          Print shop
                        </p>
                        <p className='text-sm leading-snug text-foreground-subtle text-pretty'>
                          Order prints and merchandise — shipped worldwide.
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className='inline-flex shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/8 p-2 text-accent'
                      >
                        <IconShoppingBag className='size-4' stroke={2} />
                      </span>
                    </div>

                    <ul className='flex flex-col gap-2'>
                      {storeLinks.map(store => (
                        <li key={store.label}>
                          <a
                            href={store.url}
                            target='_blank'
                            rel='noreferrer'
                            onClick={() =>
                              trackEvent(AnalyticsEvent.PAINTING_STORE_LINK_CLICKED, {
                                painting_id: _id,
                                title,
                                store: store.label,
                              })
                            }
                            className={cn(
                              'group flex items-center gap-3 rounded-xl border border-border/50 bg-background/30 px-3.5 py-3',
                              'transition-colors duration-150',
                              'hover:border-accent/35 hover:bg-accent/5',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                'flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface',
                                'text-foreground-muted transition-colors duration-150',
                                'group-hover:border-accent/30 group-hover:text-accent',
                              )}
                            >
                              {store.icon}
                            </span>
                            <span className='min-w-0 grow'>
                              <span className='block text-sm font-semibold text-foreground'>
                                {store.label}
                              </span>
                              <span className='block text-xs text-foreground-muted'>
                                {store.description}
                              </span>
                            </span>
                            <IconExternalLink
                              className='size-4 shrink-0 text-foreground-muted opacity-60 transition-opacity duration-150 group-hover:opacity-100'
                              stroke={2}
                              aria-hidden
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.aside>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Optional video below the image */}
        {video && (
          <div className='grid lg:hidden items-start grid-cols-12 max-w-7xl w-full gap-10 py-20 mx-auto text-foreground'>
            <div className='relative rounded-sm col-span-full aspect-video md:col-span-8 w-full overflow-clip'>
              <iframe
                src={`https://www.youtube.com/embed/${new URL(video).pathname.slice(1)}`}
                className='w-full h-full rounded-sm'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                title='Connected Video'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaintingDetail;
