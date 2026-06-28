'use client';

import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const cardDo = (
  <div className='w-full max-w-[220px] rounded-xl border border-border bg-surface p-4'>
    <p className='text-sm font-semibold text-foreground'>Painting title</p>
    <p className='mt-2 text-xs text-foreground-subtle'>Digital · 2024</p>
  </div>
);

const items: DosDontItem[] = [
  {
    label: 'Card padding',
    do: cardDo,
    dont: (
      <div className='w-full max-w-[220px] rounded-xl border border-border bg-surface p-1.5'>
        <p className='text-sm font-semibold text-foreground'>Painting title</p>
        <p className='text-xs text-foreground-subtle'>Digital · 2024</p>
      </div>
    ),
  },
  {
    label: 'Corner radius',
    do: cardDo,
    dont: (
      <div className='w-full max-w-[220px] rounded-sm border border-border bg-surface p-4'>
        <p className='text-sm font-semibold text-foreground'>Painting title</p>
        <p className='mt-2 text-xs text-foreground-subtle'>Digital · 2024</p>
      </div>
    ),
  },
  {
    label: 'Section rhythm',
    do: (
      <div className='flex w-full max-w-[220px] flex-col gap-4'>
        <div className='h-8 rounded-lg bg-surface-subtle' />
        <div className='h-8 rounded-lg bg-surface-subtle' />
      </div>
    ),
    dont: (
      <div className='flex w-full max-w-[220px] flex-col gap-1'>
        <div className='h-8 rounded-lg bg-surface-subtle' />
        <div className='h-8 rounded-lg bg-surface-subtle' />
      </div>
    ),
  },
  {
    label: 'Touch target',
    hint: 'Mobile nav pattern',
    do: (
      <button
        type='button'
        className='inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-foreground hover:bg-surface-hover'
        aria-label='Previous'
      >
        <span className='text-sm' aria-hidden>
          ←
        </span>
      </button>
    ),
    dont: (
      <button
        type='button'
        className='inline-flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-foreground'
        aria-label='Previous'
      >
        <span className='text-sm' aria-hidden>
          ←
        </span>
      </button>
    ),
  },
];

export function LayoutLiveExamples() {
  return (
    <DosDontGallery
      description='Stick to the spacing and radius scales. Cards use rounded-xl and p-4; sections breathe with gap-6–8; icon controls are at least size-11 on touch surfaces.'
      items={items}
    />
  );
}
