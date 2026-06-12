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
    <div className={cn('space-y-4', className)}>
      {funFact ? (
        <blockquote
          className={cn(
            'relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-accent/12 via-surface/80 to-background/60 px-4 py-3.5 sm:px-5 sm:py-4',
            funFactClassName,
          )}
        >
          <div
            className='pointer-events-none absolute -right-3 -top-3 size-16 rounded-full bg-accent/10 blur-2xl'
            aria-hidden
          />
          <p className='relative font-serif text-base leading-relaxed text-foreground text-pretty sm:text-[1.05rem]'>
            <span className='text-accent/50' aria-hidden>
              &ldquo;
            </span>
            {funFact}
            <span className='text-accent/50' aria-hidden>
              &rdquo;
            </span>
          </p>
        </blockquote>
      ) : null}

      {statItems.length > 0 ? (
        <dl className='grid grid-cols-2 gap-3'>
          {statItems.map(stat => (
            <div
              key={`${stat.label}-${stat.value}`}
              className='group rounded-xl border border-border/40 bg-background/50 px-3.5 py-3 transition-colors hover:border-accent/30 hover:bg-background/80'
            >
              <dt className='font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted'>
                {stat.label}
              </dt>
              <dd className='mt-1 font-medium leading-snug text-foreground'>{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
