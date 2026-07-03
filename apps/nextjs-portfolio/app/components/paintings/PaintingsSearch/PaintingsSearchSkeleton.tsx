import {
  PaintingGridSkeleton,
  PaintingsSearchHitStatsSkeleton,
  PaintingsSearchSidebarSkeleton,
} from '@/app/components/paintings/PaintingGridSkeleton';

/** Full-page skeleton while the Algolia search bundle loads. */
export default function PaintingsSearchSkeleton() {
  return (
    <div
      className='mt-4 flex w-full flex-col gap-8 md:flex-row'
      aria-busy='true'
      aria-label='Loading paintings'
    >
      <div
        className='h-10 w-full animate-pulse rounded-full border border-border/40 bg-surface md:hidden'
        aria-hidden
      />

      <PaintingsSearchSidebarSkeleton />

      <div className='flex min-w-0 grow flex-col'>
        <PaintingsSearchHitStatsSkeleton />
        <PaintingGridSkeleton count={18} />
      </div>
    </div>
  );
}
