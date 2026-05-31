'use client';

import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useCurrentRefinements, useHits, useInstantSearch } from 'react-instantsearch';
import PaintingCard from '../PaintingCard/PaintingCard';

// Skeleton card that matches the PaintingCard aspect ratio
function PaintingCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        'relative col-span-6 md:col-span-4 lg:col-span-4',
        'aspect-3/4 rounded-xl bg-surface border border-border overflow-hidden',
        'animate-pulse',
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Shimmer overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-surface-subtle via-surface to-surface-subtle' />
      {/* Fake title bar at bottom */}
      <div className='absolute bottom-0 left-0 right-0 h-12 bg-surface/80 backdrop-blur-sm border-t border-border px-4 py-3'>
        <div className='h-3 w-3/5 rounded-full bg-surface-subtle' />
      </div>
    </div>
  );
}

const SKELETON_COUNT = 12;

export default function CustomHits() {
  const { items } = useHits();
  const { status } = useInstantSearch();
  const { items: refinements } = useCurrentRefinements();

  const isNsfwFilterActive = refinements.some(
    r => r.attribute === 'tags' && r.refinements.some(v => v.label === 'NSFW'),
  );

  // Show skeleton while Algolia is fetching results for the first time
  const isLoading = status === 'loading' || status === 'stalled';

  if (isLoading && items.length === 0) {
    return (
      <div className='grid w-full h-full grid-cols-12 gap-2 mt-6'>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeletons have no stable key
          <PaintingCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='w-full py-20 flex flex-col justify-center items-center text-foreground-subtle'>
        <p className='text-lg'>No paintings found matching your search.</p>
        <p className='text-sm mt-2'>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <motion.div layout className='grid w-full h-full grid-cols-12 gap-2 mt-6'>
      <AnimatePresence mode='popLayout'>
        {items.map((hit, index: number) => {
          const rawSlug = hit['slug'] as string | { current?: string } | undefined;
          const adaptedPaintingData = {
            ...hit,
            _id: hit.objectID,
            slug: typeof rawSlug === 'string' ? rawSlug : (rawSlug?.current ?? ''),
            tagsV2: hit['tags'] ? (hit['tags'] as string[]).map((t: string) => ({ name: t })) : [],
          };

          return (
            <motion.div
              key={hit.objectID}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='relative col-span-6 md:col-span-4 lg:col-span-4'
            >
              <PaintingCard
                // biome-ignore lint/suspicious/noExplicitAny: Algolia hit adapted to Sanity shape
                paintingData={adaptedPaintingData as any}
                shouldBeLazy={index < 4}
                isNsfwFilterActive={isNsfwFilterActive}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
