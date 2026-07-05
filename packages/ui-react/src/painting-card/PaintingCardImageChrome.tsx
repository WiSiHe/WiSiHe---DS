'use client';

import { cn } from '@wisihe/utils';
import { IconBadge } from '../icon-badge/IconBadge';
import type { PaintingCardBadge } from './PaintingCard';

/** Unified glass rail over artwork — one chip, icons in a row. */
const OVERLAY_DOCK_CLASS =
  'inline-flex items-center gap-1 rounded-lg border border-white/20 bg-black/45 px-1.5 py-1 shadow-sm backdrop-blur-md';

const OVERLAY_ICON_CLASS =
  'inline-flex size-6 shrink-0 items-center justify-center text-white/90 [&>svg]:size-3.5';

type PaintingCardImageChromeProps = {
  badges: PaintingCardBadge[];
  /** Badges over artwork vs caption strip on surface background. */
  tone?: 'overlay' | 'surface';
  className?: string;
};

/** Always-visible attribute icons — pinned on the image or inline in the caption strip. */
export function PaintingCardImageChrome({
  badges,
  tone = 'overlay',
  className,
}: PaintingCardImageChromeProps) {
  if (!badges.length) return null;

  if (tone === 'overlay') {
    return (
      <div
        className={cn(OVERLAY_DOCK_CLASS, className)}
        data-card-badges
        role='group'
        aria-label='Painting attributes'
      >
        {badges.map((badge, index) => (
          <span key={badge.key} className='inline-flex items-center gap-1'>
            {index > 0 ? <span className='h-3.5 w-px shrink-0 bg-white/15' aria-hidden /> : null}
            <span
              role='img'
              aria-label={badge.label}
              title={badge.label}
              className={OVERLAY_ICON_CLASS}
            >
              {badge.icon}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul
      className={cn('flex flex-wrap items-center gap-1.5', className)}
      data-card-badges
      aria-label='Painting attributes'
    >
      {badges.map(badge => (
        <li key={badge.key}>
          <IconBadge
            icon={badge.icon}
            label={badge.label}
            variant={badge.variant ?? 'surface'}
            size='sm'
            shape='square'
            shadow='sm'
          />
        </li>
      ))}
    </ul>
  );
}
