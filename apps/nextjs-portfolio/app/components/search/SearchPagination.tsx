'use client';

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { buildPaginationItems } from '@/lib/pagination/buildPaginationItems';

type SearchPaginationProps = Readonly<{
  page: number;
  nbPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}>;

const navButtonClass = cn(
  'inline-flex items-center justify-center',
  'size-10 shrink-0 rounded-xl',
  'text-foreground-subtle',
  'transition-[color,background-color,box-shadow,transform] duration-200',
  'hover:bg-surface-hover hover:text-foreground',
  'active:scale-[0.97]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-40',
);

const pageButtonClass = cn(
  'inline-flex items-center justify-center',
  'min-w-10 h-10 px-3 rounded-xl',
  'text-sm font-medium tabular-nums leading-none',
  'text-foreground-subtle',
  'transition-[color,background-color,box-shadow,transform] duration-200',
  'hover:bg-surface-hover hover:text-foreground',
  'active:scale-[0.97]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-40',
);

export default function SearchPagination({
  page,
  nbPages,
  onPageChange,
  disabled = false,
  ariaLabel = 'Pagination',
}: SearchPaginationProps) {
  if (nbPages <= 1) return null;

  const items = buildPaginationItems(page, nbPages);
  const isFirstPage = page <= 0;
  const isLastPage = page >= nbPages - 1;

  const goToPage = (nextPage: number) => {
    if (disabled || nextPage === page || nextPage < 0 || nextPage >= nbPages) return;
    onPageChange(nextPage);
  };

  return (
    <nav
      className='mt-12 flex w-full flex-col items-center gap-3'
      aria-label={ariaLabel}
      aria-busy={disabled}
    >
      <div
        className={cn(
          'inline-flex max-w-full flex-wrap items-center justify-center gap-1',
          'rounded-2xl border border-border/70 bg-surface/90 p-1.5 shadow-sm backdrop-blur-sm',
          disabled && 'opacity-70',
        )}
      >
        <button
          type='button'
          className={navButtonClass}
          disabled={disabled || isFirstPage}
          onClick={() => goToPage(0)}
          aria-label='First page'
        >
          <IconChevronsLeft className='size-4' stroke={2} aria-hidden />
        </button>
        <button
          type='button'
          className={navButtonClass}
          disabled={disabled || isFirstPage}
          onClick={() => goToPage(page - 1)}
          aria-label='Previous page'
        >
          <IconChevronLeft className='size-4' stroke={2} aria-hidden />
        </button>

        <ul className='mx-0.5 flex flex-wrap items-center justify-center gap-0.5 list-none p-0 m-0'>
          {items.map(item =>
            item.type === 'ellipsis' ? (
              <li
                key={item.key}
                className='inline-flex h-10 min-w-8 items-center justify-center px-1 text-sm text-foreground-muted select-none'
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item.page}>
                <button
                  type='button'
                  className={cn(
                    pageButtonClass,
                    item.page === page &&
                      'bg-accent text-accent-contrast font-semibold shadow-sm hover:bg-accent hover:text-accent-contrast',
                  )}
                  disabled={disabled}
                  onClick={() => goToPage(item.page)}
                  aria-label={`Page ${item.page + 1}`}
                  aria-current={item.page === page ? 'page' : undefined}
                >
                  {item.page + 1}
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type='button'
          className={navButtonClass}
          disabled={disabled || isLastPage}
          onClick={() => goToPage(page + 1)}
          aria-label='Next page'
        >
          <IconChevronRight className='size-4' stroke={2} aria-hidden />
        </button>
        <button
          type='button'
          className={navButtonClass}
          disabled={disabled || isLastPage}
          onClick={() => goToPage(nbPages - 1)}
          aria-label='Last page'
        >
          <IconChevronsRight className='size-4' stroke={2} aria-hidden />
        </button>
      </div>

      <p className='text-xs text-foreground-muted tabular-nums' aria-live='polite'>
        Page <span className='font-medium text-foreground'>{page + 1}</span> of{' '}
        <span className='font-medium text-foreground'>{nbPages}</span>
      </p>
    </nav>
  );
}
