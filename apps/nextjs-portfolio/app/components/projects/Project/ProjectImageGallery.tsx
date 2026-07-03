'use client';

import { IconChevronLeft, IconChevronRight, IconMaximize } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { contentImageLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
import type { ProjectGalleryImage } from '@/lib/projects/projectGalleryImages';
import {
  getProjectGalleryImageKey,
  PROJECT_GALLERY_VIEWPORT_HEIGHT,
} from '@/lib/projects/projectGalleryImages';
import { urlForImage } from '@/sanity/lib/utils';
import ImageModal from './ImageModal';
import { ProjectHeroSlideInteractive } from './ProjectHeroSlideInteractive';

type ProjectImageGalleryProps = {
  projectTitle: string;
  allImages: ProjectGalleryImage[];
  heroSlide: ReactNode;
};

const navButtonClass =
  'flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition-[background-color,transform,border-color] duration-200 hover:border-white/35 hover:bg-black/60 active:scale-95 sm:size-10';

type GalleryViewportProps = {
  image: ProjectGalleryImage;
  alt: string;
  onOpen: () => void;
};

function GalleryViewport({ image, alt, onOpen }: GalleryViewportProps) {
  const lqip = image.lqip ?? undefined;
  const imageUrl = urlForImage(image)?.width(1200).fit('max')?.url() || '';
  const backdropUrl = urlForImage(image)?.width(48).blur(40).fit('crop')?.url() || imageUrl;

  return (
    <motion.button
      type='button'
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className='group/slide absolute inset-0 flex cursor-zoom-in items-center justify-center overflow-hidden border-0 bg-neutral-950/90 p-0'
      onClick={onOpen}
      aria-label={`View ${alt} full size`}
    >
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt=''
          fill
          className='scale-125 object-cover opacity-50 blur-3xl saturate-150'
          sizes='100vw'
          aria-hidden
          draggable={false}
        />
      ) : null}

      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/10'
        aria-hidden
      />

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className='relative z-10 object-contain p-2 sm:p-4'
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
          sizes='(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px'
          draggable={false}
        />
      ) : null}

      <span className='pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white/90 opacity-100 shadow-lg backdrop-blur-md sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover/slide:opacity-100'>
        <IconMaximize className='size-3.5' aria-hidden />
        Full size
      </span>
    </motion.button>
  );
}

type GalleryNavProps = {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onOpen: () => void;
};

function GalleryOverlayNav({ index, total, onPrev, onNext, onOpen }: GalleryNavProps) {
  const progress = ((index + 1) / total) * 100;

  return (
    <>
      <button
        type='button'
        className={cn(navButtonClass, 'absolute left-3 top-1/2 z-30 -translate-y-1/2')}
        onClick={onPrev}
        aria-label='Previous image'
      >
        <IconChevronLeft className='size-6 sm:size-5' stroke={2.25} aria-hidden />
      </button>

      <button
        type='button'
        className={cn(navButtonClass, 'absolute right-3 top-1/2 z-30 -translate-y-1/2')}
        onClick={onNext}
        aria-label='Next image'
      >
        <IconChevronRight className='size-6 sm:size-5' stroke={2.25} aria-hidden />
      </button>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 bg-white/10'>
        <motion.div
          className='h-full bg-accent'
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className='absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2'>
        <span className='rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 font-mono text-xs font-semibold tabular-nums text-white shadow-lg backdrop-blur-md'>
          {index + 1}
          <span className='text-white/50'> / </span>
          {total}
        </span>
        <button
          type='button'
          className={cn(navButtonClass, 'sm:hidden')}
          onClick={onOpen}
          aria-label='View full size'
        >
          <IconMaximize className='size-5' aria-hidden />
        </button>
      </div>
    </>
  );
}

type FilmstripProps = {
  images: ProjectGalleryImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  stripRef: RefObject<HTMLDivElement | null>;
};

function GalleryFilmstrip({ images, selectedIndex, onSelect, stripRef }: FilmstripProps) {
  return (
    <div className='border-t border-border/40 bg-surface-subtle/40 px-3 py-3 sm:px-4'>
      <div
        ref={stripRef}
        className='flex gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {images.map((img, index) => {
          const thumbUrl = urlForImage(img)?.width(200).height(120).fit('crop').url();
          const isActive = index === selectedIndex;

          return (
            <button
              key={getProjectGalleryImageKey(img, index)}
              type='button'
              onClick={() => onSelect(index)}
              data-active={isActive ? '' : undefined}
              className={cn(
                'relative h-16 w-24 shrink-0 snap-center overflow-hidden rounded-lg border-2 transition-[border-color,opacity,transform] duration-200 sm:h-[4.5rem] sm:w-28',
                isActive
                  ? 'scale-100 border-accent opacity-100 ring-2 ring-accent/25'
                  : 'scale-[0.97] border-transparent opacity-50 hover:scale-[0.99] hover:opacity-85',
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
                  sizes='112px'
                  draggable={false}
                />
              ) : (
                <span className='absolute inset-0 bg-surface-subtle' aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectImageGallery({
  projectTitle,
  allImages,
  heroSlide,
}: ProjectImageGalleryProps) {
  const hasMultiple = allImages.length > 1;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

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
    const strip = filmstripRef.current;
    if (!strip || !hasMultiple) return;

    const active = strip.querySelector<HTMLElement>('[data-active]');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedIndex, hasMultiple]);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const safeIndex = Math.min(selectedIndex, allImages.length - 1);
  const currentImage = allImages[safeIndex];
  if (!currentImage) {
    return null;
  }

  const currentKey = getProjectGalleryImageKey(currentImage, safeIndex);
  const currentAlt = currentImage.alt || `${projectTitle} — image ${safeIndex + 1}`;
  const firstAlt = allImages[0]?.alt || `${projectTitle} — image 1`;

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
    <div className='space-y-0'>
      <motion.div
        layoutId={contentImageLayoutId(projectTitle)}
        initial={false}
        transition={sharedLayoutTransition}
        className='overflow-hidden rounded-2xl bg-surface shadow-lg ring-1 ring-border/50'
      >
        <section
          className={cn('relative w-full overflow-hidden', PROJECT_GALLERY_VIEWPORT_HEIGHT)}
          aria-label={`Project images for ${projectTitle}`}
          aria-roledescription={hasMultiple ? 'carousel' : undefined}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode='wait' initial={false}>
            {safeIndex === 0 ? (
              <ProjectHeroSlideInteractive
                key='hero-slide-0'
                alt={firstAlt}
                onOpen={() => openModal(0)}
              >
                {heroSlide}
              </ProjectHeroSlideInteractive>
            ) : (
              <GalleryViewport
                key={currentKey}
                image={currentImage}
                alt={currentAlt}
                onOpen={() => openModal(safeIndex)}
              />
            )}
          </AnimatePresence>

          {hasMultiple ? (
            <GalleryOverlayNav
              index={safeIndex}
              total={allImages.length}
              onPrev={goPrev}
              onNext={goNext}
              onOpen={() => openModal(safeIndex)}
            />
          ) : null}
        </section>

        {hasMultiple ? (
          <GalleryFilmstrip
            images={allImages}
            selectedIndex={safeIndex}
            onSelect={goTo}
            stripRef={filmstripRef}
          />
        ) : null}
      </motion.div>

      <ImageModal
        images={allImages}
        initialIndex={selectedIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
