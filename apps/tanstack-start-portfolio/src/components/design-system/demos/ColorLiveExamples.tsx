import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

const items: DosDontItem[] = [
  {
    label: 'Card',
    do: (
      <div className='w-full max-w-[220px] rounded-xl border border-border bg-surface p-3'>
        <p className='text-sm font-semibold text-foreground'>Painting title</p>
        <p className='text-xs text-foreground-subtle'>Digital · 2024</p>
      </div>
    ),
    dont: (
      <div className='w-full max-w-[220px] rounded-xl border border-neutral-200 bg-white p-3'>
        <p className='text-sm font-semibold text-neutral-900'>Painting title</p>
        <p className='text-xs text-neutral-500'>Digital · 2024</p>
      </div>
    ),
  },
  {
    label: 'Primary action',
    do: (
      <button
        type='button'
        className='rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast hover:bg-accent-hover'
      >
        View project
      </button>
    ),
    dont: (
      <button
        type='button'
        className='rounded-lg bg-accent-legacy-500 px-4 py-2 text-sm font-semibold text-white'
      >
        View project
      </button>
    ),
  },
];

export function ColorLiveExamples() {
  return <DosDontGallery items={items} />;
}
