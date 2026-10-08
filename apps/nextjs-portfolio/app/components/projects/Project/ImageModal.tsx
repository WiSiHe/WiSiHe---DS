'use client';

import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import { urlForImage } from '@/sanity/lib/utils';

type SanityModalImage = {
  asset?: { _ref: string; _type: string; _weak?: boolean };
  hotspot?: { x?: number; y?: number };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  alt?: string;
  _type: string;
  lqip?: string | null;
};

type ImageModalProps = {
  images: Array<SanityModalImage | null | undefined>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

const controlButtonClass =
  'rounded-full bg-black/55 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/70';

const ImageModal = ({ images, initialIndex, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const scrollPaneRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `currentIndex` is an intentional trigger — scroll back to the top when the image changes
  useEffect(() => {
    if (!isOpen) return;
    scrollPaneRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentIndex, isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `currentIndex` is an intentional trigger — re-measure the scroll pane when the image changes
  useEffect(() => {
    const scrollPane = scrollPaneRef.current;
    if (!isOpen || !scrollPane) return;

    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation();

      const { scrollTop, scrollHeight, clientHeight } = scrollPane;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return;

      event.preventDefault();
      scrollPane.scrollTop = Math.min(maxScroll, Math.max(0, scrollTop + event.deltaY));
    };

    scrollPane.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      scrollPane.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [isOpen, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, images.length]);

  if (!mounted || !isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];
  const imageUrl = urlForImage(currentImage)?.width(2400).fit('max')?.url() || '';

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return createPortal(
    <div
      className='fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden'
      role='dialog'
      aria-modal='true'
      aria-label='Project image viewer'
    >
      <div className='pointer-events-none absolute inset-0 bg-black/55 backdrop-blur-[2px]' />

      <div className='relative z-10 flex h-14 shrink-0 items-center justify-between gap-4 px-4 sm:h-16 sm:px-5'>
        {images.length > 1 ? (
          <div className='rounded-full bg-black/55 px-3 py-1 text-sm text-white backdrop-blur-md'>
            {currentIndex + 1} / {images.length}
          </div>
        ) : (
          <span />
        )}

        <button
          type='button'
          onClick={onClose}
          className={controlButtonClass}
          aria-label='Close modal'
        >
          <IconX className='size-6' stroke={2} aria-hidden />
        </button>
      </div>

      <div
        ref={scrollPaneRef}
        className='relative z-10 h-[calc(100dvh-3.5rem)] overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] sm:h-[calc(100dvh-4rem)]'
      >
        {/* biome-ignore lint/performance/noImgElement: lightbox needs intrinsic sizing + scroll */}
        <img
          src={imageUrl}
          alt={currentImage?.alt || `Project image ${currentIndex + 1}`}
          className='mx-auto block h-auto w-auto max-w-[min(96vw,1400px)] px-4 pb-16 pt-2 sm:px-8 sm:pb-20'
          style={{ maxHeight: 'none' }}
          draggable={false}
        />
      </div>

      {images.length > 1 ? (
        <>
          <button
            type='button'
            onClick={goToPrevious}
            className={`${controlButtonClass} fixed left-3 top-1/2 z-20 -translate-y-1/2 sm:left-5`}
            aria-label='Previous image'
          >
            <IconChevronLeft className='size-6' stroke={2} aria-hidden />
          </button>

          <button
            type='button'
            onClick={goToNext}
            className={`${controlButtonClass} fixed right-3 top-1/2 z-20 -translate-y-1/2 sm:right-5`}
            aria-label='Next image'
          >
            <IconChevronRight className='size-6' stroke={2} aria-hidden />
          </button>
        </>
      ) : null}
    </div>,
    document.body,
  );
};

export default ImageModal;
