import { cn } from '@wisihe/utils';
import type { CSSProperties } from 'react';

const SKELETON_ASPECTS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/3]'] as const;

const SKELETON_TITLE_WIDTHS = ['w-[58%]', 'w-[68%]', 'w-[48%]'] as const;

function shimmerDelay(index: number, offset = 0): CSSProperties {
  return { animationDelay: `${index * 45 + offset}ms` };
}

type PaintingGridSkeletonItemProps = {
  index: number;
};

/** Single masonry tile — compact caption below on mobile/tablet, image-only on lg+ desktop grid. */
export function PaintingGridSkeletonItem({ index }: PaintingGridSkeletonItemProps) {
  const aspectClass = SKELETON_ASPECTS[index % SKELETON_ASPECTS.length]!;
  const titleWidth = SKELETON_TITLE_WIDTHS[index % SKELETON_TITLE_WIDTHS.length]!;

  return (
    <div className='mb-3 w-full break-inside-avoid' aria-hidden>
      <div
        className={cn(
          aspectClass,
          'relative overflow-hidden rounded-xl border border-border/40 bg-surface shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.08)] ring-1 ring-border/10',
        )}
      >
        <div
          className='absolute inset-0 animate-pulse bg-linear-to-br from-surface-subtle via-surface-hover/60 to-surface-subtle'
          style={shimmerDelay(index)}
        />
        <svg
          aria-hidden
          className='absolute inset-0 size-full opacity-[0.07]'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern
              id={`pg-sk-grid-${index}`}
              width='20'
              height='20'
              patternUnits='userSpaceOnUse'
            >
              <path d='M 20 0 L 0 0 0 20' fill='none' stroke='currentColor' strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill={`url(#pg-sk-grid-${index})`} />
        </svg>
      </div>
      <div
        className={cn(
          'mt-2 h-3.5 animate-pulse rounded-full bg-surface-hover lg:hidden',
          titleWidth,
        )}
        style={shimmerDelay(index, 20)}
      />
    </div>
  );
}

type PaintingGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function PaintingGridSkeleton({ count = 12, className }: PaintingGridSkeletonProps) {
  return (
    <div
      className={cn('mt-4 columns-2 gap-3 sm:columns-2 md:columns-3', className)}
      aria-busy='true'
      aria-label='Loading paintings'
    >
      {Array.from({ length: count }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
        <PaintingGridSkeletonItem key={index} index={index} />
      ))}
    </div>
  );
}

function SidebarLabelSkeleton({ widthClass }: { widthClass: string }) {
  return <div className={cn('h-3 rounded-sm bg-surface-hover/90 animate-pulse', widthClass)} />;
}

export function PaintingsSearchSidebarSkeleton() {
  return (
    <div className='hidden md:flex w-56 shrink-0 flex-col gap-6' aria-hidden>
      <div className='flex flex-col gap-1.5'>
        <SidebarLabelSkeleton widthClass='w-14' />
        <div className='h-10 w-full animate-pulse rounded-lg border border-border/40 bg-surface' />
      </div>

      <div className='flex flex-col gap-1.5'>
        <SidebarLabelSkeleton widthClass='w-10' />
        <div className='h-9 w-full animate-pulse rounded-lg bg-surface-hover/80' />
      </div>

      <div className='flex flex-col gap-2'>
        <SidebarLabelSkeleton widthClass='w-12' />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 11 }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
              key={index}
              className='size-7 animate-pulse rounded-full bg-surface-hover/80 ring-1 ring-border/30'
              style={shimmerDelay(index, 10)}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <SidebarLabelSkeleton widthClass='w-8' />
        <div className='flex flex-col gap-1.5'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
              key={index}
              className='h-9 w-full animate-pulse rounded-lg bg-surface-hover/80'
              style={shimmerDelay(index, 15)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PaintingsSearchHitStatsSkeleton() {
  return (
    <div className='mb-2 flex items-center justify-between gap-4' aria-hidden>
      <div className='h-4 w-44 max-w-[55%] animate-pulse rounded-sm bg-surface-hover/90' />
      <div className='h-9 w-28 shrink-0 animate-pulse rounded-full border border-border/40 bg-surface' />
    </div>
  );
}
