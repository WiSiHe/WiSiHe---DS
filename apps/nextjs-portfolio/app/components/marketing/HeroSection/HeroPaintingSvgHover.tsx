'use client';

/**
 * Hero painting hover — blend (full strokes + mix-blend), spotlight (accent), paintOver (opaque).
 */

import { motion, type Variants } from 'motion/react';
import { type CSSProperties, useId } from 'react';

import {
  type BrushStrokeProfile,
  getBrushProfileConfig,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './brushStrokeConstants';
import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
  paintingBrushSeed,
} from './brushStrokeVariants';

export {
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
} from './brushStrokeConstants';

/** Prepare paths for dash-offset animation (call once per card root that contains `[data-hero-svg]`). */
export function initHeroSvgStrokePaths(root: HTMLElement | null, strokeScale = 1): void {
  if (!root) return;
  const profile = strokeScale < 1 ? getBrushProfileConfig('heroSpotlight') : null;
  const restWidth = profile ? profile.rest : HERO_BRUSH_STROKE_WIDTH_REST * strokeScale;
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
}

export { getBrushStrokeVariant, paintingBrushSeed };

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

export type HeroPaintingHoverMode = 'spotlight' | 'paintOver' | 'blend';

type HeroPaintingSvgHoverProps = {
  accentColor: string;
  secondaryColor: string;
  strokeVariantIndex?: number;
  title?: string | null;
  isNsfwBlurred?: boolean;
  useMotion?: boolean;
  /** Palette wash — paintOver (opaque) and blend (multiply). */
  washColor?: string;
  isHovered?: boolean;
  titleOnly?: boolean;
  /** blend: full strokes + mix-blend; spotlight: thin accent; paintOver: opaque grid-style. */
  hoverMode?: HeroPaintingHoverMode;
};

const LAYER_BASE_CLASS =
  'svg-stroke absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center';

function layerSizeStyle(layerSizePercent: number): CSSProperties {
  const size = `${layerSizePercent}%`;
  return { width: size, height: size };
}

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

/** Smooth, calm draw — slow ease-in-out with soft opacity bloom. */
const STROKE_DRAW_EASE = [0.42, 0.03, 0.58, 0.97] as const;
const STROKE_WIDTH_EASE = [0.33, 0, 0.18, 1] as const;

function strokePathVariants(
  restStrokeWidth: number,
  hoverStrokeWidth: number,
  peakOpacity: number,
  delay = 0,
  drawDuration = 0.85,
): Variants {
  return {
    initial: {
      pathLength: 0,
      strokeWidth: restStrokeWidth * 0.85,
      opacity: 0,
    },
    hover: {
      pathLength: 1,
      strokeWidth: hoverStrokeWidth,
      opacity: peakOpacity,
      transition: {
        pathLength: { duration: drawDuration, ease: STROKE_DRAW_EASE, delay },
        strokeWidth: {
          duration: drawDuration * 1.15,
          ease: STROKE_WIDTH_EASE,
          delay: delay + 0.06,
        },
        opacity: { duration: drawDuration * 0.65, ease: 'easeOut', delay: delay + 0.1 },
      },
    },
  };
}

function BrushStrokeSvg({
  layer,
  color,
  className,
  filterId,
  useMotion,
  pathVariants,
  strokeWidthRest,
  layerSizePercent,
  motionState,
  strokeBlendMode,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  filterId: string;
  useMotion: boolean;
  pathVariants?: Variants;
  strokeWidthRest: number;
  layerSizePercent: number;
  motionState?: 'initial' | 'hover';
  strokeBlendMode?: CSSProperties['mixBlendMode'];
}) {
  const paintProps = {
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
    filter: `url(#${filterId})`,
  };

  return (
    <div
      className={className}
      style={{
        ...layerSizeStyle(layerSizePercent),
        transform: layerTransform(layer),
        ...(strokeBlendMode ? { mixBlendMode: strokeBlendMode } : {}),
      }}
    >
      <svg
        className='block h-full w-full'
        viewBox={layer.viewBox}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='xMidYMid slice'
      >
        <title>Decorative brush stroke</title>
        {useMotion && pathVariants && motionState ? (
          <motion.path
            variants={pathVariants}
            animate={motionState}
            initial='initial'
            d={layer.d}
            {...paintProps}
          />
        ) : (
          <path d={layer.d} strokeWidth={strokeWidthRest} {...paintProps} style={{ opacity: 0 }} />
        )}
      </svg>
    </div>
  );
}

function TitleOverlay({
  title,
  motionOverlay,
  overlayVariants,
  motionState,
  blendCaption = false,
}: {
  title?: string | null;
  motionOverlay?: boolean;
  overlayVariants?: Variants;
  motionState?: 'initial' | 'hover';
  /** Blend hovers: scrim + shadow stack only. */
  blendCaption?: boolean;
}) {
  if (!title) return null;

  const content = (
    <div data-hero-title className='relative z-20 mt-auto text-left'>
      <p
        className={
          blendCaption
            ? 'line-clamp-2 font-serif text-base font-medium italic leading-tight text-white sm:text-lg [text-shadow:0_0_1px_rgba(0,0,0,1),0_1px_4px_rgba(0,0,0,0.92),0_6px_20px_rgba(0,0,0,0.78),0_14px_36px_rgba(0,0,0,0.55)] [-webkit-text-stroke:0.35px_rgba(0,0,0,0.45)]'
            : 'line-clamp-2 font-serif text-base font-medium italic leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:text-lg'
        }
      >
        {title}
      </p>
    </div>
  );

  const className =
    'pointer-events-none absolute inset-0 z-[22] flex flex-col justify-end p-2 sm:p-3';

  if (motionOverlay && overlayVariants && motionState) {
    return (
      <motion.div
        data-hero-overlay
        variants={overlayVariants}
        animate={motionState}
        initial='initial'
        className={className}
      >
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

function profileForMode(mode: HeroPaintingHoverMode): BrushStrokeProfile {
  if (mode === 'paintOver') return 'heroCard';
  if (mode === 'blend') return 'heroBlend';
  return 'heroSpotlight';
}

export function HeroPaintingSvgHover({
  accentColor,
  secondaryColor,
  strokeVariantIndex = 0,
  title,
  useMotion = false,
  isNsfwBlurred = false,
  washColor,
  isHovered = false,
  titleOnly = true,
  hoverMode = 'blend',
}: HeroPaintingSvgHoverProps) {
  const brushProfile = getBrushProfileConfig(profileForMode(hoverMode));
  const variant = getBrushStrokeVariant(strokeVariantIndex);
  const filterId = useId().replace(/:/g, '');
  const scale = brushProfile.coverScale(variant.scale);
  const layerColors = [accentColor, secondaryColor, accentColor, secondaryColor] as const;
  const motionState = useMotion ? (isHovered ? 'hover' : 'initial') : undefined;
  const isSpotlight = hoverMode === 'spotlight';
  const isBlend = hoverMode === 'blend';
  const isOpaquePaintOver = hoverMode === 'paintOver';
  const layers = variant.layers.slice(0, brushProfile.layerCount);
  const strokeDrawDuration = isBlend ? 0.82 : isSpotlight ? 0.68 : 0.95;
  const layerStagger = isBlend ? 0.14 : 0.14;

  const overlayVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isBlend ? 0.48 : 0.45,
        ease: [0.33, 0, 0.2, 1],
        delay: isSpotlight ? 0.12 : isBlend ? 0.28 : 0.3,
      },
    },
  };

  const washVariants: Variants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.38, ease: [0.33, 0, 0.2, 1] },
    },
  };

  const scrimVariants: Variants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const titleScrimVariants: Variants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut', delay: 0.1 } },
  };

  return (
    <>
      {isSpotlight && !isNsfwBlurred ? (
        <motion.div
          data-hero-scrim
          variants={useMotion ? scrimVariants : undefined}
          animate={motionState}
          initial='initial'
          className='pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[48%] bg-gradient-to-t from-black/85 via-black/40 to-transparent'
          aria-hidden
        />
      ) : null}

      {isBlend && !isNsfwBlurred ? (
        <motion.div
          data-hero-title-scrim
          variants={useMotion ? titleScrimVariants : undefined}
          animate={motionState}
          initial='initial'
          className='pointer-events-none absolute inset-x-0 bottom-0 z-[14] h-[40%] bg-gradient-to-t from-black/80 via-black/45 to-transparent'
          aria-hidden
        />
      ) : null}

      {isOpaquePaintOver && !isNsfwBlurred && washColor ? (
        <motion.div
          data-brush-wash
          variants={useMotion ? washVariants : undefined}
          animate={motionState}
          initial='initial'
          className='pointer-events-none absolute inset-0 z-[6]'
          style={{ backgroundColor: washColor }}
          aria-hidden
        />
      ) : null}

      <div
        data-hero-svg
        data-nsfw-blurred={isNsfwBlurred ? '' : undefined}
        className={`pointer-events-none absolute inset-0 z-10 ${isOpaquePaintOver ? 'overflow-visible' : 'overflow-hidden'}`}
        aria-hidden
        style={{ transform: `scale(${scale})` }}
      >
        <svg className='absolute h-0 w-0' aria-hidden>
          <defs>
            <filter id={filterId} x='-20%' y='-20%' width='140%' height='140%'>
              <feGaussianBlur
                in='SourceGraphic'
                stdDeviation={brushProfile.strokeBlur}
                result='blur'
              />
              <feMerge>
                <feMergeNode in='blur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>
        </svg>
        {layers.map((layer, index) => (
          <BrushStrokeSvg
            key={`${variant.id}-${layer.d.slice(0, 12)}-${layer.rotateDeg}`}
            layer={layer}
            color={layerColors[index % layerColors.length] ?? accentColor}
            filterId={filterId}
            className={`${LAYER_BASE_CLASS} svg-stroke-${index + 1}`}
            useMotion={useMotion}
            pathVariants={
              useMotion
                ? strokePathVariants(
                    brushProfile.rest,
                    brushProfile.hover,
                    brushProfile.strokeOpacity,
                    index * layerStagger,
                    strokeDrawDuration,
                  )
                : undefined
            }
            strokeWidthRest={brushProfile.rest}
            layerSizePercent={brushProfile.layerSizePercent}
            motionState={motionState}
            strokeBlendMode={isBlend ? 'hard-light' : undefined}
          />
        ))}
      </div>

      {isNsfwBlurred ? (
        <div
          data-nsfw-blur
          className='pointer-events-none absolute inset-0 z-[8] bg-background/45 backdrop-blur-xl'
          aria-hidden
        />
      ) : null}

      {titleOnly ? (
        <TitleOverlay
          title={title}
          motionOverlay={useMotion}
          overlayVariants={useMotion ? overlayVariants : undefined}
          motionState={motionState}
          blendCaption={isBlend}
        />
      ) : null}
    </>
  );
}
