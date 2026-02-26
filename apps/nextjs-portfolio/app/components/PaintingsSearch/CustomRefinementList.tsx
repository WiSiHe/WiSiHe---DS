'use client';

import { Button } from '@wisihe/ui-react';
import { useRefinementList } from 'react-instantsearch';

export default function CustomRefinementList(props: Parameters<typeof useRefinementList>[0]) {
  const { items, refine, canToggleShowMore, isShowingMore, toggleShowMore } =
    useRefinementList(props);

  return (
    <>
      <ul className='flex flex-col gap-1 w-full overflow-hidden'>
        {items.map(item => {
          const isStore = item.label.toLowerCase() === 'store';
          return (
            <li key={item.value} className='w-full'>
              <label
                className={`flex items-center gap-3 cursor-pointer group w-full text-sm transition-colors p-2 rounded-lg ${item.isRefined ? 'bg-accent/10 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <input
                  type='checkbox'
                  checked={item.isRefined}
                  onChange={e => {
                    e.preventDefault();
                    refine(item.value);
                  }}
                  className='rounded border-border/60 text-accent focus:ring-ring bg-background w-4 h-4 shrink-0 transition-colors cursor-pointer'
                />
                <span className={`grow truncate min-w-0 ${isStore ? 'font-bold text-accent' : ''}`}>
                  {item.label}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors shrink-0 ${isStore ? 'bg-accent/20 text-accent' : item.isRefined ? 'bg-background text-foreground tracking-tight shadow-sm border border-border/40' : 'bg-background group-hover:bg-background text-muted-foreground'}`}
                >
                  {item.count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {canToggleShowMore && (
        <Button
          onClick={toggleShowMore}
          variant='tertiary'
          size='small'
          className='mt-2 w-full justify-start pl-2'
        >
          {isShowingMore ? 'Show less' : 'Show more'}
        </Button>
      )}
    </>
  );
}
