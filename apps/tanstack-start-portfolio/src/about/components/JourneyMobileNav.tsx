'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';

type JourneyMobileNavProps = {
  activeIndex: number;
  total: number;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export function JourneyMobileNav({
  activeIndex,
  total,
  label,
  onPrev,
  onNext,
  className,
}: JourneyMobileNavProps) {
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < total - 1;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border border-border/60 bg-background/95 p-2.5 shadow-lg backdrop-blur-md lg:hidden',
        className,
      )}
      aria-label='Journey navigation'
    >
      <button
        type='button'
        onClick={onPrev}
        disabled={!canPrev}
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors',
          canPrev
            ? 'bg-surface text-foreground hover:bg-surface-subtle'
            : 'text-foreground-muted/40',
        )}
        aria-label='Previous place'
      >
        <IconChevronLeft className='size-5' stroke={2} aria-hidden />
      </button>

      <div className='min-w-0 flex-1 px-1 text-center'>
        <p className='truncate font-serif text-sm font-semibold text-foreground'>{label}</p>
        <p className='font-mono text-[10px] tabular-nums text-foreground-muted'>
          {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
      </div>

      <button
        type='button'
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors',
          canNext
            ? 'bg-surface text-foreground hover:bg-surface-subtle'
            : 'text-foreground-muted/40',
        )}
        aria-label='Next place'
      >
        <IconChevronRight className='size-5' stroke={2} aria-hidden />
      </button>
    </div>
  );
}
