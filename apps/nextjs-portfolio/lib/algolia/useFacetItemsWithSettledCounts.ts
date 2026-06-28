'use client';

import { useMemo, useRef } from 'react';
import { useInstantSearch } from 'react-instantsearch';

type FacetListItem = {
  label: string;
  value: string;
  count: number;
  isRefined: boolean;
};

/**
 * Keeps facet counts stable while Algolia is loading so toggling one filter does not
 * re-render every facet row when disjunctive counts stream in.
 * `isRefined` still updates immediately from live items for responsive toggles.
 */
export function useFacetItemsWithSettledCounts<T extends FacetListItem>(items: T[]): T[] {
  const { status } = useInstantSearch();
  const settledRef = useRef(items);
  const isPending = status === 'loading' || status === 'stalled';

  if (!isPending) {
    settledRef.current = items;
  }

  return useMemo(() => {
    if (!isPending) return items;

    const refinedByValue = new Map(items.map(item => [item.value, item.isRefined]));
    return settledRef.current.map(item => {
      const isRefined = refinedByValue.get(item.value) ?? item.isRefined;
      if (isRefined === item.isRefined) return item;
      return { ...item, isRefined };
    });
  }, [items, isPending]);
}
