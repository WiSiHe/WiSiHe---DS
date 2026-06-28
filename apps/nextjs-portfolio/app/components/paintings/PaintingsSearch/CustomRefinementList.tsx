'use client';

import { Checkbox } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { memo, startTransition, useDeferredValue, useState } from 'react';
import { useRefinementList } from 'react-instantsearch';
import { getFacetIcon } from '@/lib/facetIcons';

/** How many items to show initially */
const DEFAULT_VISIBLE = 10;

type FacetItem = {
  label: string;
  value: string;
  count: number;
  isRefined: boolean;
};

type FacetRowProps = {
  item: FacetItem;
  onRefine: (value: string) => void;
};

const FacetRow = memo(function FacetRow({ item, onRefine }: FacetRowProps) {
  const icon = getFacetIcon(item.label);

  return (
    <li className='w-full'>
      <button
        type='button'
        onClick={() => startTransition(() => onRefine(item.value))}
        className={cn(
          'flex items-center gap-2.5 cursor-pointer group w-full text-sm transition-colors py-1.5 px-2 rounded-lg',
          item.isRefined
            ? 'bg-accent/10 text-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <Checkbox
          inputSize='sm'
          checked={item.isRefined}
          className='pointer-events-none'
          label={item.label}
          labelClassName='grow truncate min-w-0 text-sm cursor-pointer pointer-events-none'
        />
        <span
          className={cn(
            'shrink-0 transition-colors',
            item.isRefined
              ? 'text-accent'
              : 'text-muted-foreground/50 group-hover:text-muted-foreground',
          )}
          aria-hidden
        >
          {icon}
        </span>
        <span
          className={cn(
            'text-xs px-1.5 py-0.5 rounded-full font-medium transition-colors shrink-0 min-w-[1.5rem] text-center',
            item.isRefined ? 'bg-accent/20 text-accent' : 'text-muted-foreground',
          )}
        >
          {item.count}
        </span>
      </button>
    </li>
  );
});

export default function CustomRefinementList(props: Parameters<typeof useRefinementList>[0]) {
  const { items, refine } = useRefinementList(props);
  const deferredItems = useDeferredValue(items);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = isExpanded ? deferredItems : deferredItems.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = deferredItems.length - DEFAULT_VISIBLE;
  const canToggle = deferredItems.length > DEFAULT_VISIBLE;

  return (
    <div className='flex flex-col gap-1'>
      <ul className='flex flex-col gap-0.5 w-full'>
        {visibleItems.map(item => (
          <FacetRow key={item.value} item={item} onRefine={refine} />
        ))}
      </ul>

      {canToggle && (
        <button
          type='button'
          onClick={() => setIsExpanded(v => !v)}
          className='mt-1 text-xs text-foreground-muted hover:text-accent transition-colors text-left pl-2 w-fit'
        >
          {isExpanded ? '↑ Show fewer' : `↓ Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
