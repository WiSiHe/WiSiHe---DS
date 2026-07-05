import type { CSSProperties, ImgHTMLAttributes } from 'react';

type NextImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
};

/** Storybook stand-in for `next/image` — renders a plain `<img>`. */
export default function Image({
  fill,
  priority: _priority,
  fetchPriority: _fetchPriority,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  sizes: _sizes,
  quality: _quality,
  style,
  className,
  alt = '',
  ...props
}: NextImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : undefined;

  return <img {...props} alt={alt} className={className} style={{ ...fillStyle, ...style }} />;
}
