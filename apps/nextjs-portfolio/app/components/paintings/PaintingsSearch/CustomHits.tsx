'use client';

import { cn } from '@wisihe/utils';
import { memo, useDeferredValue, useEffect, useMemo, useRef } from 'react';
import { useCurrentRefinements, useHits, useInstantSearch } from 'react-instantsearch';
import { isNsfwFacetActive } from '@/lib/algolia/facets';
import { SearchGridCard, type SearchGridHit } from './SearchGridCard';

type AlgoliaHit = ReturnType<typeof useHits>['items'][number];

function adaptSearchHit(hit: AlgoliaHit): SearchGridHit {
  const rawSlug = hit['slug'] as string | { current?: string } | undefined;
  return {
    objectID: hit.objectID,
    slug: typeof rawSlug === 'string' ? rawSlug : (rawSlug?.current ?? ''),
    title: hit['title'] as string | undefined,
    image: hit['image'] as SearchGridHit['image'],
    format: hit['format'] as string | null | undefined,
    isNSFW: hit['isNSFW'] === true,
    isForSale: hit['isForSale'] === true,
    hasStoreLink: hit['hasStoreLink'] === true,
  };
}

type PaintingHitProps = {
  hit: AlgoliaHit;
  index: number;
  nsfwRevealed?: boolean;
};

const PaintingHit = memo(
  function PaintingHit({ hit, index, nsfwRevealed }: PaintingHitProps) {
    const adapted = useMemo(() => adaptSearchHit(hit), [hit]);

    return (
      <div className='mb-2 [content-visibility:auto] [contain-intrinsic-size:auto_280px]'>
        <SearchGridCard hit={adapted} index={index} nsfwRevealed={nsfwRevealed} />
      </div>
    );
  },
  (prev, next) => {
    if (prev.hit !== next.hit || prev.index !== next.index) return false;
    if (prev.hit['isNSFW'] !== true) return true;
    return prev.nsfwRevealed === next.nsfwRevealed;
  },
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
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4' aria-busy='true'>
      {Array.from({ length: 18 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeletons have no stable key
        <PaintingCardSkeleton key={i} index={i} />
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
      className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4'
      aria-busy={isSearchPending || isUpdatingResults}
    >
      {displayItems.map((hit, index) => (
        <PaintingHit
          key={hit.objectID}
          hit={hit}
          index={index}
          nsfwRevealed={hit['isNSFW'] === true ? isNsfwFilterActive : undefined}
        />
      ))}
    </div>
  );
}
