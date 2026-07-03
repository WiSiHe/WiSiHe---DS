'use client';

import { motion, type Transition } from 'motion/react';
import type { CSSProperties } from 'react';
import type { BrushStrokeLayer } from '@/app/components/marketing/HeroSection/brushStrokeVariants';
import { useBrushReveal } from './BrushRevealContext';
import { brushSmearTransition } from './brushRevealMotion';
import type { SmearSweep } from './brushSmearLayout';
import { loadedTipSmearGradient } from './brushSmearLayout';

const LAYER_BASE_CLASS =
  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center';

const SMEAR_GRADIENT = loadedTipSmearGradient();

function layerSizeStyle(layerSizePercent: number): CSSProperties {
  const size = `${layerSizePercent}%`;
  return { width: size, height: size };
}

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

type BrushSmearPassProps = {
  sweep: SmearSweep;
  layer: BrushStrokeLayer;
  color: string;
  tipColor: string;
  index: number;
  passCount: number;
  layerSizePercent: number;
  bodyOpacity: number;
  tipOpacity: number;
  strokeBlendMode?: CSSProperties['mixBlendMode'];
  filterId?: string;
  useBristleFilter: boolean;
};

/** Masonry glaze smear — CSS loaded-tip bands (grid cards use GridBandReveal instead). */
export function BrushSmearPass({
  sweep,
  layer,
  color,
  tipColor,
  index,
  passCount: _passCount,
  layerSizePercent,
  bodyOpacity,
  tipOpacity,
  strokeBlendMode,
  filterId,
  useBristleFilter,
}: BrushSmearPassProps) {
  const { isActive, reduceMotion, liteMode } = useBrushReveal();
  const smearTransition = brushSmearTransition(index, isActive, reduceMotion, liteMode);
  const travel = sweep.direction * (isActive ? 36 : -36);
  const tipTravel = sweep.direction * (isActive ? 38 : -38);
  const bristleFilter = useBristleFilter && filterId ? `url(#${filterId})` : undefined;

  const bristleTransition: Transition = {
    ...smearTransition,
    delay: (typeof smearTransition.delay === 'number' ? smearTransition.delay : 0) + 0.06,
    duration: typeof smearTransition.duration === 'number' ? smearTransition.duration * 0.55 : 0.42,
  };

  const smearBandStyle: CSSProperties = {
    width: '320%',
    height: '155%',
    left: '50%',
    top: '50%',
    marginLeft: '-160%',
    marginTop: '-77.5%',
    rotate: `${sweep.angle}deg`,
    transformOrigin: 'center center',
    backgroundColor: color,
    backgroundImage: SMEAR_GRADIENT,
    backgroundBlendMode: 'multiply',
    ...(strokeBlendMode ? { mixBlendMode: strokeBlendMode } : {}),
  };

  const tipBandStyle: CSSProperties = {
    ...smearBandStyle,
    backgroundColor: tipColor,
    backgroundImage: loadedTipSmearGradient(),
  };

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden>
      <motion.div
        className='absolute'
        style={smearBandStyle}
        initial={false}
        animate={{
          x: `${travel}%`,
          opacity: isActive ? bodyOpacity : 0,
        }}
        transition={smearTransition}
      />

      <motion.div
        className='absolute'
        style={tipBandStyle}
        initial={false}
        animate={{
          x: `${tipTravel}%`,
          opacity: isActive ? tipOpacity : 0,
        }}
        transition={smearTransition}
      />

      <motion.div
        className={LAYER_BASE_CLASS}
        style={{
          ...layerSizeStyle(layerSizePercent),
          transform: layerTransform(layer),
          ...(strokeBlendMode && !liteMode ? { mixBlendMode: 'overlay' } : {}),
        }}
        initial={false}
        animate={{ opacity: isActive ? bodyOpacity * 0.55 : 0 }}
        transition={bristleTransition}
      >
        <svg
          className='block h-full w-full'
          viewBox={layer.viewBox}
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid slice'
          aria-hidden
        >
          <title>Decorative brush stroke</title>
          <motion.path
            d={layer.d}
            stroke={color}
            strokeWidth={layer.widthScale ? 118 * layer.widthScale : 118}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            filter={bristleFilter}
            initial={false}
            animate={{ opacity: isActive ? 0.85 : 0 }}
            transition={bristleTransition}
          />
        </svg>
      </motion.div>
    </div>
  );
}
