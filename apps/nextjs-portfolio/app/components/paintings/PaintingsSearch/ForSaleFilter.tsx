'use client';

import { Checkbox } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { startTransition } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useToggleRefinement } from 'react-instantsearch';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

export default function ForSaleFilter() {
  const { value, refine } = useToggleRefinement({ attribute: 'isForSale' });

  const handleToggle = () => {
    // value.isRefined reflects the state before this toggle.
    trackEvent(AnalyticsEvent.FOR_SALE_FILTER_TOGGLED, { enabled: !value.isRefined });
    startTransition(() => refine(value));
  };

  return (
    <button
      type='button'
      onClick={handleToggle}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm transition-colors',
        value.isRefined
          ? 'border-accent/40 bg-accent/10 text-foreground'
          : 'border-border bg-surface text-muted-foreground hover:border-accent/30 hover:bg-surface-hover hover:text-foreground',
      )}
    >
      <Checkbox
        inputSize='sm'
        checked={value.isRefined}
        className='pointer-events-none'
        label='For sale'
        labelClassName='grow text-left text-sm font-medium cursor-pointer pointer-events-none'
      />
      <FaShoppingCart
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          value.isRefined ? 'text-accent' : 'text-muted-foreground/60',
        )}
        aria-hidden
      />
    </button>
  );
}
