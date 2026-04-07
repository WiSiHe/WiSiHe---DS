'use client';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { urlForImage } from '@/sanity/lib/utils';

type ProjectImageProps = {
  project: NonNullable<ProjectQueryResult>;
};

const ProjectImage = ({ project }: ProjectImageProps) => {
  const { name, image, extraImages = [] } = project;
  const projectTitle = name || 'Untitled Project';

  // Create array with main image first, then extra images
  const allImages = image ? [image, ...extraImages] : extraImages;
  const hasMultipleImages = allImages.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: hasMultipleImages,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setCurrentSlideIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className='relative'>
      {/* Navigation Buttons - only show if multiple images */}
      {hasMultipleImages && (
        <>
          <button
            type='button'
            className='absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface border border-border/30 p-3 text-foreground transition-all hover:bg-accent hover:text-accent-contrast disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label='Previous image'
          >
            <FaChevronLeft className='h-5 w-5' />
          </button>

          <button
            type='button'
            className='absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface border border-border/30 p-3 text-foreground transition-all hover:bg-accent hover:text-accent-contrast disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label='Next image'
          >
            <FaChevronRight className='h-5 w-5' />
          </button>
        </>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className='absolute top-4 left-4 z-10 rounded-full bg-surface border border-border/30 px-3 py-1 text-foreground text-sm shadow-lg'>
          {currentSlideIndex + 1} / {allImages.length}
        </div>
      )}

      {/* Main Carousel Container */}
      <motion.div
        layoutId={`image-${projectTitle}`}
        className='relative aspect-square lg:aspect-video overflow-hidden rounded-xl'
        aria-label={`Project images for ${projectTitle}`}
      >
        {hasMultipleImages ? (
          // Carousel with multiple images
          <div className='overflow-hidden h-full' ref={emblaRef}>
            <div className='flex h-full'>
              {allImages.map((img, index) => {
                if (!img) return null;

                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Carousel item order does not change
                  <div key={`image-${index}`} className='relative flex-[0_0_100%] min-w-0 h-full'>
                    <div className='relative w-full h-full'>
                      <Image
                        src={urlForImage(img)?.width(1200).fit('max')?.url() || ''}
                        alt={`${projectTitle} - Image ${index + 1}`}
                        fill
                        className='object-cover'
                        priority={index === 0}
                        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px'
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Single image (no carousel needed)
          <div className='relative w-full h-full'>
            {image && (
              <Image
                src={urlForImage(image)?.width(1200).fit('max')?.url() || ''}
                alt={`${projectTitle} - Project image`}
                fill
                className='object-cover'
                priority
                sizes='(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px'
                draggable={false}
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectImage;
