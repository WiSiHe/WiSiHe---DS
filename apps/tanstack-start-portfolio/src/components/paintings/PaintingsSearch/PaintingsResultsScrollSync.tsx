'use client';

import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';
import { useScrollToResultsOnPageChange } from '@/lib/pagination/useScrollToResultsOnPageChange';

export default function PaintingsResultsScrollSync() {
  const { page, status } = usePaintingsSearchContext();

  useScrollToResultsOnPageChange({
    page,
    isLoading: status === 'loading',
    targetId: 'paintings-results',
  });

  return null;
}
