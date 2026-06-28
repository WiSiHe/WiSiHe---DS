'use client';

import { cn } from '@wisihe/utils';
import { instantSearchPaginationClassNames } from '@/lib/algolia/instantSearchPaginationClassNames';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';

function pageWindow(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages = new Set<number>([0, total - 1, current]);
  for (let offset = -2; offset <= 2; offset += 1) {
    const page = current + offset;
    if (page >= 0 && page < total) pages.add(page);
  }

  return [...pages].sort((a, b) => a - b);
}

export default function PaintingsSearchPagination() {
  const { page, nbPages, nbHits, setPage, status } = usePaintingsSearchContext();

  if (nbHits === 0 || nbPages <= 1) return null;

  const pages = pageWindow(page, nbPages);
  const classes = instantSearchPaginationClassNames;

  return (
    <nav className='mt-12 flex justify-center w-full' aria-label='Paintings pagination'>
      <ul className={classes.list}>
        <li className={cn(classes.item, page === 0 && classes.disabledItem)}>
          <button
            type='button'
            className={classes.link}
            disabled={page === 0 || status === 'loading'}
            onClick={() => setPage(0)}
            aria-label='First page'
          >
            ‹‹
          </button>
        </li>
        <li className={cn(classes.item, page === 0 && classes.disabledItem)}>
          <button
            type='button'
            className={classes.link}
            disabled={page === 0 || status === 'loading'}
            onClick={() => setPage(page - 1)}
            aria-label='Previous page'
          >
            ‹
          </button>
        </li>

        {pages.map(pageNumber => (
          <li
            key={pageNumber}
            className={cn(classes.item, pageNumber === page && classes.selectedItem)}
          >
            <button
              type='button'
              className={classes.link}
              disabled={status === 'loading'}
              onClick={() => setPage(pageNumber)}
              aria-label={`Page ${pageNumber + 1}`}
              aria-current={pageNumber === page ? 'page' : undefined}
            >
              {pageNumber + 1}
            </button>
          </li>
        ))}

        <li className={cn(classes.item, page >= nbPages - 1 && classes.disabledItem)}>
          <button
            type='button'
            className={classes.link}
            disabled={page >= nbPages - 1 || status === 'loading'}
            onClick={() => setPage(page + 1)}
            aria-label='Next page'
          >
            ›
          </button>
        </li>
        <li className={cn(classes.item, page >= nbPages - 1 && classes.disabledItem)}>
          <button
            type='button'
            className={classes.link}
            disabled={page >= nbPages - 1 || status === 'loading'}
            onClick={() => setPage(nbPages - 1)}
            aria-label='Last page'
          >
            ››
          </button>
        </li>
      </ul>
    </nav>
  );
}
