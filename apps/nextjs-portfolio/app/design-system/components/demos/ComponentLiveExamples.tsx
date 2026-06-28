'use client';

import { Button, Skeleton } from '@wisihe/ui-react';
import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const items: DosDontItem[] = [
  {
    label: 'Primary',
    do: <Button variant='primary'>Contact</Button>,
    dont: (
      <button
        type='button'
        className='rounded-full bg-pink-500 px-5 py-2 text-sm font-bold uppercase text-white'
      >
        Contact
      </button>
    ),
  },
  {
    label: 'Secondary',
    do: <Button variant='secondary'>Cancel</Button>,
    dont: (
      <button
        type='button'
        className='rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-800'
      >
        Cancel
      </button>
    ),
  },
  {
    label: 'Loading',
    do: <Skeleton className='h-9 w-40 rounded-lg' />,
    dont: (
      <div
        className='size-9 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'
        aria-hidden
      />
    ),
  },
  {
    label: 'Focus',
    hint: 'Tab into the buttons',
    do: <Button variant='secondary'>Tab here</Button>,
    dont: (
      <button
        type='button'
        className='rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none focus:outline-none'
      >
        Tab here
      </button>
    ),
  },
];

export function ComponentLiveExamples() {
  return (
    <DosDontGallery
      description='Use @wisihe/ui-react on the left. Avoid one-off copies on the right.'
      items={items}
    />
  );
}
