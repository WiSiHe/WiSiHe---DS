'use client';

import { cn } from '@wisihe/utils';
import Image from '@/components/ui/Image';
import { urlForImage } from '@/lib/sanity';
import type { LifeJourneyItem } from './lifeJourneyTypes';
import { formatCityLabel, PlaceFactsGrid } from './PlaceFactsGrid';

type JourneyCityCardProps = {
  item: LifeJourneyItem;
  index: number;
  total: number;
  isActive?: boolean;
  className?: string;
};

export function JourneyCityCard({
  item,
  index,
  total,
  isActive = true,
  className,
}: JourneyCityCardProps) {
  const imageUrl = item.image ? urlForImage(item.image)?.width(900).quality(80).url() : null;
  const cityName = formatCityLabel(item.placeName, item.title);
  const countryLabel = item.placeName?.includes(',') ? item.placeName.split(',')[1]?.trim() : null;

  return (
    <div
      data-journey-card
      className={cn(
        'rounded-2xl border p-5 transition-colors sm:p-6',
        isActive ? 'border-accent-border bg-accent-subtle/40' : 'border-border/50 bg-surface/30',
        className,
      )}
    >
      <div className='mb-4 flex items-center justify-between gap-3'>
        <span className='font-mono text-[10px] tabular-nums text-foreground-muted'>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {countryLabel ? (
          <span className='font-mono text-[10px] uppercase tracking-wider text-foreground-muted'>
            {countryLabel}
          </span>
        ) : null}
      </div>

      <h3 className='font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl'>
        {cityName}
      </h3>

      <PlaceFactsGrid funFact={item.funFact} stats={item.stats} className='mt-4' />

      {imageUrl ? (
        <div className='relative mt-5 aspect-16/10 overflow-hidden rounded-xl border border-border/50'>
          <Image
            src={imageUrl}
            alt={cityName}
            fill
            className='object-cover'
            sizes='(max-width: 1024px) 100vw, 480px'
            placeholder={item.image?.lqip ? 'blur' : 'empty'}
            blurDataURL={item.image?.lqip ?? undefined}
          />
        </div>
      ) : null}
    </div>
  );
}
