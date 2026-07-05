import { cn } from '@wisihe/utils';

type NsfwContentIndicatorProps = {
  label: string;
  className?: string;
  /** Compact pill on the image; inline under a caption (legacy). */
  variant?: 'overlay' | 'inline';
  /** Minimal pill for small grid tiles. */
  compact?: boolean;
};

export function NsfwContentIndicator({
  label,
  className,
  variant = 'overlay',
  compact = false,
}: NsfwContentIndicatorProps) {
  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex max-w-full items-center rounded-md border border-border/60 bg-surface-hover/80 px-1.5 py-0.5 text-[9px] font-semibold leading-none text-foreground-subtle',
          label.length <= 4 ? 'uppercase tracking-wider' : 'normal-case tracking-normal',
          className,
        )}
        title={label}
      >
        <span className='truncate'>{label}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm',
        compact
          ? cn(
              'h-5 max-w-[5.5rem] px-2 text-[8px] font-bold leading-none',
              label.length <= 4
                ? 'uppercase tracking-wider'
                : 'font-semibold normal-case tracking-normal',
            )
          : 'max-w-[calc(100%-1rem)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] shadow-sm',
        className,
      )}
      title={label}
    >
      <span className='truncate'>{label}</span>
    </span>
  );
}
