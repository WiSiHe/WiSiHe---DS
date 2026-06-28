'use client';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

type ImageModalProps = {
  images: Array<
    | {
        asset?: { _ref: string; _type: string; _weak?: boolean };
        hotspot?: { x?: number; y?: number };
        crop?: { top?: number; bottom?: number; left?: number; right?: number };
        alt?: string;
        _type: string;
        lqip?: string | null;
      }
    | null
    | undefined
  >;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal = ({ images, initialIndex, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md'>
      {/* Close button */}
      <button
        type='button'
        onClick={onClose}
        className='absolute top-4 right-4 z-10 rounded-full bg-black/60 backdrop-blur-lg p-3 text-white transition-all hover:bg-black/75'
        aria-label='Close modal'
      >
        <IconX className='size-6' stroke={2} aria-hidden />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            type='button'
            onClick={goToPrevious}
            className='absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-lg p-3 text-white transition-all hover:bg-black/75'
            aria-label='Previous image'
          >
            <IconChevronLeft className='size-6' stroke={2} aria-hidden />
          </button>

          <button
            type='button'
            onClick={goToNext}
            className='absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-lg p-3 text-white transition-all hover:bg-black/75'
            aria-label='Next image'
          >
            <IconChevronRight className='size-6' stroke={2} aria-hidden />
          </button>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className='absolute top-4 left-4 z-10 rounded-full bg-black/60 backdrop-blur-lg px-3 py-1 text-white'>
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image */}
      <div className='relative max-h-[90vh] max-w-[90vw] p-4'>
        <Image
          src={urlForImage(currentImage)?.width(1200).fit('max')?.url() || ''}
          alt={`Project image ${currentIndex + 1}`}
          width={1200}
          height={800}
          className='max-h-full max-w-full object-contain'
          priority
        />
      </div>

      {/* Click outside to close */}
      <div className='absolute inset-0 -z-10' onClick={onClose} aria-hidden='true' />
    </div>
  );
};

export default ImageModal;
