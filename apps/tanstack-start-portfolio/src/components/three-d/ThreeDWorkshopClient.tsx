'use client';

import { lazy, Suspense } from 'react';
import type { PresentationSlide } from '@/lib/three-d/types';

const WorkshopPresentationSlideDeck = lazy(() =>
  import('./WorkshopPresentationSlideDeck').then(mod => ({
    default: mod.WorkshopPresentationSlideDeck,
  })),
);

type ThreeDWorkshopClientProps = {
  slides: PresentationSlide[] | null;
  tldr?: string | null;
  tldrPosition?: 'top' | 'bottom' | null;
};

export function ThreeDWorkshopClient({ slides, tldr, tldrPosition }: ThreeDWorkshopClientProps) {
  return (
    <Suspense
      fallback={
        <div className='flex h-[100dvh] w-full items-center justify-center bg-background text-foreground/60'>
          Loading 3D workshop…
        </div>
      }
    >
      <WorkshopPresentationSlideDeck
        slides={slides}
        tldr={tldr}
        tldrPosition={tldrPosition}
        showSkipControl
      />
    </Suspense>
  );
}
