'use client';

import { IconX } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import type { PlaceImage, PlaceStat } from './lifeJourneyTypes';
import { PlaceFactsGrid } from './PlaceFactsGrid';

type MapPlaceSidePanelProps = {
  title: string;
  subtitle?: string | null;
  notes?: string | null;
  funFact?: string | null;
  stats?: PlaceStat[] | null;
  image?: PlaceImage | null;
  onClose: () => void;
  className?: string;
};

function resolveImageUrl(image: PlaceImage | null | undefined) {
  if (!image) return null;
  return urlForImage(image)?.width(720).height(480).quality(82).url() ?? null;
}

export function MapPlaceSidePanel({
  title,
  subtitle,
  notes,
  funFact,
  stats,
  image,
  onClose,
  className,
}: MapPlaceSidePanelProps) {
  const imageUrl = resolveImageUrl(image);

  return (
    <aside
      className={cn(
        'absolute z-30 flex flex-col overflow-hidden border border-border/60 bg-background/98 shadow-2xl backdrop-blur-md',
        'bottom-0 left-0 right-0 max-h-[min(68dvh,440px)] rounded-t-2xl border-b-0',
        'pb-[max(0px,env(safe-area-inset-bottom))]',
        'sm:bottom-0 sm:left-auto sm:right-0 sm:top-0 sm:max-h-none sm:w-[min(100%,20rem)] sm:rounded-none sm:rounded-l-xl sm:border-b sm:border-r-0 sm:pb-0',
        className,
      )}
      aria-label={`Details for ${title}`}
    >
      {imageUrl ? (
        <div className='relative aspect-16/10 w-full shrink-0 border-b border-border/50 sm:aspect-4/3'>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, 320px'
            placeholder={image?.lqip ? 'blur' : 'empty'}
            blurDataURL={image?.lqip ?? undefined}
          />
        </div>
      ) : null}

      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='font-serif text-lg font-bold leading-tight text-foreground'>{title}</h3>
            {subtitle ? (
              <p className='mt-1 font-mono text-[10px] uppercase tracking-wider text-foreground-muted'>
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type='button'
            onClick={onClose}
            className='shrink-0 rounded-md p-2 text-foreground-muted transition-colors hover:bg-surface hover:text-foreground'
            aria-label='Close place details'
          >
            <IconX className='size-4' stroke={2} aria-hidden />
          </button>
        </div>

        {notes ? (
          <p className='mt-3 text-sm leading-relaxed text-foreground-subtle text-pretty'>{notes}</p>
        ) : null}

        <PlaceFactsGrid funFact={funFact} stats={stats} className='mt-3' />
      </div>
    </aside>
  );
}
