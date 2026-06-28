'use client';

import { cn } from '@wisihe/utils';
import { memo, useMemo, useState } from 'react';
import type { PaintingsFacetItem } from '@/lib/algolia/paintingsSearch/types';

const DEFAULT_VISIBLE = 8;

type FacetRowProps = {
  item: PaintingsFacetItem;
  onToggle: (value: string) => void;
};

const FacetRow = memo(
  function FacetRow({ item, onToggle }: FacetRowProps) {
    return (
      <li className='w-full'>
        <button
          type='button'
          onClick={() => onToggle(item.value)}
          className={cn(
            'flex w-full items-center gap-2.5 cursor-pointer group text-sm py-1.5 px-2 rounded-lg',
            item.isRefined
              ? 'bg-accent/10 text-foreground'
              : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded border',
              item.isRefined
                ? 'border-accent bg-accent text-accent-contrast'
                : 'border-border bg-surface group-hover:border-foreground-muted',
            )}
          >
            {item.isRefined ? (
              <svg
                viewBox='0 0 12 12'
                className='size-2.5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden
              >
                <path d='M2 6l3 3 5-5' />
              </svg>
            ) : null}
          </span>
          <span className='grow truncate min-w-0 text-left text-sm'>{item.label}</span>
          <span
            className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 min-w-6 text-center tabular-nums',
              item.isRefined ? 'bg-accent/20 text-accent' : 'text-foreground-muted',
            )}
          >
            {item.count}
          </span>
        </button>
      </li>
    );
  },
  (prev, next) =>
    prev.item.value === next.item.value &&
    prev.item.isRefined === next.item.isRefined &&
    prev.item.count === next.item.count &&
    prev.onToggle === next.onToggle,
);

type PaintingsFacetListProps = {
  items: PaintingsFacetItem[];
  onToggle: (value: string) => void;
};

export default function PaintingsFacetList({ items, onToggle }: PaintingsFacetListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = useMemo(
    () => (isExpanded ? items : items.slice(0, DEFAULT_VISIBLE)),
    [isExpanded, items],
  );
  const hiddenCount = items.length - DEFAULT_VISIBLE;
  const canToggle = items.length > DEFAULT_VISIBLE;

  return (
    <div className='flex flex-col gap-1'>
      <ul className='flex flex-col gap-0.5 w-full'>
        {visibleItems.map(item => (
          <FacetRow key={item.value} item={item} onToggle={onToggle} />
        ))}
      </ul>

      {canToggle ? (
        <button
          type='button'
          onClick={() => setIsExpanded(v => !v)}
          className='mt-1 text-xs text-foreground-muted hover:text-accent text-left pl-2 w-fit'
        >
          {isExpanded ? '↑ Show fewer' : `↓ Show ${hiddenCount} more`}
        </button>
      ) : null}
    </div>
  );
}
