import { cn } from '@wisihe/utils';
import { NSFW_FILTER_HINT, NSFW_MATURE_LABEL } from '@/lib/paintings/nsfwCover';

type NsfwMatureCaptionProps = {
  className?: string;
  /** When true, include the filter hint (search grid captions). */
  showFilterHint?: boolean;
};

export function NsfwMatureCaption({ className, showFilterHint = true }: NsfwMatureCaptionProps) {
  return (
    <p className={cn('text-[11px] leading-snug text-foreground-muted', className)}>
      <span className='font-medium text-foreground-subtle'>{NSFW_MATURE_LABEL}.</span>
      {showFilterHint ? <> {NSFW_FILTER_HINT}.</> : null}
    </p>
  );
}
