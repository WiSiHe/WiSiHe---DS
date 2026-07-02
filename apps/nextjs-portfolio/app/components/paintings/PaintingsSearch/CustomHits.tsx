'use client';

import { cn } from '@wisihe/utils';
import { memo, useMemo } from 'react';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';
import type { PaintingAlgoliaHit } from '@/lib/algolia/paintingsSearch/types';
import { useIsDesktopPaintingGrid } from '@/lib/paintings/mediaCapabilities';
import PaintingCard from '../PaintingCard/PaintingCard';
import { PaintingSearchCompactCard } from './PaintingSearchCompactCard';

function slugFromHit(rawSlug: unknown): string {
  if (typeof rawSlug === 'string') return rawSlug;
  if (rawSlug && typeof rawSlug === 'object' && 'current' in rawSlug) {
    const current = (rawSlug as { current?: string }).current;
    return typeof current === 'string' ? current : '';
  }
  return '';
}

function adaptPaintingData(hit: PaintingAlgoliaHit) {
  const tags = hit['tags'];
  return {
    ...hit,
    _id: hit.objectID,
    slug: slugFromHit(hit['slug']),
    isNSFW: hit['isNSFW'] === true,
    isForSale: hit['isForSale'] === true,
    hasStoreLink: hit['hasStoreLink'] === true,
    isFanArt: hit['isFanArt'] === true,
    video: hit['video'] ?? '',
    imagesCount: hit['imagesCount'] ?? 0,
    tagsV2: Array.isArray(tags) ? (tags as string[]).map(name => ({ name })) : [],
  };
}

type PaintingHitProps = {
  hit: PaintingAlgoliaHit;
  index: number;
  isNsfwFilterActive: boolean;
};

const PaintingHit = memo(
  function PaintingHit({ hit, index, isNsfwFilterActive }: PaintingHitProps) {
    const paintingData = useMemo(() => adaptPaintingData(hit), [hit]);
    const isDesktopGrid = useIsDesktopPaintingGrid();

    return (
      <div className='break-inside-avoid mb-2'>
        {isDesktopGrid ? (
          <PaintingCard
            // biome-ignore lint/suspicious/noExplicitAny: Algolia hit adapted to Sanity shape
            paintingData={paintingData as any}
            shouldBeLazy={index < 6}
            isNsfwFilterActive={isNsfwFilterActive}
          />
        ) : (
          <PaintingSearchCompactCard
            title={typeof hit['title'] === 'string' ? hit['title'] : ''}
            slug={typeof paintingData.slug === 'string' ? paintingData.slug : ''}
            // biome-ignore lint/suspicious/noExplicitAny: Algolia image shape
            image={(paintingData as any).image}
            index={index}
            isNsfw={paintingData.isNSFW}
            isNsfwFilterActive={isNsfwFilterActive}
            isForSale={paintingData.isForSale}
            hasStoreLink={paintingData.hasStoreLink}
            paintingId={paintingData._id}
            // biome-ignore lint/suspicious/noExplicitAny: Algolia palette shape
            palette={(paintingData as any).palette}
          />
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.hit === next.hit &&
    prev.index === next.index &&
    prev.isNsfwFilterActive === next.isNsfwFilterActive,
);

function PaintingCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className='mb-2 w-full overflow-hidden rounded-xl border border-border bg-surface animate-pulse'
      style={{ animationDelay: `${index * 40}ms` }}
      aria-hidden
    >
      <div className='aspect-[4/3] bg-linear-to-br from-surface-subtle via-surface to-surface-subtle' />
      <div className='border-t border-border px-3 py-2.5'>
        <div className='h-3.5 w-2/5 rounded-full bg-surface-subtle' />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      className='mt-4 columns-2 gap-2 sm:columns-3'
      aria-busy='true'
      aria-label='Loading paintings'
    >
      {Array.from({ length: 18 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
        <div key={i} className='break-inside-avoid'>
          <PaintingCardSkeleton index={i} />
        </div>
      ))}
    </div>
  );
}

export default function CustomHits() {
  const { hits, nbHits, status, nsfwFilterActive } = usePaintingsSearchContext();

  const showInitialSkeleton = status === 'loading' && hits.length === 0;

  if (showInitialSkeleton) {
    return <SkeletonGrid />;
  }

  if (hits.length === 0 && nbHits === 0) {
    return (
      <div className='flex w-full flex-col items-center justify-center py-20 text-foreground-subtle'>
        <p className='text-lg'>No paintings found matching your search.</p>
        <p className='mt-2 text-sm'>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mt-4 columns-2 gap-2 sm:columns-3 lg:columns-3 transition-opacity duration-300',
        status === 'loading' && 'pointer-events-none opacity-40',
      )}
      aria-busy={status === 'loading'}
      aria-live='polite'
    >
      {hits.map((hit, index) => (
        <PaintingHit
          key={hit.objectID}
          hit={hit}
          index={index}
          isNsfwFilterActive={nsfwFilterActive}
        />
      ))}
    </div>
  );
}
