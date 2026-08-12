'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from '@/components/ui/Image';
import {
  getProjectGalleryImageKey,
  PROJECT_GALLERY_VIEWPORT_HEIGHT,
  type ProjectGalleryImage,
} from '@/lib/projects/projectGalleryImages';
import { imageUrl } from '@/server/fns';

type ProjectImageGalleryProps = {
  projectTitle: string;
  images: ProjectGalleryImage[];
};

export function ProjectImageGallery({ projectTitle, images }: ProjectImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  if (!images.length) return null;

  return (
    <div className='space-y-4'>
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-border/20 bg-surface-subtle shadow-lg',
          PROJECT_GALLERY_VIEWPORT_HEIGHT,
        )}
      >
        <div className='h-full overflow-hidden' ref={emblaRef}>
          <div className='flex h-full'>
            {images.map((img, index) => {
              const src = imageUrl(img as Parameters<typeof imageUrl>[0], 1400);
              if (!src) return null;
              return (
                <div
                  key={getProjectGalleryImageKey(img, index)}
                  className='relative h-full min-w-0 flex-[0_0_100%]'
                >
                  <Image
                    src={src}
                    alt={img.alt || `${projectTitle} — image ${index + 1}`}
                    fill
                    priority={index === 0}
                    className='object-contain'
                    sizes='(max-width: 1280px) 100vw, 1200px'
                  />
                </div>
              );
            })}
          </div>
        </div>

        {images.length > 1 ? (
          <>
            <button
              type='button'
              onClick={() => emblaApi?.scrollPrev()}
              className='absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/40 bg-background/80 p-2 backdrop-blur-md'
              aria-label='Previous image'
            >
              <IconChevronLeft className='size-5' stroke={2} aria-hidden />
            </button>
            <button
              type='button'
              onClick={() => emblaApi?.scrollNext()}
              className='absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/40 bg-background/80 p-2 backdrop-blur-md'
              aria-label='Next image'
            >
              <IconChevronRight className='size-5' stroke={2} aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <p className='text-center text-xs tabular-nums text-foreground-muted'>
          {selectedIndex + 1} / {images.length}
        </p>
      ) : null}
    </div>
  );
}
