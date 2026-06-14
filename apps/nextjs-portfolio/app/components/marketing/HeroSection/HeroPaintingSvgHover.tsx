'use client';

/**
 * CodeGrid-style SVG brush strokes: organic paths, dash reveal + stroke-width.
 * GSAP targets `[data-hero-svg] path`. Parent should use `overflow-hidden` + radius so strokes clip to the image.
 */

import { motion } from 'motion/react';

import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
  paintingBrushSeed,
} from './brushStrokeVariants';

/** Prepare paths for dash-offset animation (call once per card root that contains `[data-hero-svg]`). */
export function initHeroSvgStrokePaths(root: HTMLElement | null): void {
  if (!root) return;
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
  });
}

export { getBrushStrokeVariant, paintingBrushSeed };

/** Initial / rest stroke width (matches example markup). */
export const HERO_BRUSH_STROKE_WIDTH_REST = 200;
/** Peak stroke width on hover (matches example script). */
export const HERO_BRUSH_STROKE_WIDTH_HOVER = 700;

/**
 * Stroke colors for hero SVG hover — hex values taken from `@wisihe/tokens` primitives
 * (`packages/tokens/tokens/primitives/color.json`). Each pair crosses two families for contrast.
 * Large set so carousel indices rarely repeat nearby.
 */
export const HERO_STROKE_COLOR_PAIRS: ReadonlyArray<{ accent: string; secondary: string }> = [
  { accent: '#ff4400', secondary: '#8b5cf6' }, // neon-orange.500 + brand-2.500
  { accent: '#ff007f', secondary: '#14b8a6' }, // neon-pink.500 + brand-3.500
  { accent: '#3b82f6', secondary: '#ff7442' }, // brand-1.500 + neon-orange.400
  { accent: '#7c3aed', secondary: '#eab308' }, // brand-2.600 + neon-yellow.500
  { accent: '#14b8a6', secondary: '#ec4899' }, // brand-3.500 + accent-legacy.500
  { accent: '#10b981', secondary: '#ff54b0' }, // success-primitive.500 + neon-pink.400
  { accent: '#d97706', secondary: '#60a5fa' }, // warning-primitive.600 + brand-1.400
  { accent: '#ef4444', secondary: '#2dd4bf' }, // danger-primitive.500 + brand-3.400
  { accent: '#e02e00', secondary: '#93c5fd' }, // neon-orange.600 + brand-1.300
  { accent: '#a78bfa', secondary: '#ff4400' }, // brand-2.400 + neon-orange.500
  { accent: '#facc15', secondary: '#0f766e' }, // neon-yellow.400 + brand-3.700
  { accent: '#f472b6', secondary: '#2563eb' }, // accent-legacy.400 + brand-1.600
  { accent: '#ff54b0', secondary: '#059669' }, // neon-pink.400 + success-primitive.600
  { accent: '#c4b5fd', secondary: '#e02e00' }, // brand-2.300 + neon-orange.600
  { accent: '#99f6e4', secondary: '#db2777' }, // brand-3.200 + accent-legacy.600
  { accent: '#fde047', secondary: '#7c3aed' }, // neon-yellow.300 + brand-2.600
  { accent: '#ff91cc', secondary: '#1d4ed8' }, // neon-pink.300 + brand-1.700
  { accent: '#ffa379', secondary: '#5b21b6' }, // neon-orange.300 + brand-2.800
  { accent: '#5eead4', secondary: '#f87171' }, // brand-3.300 + danger-primitive.400
  { accent: '#fbbf24', secondary: '#6d28d9' }, // warning-primitive.400 + brand-2.700
  { accent: '#6ee7b7', secondary: '#be185d' }, // success-primitive.300 + accent-legacy.700
  { accent: '#fca5a5', secondary: '#0d9488' }, // danger-primitive.300 + brand-3.600
  { accent: '#bfdbfe', secondary: '#b5005a' }, // brand-1.200 + neon-pink.700
  { accent: '#f9a8d4', secondary: '#115e59' }, // accent-legacy.300 + brand-3.800
  { accent: '#ca8a04', secondary: '#1e40af' }, // neon-yellow.600 + brand-1.800
  { accent: '#fecaca', secondary: '#047857' }, // danger-primitive.200 + success-primitive.700
  { accent: '#ede9fe', secondary: '#b82000' }, // brand-2.100 + neon-orange.700
  { accent: '#ccfbf1', secondary: '#831843' }, // brand-3.100 + accent-legacy.900
  { accent: '#fcd34d', secondary: '#4c1d95' }, // warning-primitive.300 + brand-2.900
  { accent: '#34d399', secondary: '#ff007f' }, // success-primitive.400 + neon-pink.500
  { accent: '#60a5fa', secondary: '#941b06' }, // brand-1.400 + neon-orange.800
  { accent: '#a78bfa', secondary: '#ca8a04' }, // brand-2.400 + neon-yellow.600
  { accent: '#2dd4bf', secondary: '#b91c1c' }, // brand-3.400 + danger-primitive.700
  { accent: '#fef08a', secondary: '#6d28d9' }, // neon-yellow.200 + brand-2.700
  { accent: '#fbcfe8', secondary: '#0f766e' }, // accent-legacy.200 + brand-3.700
  { accent: '#ffbee0', secondary: '#1e3a8a' }, // neon-pink.200 + brand-1.900
  { accent: '#ffccaa', secondary: '#9d174d' }, // neon-orange.200 + accent-legacy.800
  { accent: '#ddd6fe', secondary: '#e02e00' }, // brand-2.200 + neon-orange.600
  { accent: '#a7f3d0', secondary: '#7c3aed' }, // success-primitive.200 + brand-2.600
  { accent: '#93c5fd', secondary: '#db006d' }, // brand-1.300 + neon-pink.600
  { accent: '#5eead4', secondary: '#92400e' }, // brand-3.300 + warning-primitive.800
  { accent: '#f472b6', secondary: '#115e59' }, // accent-legacy.400 + brand-3.800
  { accent: '#eab308', secondary: '#4c1d95' }, // neon-yellow.500 + brand-2.900
  { accent: '#2563eb', secondary: '#ff7442' }, // brand-1.600 + neon-orange.400
  { accent: '#8b5cf6', secondary: '#10b981' }, // brand-2.500 + success-primitive.500
  { accent: '#0d9488', secondary: '#f59e0b' }, // brand-3.600 + warning-primitive.500
  { accent: '#ec4899', secondary: '#34d399' }, // accent-legacy.500 + success-primitive.400
  { accent: '#b82000', secondary: '#93c5fd' }, // neon-orange.700 + brand-1.300
  { accent: '#172554', secondary: '#fde047' }, // brand-1.950 + neon-yellow.300
];

const DEFAULT_HERO_STROKE_COLOR_PAIR = { accent: '#ff4400', secondary: '#8b5cf6' } as const;

export function getHeroStrokeColors(index: number): {
  accentColor: string;
  secondaryColor: string;
} {
  const pair =
    HERO_STROKE_COLOR_PAIRS[index % HERO_STROKE_COLOR_PAIRS.length] ??
    DEFAULT_HERO_STROKE_COLOR_PAIR;
  return { accentColor: pair.accent, secondaryColor: pair.secondary };
}

type HeroPaintingSvgHoverProps = {
  accentColor: string;
  secondaryColor: string;
  strokeVariantIndex?: number;
  title?: string | null;
  medium?: string | null;
  year?: string | null;
  tags?: string[] | null;
  useMotion?: boolean;
};

const LAYER_BASE_CLASS =
  'svg-stroke absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 origin-center';

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

function BrushStrokeSvg({
  layer,
  color,
  className,
  useMotion,
  pathVariants,
  strokeWidthRest,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  useMotion: boolean;
  pathVariants?: {
    initial: object;
    hover: object;
  };
  strokeWidthRest: number;
}) {
  return (
    <div className={className} style={{ transform: layerTransform(layer) }}>
      <svg
        className='block h-full w-full'
        viewBox={layer.viewBox}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='xMidYMid slice'
      >
        <title>Decorative brush stroke</title>
        {useMotion && pathVariants ? (
          <motion.path
            variants={pathVariants}
            d={layer.d}
            stroke={color}
            strokeLinecap='round'
            fill='none'
          />
        ) : (
          <path
            d={layer.d}
            stroke={color}
            strokeWidth={strokeWidthRest}
            strokeLinecap='round'
            fill='none'
            style={{ opacity: 0 }}
          />
        )}
      </svg>
    </div>
  );
}

export function HeroPaintingSvgHover({
  accentColor,
  secondaryColor,
  strokeVariantIndex = 0,
  title,
  medium,
  year,
  useMotion = false,
}: HeroPaintingSvgHoverProps) {
  const variant = getBrushStrokeVariant(strokeVariantIndex);
  if (useMotion) {
    const pathVariants = {
      initial: {
        pathLength: 0,
        strokeWidth: HERO_BRUSH_STROKE_WIDTH_REST,
        opacity: 0,
      },
      hover: {
        pathLength: 1,
        strokeWidth: HERO_BRUSH_STROKE_WIDTH_HOVER,
        opacity: 1,
        transition: {
          pathLength: { duration: 1.5, ease: 'easeOut' as const },
          opacity: { duration: 0.1 }, // Fade in quickly to hide start dots
        },
      },
    };

    const detailsVariants = {
      initial: { opacity: 0, y: 15 },
      hover: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: 'easeOut' as const, delay: 0.25 },
      },
    };

    return (
      <>
        <div
          data-hero-svg
          className='pointer-events-none absolute inset-0 z-2 overflow-hidden'
          aria-hidden
          style={{ transform: `scale(${variant.scale})` }}
        >
          <BrushStrokeSvg
            layer={variant.layers[0]}
            color={accentColor}
            className={`${LAYER_BASE_CLASS} svg-stroke-1`}
            useMotion
            pathVariants={pathVariants}
            strokeWidthRest={HERO_BRUSH_STROKE_WIDTH_REST}
          />
          <BrushStrokeSvg
            layer={variant.layers[1]}
            color={secondaryColor}
            className={`${LAYER_BASE_CLASS} svg-stroke-2`}
            useMotion
            pathVariants={pathVariants}
            strokeWidthRest={HERO_BRUSH_STROKE_WIDTH_REST}
          />
        </div>
        {title ? (
          <motion.div
            variants={detailsVariants}
            className='pointer-events-none absolute bottom-3 left-3 right-3 z-3 flex flex-col items-start text-left space-y-1'
          >
            <p className='line-clamp-2 font-serif text-lg font-medium leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-xl italic'>
              {title}
            </p>
            <div className='flex flex-wrap items-center gap-2'>
              {year && (
                <span className='font-sans text-[10px] font-bold text-white/80 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/5'>
                  {year}
                </span>
              )}
              {medium && (
                <span className='font-mono text-[9px] uppercase tracking-wider text-white/70 drop-shadow-sm font-semibold'>
                  {medium}
                </span>
              )}
            </div>
          </motion.div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <div
        data-hero-svg
        className='pointer-events-none absolute inset-0 z-2 overflow-hidden'
        aria-hidden
        style={{ transform: `scale(${variant.scale})` }}
      >
        <BrushStrokeSvg
          layer={variant.layers[0]}
          color={accentColor}
          className={`${LAYER_BASE_CLASS} svg-stroke-1`}
          useMotion={false}
          strokeWidthRest={HERO_BRUSH_STROKE_WIDTH_REST}
        />
        <BrushStrokeSvg
          layer={variant.layers[1]}
          color={secondaryColor}
          className={`${LAYER_BASE_CLASS} svg-stroke-2`}
          useMotion={false}
          strokeWidthRest={HERO_BRUSH_STROKE_WIDTH_REST}
        />
      </div>
      {title ? (
        <div
          data-hero-title
          className='pointer-events-none absolute bottom-2 left-2 right-2 z-3 opacity-0 flex flex-col items-start text-left space-y-0.5'
        >
          <p className='line-clamp-2 font-serif text-base font-medium leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-lg italic'>
            {title}
          </p>
          {(year || medium) && (
            <div className='flex flex-wrap items-center gap-1.5'>
              {year && (
                <span className='font-sans text-[9px] font-bold text-white/80 bg-black/40 px-1.2 py-0.2 rounded backdrop-blur-sm border border-white/5'>
                  {year}
                </span>
              )}
              {medium && (
                <span className='font-mono text-[8px] uppercase tracking-wider text-white/70 drop-shadow-sm font-semibold truncate max-w-[150px]'>
                  {medium}
                </span>
              )}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
