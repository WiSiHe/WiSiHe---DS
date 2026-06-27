'use client';

import { cn } from '@wisihe/utils';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useCurrentRefinements, useHits, useInstantSearch } from 'react-instantsearch';
import { isNsfwFacetActive } from '@/lib/algolia/facets';
import PaintingCard from '../PaintingCard/PaintingCard';

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

  const nbHits = results?.nbHits ?? 0;
  const queryId = results?.queryID;
  const isLoading = status === 'loading' || status === 'stalled';
  const awaitingFirstResponse = items.length === 0 && queryId == null && status !== 'error';

  // If the first search never returns, retry once while keeping the skeleton visible.
  useEffect(() => {
    if (!awaitingFirstResponse || refreshAttempted.current || status !== 'idle') return;
    refreshAttempted.current = true;
    refresh();
  }, [awaitingFirstResponse, refresh, status]);

  const isNsfwFilterActive = isNsfwFacetActive(refinements);

  if (isLoading || awaitingFirstResponse) {
    return <SkeletonGrid />;
  }

  if (items.length === 0 && nbHits === 0) {
    return (
      <div className='w-full py-20 flex flex-col justify-center items-center text-foreground-subtle'>
        <p className='text-lg'>No paintings found matching your search.</p>
        <p className='text-sm mt-2'>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <LayoutGroup id='masonry'>
      <motion.div layout className='columns-2 sm:columns-3 gap-2 mt-4'>
        <AnimatePresence mode='popLayout'>
          {items.map((hit, index) => {
            const rawSlug = hit['slug'] as string | { current?: string } | undefined;
            const adaptedPaintingData = {
              ...hit,
              _id: hit.objectID,
              slug: typeof rawSlug === 'string' ? rawSlug : (rawSlug?.current ?? ''),
              isNSFW: hit['isNSFW'] === true,
              isForSale: hit['isForSale'] === true,
              hasStoreLink: hit['hasStoreLink'] === true,
              isFanArt: hit['isFanArt'] === true,
              video: hit['video'] ?? '',
              imagesCount: hit['imagesCount'] ?? 0,
              tagsV2: hit['tags']
                ? (hit['tags'] as string[]).map((t: string) => ({ name: t }))
                : [],
            };

            return (
              <motion.div
                key={hit.objectID}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: Math.min(index * 0.015, 0.2) }}
                className='break-inside-avoid mb-2'
              >
                <PaintingCard
                  // biome-ignore lint/suspicious/noExplicitAny: Algolia hit adapted to Sanity shape
                  paintingData={adaptedPaintingData as any}
                  shouldBeLazy={index < 6}
                  isNsfwFilterActive={isNsfwFilterActive}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
