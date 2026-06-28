'use client';

import { IconArrowRight, IconHeart, IconSearch } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
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
  {
    label: 'Icon-only control',
    hint: 'Inspect with a screen reader',
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
    label: 'Inconsistent control',
    do: (
      <Button variant='primary' Icon={IconArrowRight} iconPosition='right'>
        View project
      </Button>
    ),
    dont: (
      <button
        type='button'
        className='inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-contrast'
      >
        View project
        <IconHeart className='size-4' stroke={2} aria-hidden />
      </button>
    ),
  },
];

export function IconographyLiveExamples() {
  return (
    <DosDontGallery
      description='Pick a size tier and match adjacent text. stroke={2} (1.75 at size-3). shrink-0 in flex rows. Use @wisihe/ui-react Button for actions.'
      items={items}
    />
  );
}
