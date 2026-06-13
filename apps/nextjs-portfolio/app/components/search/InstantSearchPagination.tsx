'use client';

import { Pagination, useInstantSearch, useStats } from 'react-instantsearch';
import { instantSearchPaginationClassNames } from '@/lib/algolia/instantSearchPaginationClassNames';

export default function InstantSearchPagination() {
  const { nbHits } = useStats();
  const { status } = useInstantSearch();

  if (nbHits === 0 || status === 'loading' || status === 'stalled') {
    return null;
  }

  return (
    <div className='mt-12 flex justify-center w-full'>
      <Pagination classNames={instantSearchPaginationClassNames} />
    </div>
  );
}
