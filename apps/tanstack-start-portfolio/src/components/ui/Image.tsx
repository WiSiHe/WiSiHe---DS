import { cn } from '@wisihe/utils';
import type { CSSProperties } from 'react';

type ImageProps = {
  src: string;
  srcSet?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  draggable?: boolean;
  'aria-hidden'?: boolean;
};

export default function Image({
  src,
  srcSet,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
  style,
  loading,
  fetchPriority,
  placeholder,
  blurDataURL,
  draggable,
  'aria-hidden': ariaHidden,
}: ImageProps) {
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  // LQIP as a CSS background: visible while the image loads and hidden once the opaque image paints.
  // No JS state, so there is nothing to mismatch on hydration.
  const resolvedStyle: CSSProperties | undefined =
    placeholder === 'blur' && blurDataURL
      ? {
          backgroundImage: `url("${blurDataURL}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...style,
        }
      : style;

  if (fill) {
    return (
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        aria-hidden={ariaHidden}
        sizes={sizes}
        loading={resolvedLoading}
        fetchPriority={fetchPriority}
        decoding='async'
        draggable={draggable}
        className={cn('absolute inset-0 h-full w-full', className)}
        style={resolvedStyle}
      />
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      aria-hidden={ariaHidden}
      width={width}
      height={height}
      sizes={sizes}
      loading={resolvedLoading}
      fetchPriority={fetchPriority}
      decoding='async'
      draggable={draggable}
      className={className}
      style={resolvedStyle}
    />
  );
}
