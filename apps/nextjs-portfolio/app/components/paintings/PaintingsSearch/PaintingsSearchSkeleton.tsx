function SidebarBlock({ lines = 1 }: { lines?: number }) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='h-3 w-16 rounded bg-surface-subtle animate-pulse' />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
          key={i}
          className='h-9 w-full rounded-lg bg-surface-subtle animate-pulse'
        />
      ))}
    </div>
  );
}

function PaintingCardSkeleton() {
  return (
    <div className='aspect-square w-full rounded-xl border border-border bg-surface overflow-hidden animate-pulse'>
      <div className='size-full bg-linear-to-br from-surface-subtle via-surface to-surface-subtle' />
    </div>
  );
}

/** Full-page skeleton while the Algolia search bundle loads. */
export default function PaintingsSearchSkeleton() {
  return (
    <div
      className='flex flex-col md:flex-row gap-8 w-full mt-4'
      aria-busy='true'
      aria-label='Loading paintings'
    >
      <div className='hidden md:flex w-56 shrink-0 flex-col gap-6'>
        <SidebarBlock lines={1} />
        <SidebarBlock lines={1} />
        <SidebarBlock lines={4} />
        <SidebarBlock lines={6} />
      </div>
      <div className='grow flex flex-col min-w-0'>
        <div className='flex items-center justify-between gap-4 mb-2'>
          <div className='h-4 w-40 rounded bg-surface-subtle animate-pulse' />
          <div className='h-9 w-28 rounded-full bg-surface-subtle animate-pulse' />
        </div>
        <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'>
          {Array.from({ length: 18 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            <PaintingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
