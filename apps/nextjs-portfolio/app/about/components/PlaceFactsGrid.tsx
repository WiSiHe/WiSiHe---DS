'use client';

import { cn } from '@wisihe/utils';
import type { PlaceStat } from './lifeJourneyTypes';

type PlaceFactsGridProps = {
  funFact?: string | null;
  stats?: PlaceStat[] | null;
  className?: string;
  funFactClassName?: string;
};

export function formatCityLabel(placeName?: string | null, fallback?: string | null) {
  if (placeName) {
    const city = placeName.split(',')[0]?.trim();
    if (city) return city;
  }
  return fallback?.trim() || 'Place';
}

export function PlaceFactsGrid({
  funFact,
  stats,
  className,
  funFactClassName,
}: PlaceFactsGridProps) {
  const statItems = stats ?? [];
  if (!funFact && statItems.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {funFact ? (
        <p
          className={cn(
            'rounded-lg border border-accent/25 bg-accent/8 px-3 py-2 text-sm leading-relaxed text-foreground text-pretty',
            funFactClassName,
          )}
        >
          {funFact}
        </p>
      ) : null}

      {statItems.length > 0 ? (
        <dl className='grid grid-cols-2 gap-2'>
          {statItems.map(stat => (
            <div
              key={`${stat.label}-${stat.value}`}
              className='rounded-lg border border-border/50 bg-surface/50 px-3 py-2'
            >
              <dt className='font-mono text-[10px] uppercase tracking-wider text-foreground-muted'>
                {stat.label}
              </dt>
              <dd className='mt-0.5 text-sm font-medium text-foreground'>{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
