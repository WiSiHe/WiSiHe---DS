'use client';

import { cn } from '@wisihe/utils';
import { FaShoppingCart } from 'react-icons/fa';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

export default function PaintingsForSaleFilter() {
  const { forSale, toggleForSale } = usePaintingsSearchContext();

  const handleToggle = () => {
    trackEvent(AnalyticsEvent.FOR_SALE_FILTER_TOGGLED, { enabled: !forSale });
    toggleForSale();
  };

  return (
    <button
      type='button'
      onClick={handleToggle}
      aria-pressed={forSale}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm',
        forSale
          ? 'border-accent/40 bg-accent/10 text-foreground'
          : 'border-border bg-surface text-muted-foreground hover:border-accent/30 hover:bg-surface-hover hover:text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded border',
          forSale ? 'border-accent bg-accent text-accent-contrast' : 'border-border bg-surface',
        )}
      >
        {forSale ? (
          <svg
            viewBox='0 0 12 12'
            className='size-2.5'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            aria-hidden
          >
            <path d='M2 6l3 3 5-5' />
          </svg>
        ) : null}
      </span>
      <span className='grow text-left text-sm font-medium'>For sale</span>
      <FaShoppingCart
        className={cn('h-3.5 w-3.5 shrink-0', forSale ? 'text-accent' : 'text-muted-foreground/60')}
        aria-hidden
      />
    </button>
  );
}
