'use client';

import { cn } from '@wisihe/utils';
import { resolveNsfwRatingLabel } from '@/lib/paintings/nsfwCover';
import { useBrushReveal } from './BrushRevealContext';
import { NsfwContentIndicator } from './NsfwContentIndicator';

type NsfwRestIndicatorProps = {
  tags?: string[] | null;
  className?: string;
};

/** Corner pill at rest — hides when brush-reveal metadata is active. */
export function NsfwRestIndicator({ tags, className }: NsfwRestIndicatorProps) {
  const { isActive } = useBrushReveal();
  const label = resolveNsfwRatingLabel((tags ?? []).filter(Boolean));

  return (
    <div
      className={cn(
        'pointer-events-none absolute left-2 top-2 z-[12] transition-opacity duration-200 ease-out',
        isActive ? 'opacity-0' : 'opacity-100',
        className,
      )}
      aria-hidden={isActive}
    >
      <NsfwContentIndicator label={label} compact />
    </div>
  );
}
