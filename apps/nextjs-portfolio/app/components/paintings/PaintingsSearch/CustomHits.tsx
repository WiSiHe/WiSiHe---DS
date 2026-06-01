'use client';

import { cn } from '@wisihe/utils';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useCurrentRefinements, useHits, useInstantSearch } from 'react-instantsearch';
import PaintingCard from '../PaintingCard/PaintingCard';

// Skeleton card — varied heights to mimic the masonry feel
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

// Aspect class based on painting format
function aspectClass(format: string): string {
  if (format === 'landscape') return 'aspect-[4/3]';
  if (format === 'portrait') return 'aspect-[3/4]';
  return 'aspect-square';
}

const SKELETON_COUNT = 18;
// Maximum time to show skeleton before giving up and showing empty state
const SKELETON_TIMEOUT_MS = 6000;

export default function CustomHits() {
  const { items } = useHits();
  const { status, results, refresh } = useInstantSearch();
  const { items: refinements } = useCurrentRefinements();

  // Flip to true the first time items arrive after this mount
  const hasReceivedResultsThisMount = useRef(false);
  if (items.length > 0) hasReceivedResultsThisMount.current = true;

  // Safety valve: if skeleton has shown for too long, stop waiting.
  // This catches cases where the search never fires (routing/hydration issues).
  const [skeletonTimedOut, setSkeletonTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset timeout on every mount
    setSkeletonTimedOut(false);
    timeoutRef.current = setTimeout(() => {
      setSkeletonTimedOut(true);
    }, SKELETON_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // If we received results, clear the timeout
  useEffect(() => {
    if (hasReceivedResultsThisMount.current && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [items.length]);

  // Force a search refresh if we've been idle too long with no results.
  // This handles cases where the search failed to fire on initial mount.
  useEffect(() => {
    if (skeletonTimedOut && !hasReceivedResultsThisMount.current && status === 'idle') {
      refresh();
    }
  }, [skeletonTimedOut, status, refresh]);

  const isNsfwFilterActive = refinements.some(
    r => r.attribute === 'tags' && r.refinements.some(v => v.label === 'NSFW'),
  );

  // `processingTimeMS` is set after Algolia responds — distinguishes
  // "no search fired yet" from "search returned 0 results"
  const searchHasCompleted = results?.processingTimeMS !== undefined;

  // Show skeleton while: loading, stalled, or first search not yet complete
  // BUT stop after timeout to avoid infinite skeleton
  const showSkeleton =
    !skeletonTimedOut && (!searchHasCompleted || status === 'loading' || status === 'stalled');

  if (items.length === 0 && showSkeleton) {
    return (
      <div className='columns-2 sm:columns-3 gap-2 mt-4'>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeletons have no stable key
          <div key={i} className='break-inside-avoid'>
            <PaintingCardSkeleton index={i} />
          </div>
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
    <LayoutGroup id='masonry'>
      <motion.div layout className='columns-2 sm:columns-3 gap-2 mt-4'>
        <AnimatePresence mode='popLayout'>
          {items.map((hit, index) => {
            const format = (hit['format'] as string) || 'square';
            const rawSlug = hit['slug'] as string | { current?: string } | undefined;
            const adaptedPaintingData = {
              ...hit,
              _id: hit.objectID,
              slug: typeof rawSlug === 'string' ? rawSlug : (rawSlug?.current ?? ''),
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
                  // Pass aspect class so tailwind-merge overrides the hardcoded aspect-3/4
                  className={aspectClass(format)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
