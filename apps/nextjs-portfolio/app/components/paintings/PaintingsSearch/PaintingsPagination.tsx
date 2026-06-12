'use client';

import { Pagination, useInstantSearch, useStats } from 'react-instantsearch';

export default function PaintingsPagination() {
  const { nbHits } = useStats();
  const { status } = useInstantSearch();

  if (nbHits === 0 || status === 'loading' || status === 'stalled') {
    return null;
  }

  return (
    <div className='mt-12 flex justify-center w-full'>
      <Pagination
        classNames={{
          root: 'flex justify-center',
          list: 'flex items-center gap-1.5',
          item: 'flex items-center',
          link: 'min-w-10 px-2.5 py-2 text-sm rounded-md transition-all duration-200 text-center text-foreground-subtle hover:bg-surface-hover hover:text-foreground border border-transparent',
          selectedItem: 'bg-accent/10 border-accent text-accent font-semibold',
          disabledItem: 'opacity-50 cursor-not-allowed pointer-events-none',
        }}
      />
    </div>
  );
}
