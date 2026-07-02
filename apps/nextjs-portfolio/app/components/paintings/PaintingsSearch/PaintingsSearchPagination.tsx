'use client';

import SearchPagination from '@/app/components/search/SearchPagination';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';

export default function PaintingsSearchPagination() {
  const { page, nbPages, nbHits, setPage, status } = usePaintingsSearchContext();

  if (nbHits === 0 || nbPages <= 1) return null;

  return (
    <SearchPagination
      page={page}
      nbPages={nbPages}
      onPageChange={setPage}
      disabled={status === 'loading'}
      ariaLabel='Paintings pagination'
    />
  );
}
