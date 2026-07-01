'use client';

import { IconChevronLeft, IconChevronRight, IconMaximize } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { urlForImage } from '@/sanity/lib/utils';
import ImageModal from './ImageModal';
import { ProjectImagePlaceholder } from './ProjectImagePlaceholder';

type ProjectImageProps = {
  project: NonNullable<ProjectQueryResult>;
};

type SanityImage = NonNullable<ProjectQueryResult>['image'];
type SanityImageWithKey = SanityImage & { _key?: string };

function dedupeProjectImages(images: SanityImage[]): SanityImage[] {
  const seen = new Set<string>();

  return images.filter(img => {
    const ref = img?.asset?._ref;
    if (!ref) return true;
    if (seen.has(ref)) return false;
    seen.add(ref);
    return true;
  });
}

function getImageKey(img: SanityImage, index: number): string {
  const keyed = img as SanityImageWithKey;
  if (keyed._key) return keyed._key;
  return `slide-${index}-${img?.asset?._ref ?? 'unknown'}`;
}

const ProjectImage = ({ project }: ProjectImageProps) => {
  const { name, client, image, extraImages = [] } = project;
  const projectTitle = getProjectDisplayTitle({ name, client });

  const allImages = useMemo(() => {
    const combined = (image ? [image, ...extraImages] : extraImages).filter(
      Boolean,
    ) as SanityImage[];
    return dedupeProjectImages(combined);
  }, [image, extraImages]);

  const hasImages = allImages.length > 0;
  const hasMultiple = allImages.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: hasMultiple,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
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

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  return (
    <div className='space-y-4'>
      <motion.div
        layoutId={`image-${projectTitle}`}
        className='overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm'
      >
        <div className='relative bg-linear-to-br from-accent/8 via-surface-subtle to-surface-subtle'>
          <div className='p-4 md:p-6 lg:p-8'>
            <section
              className={cn(
                'relative overflow-hidden rounded-2xl bg-surface-subtle/60 ring-1 ring-border/40',
                hasImages ? 'aspect-16/10 lg:aspect-2/1' : 'aspect-16/10 max-h-[420px]',
              )}
              aria-label={hasImages ? `Project images for ${projectTitle}` : undefined}
            >
              {hasImages ? (
                <>
                  <div className='h-full overflow-hidden' ref={emblaRef}>
                    <div className='flex h-full'>
                      {allImages.map((img, index) => (
                        <div
                          key={getImageKey(img, index)}
                          className='relative min-w-0 flex-[0_0_100%] h-full'
                        >
                          <button
                            type='button'
                            className='group/slide relative h-full w-full cursor-zoom-in border-0 bg-transparent p-0'
                            onClick={() => openModal(index)}
                            aria-label={`View image ${index + 1} of ${allImages.length} full size`}
                          >
                            <Image
                              src={urlForImage(img)?.width(1600).fit('max')?.url() || ''}
                              alt={img?.alt || `${projectTitle} — image ${index + 1}`}
                              fill
                              className='object-contain p-3 md:p-4 transition-transform duration-500 group-hover/slide:scale-[1.01]'
                              priority={index === 0}
                              sizes='(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px'
                              draggable={false}
                            />
                            <span className='pointer-events-none absolute right-3 top-3 rounded-full border border-border/60 bg-background/85 p-2 text-foreground-subtle opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover/slide:opacity-100'>
                              <IconMaximize className='size-4' aria-hidden />
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {hasMultiple ? (
                    <div className='pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-3 md:flex'>
                      <button
                        type='button'
                        className='pointer-events-auto rounded-full border border-border/60 bg-background/90 p-2.5 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-contrast disabled:cursor-not-allowed disabled:opacity-40'
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        aria-label='Previous image'
                      >
                        <IconChevronLeft className='size-5' stroke={2} aria-hidden />
                      </button>
                      <button
                        type='button'
                        className='pointer-events-auto rounded-full border border-border/60 bg-background/90 p-2.5 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-contrast disabled:cursor-not-allowed disabled:opacity-40'
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        aria-label='Next image'
                      >
                        <IconChevronRight className='size-5' stroke={2} aria-hidden />
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <ProjectImagePlaceholder title={name ?? client} />
              )}
            </section>
          </div>
        </div>

        {hasMultiple ? (
          <div className='flex flex-col gap-3 border-t border-border/60 bg-surface px-4 py-3 md:px-6 md:py-4'>
            <div className='flex items-center justify-between gap-3'>
              <p className='text-sm font-medium text-foreground-subtle'>
                Image {selectedIndex + 1} of {allImages.length}
              </p>
              <div className='flex items-center gap-2 md:hidden'>
                <button
                  type='button'
                  className='rounded-full border border-border/60 bg-surface-subtle p-2 text-foreground disabled:opacity-40'
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  aria-label='Previous image'
                >
                  <IconChevronLeft className='size-4' aria-hidden />
                </button>
                <button
                  type='button'
                  className='rounded-full border border-border/60 bg-surface-subtle p-2 text-foreground disabled:opacity-40'
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  aria-label='Next image'
                >
                  <IconChevronRight className='size-4' aria-hidden />
                </button>
              </div>
            </div>

            <div className='flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden'>
              {allImages.map((img, index) => {
                const thumbUrl = urlForImage(img)?.width(160).height(120).fit('crop').url();
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={getImageKey(img, index)}
                    type='button'
                    onClick={() => scrollTo(index)}
                    className={cn(
                      'relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-[border-color,opacity,transform] duration-200',
                      isActive
                        ? 'border-accent opacity-100 ring-2 ring-accent/20'
                        : 'border-border/60 opacity-70 hover:border-accent/40 hover:opacity-100',
                    )}
                    aria-label={`Show image ${index + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt=''
                        fill
                        className='object-cover'
                        sizes='96px'
                        draggable={false}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </motion.div>

      {hasImages ? (
        <ImageModal
          images={allImages}
          initialIndex={selectedIndex}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default ProjectImage;
