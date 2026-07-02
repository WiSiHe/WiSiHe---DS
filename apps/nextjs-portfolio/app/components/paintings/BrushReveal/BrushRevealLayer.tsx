'use client';

/**
 * Card brush reveal — wash + layered SVG strokes + metadata (tags, badges, title).
 * Driven by Motion via `BrushRevealWrap` context.
 */

import { motion, type Variants } from 'motion/react';
import { type CSSProperties, type ReactNode, useId } from 'react';
import {
  type BrushStrokeProfile,
  resolveBrushProfile,
} from '@/app/components/marketing/HeroSection/brushStrokeConstants';
import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
  paintingBrushSeed,
} from '@/app/components/marketing/HeroSection/brushStrokeVariants';
import { NSFW_FILTER_HINT, NSFW_MATURE_LABEL } from '@/lib/paintings/nsfwCover';
import { BrushPaletteWash } from './BrushFrostedWash';
import { useBrushReveal } from './BrushRevealContext';
import {
  BRUSH_OVERLAY_GROUP_STAGGER,
  BRUSH_OVERLAY_ITEM_STAGGER,
  brushOverlayEnterDelay,
  brushOverlayItemTransition,
  brushStrokeTransition,
  brushWashTransition,
} from './brushRevealMotion';
import {
  brushStrokePathTransitions,
  resolveBrushLayerColors,
  resolveBrushLayerMetrics,
} from './brushStrokeRender';

export { getBrushStrokeVariant, paintingBrushSeed };

const LAYER_BASE_CLASS =
  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center';

const CHIP_CLASS =
  'rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-white border border-white/20 shadow-sm sm:text-[10px]';

const TITLE_CLASS =
  'line-clamp-2 font-serif text-base font-medium italic leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:text-lg [@supports(color:contrast-color(red))]:text-[contrast-color(var(--brush-wash))]';

const OVERLAY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function overlayRootVariants(reduced: boolean, enterDelay: number): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2, ease: OVERLAY_EASE },
      },
    };
  }
  return {
    hidden: {
      opacity: 0,
      transition: { when: 'afterChildren', staggerDirection: -1, staggerChildren: 0.04 },
    },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        delayChildren: enterDelay,
        staggerChildren: BRUSH_OVERLAY_GROUP_STAGGER,
      },
    },
  };
}

const overlayGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: BRUSH_OVERLAY_ITEM_STAGGER },
  },
};

function overlayItemVariants(reduced: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 8,
      transition: brushOverlayItemTransition(false, reduced),
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: brushOverlayItemTransition(true, reduced),
    },
  };
}

function layerSizeStyle(layerSizePercent: number): CSSProperties {
  const size = `${layerSizePercent}%`;
  return { width: size, height: size };
}

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

function BrushStrokePath({
  layer,
  color,
  className,
  strokeWidthRest,
  strokeWidthHover,
  layerSizePercent,
  strokeOpacity,
  index,
  layerCount,
  filterId,
  paintOver,
  strokeBlendMode,
  opacityOnly,
  useStrokeFilter,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  strokeWidthRest: number;
  strokeWidthHover: number;
  layerSizePercent: number;
  strokeOpacity: number;
  index: number;
  layerCount: number;
  filterId: string;
  paintOver: boolean;
  strokeBlendMode?: CSSProperties['mixBlendMode'];
  opacityOnly: boolean;
  useStrokeFilter: boolean;
}) {
  const { isActive, reduceMotion, liteMode } = useBrushReveal();
  const metrics = resolveBrushLayerMetrics(
    layer,
    strokeWidthRest,
    strokeWidthHover,
    strokeOpacity,
    paintOver,
  );
  const { restWidth, hoverWidth, peakOpacity, underWidth, underOpacity } = metrics;
  const strokeFilter = useStrokeFilter ? `url(#${filterId})` : undefined;
  const baseTransition = brushStrokeTransition(
    index,
    isActive,
    reduceMotion,
    layerCount,
    paintOver,
    liteMode,
  );
  const pathTransitions = brushStrokePathTransitions(
    index,
    isActive,
    reduceMotion,
    layerCount,
    paintOver,
    liteMode,
    baseTransition,
  );

  const initialState = opacityOnly
    ? {
        pathLength: 1,
        opacity: 0,
        strokeWidth: hoverWidth,
      }
    : {
        pathLength: 0,
        opacity: 0,
        strokeWidth: restWidth,
      };

  const activeState = opacityOnly
    ? {
        pathLength: 1,
        opacity: isActive ? peakOpacity : 0,
        strokeWidth: hoverWidth,
      }
    : {
        pathLength: isActive ? 1 : 0,
        opacity: isActive ? peakOpacity : 0,
        strokeWidth: isActive ? hoverWidth : restWidth,
      };

  const underInitial = opacityOnly
    ? { pathLength: 1, opacity: 0, strokeWidth: underWidth }
    : { pathLength: 0, opacity: 0, strokeWidth: restWidth * 1.15 };

  const underActive = opacityOnly
    ? {
        pathLength: 1,
        opacity: isActive ? underOpacity : 0,
        strokeWidth: underWidth,
      }
    : {
        pathLength: isActive ? 1 : 0,
        opacity: isActive ? underOpacity : 0,
        strokeWidth: isActive ? underWidth : restWidth * 1.15,
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
        aria-hidden
      >
        <title>Decorative brush stroke</title>
        {!opacityOnly ? (
          <motion.path
            d={layer.d}
            stroke={color}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            filter={strokeFilter}
            initial={underInitial}
            animate={underActive}
            transition={pathTransitions}
          />
        ) : null}
        <motion.path
          d={layer.d}
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          filter={strokeFilter}
          initial={initialState}
          animate={activeState}
          transition={pathTransitions}
        />
      </svg>
    </div>
  );
}

export type BrushRevealBadge = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type BrushRevealLayerProps = {
  accentColor: string;
  secondaryColor: string;
  washColor: string;
  strokeVariantIndex?: number;
  title?: string | null;
  medium?: string | null;
  year?: string | null;
  tags?: string[] | null;
  badges?: BrushRevealBadge[];
  isNsfwBlurred?: boolean;
  profile?: BrushStrokeProfile;
};

export function BrushRevealLayer({
  accentColor,
  secondaryColor,
  washColor,
  strokeVariantIndex = 0,
  title,
  medium,
  year,
  tags,
  badges = [],
  isNsfwBlurred = false,
  profile = 'masonry',
}: BrushRevealLayerProps) {
  const { isActive, reduceMotion, liteMode } = useBrushReveal();
  const brushProfile = resolveBrushProfile(profile, liteMode);
  const { solidFill } = brushProfile;
  const paintOver = solidFill;
  const opacityOnly = liteMode;
  const useStrokeFilter = brushProfile.strokeBlur > 0;
  const filterId = useId().replace(/:/g, '');
  const variant = getBrushStrokeVariant(strokeVariantIndex);
  const scale = brushProfile.coverScale(variant.scale);
  const displayTags = (tags ?? []).filter(Boolean);
  const visibleTags = displayTags.slice(0, 4);
  const layerColors = resolveBrushLayerColors(
    brushProfile.layerCount,
    accentColor,
    secondaryColor,
    washColor,
    solidFill,
  );
  const overlayDelay = brushOverlayEnterDelay(paintOver, liteMode);
  const chipVariants = overlayItemVariants(reduceMotion);
  const showStrokes = !isNsfwBlurred && !reduceMotion && (!liteMode || isActive);

  const washTransition = brushWashTransition(isActive, reduceMotion, paintOver, liteMode);

  return (
    <>
      {!paintOver ? (
        <motion.div
          data-brush-dim
          className='pointer-events-none absolute inset-0 z-[5] bg-black'
          aria-hidden
          initial={false}
          animate={{ opacity: isActive ? 0.38 : 0 }}
          transition={washTransition}
        />
      ) : null}

      {!isNsfwBlurred ? (
        <BrushPaletteWash
          washColor={washColor}
          washOpacity={brushProfile.washOpacity}
          isActive={isActive}
          transition={washTransition}
        />
      ) : null}

      {showStrokes ? (
        <div
          data-brush-svg
          className='pointer-events-none absolute inset-0 z-10 overflow-hidden'
          aria-hidden
          style={{ transform: `scale(${scale})` }}
        >
          {useStrokeFilter ? (
            <svg className='absolute h-0 w-0' aria-hidden>
              <defs>
                <filter
                  id={filterId}
                  x='-45%'
                  y='-45%'
                  width='190%'
                  height='190%'
                  colorInterpolationFilters='sRGB'
                >
                  <feTurbulence
                    type='fractalNoise'
                    baseFrequency='0.045 0.12'
                    numOctaves='2'
                    seed={strokeVariantIndex % 97}
                    result='noise'
                  />
                  <feDisplacementMap
                    in='SourceGraphic'
                    in2='noise'
                    scale={paintOver ? 2.8 : 2.2}
                    xChannelSelector='R'
                    yChannelSelector='G'
                    result='displaced'
                  />
                  <feGaussianBlur
                    in='displaced'
                    stdDeviation={brushProfile.strokeBlur * 0.55}
                    result='soft'
                  />
                  {solidFill ? (
                    <feMerge>
                      <feMergeNode in='soft' />
                      <feMergeNode in='displaced' />
                    </feMerge>
                  ) : (
                    <feMerge>
                      <feMergeNode in='soft' />
                      <feMergeNode in='displaced' />
                      <feMergeNode in='SourceGraphic' />
                    </feMerge>
                  )}
                </filter>
              </defs>
            </svg>
          ) : null}
          {variant.layers.slice(0, brushProfile.layerCount).map((layer, index) => (
            <BrushStrokePath
              key={`${variant.id}-${layer.d.slice(0, 12)}-${layer.rotateDeg}`}
              layer={layer}
              color={layerColors[index % layerColors.length] ?? washColor}
              className={`${LAYER_BASE_CLASS} svg-stroke-${index + 1}`}
              strokeWidthRest={brushProfile.rest}
              strokeWidthHover={brushProfile.hover}
              layerSizePercent={brushProfile.layerSizePercent}
              strokeOpacity={brushProfile.strokeOpacity}
              index={index}
              layerCount={brushProfile.layerCount}
              filterId={filterId}
              paintOver={paintOver}
              strokeBlendMode={brushProfile.strokeBlendMode}
              opacityOnly={opacityOnly}
              useStrokeFilter={useStrokeFilter}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        data-brush-scrim
        className='pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[58%] bg-gradient-to-t from-black/40 via-black/20 to-transparent'
        aria-hidden
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={washTransition}
      />

      <motion.div
        data-brush-overlay
        className='pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-2.5'
        style={{ '--brush-wash': washColor } as CSSProperties}
        initial='hidden'
        animate={isActive ? 'visible' : 'hidden'}
        variants={overlayRootVariants(reduceMotion, overlayDelay)}
      >
        <motion.div
          className='flex items-start justify-between gap-2'
          variants={overlayGroupVariants}
        >
          <motion.div
            className='flex min-w-0 flex-1 flex-wrap items-start gap-1 pr-1'
            variants={overlayGroupVariants}
            data-brush-tags
          >
            {isNsfwBlurred ? (
              <motion.span
                variants={chipVariants}
                className={`${CHIP_CLASS} border-white/25 bg-black/80`}
                title={NSFW_FILTER_HINT}
              >
                {NSFW_MATURE_LABEL}
              </motion.span>
            ) : null}
            {visibleTags.map(tag => (
              <motion.span
                key={tag}
                variants={chipVariants}
                className={CHIP_CLASS}
                style={{ boxShadow: `0 0 10px ${accentColor}44` }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {badges.length > 0 ? (
            <motion.ul
              className='flex shrink-0 flex-col gap-1'
              data-brush-badges
              aria-label='Painting attributes'
              variants={overlayGroupVariants}
            >
              {badges.map(badge => (
                <motion.li key={badge.key} variants={chipVariants}>
                  <span
                    className='inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-black/70 text-white shadow-sm'
                    title={badge.label}
                  >
                    <span className='sr-only'>{badge.label}</span>
                    {badge.icon}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </motion.div>

        {title ? (
          <motion.div
            data-brush-title
            className='mt-auto flex flex-col items-start space-y-0.5 text-left'
            variants={overlayGroupVariants}
          >
            <motion.p variants={chipVariants} className={TITLE_CLASS}>
              {title}
            </motion.p>
            {(year || medium) && (
              <motion.div
                className='flex flex-wrap items-center gap-1.5'
                variants={overlayGroupVariants}
              >
                {year ? (
                  <motion.span
                    variants={chipVariants}
                    className='rounded border border-white/10 bg-black/65 px-1.5 py-0.5 font-sans text-[9px] font-bold text-white/90'
                  >
                    {year}
                  </motion.span>
                ) : null}
                {medium ? (
                  <motion.span
                    variants={chipVariants}
                    className='max-w-[150px] truncate font-mono text-[8px] font-semibold uppercase tracking-wider text-white/80 drop-shadow-sm'
                  >
                    {medium}
                  </motion.span>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </motion.div>
    </>
  );
}
