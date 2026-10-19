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
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  draggable,
  'aria-hidden': ariaHidden,
}: ImageProps) {
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');

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
        style={style}
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
      style={style}
    />
  );
}
