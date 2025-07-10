'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ImageModal from './ImageModal';

type ProjectImageProps = {
  project: NonNullable<ProjectQueryResult>;
};

const ProjectImage = ({ project }: ProjectImageProps) => {
  const { name, image, connectedPage, extraImages = [] } = project;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  return (
    <div className="relative">
      {/* Navigation Buttons - only show if multiple images */}
      {hasMultipleImages && (
        <>
          <button
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous image"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>

          <button
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next image"
          >
            <FaChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute top-4 left-4 z-10 rounded-full bg-black/50 px-3 py-1 text-white text-sm">
          {currentSlideIndex + 1} / {allImages.length}
        </div>
      )}

      {/* Main Carousel Container */}
      <motion.div
        layoutId={`image-${projectTitle}`}
        className="relative aspect-square lg:aspect-video overflow-hidden rounded-xl"
        aria-label={`Project images for ${projectTitle}`}
      >
        {hasMultipleImages ? (
          // Carousel with multiple images
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {allImages.map((img, index) => {
                if (!img) return null;

                return (
                  <div key={`image-${index}`} className="relative flex-[0_0_100%] min-w-0 h-full">
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={urlForImage(img)?.width(1200).fit('max')?.url() || ''}
                        alt={`${projectTitle} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Single image (no carousel needed)
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            {image && (
              <Image
                src={urlForImage(image)?.width(1200).fit('max')?.url() || ''}
                alt={`${projectTitle} - Project image`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
              />
            )}
          </div>
        )}

        {/* Connected page iframe - overlay on top */}
        {connectedPage && (
          <iframe
            src={connectedPage}
            className="absolute inset-0 w-full h-full rounded-xl"
            title={`Connected page for ${projectTitle}`}
            loading="lazy"
          />
        )}
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectImage;
