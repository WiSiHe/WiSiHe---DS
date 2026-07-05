'use client';

import { Pagination } from '@wisihe/ui-react';
import { useInstantSearch, usePagination, useStats } from 'react-instantsearch';
import { useScrollToResultsOnPageChange } from '@/lib/pagination/useScrollToResultsOnPageChange';

type InstantSearchPaginationProps = Readonly<{
  scrollTargetId?: string;
  ariaLabel?: string;
}>;

export default function InstantSearchPagination({
  scrollTargetId = 'projects-results',
  ariaLabel = 'Search pagination',
}: InstantSearchPaginationProps) {
  const { nbHits } = useStats();
  const { status } = useInstantSearch();
  const { currentRefinement, nbPages, refine } = usePagination({ padding: 2 });

  useScrollToResultsOnPageChange({
    page: currentRefinement,
    isLoading: status === 'loading' || status === 'stalled',
    targetId: scrollTargetId,
  });

  if (nbHits === 0 || nbPages <= 1) return null;

  return (
    <Pagination
      page={currentRefinement}
      nbPages={nbPages}
      onPageChange={refine}
      disabled={status === 'loading' || status === 'stalled'}
      ariaLabel={ariaLabel}
    />
  );
}
