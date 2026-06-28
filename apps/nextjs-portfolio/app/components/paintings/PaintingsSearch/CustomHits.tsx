'use client';

import { cn } from '@wisihe/utils';
import { memo, useDeferredValue, useEffect, useRef } from 'react';
import { useCurrentRefinements, useHits, useInstantSearch } from 'react-instantsearch';
import { isNsfwFacetActive } from '@/lib/algolia/facets';
import PaintingCard from '../PaintingCard/PaintingCard';

type AlgoliaHit = ReturnType<typeof useHits>['items'][number];

function adaptAlgoliaHit(hit: AlgoliaHit) {
  const rawSlug = hit['slug'] as string | { current?: string } | undefined;
  return {
    ...hit,
    _id: hit.objectID,
    slug: typeof rawSlug === 'string' ? rawSlug : (rawSlug?.current ?? ''),
    isNSFW: hit['isNSFW'] === true,
    isForSale: hit['isForSale'] === true,
    hasStoreLink: hit['hasStoreLink'] === true,
    isFanArt: hit['isFanArt'] === true,
    video: hit['video'] ?? '',
    imagesCount: hit['imagesCount'] ?? 0,
    tagsV2: hit['tags'] ? (hit['tags'] as string[]).map((t: string) => ({ name: t })) : [],
  };
}

type PaintingHitProps = {
  hit: AlgoliaHit;
  index: number;
  isNsfwFilterActive: boolean;
};

const PaintingHit = memo(
  function PaintingHit({ hit, index, isNsfwFilterActive }: PaintingHitProps) {
    const paintingData = adaptAlgoliaHit(hit);

    return (
      <div className='break-inside-avoid mb-2 [content-visibility:auto] [contain-intrinsic-size:auto_280px]'>
        <PaintingCard
          paintingData={paintingData}
          shouldBeLazy={index < 2}
          isNsfwFilterActive={isNsfwFilterActive}
          disableBrushReveal
          lightNsfwBlur
        />
      </div>
    );
  },
  (prev, next) =>
    prev.hit === next.hit &&
    prev.index === next.index &&
    prev.isNsfwFilterActive === next.isNsfwFilterActive,
);

function PaintingCardSkeleton({ index }: { index: number }) {
  const aspects = [
    'aspect-[3/4]',
    'aspect-square',
    'aspect-[4/3]',
    'aspect-[3/5]',
    'aspect-[3/4]',
    'aspect-square',
  ];
  const aspect = aspects[index % aspects.length];
  return (
    <div
      className={cn(
        'w-full rounded-xl bg-surface border border-border overflow-hidden animate-pulse mb-2 relative',
        aspect,
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-surface-subtle via-surface to-surface-subtle' />
      <div className='absolute bottom-0 left-0 right-0 h-10 bg-surface/80 border-t border-border px-3 py-2.5'>
        <div className='h-2.5 w-2/5 rounded-full bg-surface-subtle' />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      className='columns-2 sm:columns-3 gap-2 mt-4'
      aria-busy='true'
      aria-label='Loading paintings'
    >
      {Array.from({ length: 18 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeletons have no stable key
        <div key={i} className='break-inside-avoid'>
          <PaintingCardSkeleton index={i} />
        </div>
      ))}
    </div>
  );
}

export default function CustomHits() {
  const { items } = useHits();
  const { status, results, refresh } = useInstantSearch();
  const { items: refinements } = useCurrentRefinements();
  const refreshAttempted = useRef(false);

  const displayItems = useDeferredValue(items);
  const isUpdatingResults = displayItems !== items;

  const nbHits = results?.nbHits ?? 0;
  const queryId = results?.queryID;
  const isSearchPending = status === 'loading' || status === 'stalled';
  const awaitingFirstResponse = items.length === 0 && queryId == null && status !== 'error';
  const showInitialSkeleton = items.length === 0 && (isSearchPending || awaitingFirstResponse);
  const showPendingState = isSearchPending || isUpdatingResults;

  // If the first search never returns, retry once while keeping the skeleton visible.
  useEffect(() => {
    if (!awaitingFirstResponse || refreshAttempted.current || status !== 'idle') return;
    refreshAttempted.current = true;
    refresh();
  }, [awaitingFirstResponse, refresh, status]);

  const isNsfwFilterActive = isNsfwFacetActive(refinements);

  if (showInitialSkeleton) {
    return <SkeletonGrid />;
  }

  if (displayItems.length === 0 && nbHits === 0) {
    return (
      <div className='w-full py-20 flex flex-col justify-center items-center text-foreground-subtle'>
        <p className='text-lg'>No paintings found matching your search.</p>
        <p className='text-sm mt-2'>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'columns-2 sm:columns-3 gap-2 mt-4 transition-opacity duration-150',
        showPendingState && 'pointer-events-none opacity-60',
      )}
      aria-busy={showPendingState}
    >
      {displayItems.map((hit, index) => (
        <PaintingHit
          key={hit.objectID}
          hit={hit}
          index={index}
          isNsfwFilterActive={isNsfwFilterActive}
        />
      ))}
    </div>
  );
}
