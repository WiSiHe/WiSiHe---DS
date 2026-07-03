import { cn } from '@wisihe/utils';

type NsfwBlurredCardFooterProps = {
  title: string;
  matureContentLabel: string;
  paintedAt?: string;
  className?: string;
};

/** Always-visible footer for NSFW grid cards when the filter is off. */
export function NsfwBlurredCardFooter({
  title,
  matureContentLabel,
  paintedAt,
  className,
}: NsfwBlurredCardFooterProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-0 left-0 right-0 z-[25] border-t border-border/30 bg-surface/95 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3',
        className,
      )}
      aria-hidden
    >
      <p className='line-clamp-1 font-inter text-sm font-black capitalize text-foreground sm:text-base'>
        {title}
      </p>
      {paintedAt ? (
        <div className='mt-1'>
          <span className='rounded border border-border bg-surface-hover/80 px-1.5 py-0.5 font-sans text-[10px] font-bold text-foreground-subtle'>
            {paintedAt}
          </span>
        </div>
      ) : null}
      <p className='mt-1.5 text-[10px] font-medium leading-snug text-foreground-subtle'>
        {matureContentLabel}
      </p>
    </div>
  );
}
