'use client';

/**
 * SVG brush strokes: organic paths draw on hover like paint; metadata sits above strokes.
 * GSAP targets `[data-hero-svg] path`. Parent should use `overflow-hidden` + radius.
 */

import { motion, type Variants } from 'motion/react';
import { useId } from 'react';

import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
  paintingBrushSeed,
} from './brushStrokeVariants';

/** Prepare paths for dash-offset animation (call once per card root that contains `[data-hero-svg]`). */
export function initHeroSvgStrokePaths(root: HTMLElement | null, strokeScale = 1): void {
  if (!root) return;
  const isCard = strokeScale < 1;
  const restWidth = isCard ? 30 : HERO_BRUSH_STROKE_WIDTH_REST * strokeScale;
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.setAttribute('stroke-width', String(restWidth * 0.85));
    path.style.opacity = '0';
  });
  const overlay = root.querySelector('[data-hero-overlay]');
  if (overlay instanceof HTMLElement) {
    overlay.style.opacity = '0';
  }
  const vignette = root.querySelector('[data-hero-vignette]');
  if (vignette instanceof HTMLElement) {
    vignette.style.opacity = '0';
  }
}

export { getBrushStrokeVariant, paintingBrushSeed };

/** Initial / rest stroke width (hero). */
export const HERO_BRUSH_STROKE_WIDTH_REST = 200;
/** Peak stroke width on hover (hero). */
export const HERO_BRUSH_STROKE_WIDTH_HOVER = 700;

/**
 * Stroke colors for hero SVG hover — hex values taken from `@wisihe/tokens` primitives.
 */
export const HERO_STROKE_COLOR_PAIRS: ReadonlyArray<{ accent: string; secondary: string }> = [
  { accent: '#ff4400', secondary: '#8b5cf6' },
  { accent: '#ff007f', secondary: '#14b8a6' },
  { accent: '#3b82f6', secondary: '#ff7442' },
  { accent: '#7c3aed', secondary: '#eab308' },
  { accent: '#14b8a6', secondary: '#ec4899' },
  { accent: '#10b981', secondary: '#ff54b0' },
  { accent: '#d97706', secondary: '#60a5fa' },
  { accent: '#ef4444', secondary: '#2dd4bf' },
  { accent: '#e02e00', secondary: '#93c5fd' },
  { accent: '#a78bfa', secondary: '#ff4400' },
  { accent: '#facc15', secondary: '#0f766e' },
  { accent: '#f472b6', secondary: '#2563eb' },
  { accent: '#ff54b0', secondary: '#059669' },
  { accent: '#c4b5fd', secondary: '#e02e00' },
  { accent: '#99f6e4', secondary: '#db2777' },
  { accent: '#fde047', secondary: '#7c3aed' },
  { accent: '#ff91cc', secondary: '#1d4ed8' },
  { accent: '#ffa379', secondary: '#5b21b6' },
  { accent: '#5eead4', secondary: '#f87171' },
  { accent: '#fbbf24', secondary: '#6d28d9' },
  { accent: '#6ee7b7', secondary: '#be185d' },
  { accent: '#fca5a5', secondary: '#0d9488' },
  { accent: '#bfdbfe', secondary: '#b5005a' },
  { accent: '#f9a8d4', secondary: '#115e59' },
  { accent: '#ca8a04', secondary: '#1e40af' },
  { accent: '#fecaca', secondary: '#047857' },
  { accent: '#ede9fe', secondary: '#b82000' },
  { accent: '#ccfbf1', secondary: '#831843' },
  { accent: '#fcd34d', secondary: '#4c1d95' },
  { accent: '#34d399', secondary: '#ff007f' },
  { accent: '#60a5fa', secondary: '#941b06' },
  { accent: '#a78bfa', secondary: '#ca8a04' },
  { accent: '#2dd4bf', secondary: '#b91c1c' },
  { accent: '#fef08a', secondary: '#6d28d9' },
  { accent: '#fbcfe8', secondary: '#0f766e' },
  { accent: '#ffbee0', secondary: '#1e3a8a' },
  { accent: '#ffccaa', secondary: '#9d174d' },
  { accent: '#ddd6fe', secondary: '#e02e00' },
  { accent: '#a7f3d0', secondary: '#7c3aed' },
  { accent: '#93c5fd', secondary: '#db006d' },
  { accent: '#5eead4', secondary: '#92400e' },
  { accent: '#f472b6', secondary: '#115e59' },
  { accent: '#eab308', secondary: '#4c1d95' },
  { accent: '#2563eb', secondary: '#ff7442' },
  { accent: '#8b5cf6', secondary: '#10b981' },
  { accent: '#0d9488', secondary: '#f59e0b' },
  { accent: '#ec4899', secondary: '#34d399' },
  { accent: '#b82000', secondary: '#93c5fd' },
  { accent: '#172554', secondary: '#fde047' },
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
  /** Multiplier for stroke width (card grids use ~0.4). */
  strokeScale?: number;
  title?: string | null;
  medium?: string | null;
  year?: string | null;
  tags?: string[] | null;
  /** Image is covered by NSFW frost — strokes/metadata render on top of blur, not the artwork. */
  isNsfwBlurred?: boolean;
  useMotion?: boolean;
};

const LAYER_BASE_CLASS =
  'svg-stroke absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 origin-center';

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

function coverScale(variantScale: number, strokeScale: number): number {
  if (strokeScale < 1) return Math.min(variantScale * 0.72, 1.65);
  return variantScale;
}

function BrushStrokeSvg({
  layer,
  color,
  className,
  filterId,
  useMotion,
  pathVariants,
  strokeWidthRest,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  filterId: string;
  useMotion: boolean;
  pathVariants?: Variants;
  strokeWidthRest: number;
}) {
  const paintProps = {
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
    filter: `url(#${filterId})`,
    style: { mixBlendMode: 'soft-light' as const },
  };

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
          <motion.path variants={pathVariants} d={layer.d} {...paintProps} />
        ) : (
          <path
            d={layer.d}
            strokeWidth={strokeWidthRest}
            {...paintProps}
            style={{ mixBlendMode: 'soft-light', opacity: 0 }}
          />
        )}
      </svg>
    </div>
  );
}

function BrushMetadataOverlay({
  tags,
  title,
  year,
  medium,
  accentColor,
  isNsfwBlurred = false,
  motionOverlay = false,
  overlayVariants,
}: {
  tags: string[];
  title?: string | null;
  year?: string | null;
  medium?: string | null;
  accentColor: string;
  isNsfwBlurred?: boolean;
  motionOverlay?: boolean;
  overlayVariants?: Variants;
}) {
  const visibleTags = tags.slice(0, 4);
  const chipClass =
    'rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-sm sm:text-[10px]';

  const content = (
    <>
      <div className='flex flex-wrap items-start gap-1 pr-6'>
        {isNsfwBlurred ? (
          <span className={`${chipClass} border-white/25 bg-black/65`}>Mature content</span>
        ) : null}
        {visibleTags.length > 0 ? (
          <div className='flex flex-wrap gap-1' data-hero-tags>
            {visibleTags.map(tag => (
              <span
                key={tag}
                className={chipClass}
                style={{ boxShadow: `0 0 10px ${accentColor}44` }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {title ? (
        <div data-hero-title className='mt-auto flex flex-col items-start text-left space-y-0.5'>
          <p className='line-clamp-2 font-serif text-base font-medium leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:text-lg italic'>
            {title}
          </p>
          {(year || medium) && (
            <div className='flex flex-wrap items-center gap-1.5'>
              {year && (
                <span className='font-sans text-[9px] font-bold text-white/90 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10'>
                  {year}
                </span>
              )}
              {medium && (
                <span className='font-mono text-[8px] uppercase tracking-wider text-white/80 drop-shadow-sm font-semibold truncate max-w-[150px]'>
                  {medium}
                </span>
              )}
            </div>
          )}
        </div>
      ) : null}
    </>
  );

  const className =
    'pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-2.5 opacity-0';

  if (motionOverlay && overlayVariants) {
    return (
      <motion.div data-hero-overlay variants={overlayVariants} className={className}>
        {content}
      </motion.div>
    );
  }

  return (
    <div data-hero-overlay className={className}>
      {content}
    </div>
  );
}

export function HeroPaintingSvgHover({
  accentColor,
  secondaryColor,
  strokeVariantIndex = 0,
  strokeScale = 1,
  title,
  medium,
  year,
  tags,
  useMotion = false,
  isNsfwBlurred = false,
}: HeroPaintingSvgHoverProps) {
  const variant = getBrushStrokeVariant(strokeVariantIndex);
  const isCard = strokeScale < 1;
  const restStrokeWidth = isCard ? 30 : HERO_BRUSH_STROKE_WIDTH_REST * strokeScale;
  const hoverStrokeWidth = isCard ? 46 : HERO_BRUSH_STROKE_WIDTH_HOVER * strokeScale;
  const displayTags = (tags ?? []).filter(Boolean);
  const strokePeakOpacity = isNsfwBlurred ? 0.98 : 0.92;
  const filterId = useId().replace(/:/g, '');
  const scale = coverScale(variant.scale, strokeScale);

  const pathVariants: Variants = {
    initial: {
      pathLength: 0,
      strokeWidth: restStrokeWidth * 0.85,
      opacity: 0,
    },
    hover: {
      pathLength: 1,
      strokeWidth: hoverStrokeWidth,
      opacity: strokePeakOpacity,
      transition: {
        pathLength: { duration: 1.15, ease: 'easeInOut' },
        strokeWidth: { duration: 1.15, ease: 'easeInOut' },
        opacity: { duration: 0.15 },
      },
    },
  };

  const pathVariantsDelayed: Variants = {
    initial: {
      pathLength: 0,
      strokeWidth: restStrokeWidth * 0.85,
      opacity: 0,
    },
    hover: {
      pathLength: 1,
      strokeWidth: hoverStrokeWidth,
      opacity: strokePeakOpacity,
      transition: {
        pathLength: { duration: 1.15, ease: 'easeInOut', delay: 0.22 },
        strokeWidth: { duration: 1.15, ease: 'easeInOut', delay: 0.22 },
        opacity: { duration: 0.15, delay: 0.22 },
      },
    },
  };

  const overlayVariants: Variants = {
    initial: { opacity: 0, y: 8 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.35 },
    },
  };

  const strokeLayer = (
    <>
      {!isNsfwBlurred ? (
        <div
          data-hero-vignette
          className='pointer-events-none absolute inset-0 z-[5] bg-black/40 opacity-0'
          aria-hidden
        />
      ) : null}
      <div
        data-hero-svg
        data-nsfw-blurred={isNsfwBlurred ? '' : undefined}
        className='pointer-events-none absolute inset-0 z-10 overflow-hidden'
        aria-hidden
        style={{ transform: `scale(${scale})` }}
      >
        <svg className='absolute h-0 w-0' aria-hidden>
          <defs>
            <filter id={filterId} x='-20%' y='-20%' width='140%' height='140%'>
              <feGaussianBlur in='SourceGraphic' stdDeviation={isCard ? 1.2 : 2.5} result='blur' />
              <feMerge>
                <feMergeNode in='blur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>
        </svg>
        <BrushStrokeSvg
          layer={variant.layers[0]}
          color={accentColor}
          filterId={filterId}
          className={`${LAYER_BASE_CLASS} svg-stroke-1`}
          useMotion={useMotion}
          pathVariants={useMotion ? pathVariants : undefined}
          strokeWidthRest={restStrokeWidth}
        />
        <BrushStrokeSvg
          layer={variant.layers[1]}
          color={secondaryColor}
          filterId={filterId}
          className={`${LAYER_BASE_CLASS} svg-stroke-2`}
          useMotion={useMotion}
          pathVariants={useMotion ? pathVariantsDelayed : undefined}
          strokeWidthRest={restStrokeWidth}
        />
      </div>
    </>
  );

  if (useMotion) {
    return (
      <>
        {strokeLayer}
        <BrushMetadataOverlay
          tags={displayTags}
          title={title}
          year={year}
          medium={medium}
          accentColor={accentColor}
          isNsfwBlurred={isNsfwBlurred}
          motionOverlay
          overlayVariants={overlayVariants}
        />
      </>
    );
  }

  return (
    <>
      {strokeLayer}
      <BrushMetadataOverlay
        tags={displayTags}
        title={title}
        year={year}
        medium={medium}
        accentColor={accentColor}
        isNsfwBlurred={isNsfwBlurred}
      />
    </>
  );
}
