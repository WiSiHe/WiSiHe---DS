'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { isNotEmptyArray } from '@wisihe/utils';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ImageModal from './ImageModal';

type ExtraImagesGridProps = {
  images: NonNullable<ProjectQueryResult>['extraImages'];
};

const ExtraImagesGrid = ({ images }: ExtraImagesGridProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!isNotEmptyArray(images)) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Extra Images</h2>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Previous image"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>

        <button
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Next image"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {images.map((extraImage, index) => {
              if (!extraImage) return null;

              return (
                <div
                  key={extraImage._key}
                  className="relative flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%]"
                >
                  <div
                    className="relative aspect-square mx-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={urlForImage(extraImage)?.width(600).fit('max')?.url() || ''}
                      alt={`Project extra image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
