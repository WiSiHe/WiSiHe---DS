'use client';

import { Button, Checkbox } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { useState } from 'react';
import { useRefinementList } from 'react-instantsearch';

/** How many items to show initially (before "Show more") */
const DEFAULT_VISIBLE = 10;

export default function CustomRefinementList(props: Parameters<typeof useRefinementList>[0]) {
  const { items, refine } = useRefinementList(props);
  const [isExpanded, setIsExpanded] = useState(false);

  // Slice for display — when collapsed only show the first DEFAULT_VISIBLE.
  // transformItems (applied before we receive items) has already pinned Store to index 0
  // and Algolia fetches all items at once (see limit prop in PaintingsSearch).
  const visibleItems = isExpanded ? items : items.slice(0, DEFAULT_VISIBLE);
  const canToggle = items.length > DEFAULT_VISIBLE;

  return (
    <>
      <ul className='flex flex-col gap-0.5 w-full overflow-hidden'>
        {visibleItems.map(item => {
          const isStore = item.label.toLowerCase() === 'store';
          return (
            <li key={item.value} className='w-full'>
              <button
                type='button'
                onClick={() => refine(item.value)}
                className={cn(
                  'flex items-center gap-3 cursor-pointer group w-full text-sm transition-colors py-1.5 px-2 rounded-lg',
                  item.isRefined
                    ? 'bg-accent/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Checkbox
                  inputSize='sm'
                  checked={item.isRefined}
                  onChange={() => refine(item.value)}
                  label={item.label}
                  labelClassName={cn(
                    'grow truncate min-w-0 text-sm',
                    isStore && 'font-bold text-accent',
                  )}
                />
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium transition-colors shrink-0',
                    isStore
                      ? 'bg-accent/20 text-accent'
                      : item.isRefined
                        ? 'bg-background text-foreground tracking-tight shadow-sm border border-border/40'
                        : 'bg-background group-hover:bg-background text-muted-foreground',
                  )}
                >
                  {item.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {canToggle && (
        <Button
          onClick={() => setIsExpanded(prev => !prev)}
          variant='tertiary'
          size='small'
          className='mt-2 w-full justify-start pl-2'
        >
          {isExpanded ? 'Show less' : `Show ${items.length - DEFAULT_VISIBLE} more`}
        </Button>
      )}
    </>
  );
}
