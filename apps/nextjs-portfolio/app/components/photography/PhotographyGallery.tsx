import { Suspense } from 'react';
import { PhotographyListing } from './PhotographyListing';

type PhotographyGalleryProps = {
  photos: import('@wisihe/sanity-queries').PhotographyListQueryResult;
};

function PhotographyListingFallback() {
  return (
    <div className='columns-1 gap-6 sm:columns-2 lg:columns-3'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className='mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-border/40 bg-surface/40'
        >
          <div className='aspect-[4/3] animate-pulse bg-surface' />
          <div className='space-y-2 p-4'>
            <div className='h-5 w-2/3 animate-pulse rounded bg-surface' />
            <div className='h-3 w-1/3 animate-pulse rounded bg-surface' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PhotographyGallery({ photos }: PhotographyGalleryProps) {
  return (
    <Suspense fallback={<PhotographyListingFallback />}>
      <PhotographyListing photos={photos} />
    </Suspense>
  );
}
