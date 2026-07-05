'use client';

/**
 * Grid band brush reveal — horizontal band wipe with title/year overlay on hover.
 */

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { resolveBrushProfile } from '../brush-stroke/brushStrokeConstants';
import { getBrushStrokeVariant, paintingBrushSeed } from '../brush-stroke/brushStrokeVariants';
import type { PaintingFormat } from '../layout';
import { useBrushReveal } from './BrushRevealContext';
import { brushBandBloomTransition } from './brushRevealMotion';
import { GridBandReveal } from './GridBandReveal';

export { getBrushStrokeVariant, paintingBrushSeed };

const GRID_BAND_TITLE_CLASS =
  'line-clamp-2 font-serif text-base font-medium italic leading-tight text-white sm:text-lg [@supports(color:contrast-color(red))]:text-[contrast-color(var(--brush-accent))]';

import type { ReactNode } from 'react';

export type BrushRevealBadge = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type BrushRevealLayerProps = {
  accentColor: string;
  secondaryColor: string;
  /** @deprecated Unused — grid band has no wash. Kept for call-site compatibility. */
  washColor?: string;
  strokeVariantIndex?: number;
  /** Seed for wipe direction (left/right). Defaults to strokeVariantIndex. */
  revealSeed?: number;
  title?: string | null;
  year?: string | null;
  paintingFormat?: PaintingFormat;
};

export function BrushRevealLayer({
  accentColor,
  secondaryColor,
  strokeVariantIndex = 0,
  revealSeed,
  title,
  year,
  paintingFormat = 'portrait',
}: BrushRevealLayerProps) {
  const { isActive, reduceMotion, liteMode } = useBrushReveal();
  const brushProfile = resolveBrushProfile('gridCard', liteMode);
  const bandSeed = revealSeed ?? strokeVariantIndex;

  return (
    <>
      <div
        data-brush-band
        className='pointer-events-none absolute inset-0 z-[6] overflow-hidden'
        aria-hidden
      >
        <GridBandReveal
          seed={bandSeed}
          variantIndex={strokeVariantIndex}
          accentColor={accentColor}
          secondaryColor={secondaryColor}
          brushProfile={brushProfile}
          liteMode={liteMode}
          paintingFormat={paintingFormat}
        />
      </div>

      <motion.div
        data-brush-overlay
        className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-2.5 sm:p-3'
        style={{ '--brush-accent': accentColor } as CSSProperties}
      >
        {title ? (
          <motion.div
            data-brush-title
            className='flex max-w-full flex-col items-center justify-center space-y-0.5 px-2 text-center'
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={brushBandBloomTransition(2, isActive, reduceMotion, liteMode)}
          >
            <p className={cn(GRID_BAND_TITLE_CLASS, 'line-clamp-2 max-w-full text-center')}>
              {title}
            </p>
            {year ? (
              <span className='rounded border border-white/10 bg-black/65 px-1.5 py-0.5 font-sans text-[9px] font-bold text-white/90'>
                {year}
              </span>
            ) : null}
          </motion.div>
        ) : null}
      </motion.div>
    </>
  );
}
