'use client';

import type { BrushPalette } from '@wisihe/ui-react';
import { useIsDesktopPaintingGrid } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { memo, useMemo } from 'react';
import PaintingCard from '@/components/paintings/PaintingCard';
import { PaintingGridSkeleton } from '@/components/paintings/PaintingGridSkeleton';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';
import type { PaintingAlgoliaHit } from '@/lib/algolia/paintingsSearch/types';
import { PaintingSearchCompactCard } from './PaintingSearchCompactCard';

type CompactCardImage = NonNullable<Parameters<typeof PaintingSearchCompactCard>[0]['image']>;

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
    image: hit['image'],
    palette: hit['palette'],
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
      <div className='mb-3 break-inside-avoid'>
        {isDesktopGrid ? (
          <PaintingCard
            paintingData={paintingData}
            shouldBeLazy={index < 6}
            isNsfwFilterActive={isNsfwFilterActive}
          />
        ) : (
          <PaintingSearchCompactCard
            title={typeof hit['title'] === 'string' ? hit['title'] : ''}
            slug={typeof paintingData.slug === 'string' ? paintingData.slug : ''}
            image={paintingData.image as CompactCardImage}
            index={index}
            format={typeof hit['format'] === 'string' ? hit['format'] : undefined}
            isNsfw={paintingData.isNSFW}
            isNsfwFilterActive={isNsfwFilterActive}
            isForSale={paintingData.isForSale}
            hasStoreLink={paintingData.hasStoreLink}
            paintingId={paintingData._id}
            tags={(paintingData.tagsV2 ?? []).map(tag => tag.name)}
            palette={paintingData.palette as BrushPalette | null | undefined}
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

function SkeletonGrid() {
  return <PaintingGridSkeleton count={12} />;
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
        'mt-4 columns-2 gap-3 sm:columns-2 md:columns-3 transition-opacity duration-300',
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
