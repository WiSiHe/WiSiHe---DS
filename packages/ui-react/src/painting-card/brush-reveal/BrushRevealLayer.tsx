'use client';

/**
 * Grid band brush reveal — horizontal band wipe with title/year overlay on hover.
 */

import { cn } from '@wisihe/utils';
import { motion, type Transition } from 'motion/react';
import type { CSSProperties } from 'react';
import { resolveTitleTreatment } from '../brush-stroke/brushContrast';
import { resolveBrushProfile } from '../brush-stroke/brushStrokeConstants';
import { getBrushStrokeVariant, paintingBrushSeed } from '../brush-stroke/brushStrokeVariants';
import type { PaintingFormat } from '../layout';
import { useBrushReveal } from './BrushRevealContext';
import { composeBand, seedUnit } from './bandBrushPaths';
import { brushBandBloomTransition } from './brushRevealMotion';
import { GridBandReveal } from './GridBandReveal';

export { getBrushStrokeVariant, paintingBrushSeed };

const GRID_BAND_TITLE_CLASS =
  'line-clamp-2 font-serif text-base font-medium italic leading-tight sm:text-lg';

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
  const band = composeBand(bandSeed, strokeVariantIndex, accentColor, secondaryColor);
  // Playful touch, seeded per painting: the title sits at a slight tilt and wobbles in.
  const tilt = (seedUnit(bandSeed, 90) - 0.5) * 6;
  const titleTreatment = resolveTitleTreatment(band.strokes.map(stroke => stroke.color));
  const bloom = brushBandBloomTransition(2, isActive, reduceMotion, liteMode);
  // Follow-through: the title overshoots slightly on a spring, then settles; the year chip trails it.
  const titleTransition: Transition =
    isActive && !reduceMotion
      ? {
          opacity: bloom,
          default: {
            type: 'spring',
            stiffness: 380,
            damping: 15,
            delay: typeof bloom.delay === 'number' ? bloom.delay : 0,
          },
        }
      : bloom;

  return (
    <>
      <div
        data-brush-band
        className='pointer-events-none absolute inset-0 z-[6] overflow-hidden'
        aria-hidden
      >
        <GridBandReveal
          seed={bandSeed}
          band={band}
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
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive || reduceMotion ? 1 : 0.9,
              y: isActive || reduceMotion ? 0 : 6,
              rotate: isActive || reduceMotion ? tilt : tilt - 5,
            }}
            transition={titleTransition}
          >
            <p
              className={cn(
                GRID_BAND_TITLE_CLASS,
                'line-clamp-2 max-w-full text-center',
                titleTreatment.plate && 'rounded-md px-2.5 py-1',
              )}
              style={{ color: titleTreatment.color, backgroundColor: titleTreatment.plate }}
            >
              {title}
            </p>
            {year ? (
              <motion.span
                className='rounded border border-white/10 bg-black/65 px-1.5 py-0.5 font-sans text-[9px] font-bold text-white/90'
                initial={false}
                animate={{ y: isActive || reduceMotion ? 0 : 4 }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 18,
                  delay:
                    isActive && !reduceMotion && typeof bloom.delay === 'number'
                      ? bloom.delay + 0.07
                      : 0,
                }}
              >
                {year}
              </motion.span>
            ) : null}
          </motion.div>
        ) : null}
      </motion.div>
    </>
  );
}
