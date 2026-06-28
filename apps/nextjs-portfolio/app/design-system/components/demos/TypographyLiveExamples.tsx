'use client';

import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const items: DosDontItem[] = [
  {
    label: 'Page title',
    do: <h2 className='font-serif text-3xl font-bold text-foreground'>Paintings</h2>,
    dont: <p className='font-sans text-[38px] font-bold text-neutral-800'>Paintings</p>,
  },
  {
    label: 'Section lead',
    do: (
      <p className='max-w-xs text-base leading-relaxed text-foreground-subtle'>
        A curated gallery of digital work.
      </p>
    ),
    dont: <p className='max-w-xs text-xl text-neutral-400'>A curated gallery of digital work.</p>,
  },
  {
    label: 'Label',
    do: <span className='font-mono text-xs uppercase tracking-widest text-accent'>Featured</span>,
    dont: <span className='text-sm font-black uppercase tracking-widest'>FEATURED!!!</span>,
  },
  {
    label: 'Hierarchy',
    do: (
      <div className='space-y-1'>
        <h3 className='font-serif text-lg font-bold text-foreground'>Process</h3>
        <p className='text-sm text-foreground-subtle'>Timelapses and clips.</p>
      </div>
    ),
    dont: (
      <div className='space-y-1'>
        <p className='text-base font-bold text-foreground'>Process</p>
        <p className='text-base text-foreground'>Timelapses and clips.</p>
      </div>
    ),
  },
];

export function TypographyLiveExamples() {
  return (
    <DosDontGallery
      description='Inter for body, Geist via font-serif for display, mono for code only.'
      items={items}
    />
  );
}
