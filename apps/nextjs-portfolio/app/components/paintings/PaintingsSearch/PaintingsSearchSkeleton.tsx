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

function PaintingCardSkeleton({ index }: { index: number }) {
  const aspects = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/5]'];
  const aspect = aspects[index % aspects.length];
  return (
    <div
      className={`w-full rounded-xl bg-surface border border-border overflow-hidden animate-pulse mb-2 relative ${aspect}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-subtle' />
      <div className='absolute bottom-0 left-0 right-0 h-10 bg-surface/80 border-t border-border px-3 py-2.5'>
        <div className='h-2.5 w-2/5 rounded-full bg-surface-subtle' />
      </div>
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
        <div className='columns-2 sm:columns-3 gap-2 mt-4'>
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
              key={i}
              className='break-inside-avoid'
            >
              <PaintingCardSkeleton index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
