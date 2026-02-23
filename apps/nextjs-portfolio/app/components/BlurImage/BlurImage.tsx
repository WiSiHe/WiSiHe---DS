import { cn } from '@wisihe/utils';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  quality = 80,
  loading = 'lazy',
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn('transition duration-300', isLoading ? 'blur-xs' : 'blur-0', className)}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading={loading}
      decoding='async'
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt ? alt : 'Background of a beautiful view'}
      quality={quality}
      {...rest}
    />
  );
};
