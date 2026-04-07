'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCurrentRefinements, useHits } from 'react-instantsearch';
import PaintingCard from '../PaintingCard/PaintingCard';

export default function CustomHits() {
  const { items } = useHits();
  const { items: refinements } = useCurrentRefinements();

  const isNsfwFilterActive = refinements.some(
    r => r.attribute === 'tags' && r.refinements.some(v => v.label === 'NSFW'),
  );

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
