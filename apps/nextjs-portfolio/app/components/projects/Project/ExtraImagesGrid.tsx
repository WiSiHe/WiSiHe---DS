'use client';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { isNotEmptyArray } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import ImageModal from './ImageModal';

type ExtraImagesGridProps = {
  images: NonNullable<NonNullable<ProjectQueryResult>['extraImages']>;
};

const ExtraImagesGrid = ({ images }: ExtraImagesGridProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onInit();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('init', onInit);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('init', onInit);
    };
  }, [emblaApi, onSelect, onInit]);

  if (!isNotEmptyArray(images)) return null;

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold font-serif text-foreground'>Additional Images</h2>

      <div className='relative'>
        <div className='overflow-hidden rounded-xl border border-border/20' ref={emblaRef}>
          <div className='flex'>
            {images.map((extraImage, index) => {
              if (!extraImage) return null;

              return (
                <div key={extraImage._key} className='relative flex-[0_0_100%] min-w-0'>
                  <button
                    type='button'
                    className='relative aspect-video cursor-pointer w-full p-0 border-0 bg-transparent'
                    onClick={() => handleImageClick(index)}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <Image
                      src={urlForImage(extraImage)?.width(1200).fit('max')?.url() || ''}
                      alt={`Project extra image ${index + 1}`}
                      fill
                      className='object-cover'
                      loading={index === 0 ? 'eager' : 'lazy'}
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1200px'
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <div className='flex justify-between items-center mt-4'>
            <button
              type='button'
              className='flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-full cursor-pointer bg-accent text-accent-contrast disabled:opacity-50 hover:bg-accent-hover shadow-lg'
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label='Previous image'
            >
              <IconArrowNarrowLeft className='w-6 h-6' />
            </button>

            {/* Dots navigation */}
            {scrollSnaps.length > 1 && (
              <div className='flex gap-2'>
                {scrollSnaps.map((_, index) => (
                  <button
                    type='button'
                    // biome-ignore lint/suspicious/noArrayIndexKey: scroll snaps have no other stable identifier
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent'
                        : 'bg-surface-hover hover:bg-surface-subtle'
                    }`}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <button
              type='button'
              className='flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-full cursor-pointer bg-accent text-accent-contrast disabled:opacity-50 hover:bg-accent-hover shadow-lg'
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label='Next image'
            >
              <IconArrowNarrowRight className='w-6 h-6' />
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ExtraImagesGrid;
