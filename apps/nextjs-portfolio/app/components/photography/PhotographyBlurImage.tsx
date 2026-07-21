'use client';

import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { useState } from 'react';
import { PHOTOGRAPHY_IMAGE_QUALITY } from '@/lib/photography/photographyImage';

type PhotographyBlurImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  /** Object-fit for the loaded image. */
  objectFit?: 'cover' | 'contain';
};

/**
 * Safari-friendly blur-up: LQIP as a CSS background (visible immediately),
 * then fade the full image in on load. Next's built-in `placeholder="blur"`
 * is unreliable with `unoptimized` CDN URLs in Safari.
 */
export function PhotographyBlurImage({
  src,
  alt,
  fill = true,
  className,
  sizes,
  priority = false,
  blurDataURL,
  quality = PHOTOGRAPHY_IMAGE_QUALITY,
  objectFit = 'cover',
}: PhotographyBlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const hasLqip = Boolean(blurDataURL);

  return (
    <>
      {hasLqip ? (
        <div
          aria-hidden
          className='absolute inset-0 scale-105 bg-cover bg-center'
          style={{ backgroundImage: `url("${blurDataURL}")` }}
        />
      ) : (
        <div aria-hidden className='absolute inset-0 bg-surface-subtle' />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        fetchPriority={priority ? 'high' : 'auto'}
        // Sanity CDN URL is already width/height/quality/format optimized.
        unoptimized
        placeholder='empty'
        onLoad={() => setLoaded(true)}
        className={cn(
          'z-[1]',
          objectFit === 'contain' ? 'object-contain' : 'object-cover',
          'transition-[opacity,transform] duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </>
  );
}
