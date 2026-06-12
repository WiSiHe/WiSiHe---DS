'use client';

import { cn } from '@wisihe/utils';
import { getLocationMeta, type LifeJourneyItem } from './lifeJourneyTypes';

type JourneyMapProgressProps = {
  items: LifeJourneyItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function JourneyMapProgress({ items, activeIndex, onSelect }: JourneyMapProgressProps) {
  if (items.length === 0) return null;

  return (
    <div
      className='hidden shrink-0 rounded-xl border border-border/50 bg-background/80 p-3 backdrop-blur-md lg:block'
      aria-label='Journey progress'
    >
      <div className='mb-2 flex items-center justify-between gap-2'>
        <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent'>
          Route
        </p>
        <p className='text-[10px] text-foreground-muted'>
          {activeIndex + 1} / {items.length}
        </p>
      </div>
      <ol className='flex flex-col gap-1'>
        {items.map((item, index) => {
          const meta = getLocationMeta(item.locationType);
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <li key={item._key}>
              <button
                type='button'
                onClick={() => onSelect(index)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                  isActive
                    ? 'bg-accent/10 text-foreground'
                    : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full ring-1',
                    meta.markerClass,
                    isPast && 'opacity-50',
                    isActive && 'scale-125 ring-2',
                  )}
                  aria-hidden
                />
                <span className='min-w-0 flex-1 truncate text-xs font-medium'>
                  {item.placeName ?? item.title ?? `Stop ${index + 1}`}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
