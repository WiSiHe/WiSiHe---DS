'use client';

import type { CSSProperties } from 'react';

type HeroProjectUiHoverProps = {
  accentColor: string;
  title?: string | null;
  client?: string | null;
  tags?: string[] | null;
};

/** Minimal product-card hover — bottom dock + accent edge (paintings use brush reveal). */
export function HeroProjectUiHover({ accentColor, title, client, tags }: HeroProjectUiHoverProps) {
  const displayTitle = title?.trim() || 'Project';
  const displayClient = client?.trim() || null;
  const visibleTags = (tags ?? []).filter(Boolean).slice(0, 2);

  return (
    <>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-[5] bg-black/25 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none'
      />

      <div
        aria-hidden
        className='pointer-events-none absolute left-0 top-4 bottom-4 z-[6] w-[3px] origin-top scale-y-0 rounded-full opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-y-100 group-hover:opacity-100 motion-reduce:scale-y-100 motion-reduce:opacity-100 motion-reduce:transition-none'
        style={{ backgroundColor: accentColor }}
      />

      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-[6] rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none'
        style={
          {
            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accentColor} 55%, white)`,
          } as CSSProperties
        }
      />

      <div
        data-hero-overlay
        className='pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full border-t border-white/10 bg-black/55 px-3 py-2.5 backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none sm:px-3.5 sm:py-3'
      >
        <div className='flex min-w-0 items-end justify-between gap-2'>
          <div className='min-w-0 flex-1'>
            {displayClient ? (
              <p className='mb-0.5 truncate font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-white/60'>
                {displayClient}
              </p>
            ) : null}
            <p className='line-clamp-2 text-left text-xs font-semibold leading-snug tracking-tight text-white sm:text-[13px]'>
              {displayTitle}
            </p>
            {visibleTags.length > 0 ? (
              <p className='mt-1 truncate font-mono text-[8px] uppercase tracking-wide text-white/50 sm:text-[9px]'>
                {visibleTags.join(' · ')}
              </p>
            ) : null}
          </div>
          <span
            aria-hidden
            className='shrink-0 translate-x-1 text-sm font-medium text-white/70 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none'
            style={{ color: accentColor }}
          >
            →
          </span>
        </div>
      </div>
    </>
  );
}
