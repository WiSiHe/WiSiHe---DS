import { Skeleton } from '@wisihe/ui-react/skeleton';
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
      <Skeleton variant='rectangular' className='h-10 w-full rounded-full md:hidden' aria-hidden />

      <PaintingsSearchSidebarSkeleton />

      <div className='flex min-w-0 grow flex-col'>
        <PaintingsSearchHitStatsSkeleton />
        <PaintingGridSkeleton count={18} />
      </div>
    </div>
  );
}
