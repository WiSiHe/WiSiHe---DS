'use client';

import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const items: DosDontItem[] = [
  {
    label: 'Chip (small)',
    do: (
      <span className='inline-flex rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent'>
        For sale
      </span>
    ),
    dont: (
      <span className='inline-flex rounded-2xl bg-accent/15 px-4 py-2 text-sm font-medium text-accent'>
        For sale
      </span>
    ),
  },
  {
    label: 'Card (medium)',
    do: (
      <div className='w-full max-w-[200px] rounded-xl border border-border bg-surface p-4'>
        <p className='text-sm font-semibold text-foreground'>Project</p>
      </div>
    ),
    dont: (
      <div className='w-full max-w-[200px] rounded-sm border border-border bg-surface p-4'>
        <p className='text-sm font-semibold text-foreground'>Project</p>
      </div>
    ),
  },
  {
    label: 'Section (big)',
    do: (
      <div className='w-full max-w-[220px] rounded-2xl border border-border bg-surface/50 p-6'>
        <p className='font-serif text-lg font-bold text-foreground'>Hero band</p>
      </div>
    ),
    dont: (
      <div className='w-full max-w-[220px] rounded-lg border border-border bg-surface/50 p-6'>
        <p className='font-serif text-lg font-bold text-foreground'>Hero band</p>
      </div>
    ),
  },
  {
    label: 'Nesting',
    do: (
      <div className='w-full max-w-[220px] rounded-2xl border border-border bg-surface/40 p-4'>
        <div className='rounded-xl border border-border bg-surface p-3'>
          <span className='inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent'>
            Tag
          </span>
        </div>
      </div>
    ),
    dont: (
      <div className='w-full max-w-[220px] rounded-lg border border-border bg-surface/40 p-4'>
        <div className='rounded-2xl border border-border bg-surface p-3'>
          <span className='inline-flex rounded-md bg-accent/15 px-2 py-0.5 text-[10px] text-accent'>
            Tag
          </span>
        </div>
      </div>
    ),
  },
];

export function ShapeLiveExamples() {
  return (
    <DosDontGallery
      description='Match corner radius and padding to the shape scale. Nest small inside medium inside big — child corners stay equal or tighter than the parent.'
      items={items}
    />
  );
}
