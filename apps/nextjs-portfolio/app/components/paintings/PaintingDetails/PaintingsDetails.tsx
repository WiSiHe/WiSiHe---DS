/** biome-ignore-all lint/performance/noImgElement: Necessary for motion.img which doesn't support Next.js Image component easily for this specific transition */
'use client';
import { Button, Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { BiLogoRedbubble, BiRightArrow } from 'react-icons/bi';
import { BsEye, BsHeart, BsHeartFill, BsShare } from 'react-icons/bs';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { TbMasksTheater } from 'react-icons/tb';
import { incrementPaintingLike, incrementPaintingView, removePaintingLike } from '@/app/actions';
import Breadcrumbs, { type Crumb } from '@/app/components/layout/Breadcrumbs/Breadcrumbs';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { urlForImage } from '@/sanity/lib/utils';

// biome-ignore lint/suspicious/noExplicitAny: PaintingQueryResult resolves to null until typegen is fixed
type PaintingDetailProps = {
  paintingData: any;
  breadcrumbs?: Crumb[];
};

const PaintingDetail = ({ paintingData, breadcrumbs }: PaintingDetailProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasAddedView, setHasAddedView] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // biome-ignore lint/suspicious/noExplicitAny: PaintingQueryResult resolves to null until typegen is fixed
  const {
    title,
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
    medium,
    isFanArt,
  } = paintingData as any;

  // Build the list of available stores — easy to extend with more platforms
  const storeLinks: { label: string; url: string; icon: React.ReactNode }[] = [
    ...(redbubbleUrl
      ? [{ label: 'Redbubble', url: redbubbleUrl, icon: <BiLogoRedbubble className='w-4 h-4' /> }]
      : []),
    ...(gelatoUrl
      ? [
          {
            label: 'Gelato',
            url: gelatoUrl,
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

  // Extract dominant palette swatches sorted by population
  const paletteSwatches: { key: string; color: string; population: number }[] = image?.palette
    ? Object.entries(image.palette)
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

  const aspectRatioStyle = (
    {
      landscape: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-portrait',
    } as Record<string, string>
  )[format as string];

  // Combine the primary image + any additional images
  const allImages = [image, ...images];

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

  const formattedPaintedAt = new Date(paintedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

  return (
    <div className='pt-32 min-h-[calc(100vh-5rem)] pb-32 overflow-clip'>
      <section className='grid items-start grid-cols-12 gap-6 mx-auto text-foreground lg:gap-16 max-w-screen-2xl'>
        <section className='relative flex flex-col items-center justify-center w-full p-4 lg:py-20 col-span-full md:col-span-8'>
          <div className='relative w-full'>
            <motion.img
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.45 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring' }}
              src={
                allImages[selectedIndex]?.lqip ??
                urlForImage(allImages[selectedIndex])
                  ?.width(20)
                  .height(20)
                  .quality(10)
                  .blur(100)
                  .url() ??
                ''
              }
              alt={title}
              className={cn(
                'absolute inset-0 object-cover pointer-events-none w-full h-full blur-3xl overflow-clip',
                aspectRatioStyle,
              )}
              aria-hidden='true'
            />

            <motion.div
              layoutId={`image-${title}`}
              className={cn('relative', aspectRatioStyle)}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            >
              <div className='overflow-hidden rounded-3xl w-full h-full shadow-2xl' ref={emblaRef}>
                <div className='flex w-full h-full'>
                  {allImages.map((img, index) => {
                    const { width, height } = getImageDimensions(format);
                    const imageUrl =
                      urlForImage(img)
                        ?.width(width)
                        .height(height)
                        .fit('max')
                        .format('webp')
                        .quality(90) // Increased quality for crispness
                        .url() ?? '';

                    return (
                      <div
                        key={imageUrl || index}
                        className='relative flex-[0_0_100%] w-full h-full min-w-0'
                      >
                        <div className='w-full h-full relative'>
                          <Image
                            src={imageUrl}
                            alt={`${title} - Image ${index + 1}`}
                            priority={index === 0}
                            fill
                            className='object-cover h-full w-full'
                            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 66vw'
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {allImages.length > 1 && (
                <>
                  <button
                    type='button'
                    onClick={scrollPrev}
                    className='absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-surface border border-border hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-all duration-200 text-foreground shadow-xl hover:scale-110'
                    aria-label='Previous image'
                  >
                    <IoChevronBack className='w-6 h-6' />
                  </button>
                  <button
                    type='button'
                    onClick={scrollNext}
                    className='absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-surface border border-border hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-all duration-200 text-foreground shadow-xl hover:scale-110'
                    aria-label='Next image'
                  >
                    <IoChevronForward className='w-6 h-6' />
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {allImages.length > 1 && (
            <div className='z-10 flex items-center justify-center w-full gap-2.5 pt-6'>
              {allImages.map((img, index) => (
                <button
                  key={`${img?.asset?._ref ?? index}`}
                  type='button'
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none',
                    index === selectedIndex
                      ? 'bg-accent scale-125 shadow-lg shadow-accent/50'
                      : 'bg-surface-hover hover:bg-surface-active border border-border-subtle',
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>
        <motion.div
          layout
          className='z-10 flex flex-col col-span-full lg:right-14 lg:bottom-4 lg:top-42 lg:sticky md:col-span-4'
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            className='w-full lg:rounded-2xl pointer-events-auto h-fit lg:bg-surface lg:border lg:border-border p-4 lg:p-8 lg:max-w-[520px] lg:shadow-xl'
          >
            <div className='flex flex-col gap-5'>
              {/* Breadcrumbs */}
              {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />}

              {/* Title + badges */}
              <div className='space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  {isFanArt && (
                    <span className='inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20'>
                      <TbMasksTheater className='w-3.5 h-3.5' /> Fan Art
                    </span>
                  )}
                </div>
                <h1 className='text-2xl lg:text-3xl font-bold text-balance text-foreground leading-tight'>
                  {title}
                </h1>

                {/* Stats + primary actions */}
                <div className='flex items-center flex-wrap gap-3 pt-1'>
                  <div className='flex items-center gap-4 text-sm text-foreground-muted'>
                    <span className='flex items-center gap-1.5'>
                      <BsEye className='w-3.5 h-3.5' /> {viewsCount?.toString() ?? '0'} views
                    </span>
                    <span
                      className={cn('flex items-center gap-1.5', hasLikedLocal && 'text-red-500')}
                    >
                      {hasLikedLocal ? (
                        <BsHeartFill className='w-3.5 h-3.5' />
                      ) : (
                        <BsHeart className='w-3.5 h-3.5' />
                      )}
                      {localLikesCount} likes
                    </span>
                  </div>

                  <div className='flex items-center gap-2 sm:ml-auto'>
                    <Button
                      onClick={handleLike}
                      variant='secondary'
                      className={cn(
                        'gap-2 w-fit rounded-full pl-3 pr-4 shadow-sm transition-colors',
                        hasLikedLocal
                          ? 'text-red-500 hover:text-red-500 border-red-500/20 bg-red-500/10 hover:bg-red-500/20'
                          : '',
                      )}
                    >
                      {hasLikedLocal ? (
                        <BsHeartFill className='w-4 h-4' />
                      ) : (
                        <BsHeart className='w-4 h-4' />
                      )}
                      {hasLikedLocal ? 'Liked' : 'Like'}
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant='secondary'
                      className='gap-2 w-fit rounded-full px-4 shadow-sm'
                    >
                      <BsShare className='w-4 h-4' />
                      {shareText}
                    </Button>
                  </div>
                </div>
              </div>

              <hr className='border-border/40' />

              {/* Details grid — buyer info */}
              <div className='grid grid-cols-2 gap-x-6 gap-y-3'>
                <div className='space-y-0.5'>
                  <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                    Date
                  </p>
                  <p className='text-sm font-semibold text-foreground'>{formattedPaintedAt}</p>
                </div>
                <div className='space-y-0.5'>
                  <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                    Medium
                  </p>
                  <p className='text-sm font-semibold text-foreground'>{medium ?? 'Digital'}</p>
                </div>
                <div className='space-y-0.5'>
                  <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                    Format
                  </p>
                  <p className='text-sm font-semibold text-foreground'>{formatLabel}</p>
                </div>
                {imageWidth && imageHeight && (
                  <div className='space-y-0.5'>
                    <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                      Resolution
                    </p>
                    <p className='text-sm font-semibold text-foreground'>
                      {imageWidth.toLocaleString()} × {imageHeight.toLocaleString()} px
                    </p>
                  </div>
                )}
                <div className='space-y-0.5'>
                  <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                    Background
                  </p>
                  <p className='text-sm font-semibold text-foreground'>
                    {hasAlpha ? '✦ Transparent' : 'Solid'}
                  </p>
                </div>
                <div className='space-y-0.5'>
                  <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                    File type
                  </p>
                  <p className='text-sm font-semibold text-foreground'>
                    {hasAlpha ? 'PNG' : 'JPEG / PNG'}
                  </p>
                </div>
              </div>

              {/* Colour palette — labelled swatches */}
              {paletteSwatches.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-xs font-medium text-foreground-muted uppercase tracking-wider'>
                    Colour Palette
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {paletteSwatches.map(swatch => (
                      <div
                        key={swatch.key}
                        className='flex flex-col items-center gap-1 group cursor-default'
                      >
                        <div
                          className='w-10 h-10 rounded-xl border border-border/40 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md'
                          style={{ backgroundColor: swatch.color }}
                          title={`${SWATCH_LABELS[swatch.key] ?? swatch.key}: ${swatch.color.toUpperCase()}`}
                          aria-label={swatch.color}
                        />
                        <span className='text-[10px] text-foreground-muted leading-tight text-center'>
                          {SWATCH_LABELS[swatch.key] ?? swatch.key}
                        </span>
                        <span className='text-[9px] text-foreground-muted/60 font-mono opacity-0 group-hover:opacity-100 transition-opacity'>
                          {swatch.color.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tagsV2.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {tagsV2.map((tag: { name?: string | null }) => {
                    const { name } = tag;
                    if (!name) return null;
                    return (
                      <Link key={name} href={`/paintings?filter=${name}`}>
                        <Chip variation='primary' label={name} />
                      </Link>
                    );
                  })}
                </div>
              )}

              <hr className='border-border/40' />

              {/* Gallery label */}
              {description && (
                <figure className='space-y-2'>
                  <figcaption className='text-[11px] font-medium uppercase tracking-widest text-foreground-muted'>
                    About the work
                  </figcaption>
                  <blockquote className='border-l-2 border-accent/35 pl-4 font-serif text-sm italic leading-relaxed text-foreground-subtle text-pretty'>
                    {description}
                  </blockquote>
                </figure>
              )}

              {/* Buy CTA — shows when at least one store is configured */}
              {storeLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3'
                >
                  <div>
                    <h2 className='font-semibold text-foreground text-sm'>Available to buy</h2>
                    <p className='text-xs text-foreground-muted mt-0.5'>
                      Prints, posters, stickers and more — shipped worldwide.
                    </p>
                  </div>
                  <div className='flex flex-col gap-2'>
                    {storeLinks.map(store => (
                      <a
                        key={store.label}
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
                        className='flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-accent-contrast font-semibold text-sm transition-colors shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none'
                      >
                        <span className='flex items-center gap-2'>
                          {store.icon}
                          Shop on {store.label}
                        </span>
                        <BiRightArrow className='w-3.5 h-3.5 opacity-70' />
                      </a>
                    ))}
                  </div>
                </motion.div>
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
  );
};

export default PaintingDetail;
