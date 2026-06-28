'use client';

import { IconShoppingCart } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useToggleRefinement } from 'react-instantsearch';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

export default function ForSaleFilter() {
  const { value, refine } = useToggleRefinement({ attribute: 'isForSale', on: true });

  const handleToggle = () => {
    const nextEnabled = !value.isRefined;
    trackEvent(AnalyticsEvent.FOR_SALE_FILTER_TOGGLED, { enabled: nextEnabled });
    refine({ isRefined: value.isRefined });
  };

  return (
    <button
      type='button'
      onClick={handleToggle}
      aria-pressed={value.isRefined}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm transition-colors',
        value.isRefined
          ? 'border-accent/40 bg-accent/10 text-foreground'
          : 'border-border bg-surface text-foreground-muted hover:border-accent/30 hover:bg-surface-hover hover:text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
          value.isRefined
            ? 'border-accent bg-accent text-accent-contrast'
            : 'border-border bg-surface',
        )}
      >
        {value.isRefined ? (
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
      <IconShoppingCart
        className={cn(
          'size-3.5 shrink-0',
          value.isRefined ? 'text-accent' : 'text-foreground-muted/60',
        )}
        stroke={2}
        aria-hidden
      />
    </button>
  );
}
