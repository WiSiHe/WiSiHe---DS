'use client';

import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const items: DosDontItem[] = [
  {
    label: 'Scale with text',
    do: (
      <p className='flex items-center gap-2 text-sm text-foreground'>
        <IconSearch className='size-4 shrink-0' stroke={2} aria-hidden />
        Search paintings
      </p>
    ),
    dont: (
      <p className='flex items-center gap-2 text-sm text-foreground'>
        <IconSearch className='size-6 shrink-0' stroke={2} aria-hidden />
        Search paintings
      </p>
    ),
  },
  {
    label: 'Icon-only control',
    do: (
      <button
        type='button'
        className='inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground hover:bg-surface-hover'
        aria-label='Search paintings'
      >
        <IconSearch className='size-5' stroke={2} aria-hidden />
      </button>
    ),
    dont: (
      <button
        type='button'
        className='inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground hover:bg-surface-hover'
      >
        <IconSearch className='size-5' stroke={2} />
      </button>
    ),
  },
  {
    label: 'Color',
    do: (
      <p className='flex items-center gap-2 text-sm text-foreground-muted'>
        <IconArrowRight className='size-4 text-accent' stroke={2} aria-hidden />
        Read more
      </p>
    ),
    dont: (
      <p className='flex items-center gap-2 text-sm text-foreground-muted'>
        <IconArrowRight className='size-4 text-[#ec4899]' stroke={2} aria-hidden />
        Read more
      </p>
    ),
  },
];

export function IconographyLiveExamples() {
  return <DosDontGallery items={items} />;
}
