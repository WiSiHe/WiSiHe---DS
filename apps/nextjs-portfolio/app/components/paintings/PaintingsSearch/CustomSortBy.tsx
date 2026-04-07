'use client';

import { Select } from '@wisihe/ui-react';
import type * as React from 'react';
import { useSortBy } from 'react-instantsearch';

export default function CustomSortBy({
  items,
}: {
  items: { label: string; value: string; icon?: React.ReactNode }[];
}) {
  const { currentRefinement, refine } = useSortBy({ items });

  const value = items.find(o => o.value === currentRefinement) ?? items[0] ?? null;

  return (
    <Select
      label='Sort'
      hideLabel
      options={items}
      value={value}
      onChange={val => refine(val.value)}
    />
  );
}
