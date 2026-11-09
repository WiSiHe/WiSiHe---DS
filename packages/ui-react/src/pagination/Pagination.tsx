import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import type React from 'react';
import { buildPaginationItems } from './buildPaginationItems';

export type PaginationProps = Readonly<{
  page: number;
  nbPages: number;
  onPageChange: (page: number) => void;
  getPageHref?: (page: number) => string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}>;

const navButtonClass = cn(
  'inline-flex items-center justify-center',
  'size-10 shrink-0 rounded-xl',
  'text-foreground-subtle',
  'transition-[color,background-color,box-shadow,transform] duration-200',
  'hover:bg-surface-hover hover:text-foreground',
  'active:scale-[0.97]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-40',
);

export function Pagination({
  page,
  nbPages,
  onPageChange,
  getPageHref,
  disabled = false,
  ariaLabel = 'Pagination',
  className,
}: PaginationProps) {
  if (nbPages <= 1) return null;

  const items = buildPaginationItems(page, nbPages);
  const isFirstPage = page <= 0;
  const isLastPage = page >= nbPages - 1;

  const goToPage = (nextPage: number) => {
    if (disabled || nextPage === page || nextPage < 0 || nextPage >= nbPages) return;
    onPageChange(nextPage);
  };

  const renderNavAction = (
    targetPage: number,
    isDisabled: boolean,
    label: string,
    icon: React.ReactNode,
  ) => {
    const href = getPageHref && !isDisabled ? getPageHref(targetPage) : undefined;
    if (href && !disabled) {
      return (
        <a
          href={href}
          className={navButtonClass}
          onClick={e => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              goToPage(targetPage);
            }
          }}
          aria-label={label}
        >
          {icon}
        </a>
      );
    }

    return (
      <button
        type='button'
        className={navButtonClass}
        disabled={disabled || isDisabled}
        onClick={() => goToPage(targetPage)}
        aria-label={label}
      >
        {icon}
      </button>
    );
  };

  return (
    <nav
      className={cn('mt-12 flex w-full flex-col items-center gap-3', className)}
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
        {renderNavAction(
          0,
          isFirstPage,
          'First page',
          <IconChevronsLeft className='size-4' stroke={2} aria-hidden />,
        )}
        {renderNavAction(
          page - 1,
          isFirstPage,
          'Previous page',
          <IconChevronLeft className='size-4' stroke={2} aria-hidden />,
        )}

        <ul className='mx-0.5 m-0 flex list-none flex-wrap items-center justify-center gap-0.5 p-0'>
          {items.map(item =>
            item.type === 'ellipsis' ? (
              <li
                key={item.key}
                className='inline-flex h-10 min-w-8 select-none items-center justify-center px-1 text-sm text-foreground-muted'
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item.page}>
                {(() => {
                  const isActive = item.page === page;
                  const href = getPageHref && !disabled ? getPageHref(item.page) : undefined;
                  const itemClass = cn(
                    pageButtonClass,
                    isActive &&
                      'bg-accent font-semibold text-accent-contrast shadow-sm hover:bg-accent hover:text-accent-contrast',
                  );

                  if (href) {
                    return (
                      <a
                        href={href}
                        className={itemClass}
                        onClick={e => {
                          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                            e.preventDefault();
                            goToPage(item.page);
                          }
                        }}
                        aria-label={`Page ${item.page + 1}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.page + 1}
                      </a>
                    );
                  }

                  return (
                    <button
                      type='button'
                      className={itemClass}
                      disabled={disabled}
                      onClick={() => goToPage(item.page)}
                      aria-label={`Page ${item.page + 1}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.page + 1}
                    </button>
                  );
                })()}
              </li>
            ),
          )}
        </ul>

        {renderNavAction(
          page + 1,
          isLastPage,
          'Next page',
          <IconChevronRight className='size-4' stroke={2} aria-hidden />,
        )}
        {renderNavAction(
          nbPages - 1,
          isLastPage,
          'Last page',
          <IconChevronsRight className='size-4' stroke={2} aria-hidden />,
        )}
      </div>

      <p className='text-xs tabular-nums text-foreground-muted' aria-live='polite'>
        Page <span className='font-medium text-foreground'>{page + 1}</span> of{' '}
        <span className='font-medium text-foreground'>{nbPages}</span>
      </p>
    </nav>
  );
}
