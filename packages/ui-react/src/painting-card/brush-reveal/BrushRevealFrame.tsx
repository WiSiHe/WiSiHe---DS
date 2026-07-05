'use client';

import { cn } from '@wisihe/utils';
import type { ReactNode } from 'react';
import { getBrushStrokeColors } from '../brush-stroke/brushStrokeColors';
import type { PaintingFormat } from '../layout';
import { getNsfwImageBlurClass, type NsfwCoverVariant } from '../nsfwCover';
import { PaintingCardImageChrome } from '../PaintingCardImageChrome';
import { type BrushRevealBadge, BrushRevealLayer } from './BrushRevealLayer';
import { BrushRevealWrap } from './BrushRevealWrap';

export type BrushRevealFrameProps = {
  /** @deprecated Only grid band exists — ignored. */
  profile?: 'gridCard';
  paintingFormat?: PaintingFormat;
  /** Pin overlay open (compare grids). Omit for pointer-driven hover. */
  hovered?: boolean;
  /** Blur image underneath (NSFW demo). */
  isNsfwBlurred?: boolean;
  nsfwCoverVariant?: NsfwCoverVariant;
  strokeVariantIndex?: number;
  title?: string;
  year?: string;
  badges?: BrushRevealBadge[];
  imageSrc?: string;
  imageAlt?: string;
  frameClass?: string;
  children?: ReactNode;
  className?: string;
  /** Opt-in band hover. */
  brushReveal?: boolean;
};

const DEFAULT_IMAGE = 'https://www.wisihe.no/images/cute.jpg';

/** Standalone grid band reveal — wrap any media frame. */
export function BrushRevealFrame({
  hovered,
  isNsfwBlurred = false,
  nsfwCoverVariant = 'card',
  strokeVariantIndex = 0,
  title = '',
  year = '',
  badges = [],
  imageSrc = DEFAULT_IMAGE,
  imageAlt = '',
  frameClass = 'relative aspect-[3/4] w-full overflow-hidden rounded-xl',
  children,
  className,
  brushReveal = true,
  paintingFormat = 'portrait',
}: BrushRevealFrameProps) {
  const colors = getBrushStrokeColors(strokeVariantIndex);

  return (
    <BrushRevealWrap
      enabled={brushReveal}
      hovered={hovered}
      className={className ?? 'h-full w-full'}
    >
      <div className={frameClass}>
        {children ?? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              isNsfwBlurred && getNsfwImageBlurClass(nsfwCoverVariant),
            )}
          />
        )}
        {badges.length > 0 ? (
          <PaintingCardImageChrome
            badges={badges}
            tone='overlay'
            className='pointer-events-none absolute top-2 right-2 z-[22]'
          />
        ) : null}
        {brushReveal ? (
          <BrushRevealLayer
            {...colors}
            strokeVariantIndex={strokeVariantIndex}
            title={title}
            year={year}
            paintingFormat={paintingFormat}
          />
        ) : null}
      </div>
    </BrushRevealWrap>
  );
}
