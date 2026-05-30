/** biome-ignore-all lint/performance/noImgElement: Necessary for motion.img which doesn't support Next.js Image component easily for this specific transition */
'use client';
import type { PaintingQueryResult } from '@wisihe/sanity-queries';
import { Button, Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BiLogoRedbubble, BiRightArrow } from 'react-icons/bi';
import { BsClockFill, BsEye, BsHeart, BsHeartFill, BsShare } from 'react-icons/bs';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { TbMasksTheater, TbPalette } from 'react-icons/tb';
import { incrementPaintingLike, incrementPaintingView, removePaintingLike } from '@/app/actions';
import { urlForImage } from '@/sanity/lib/utils';

type PaintingDetailProps = {
  paintingData: Exclude<PaintingQueryResult, null>;
};

const PaintingDetail = ({ paintingData }: PaintingDetailProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasAddedView, setHasAddedView] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const {
    title,
    _id,
    views,
    description,
    tagsV2 = [],
    paintedAt,
    viewsCount,
    likesCount,
    image,
    images = [],
    video,
    redbubbleUrl,
    format,
    medium,
    isFanArt,
  } = paintingData;

  const aspectRatioStyle = {
    landscape: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-portrait',
  }[format];

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

  // On mount, patch painting views
  useEffect(() => {
    const addView = async () => {
      const viewerId = generateOrRetrieveViewerId();

      if (
        Array.isArray(views) &&
        !views.some(view => view.viewerId === viewerId) &&
        !hasAddedView
      ) {
        setHasAddedView(true);
        await incrementPaintingView(_id, viewerId);
      }
    };
    void addView();
  }, [_id, views, hasAddedView, generateOrRetrieveViewerId]);

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
      <section className='grid items-start grid-cols-12 gap-4 mx-auto text-foreground lg:gap-10 max-w-screen-2xl'>
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

            <div className={cn('relative', aspectRatioStyle)}>
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
            </div>
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
          className='z-10 flex flex-col items-center justify-center gap-5 col-span-full lg:right-14 lg:bottom-4 lg:top-42 lg:sticky md:col-span-4'
        >
          <motion.div
            initial={{ scale: 0.8, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0.9, x: -20 }}
            transition={{ type: 'spring' }}
            className='w-full lg:rounded-lg pointer-events-auto h-fit lg:bg-surface lg:border lg:border-border p-4 lg:p-10 lg:max-w-[520px] lg:shadow-2xl lg:cursor-grab'
          >
            <div className={cn('pt-2 flex flex-col gap-4')}>
              <motion.h1
                // layoutId={`title-${title}`}
                className='text-3xl font-bold text-balance text-foreground'
              >
                {title}
              </motion.h1>

              {/* Information Row */}
              <div className='flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-foreground-subtle/80 font-medium'>
                <span className='flex items-center gap-1.5' title='Painting date'>
                  <BsClockFill className='w-3.5 h-3.5' /> {formattedPaintedAt}
                </span>
                {medium && (
                  <span className='flex items-center gap-1.5' title='Medium'>
                    <TbPalette className='w-4 h-4' /> {medium}
                  </span>
                )}
                {isFanArt && (
                  <span className='flex items-center gap-1.5 text-accent' title='Fan art'>
                    <TbMasksTheater className='w-4 h-4' /> Fan Art
                  </span>
                )}
                <span className='flex items-center gap-1.5' title='View count'>
                  <BsEye className='w-4 h-4' /> {viewsCount?.toString() ?? '0'} Views
                </span>
                <span className='flex items-center gap-1.5' title='Like count'>
                  <span className={cn(hasLikedLocal ? 'text-red-500' : '')}>
                    {hasLikedLocal ? (
                      <BsHeartFill className='w-3.5 h-3.5' />
                    ) : (
                      <BsHeart className='w-3.5 h-3.5' />
                    )}
                  </span>
                  {localLikesCount} Likes
                </span>
              </div>

              {/* Taxonomy (Tags) */}
              {tagsV2.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-1'>
                  {tagsV2.map(tag => {
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

              {/* Actions */}
              <div className='flex items-center flex-wrap gap-3 mt-1'>
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

              {redbubbleUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.4 }}
                >
                  <hr className='my-4 border-border/30' />

                  <div className='flex flex-col'>
                    <h2 className='text-2xl font-semibold text-foreground mb-2'>
                      Want to own this piece?
                    </h2>
                    <p className='text-foreground-subtle mb-3'>
                      This painting is available for purchase on my Redbubble store.
                    </p>
                    <a
                      href={redbubbleUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='px-4 py-2.5 mt-2 flex rounded-lg bg-accent hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none font-semibold text-accent-contrast justify-center items-center gap-2 w-fit transition-colors shadow-lg hover:shadow-xl'
                    >
                      <BiLogoRedbubble className='inline' title='Redbubble logo' /> Go to store{' '}
                      <BiRightArrow />
                    </a>
                  </div>
                </motion.div>
              )}
              <p className='whitespace-pre-wrap text-foreground-subtle leading-relaxed'>
                {description}
              </p>
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
