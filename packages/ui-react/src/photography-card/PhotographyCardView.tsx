import { cn } from '@wisihe/utils';
import type * as React from 'react';

export type PhotographyCardImageComponentProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
};

export type PhotographyCardViewProps = {
  title?: string | null;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  blurDataURL?: string | null;
  /** Width / height ratio of the image; drives the frame aspect. */
  aspectRatio?: number;
  placeLabel?: string | null;
  caption?: string | null;
  yearLabel?: string | null;
  priority?: boolean;
  size?: 'default' | 'large';
  className?: string;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    'aria-label'?: string;
    children: React.ReactNode;
  }>;
  ImageComponent?: React.ComponentType<PhotographyCardImageComponentProps>;
};

function DefaultLink({
  href,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  href: string;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

function DefaultImage({ fill, className, alt = '', src }: PhotographyCardImageComponentProps) {
  const fillStyle = fill
    ? ({ position: 'absolute', inset: 0, width: '100%', height: '100%' } as const)
    : undefined;
  return <img src={src} alt={alt} className={className} style={fillStyle} />;
}

/** Framework-agnostic photography card — pass plain props and optional Link/Image components. */
export function PhotographyCardView({
  title,
  href,
  imageSrc,
  imageAlt,
  blurDataURL,
  aspectRatio = 4 / 3,
  placeLabel,
  caption,
  yearLabel,
  priority = false,
  size = 'default',
  className,
  LinkComponent = DefaultLink,
  ImageComponent = DefaultImage,
}: PhotographyCardViewProps) {
  const alt = imageAlt ?? title ?? 'Photograph';

  return (
    <article className={cn('group', className)}>
      <LinkComponent
        href={href}
        className='block space-y-3.5'
        aria-label={title ?? 'View photograph'}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-2xl bg-surface/60 ring-1 ring-border/45 shadow-sm transition-all duration-500',
            'group-hover:ring-accent/35 group-hover:shadow-xl group-hover:shadow-black/[0.08]',
          )}
          style={{ aspectRatio }}
        >
          <ImageComponent
            src={imageSrc}
            alt={alt}
            fill
            priority={priority}
            className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]'
            sizes={
              size === 'large'
                ? '(max-width: 1024px) 100vw, 66vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL ?? undefined}
          />
          <div
            className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            aria-hidden
          />
          {yearLabel ? (
            <span className='absolute left-3 top-3 rounded-md border border-white/20 bg-black/35 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-white backdrop-blur-md'>
              {yearLabel}
            </span>
          ) : null}
        </div>

        <div className='px-0.5'>
          <h2
            className={cn(
              'font-serif font-bold leading-snug text-foreground text-pretty transition-colors group-hover:text-accent',
              size === 'large' ? 'text-2xl sm:text-[1.65rem]' : 'text-lg sm:text-xl',
            )}
          >
            {title}
          </h2>
          {placeLabel ? (
            <p className='mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted'>
              {placeLabel}
            </p>
          ) : null}
          {caption ? (
            <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
              {caption}
            </p>
          ) : null}
        </div>
      </LinkComponent>
    </article>
  );
}
