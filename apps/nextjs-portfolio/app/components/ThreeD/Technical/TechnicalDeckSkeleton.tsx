'use client';

export function TechnicalDeckSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-background">
      {/* Left Content Panel Skeleton */}
      <article className="flex-1 lg:w-1/2 flex flex-col relative z-10">
        {/* Fixed Header Skeleton */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-28 pb-4 px-8 md:pt-32 md:px-12 lg:pt-36 lg:px-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="h-8 w-48 bg-surface-elevated rounded-full animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-surface-elevated animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-2 w-2 rounded-full bg-surface-elevated animate-pulse" />
                ))}
              </div>
              <div className="h-10 w-10 rounded-full bg-surface-elevated animate-pulse" />
            </div>
          </div>
          <div className="h-12 w-3/4 bg-surface-elevated rounded-lg animate-pulse" />
        </div>

        {/* Scrollable Content Skeleton */}
        <div className="flex-1 overflow-y-auto pb-8 px-8 md:pb-12 md:px-12 lg:pb-16 lg:px-16">
          <div className="flex flex-col justify-center max-w-4xl mx-auto w-full">
            <div className="space-y-12 pt-8">
              <div className="space-y-3">
                <div className="h-6 w-full bg-surface-elevated rounded animate-pulse" />
                <div className="h-6 w-5/6 bg-surface-elevated rounded animate-pulse" />
                <div className="h-6 w-4/6 bg-surface-elevated rounded animate-pulse" />
              </div>
              <div className="h-64 w-full bg-surface-elevated rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-surface-elevated rounded animate-pulse" />
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-24 bg-surface-elevated rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Right 3D Panel Skeleton */}
      <div className="flex-1 lg:w-1/2 h-full relative bg-linear-to-br from-surface/30 via-background to-surface/20 border-l border-border/30 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-foreground/60 font-medium">Loading 3D Scene...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
