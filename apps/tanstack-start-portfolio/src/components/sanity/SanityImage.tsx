import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { useState } from 'react';
import { urlForImage } from '../../lib/sanity';

interface SanityImageProps {
  asset: Parameters<typeof urlForImage>[0] | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function SanityImage({ asset, alt, className, width, height, priority }: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!asset) return null;

  let imageUrl = urlForImage(asset).auto('format').quality(80);
  if (width) imageUrl = imageUrl.width(width);
  if (height) imageUrl = imageUrl.height(height);

  const blurUrl = urlForImage(asset).width(20).blur(10).url();

  return (
    <div className={cn('relative overflow-hidden bg-surface-subtle', className)}>
      {/* Low-quality placeholder */}
      {!isLoaded && (
        <img
          src={blurUrl}
          alt=''
          className='absolute inset-0 h-full w-full object-cover blur-xl scale-110'
          aria-hidden='true'
        />
      )}

      <motion.img
        src={imageUrl.url()}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-transform duration-700',
          isLoaded ? 'scale-100' : 'scale-105',
        )}
      />
    </div>
  );
}
