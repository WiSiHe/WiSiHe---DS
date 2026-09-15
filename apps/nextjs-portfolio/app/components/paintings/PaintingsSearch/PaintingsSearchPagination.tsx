'use client';

import { Pagination } from '@wisihe/ui-react';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';

export default function PaintingsSearchPagination() {
  const { page, nbPages, nbHits, setPage, status } = usePaintingsSearchContext();

  if (nbHits === 0 || nbPages <= 1) return null;

  return (
    <Pagination
      page={page}
      nbPages={nbPages}
      onPageChange={setPage}
      getPageHref={(p: number) => (p === 0 ? '/paintings' : `/paintings?p=${p + 1}`)}
      disabled={status === 'loading'}
      ariaLabel='Paintings pagination'
    />
  );
}
