'use client';

import { IconChevronLeft, IconChevronRight, IconMaximize } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { getCroppedAspectRatio, urlForImage } from '@/sanity/lib/utils';
import ImageModal from './ImageModal';

type ProjectImageProps = {
  project: NonNullable<ProjectQueryResult>;
};

type SanityImage = NonNullable<ProjectQueryResult>['image'];
type SanityImageWithKey = SanityImage & {
  _key?: string;
  aspectRatio?: number | null;
};

const THUMBNAIL_STRIP_MAX = 5;

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

function getImageAspectRatio(img: SanityImage, measured: number | undefined): number {
  if (measured && measured > 0) return measured;
  return getCroppedAspectRatio(img as SanityImageWithKey);
}

type GalleryViewportProps = {
  image: SanityImage;
  alt: string;
  aspectRatio: number;
  priority?: boolean;
  onOpen: () => void;
};

function GalleryViewport({ image, alt, aspectRatio, priority, onOpen }: GalleryViewportProps) {
  const imageUrl = urlForImage(image)?.width(1800).fit('max')?.url() || '';
  const backdropUrl = urlForImage(image)?.width(48).blur(40).fit('crop')?.url() || imageUrl;
  const isPortrait = aspectRatio < 0.95;

  return (
    <motion.button
      type='button'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group/slide relative block cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-foreground/4 p-0',
        isPortrait
          ? 'mx-auto h-[min(75vh,720px)] w-auto max-w-full'
          : 'mx-auto w-full max-h-[min(75vh,720px)]',
      )}
      style={{ aspectRatio: String(aspectRatio) }}
      onClick={onOpen}
      aria-label={`View ${alt} full size`}
    >
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt=''
          fill
          className='scale-110 object-cover opacity-35 blur-2xl saturate-125 dark:opacity-25'
          sizes='100vw'
          aria-hidden
          draggable={false}
        />
      ) : null}

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className='relative z-10 object-contain'
          priority={priority}
          sizes='(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px'
          draggable={false}
        />
      ) : null}

      <span className='pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-background/70 p-2 text-foreground-subtle opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-200 group-hover/slide:opacity-100 sm:right-4 sm:top-4'>
        <IconMaximize className='size-4' aria-hidden />
      </span>
    </motion.button>
  );
}

const ProjectImage = ({ project }: ProjectImageProps) => {
  const { name, client, image, extraImages = [] } = project;
  const projectTitle = getProjectDisplayTitle({ name, client });

  const allImages = useMemo(() => {
    const extras = extraImages ?? [];
    const combined = (image ? [image, ...extras] : extras).filter(Boolean) as SanityImage[];
    return dedupeProjectImages(combined);
  }, [image, extraImages]);

  const hasImages = allImages.length > 0;
  const hasMultiple = allImages.length > 1;
  const showThumbnailStrip = allImages.length <= THUMBNAIL_STRIP_MAX;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [measuredAspects, setMeasuredAspects] = useState<Record<string, number>>({});
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (!hasMultiple) return;
      const total = allImages.length;
      setSelectedIndex(((index % total) + total) % total);
    },
    [allImages.length, hasMultiple],
  );

  const goPrev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex]);
  const goNext = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex]);

  useEffect(() => {
    if (!hasMultiple) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, hasMultiple]);

  useEffect(() => {
    for (const [index, img] of allImages.entries()) {
      if (!img) continue;
      const key = getImageKey(img, index);
      if (measuredAspects[key]) continue;

      const withMeta = img as SanityImageWithKey;
      if (withMeta.aspectRatio) continue;

      const src = urlForImage(img)?.width(32).fit('max')?.url();
      if (!src) continue;

      const probe = new globalThis.Image();
      probe.onload = () => {
        if (!probe.naturalWidth || !probe.naturalHeight) return;
        setMeasuredAspects(current => {
          if (current[key]) return current;
          return {
            ...current,
            [key]: probe.naturalWidth / probe.naturalHeight,
          };
        });
      };
      probe.src = src;
    }
  }, [allImages, measuredAspects]);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  if (!hasImages) {
    return null;
  }

  const safeIndex = Math.min(selectedIndex, allImages.length - 1);
  const currentImage = allImages[safeIndex];
  if (!currentImage) {
    return null;
  }

  const currentKey = getImageKey(currentImage, safeIndex);
  const currentAspect = getImageAspectRatio(currentImage, measuredAspects[currentKey]);
  const currentAlt = currentImage.alt || `${projectTitle} — image ${safeIndex + 1}`;

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null || !hasMultiple) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  return (
    <div>
      <motion.div
        layoutId={`image-${projectTitle}`}
        className='rounded-2xl bg-surface p-1 shadow-md ring-1 ring-border/40'
      >
        <section
          className='relative'
          aria-label={`Project images for ${projectTitle}`}
          aria-roledescription={hasMultiple ? 'carousel' : undefined}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode='wait' initial={false}>
            <GalleryViewport
              key={currentKey}
              image={currentImage}
              alt={currentAlt}
              aspectRatio={currentAspect}
              priority={safeIndex === 0}
              onOpen={() => openModal(safeIndex)}
            />
          </AnimatePresence>
        </section>

        {hasMultiple ? (
          <div className='flex items-center justify-center border-t border-border/40 py-2.5'>
            <div className='flex items-center gap-1'>
              <button
                type='button'
                className='rounded-full p-1.5 text-foreground/80 transition-colors hover:bg-surface-subtle hover:text-foreground'
                onClick={goPrev}
                aria-label='Previous image'
              >
                <IconChevronLeft className='size-4' stroke={2} aria-hidden />
              </button>

              <span className='min-w-14 px-2 text-center text-xs font-medium tabular-nums text-foreground-muted'>
                {selectedIndex + 1} / {allImages.length}
              </span>

              <button
                type='button'
                className='rounded-full p-1.5 text-foreground/80 transition-colors hover:bg-surface-subtle hover:text-foreground'
                onClick={goNext}
                aria-label='Next image'
              >
                <IconChevronRight className='size-4' stroke={2} aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </motion.div>

      {hasMultiple && showThumbnailStrip ? (
        <div className='mt-3 flex justify-center gap-2 px-1 py-1'>
          {allImages.map((img, index) => {
            const thumbUrl = urlForImage(img)?.width(160).height(100).fit('crop').url();
            const isActive = index === selectedIndex;

            return (
              <button
                key={getImageKey(img, index)}
                type='button'
                onClick={() => goTo(index)}
                className={cn(
                  'relative h-14 w-18 shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] duration-200',
                  isActive
                    ? 'border-accent opacity-100'
                    : 'border-transparent opacity-55 hover:opacity-90',
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
                    sizes='72px'
                    draggable={false}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <ImageModal
        images={allImages}
        initialIndex={selectedIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ProjectImage;
