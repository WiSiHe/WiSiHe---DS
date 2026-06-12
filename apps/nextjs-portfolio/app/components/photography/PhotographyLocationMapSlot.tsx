'use client';

import dynamic from 'next/dynamic';
import type { PhotographyMapPoint } from './photographyMeta';

const PhotographyLocationMap = dynamic(
  () => import('./PhotographyLocationMap').then(module => module.PhotographyLocationMap),
  {
    ssr: false,
    loading: () => (
      <div
        className='aspect-[5/3] min-h-[168px] animate-pulse rounded-xl border border-border/40 bg-surface/40'
        aria-hidden
      />
    ),
  },
);

type PhotographyLocationMapSlotProps = {
  point: PhotographyMapPoint;
};

export function PhotographyLocationMapSlot({ point }: PhotographyLocationMapSlotProps) {
  return <PhotographyLocationMap point={point} />;
}
