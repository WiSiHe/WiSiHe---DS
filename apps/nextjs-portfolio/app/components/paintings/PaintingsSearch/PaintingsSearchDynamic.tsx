'use client';

import dynamic from 'next/dynamic';

const PaintingsSearch = dynamic(() => import('./PaintingsSearch'), {
  ssr: false,
  loading: () => (
    <div
      className='columns-2 sm:columns-3 gap-2 mt-4 animate-pulse'
      aria-busy='true'
      aria-label='Loading paintings'
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
          key={i}
          className='break-inside-avoid mb-2 aspect-[3/4] rounded-xl bg-surface border border-border'
        />
      ))}
    </div>
  ),
});

export default function PaintingsSearchDynamic() {
  return <PaintingsSearch />;
}
