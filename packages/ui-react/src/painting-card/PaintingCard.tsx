'use client';

import { cn } from '@wisihe/utils';
import type * as React from 'react';
import { NsfwContentIndicator } from './brush-reveal/NsfwContentIndicator';
import { PaintingCardImageChrome } from './PaintingCardImageChrome';

function ImagePlaceholder() {
  return (
    <div className='relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-surface-subtle via-surface to-surface-elevated'>
      <svg
        aria-hidden='true'
        className='h-12 w-12 text-foreground-muted opacity-40'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z'
        />
      </svg>
    </div>
  );
}

function PaintingCardCaption({
  title,
  badges = [],
}: {
  title: string;
  badges?: PaintingCardBadge[];
}) {
  return (
    <div className='px-0.5 pt-3'>
      <h3 className='line-clamp-2 font-serif text-lg font-bold leading-snug tracking-tight text-foreground text-pretty transition-colors duration-200 group-hover:text-accent sm:text-xl'>
        {title}
      </h3>
      {badges.length > 0 ? (
        <PaintingCardImageChrome badges={badges} tone='surface' className='mt-2.5' />
      ) : null}
    </div>
  );
}

/** @deprecated Use `caption` — kept for adapter compatibility. */
export type PaintingCardLayout = 'default' | 'carousel';

export interface PaintingCardBadge {
  key: string;
  icon: React.ReactNode;
  label: string;
  variant?: import('../icon-badge/IconBadge').IconBadgeProps['variant'];
}

export interface PaintingCardProps {
  title: string;
  href: string;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    'aria-label'?: string;
    children: React.ReactNode;
  }>;
  image?: React.ReactNode;
  badges?: PaintingCardBadge[];
  /** Title below image — SFW carousel slides only. */
  caption?: boolean;
  /** @deprecated NSFW uses on-image badge only — kept for adapter compatibility. */
  nsfwFooter?: boolean;
  /** @deprecated Carousel captions no longer show attribute badges. */
  captionBadges?: boolean;
  /** @deprecated Caption modes no longer show painted year. */
  paintedAt?: string;
  matureContentLabel?: string;
  /** Aspect ratio class on the image frame. */
  className?: string;
}

/** Painting card shell — reveal (grid band) or caption (carousel). */
export function PaintingCard({
  title,
  href,
  LinkComponent,
  image,
  badges = [],
  caption = false,
  captionBadges = false,
  matureContentLabel,
  className,
}: PaintingCardProps) {
  const aspectClass = className ?? 'aspect-[3/4]';
  const LinkEl = LinkComponent ?? 'a';
  const linkLabel = `View painting: ${title}${matureContentLabel ? ' (mature content)' : ''}`;

  const imageFrame = (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl',
        caption && 'border border-border/40 bg-surface shadow-sm',
        caption &&
          'transition-[border-color,box-shadow] duration-300 group-hover:border-border group-hover:shadow-md',
        aspectClass,
      )}
    >
      <div className='absolute inset-0'>{image ?? <ImagePlaceholder />}</div>
      {matureContentLabel ? (
        <div className='pointer-events-none absolute top-2 left-2 z-20'>
          <NsfwContentIndicator label={matureContentLabel} compact />
        </div>
      ) : null}
      {!caption && badges.length > 0 ? (
        <PaintingCardImageChrome
          badges={badges}
          tone='overlay'
          className='pointer-events-none absolute top-2 right-2 z-20'
        />
      ) : null}
    </div>
  );

  if (caption) {
    return (
      <article className='group w-full rounded-xl focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background'>
        <LinkEl href={href} className='block' aria-label={linkLabel}>
          {imageFrame}
          <PaintingCardCaption title={title} badges={captionBadges ? badges : []} />
        </LinkEl>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group relative w-full overflow-hidden rounded-xl border border-border/40 bg-surface',
        aspectClass,
      )}
    >
      {imageFrame}
      <LinkEl href={href} className='absolute inset-0 z-[1]' aria-label={linkLabel}>
        <span className='sr-only'>{linkLabel}</span>
      </LinkEl>
    </article>
  );
}
