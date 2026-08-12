'use client';

import { cn } from '@wisihe/utils';

type MapMarkerTooltipProps = {
  title: string;
  detail?: string | null;
  className?: string;
};

export function MapMarkerTooltip({ title, detail, className }: MapMarkerTooltipProps) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[11rem] -translate-x-1/2',
        'max-sm:hidden opacity-0 scale-95 transition-all duration-150',
        'group-hover/marker:opacity-100 group-hover/marker:scale-100 group-focus-within/marker:opacity-100 group-focus-within/marker:scale-100',
        className,
      )}
    >
      <span className='block rounded-md border border-border/60 bg-background/95 px-2.5 py-1.5 text-left shadow-lg backdrop-blur-md'>
        <span className='block text-[11px] font-semibold leading-tight text-foreground'>
          {title}
        </span>
        {detail ? (
          <span className='mt-0.5 block text-[10px] leading-snug text-foreground-subtle line-clamp-2'>
            {detail}
          </span>
        ) : null}
      </span>
    </span>
  );
}
