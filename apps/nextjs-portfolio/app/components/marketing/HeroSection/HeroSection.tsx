'use client';

import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import { useEffect, useMemo, useState } from 'react';
import { TextPressure } from '@/app/components/ui/TextPressure';
import { paintingBrushSeed } from '@/lib/paintings/paintingCardImage';
import { urlForImage } from '@/sanity/lib/utils';
import { HeroDotGrid } from './HeroDotGrid';
import HeroScrollIndicator from './HeroScrollIndicator';
import {
  EXPLODE_SQUASH_KEYFRAMES,
  EXPLODE_SQUASH_TRANSITION,
  heroFloatSquashStretch,
} from './heroSquashStretch';

export type ShowcasePainting = {
  _type: 'painting';
  _id: string;
  slug: string | null;
  title: string | null;
  altText?: string | null;
  format: 'square' | 'landscape' | 'portrait' | null;
  isFeatured?: boolean | null;
  isNSFW?: boolean | null;
  medium?: string | null;
  paintedAt?: string | null;
  image?: {
    asset?: { _ref: string };
    lqip?: string | null;
    aspectRatio?: number | null;
    alt?: string;
    palette?: {
      dominant?: { background?: string };
      vibrant?: { background?: string };
      darkVibrant?: { background?: string };
      muted?: { background?: string };
    } | null;
  } | null;
  tagsV2?: { name: string | null }[] | null;
};

export type ShowcaseProject = {
  _type: 'project';
  _id: string;
  slug: string | null;
  title?: string | null;
  name?: string | null;
  client?: string | null;
  description?: string | null;
  seoDescription?: string | null;
  seo?: { title?: string | null } | null;
  image?: {
    asset?: { _ref: string };
    lqip?: string | null;
    aspectRatio?: number | null;
    alt?: string;
  } | null;
  tags?: { name: string | null }[] | null;
};

export type ShowcaseItem = ShowcasePainting | ShowcaseProject;

function heroDisplayName(heroSubtitle?: string | null): string {
  const trimmed = heroSubtitle?.trim();
  if (!trimmed) return 'Henrik';
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

type HeroImageSectionProps = {
  items?: ShowcaseItem[] | null;
  overview?: PortableTextBlock[] | null;
  heroEyebrow?: string | null;
  heroName?: string | null;
};

// Cards form left/right wing columns; center ~25–75% horizontal, ~32–68% vertical
// stays clear for hero copy. `side` + `band` drive outward-biased jitter/parallax.
type HeroCardSide = 'left' | 'right';
type HeroCardBand = 'top' | 'bottom';
type HeroCardPosition = {
  top: string;
  left: string;
  rotation: number;
  scale: number;
  side: HeroCardSide;
  band: HeroCardBand;
};

/** 8 collage slots — asymmetric wings; no mirrored rows (center ~28–72% stays clear). */
const FIXED_POSITIONS_DESKTOP: HeroCardPosition[] = [
  { top: '7%', left: '7%', rotation: -14, scale: 0.9, side: 'left', band: 'top' },
  { top: '13%', left: '91%', rotation: 11, scale: 0.94, side: 'right', band: 'top' },
  { top: '22%', left: '16%', rotation: -6, scale: 0.96, side: 'left', band: 'top' },
  { top: '19%', left: '88%', rotation: 15, scale: 0.89, side: 'right', band: 'top' },
  { top: '59%', left: '93%', rotation: 9, scale: 0.91, side: 'right', band: 'bottom' },
  { top: '64%', left: '12%', rotation: -11, scale: 0.93, side: 'left', band: 'bottom' },
  { top: '74%', left: '86%', rotation: 6, scale: 0.95, side: 'right', band: 'bottom' },
  { top: '78%', left: '9%', rotation: -16, scale: 0.88, side: 'left', band: 'bottom' },
];

/** 6 slots — staggered heights per side, no horizontal pairs. */
const FIXED_POSITIONS_TABLET: HeroCardPosition[] = [
  { top: '8%', left: '8%', rotation: -12, scale: 0.91, side: 'left', band: 'top' },
  { top: '15%', left: '90%', rotation: 10, scale: 0.92, side: 'right', band: 'top' },
  { top: '24%', left: '15%', rotation: -5, scale: 0.93, side: 'left', band: 'top' },
  { top: '21%', left: '87%', rotation: 13, scale: 0.9, side: 'right', band: 'top' },
  { top: '66%', left: '11%', rotation: -9, scale: 0.91, side: 'left', band: 'bottom' },
  { top: '71%', left: '89%', rotation: 8, scale: 0.92, side: 'right', band: 'bottom' },
];

/** 4 cards — diagonal stagger, not corner pairs. */
const FIXED_POSITIONS_MOBILE: HeroCardPosition[] = [
  { top: '9%', left: '10%', rotation: -11, scale: 0.86, side: 'left', band: 'top' },
  { top: '14%', left: '88%', rotation: 12, scale: 0.85, side: 'right', band: 'top' },
  { top: '72%', left: '14%', rotation: -8, scale: 0.84, side: 'left', band: 'bottom' },
  { top: '67%', left: '86%', rotation: 9, scale: 0.83, side: 'right', band: 'bottom' },
];

/** Collage display ratios — portrait through ultra-wide, picked per card. */
const HERO_CARD_ASPECT_PRESETS = [
  2 / 3,
  3 / 4,
  4 / 5,
  5 / 6,
  1,
  6 / 5,
  5 / 4,
  4 / 3,
  3 / 2,
  16 / 10,
  16 / 9,
  18 / 10,
  2 / 1,
] as const;

function resolveHeroCardAspectRatio(item: ShowcaseItem, index: number): number {
  const seed = paintingBrushSeed(`${item._id}:${index}`);
  return HERO_CARD_ASPECT_PRESETS[seed % HERO_CARD_ASPECT_PRESETS.length] ?? 4 / 3;
}

function shuffleSlotOrder(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order;
}

/** Stable outward-biased scatter — unique per item, not identical across a wing pair. */
function heroCardScatter(
  seed: number,
  side: HeroCardSide,
  band: HeroCardBand,
): { x: number; y: number; rotate: number } {
  const r1 = (seed % 997) / 997;
  const r2 = ((seed * 17) % 991) / 991;
  const r3 = ((seed * 31) % 983) / 983;

  return {
    x: (side === 'left' ? -1 : 1) * (10 + r1 * 24),
    y: (band === 'top' ? -1 : 1) * (8 + r2 * 20),
    rotate: (r3 - 0.5) * 18,
  };
}

const HeroImageSection = ({ items, overview, heroEyebrow, heroName }: HeroImageSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const displayName = heroDisplayName(heroName);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'exploding' | 'floating'>('loading');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasPlayedAlready, setHasPlayedAlready] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  /** Per-card float loop — must be stable across renders so Motion does not restart. */
  const floatKeyframes = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => {
        const y = [0, Math.random() * 20 + 10, 0] as [number, number, number];
        const squashStretch = heroFloatSquashStretch(y[1]);
        return {
          y,
          x: [0, Math.random() * 10 - 5, 0] as [number, number, number],
          rotate: [0, Math.random() * 6 - 3, 0] as [number, number, number],
          scaleX: squashStretch.scaleX,
          scaleY: squashStretch.scaleY,
          duration: Math.random() * 3 + 4,
          delay: i * 0.1,
        };
      }),
    [],
  );

  // Track viewport matches reactively
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport('mobile');
      } else if (width < 1024) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect touch device for mobile optimizations
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // Track mouse coordinates normalized relative to window center (-1 to 1)
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  // Set up the loading & entry stages using Framer Motion
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('hero-splash-played');
    const isDev = process.env.NODE_ENV === 'development';

    if (hasPlayed && !isDev) {
      setStage('floating');
      setProgress(100);
      setHasPlayedAlready(true);
      return;
    }

    if (!isDev) {
      sessionStorage.setItem('hero-splash-played', 'true');
    }

    // Animate the progress counter (0% to 100% over 2.5s)
    const controls = animate(0, 100, {
      duration: 2.5,
      ease: 'easeInOut',
      onUpdate: latest => setProgress(Math.round(latest)),
      onComplete: () => {
        setStage('exploding');
        // Let the spring explosion settle for 1.2s before entering float loop
        setTimeout(() => {
          setStage('floating');
        }, 1200);
      },
    });

    return () => controls.stop();
  }, []);

  // Hide scroll indicator after scroll threshold
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine visibility slice for items (matches original layout logic)
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  const visibleItems = items
    ? isMobile
      ? items.slice(0, 4)
      : isTablet
        ? items.slice(0, 6)
        : items.slice(0, 8)
    : [];

  const positions = isMobile
    ? FIXED_POSITIONS_MOBILE
    : isTablet
      ? FIXED_POSITIONS_TABLET
      : FIXED_POSITIONS_DESKTOP;

  /** Which collage slot each visible item occupies — shuffled so wings don't read as pairs. */
  const slotOrder = useMemo(() => shuffleSlotOrder(positions.length), [positions.length]);

  if (!items || items.length === 0) {
    return <div className='text-center py-20'>No items available.</div>;
  }

  // Variants for central text stagger entrance
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: 'easeOut' as const },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      className='relative flex min-h-screen w-full items-center justify-center overflow-visible pt-16 pb-8 transition-colors duration-500 bg-background-subtle md:pt-20 md:pb-12'
      style={{ perspective: 1200 }}
    >
      <HeroDotGrid />

      {/* Loader */}
      <AnimatePresence>
        {stage === 'loading' && (
          <motion.div
            key='loader'
            initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -50,
              filter: 'blur(10px)',
              transition: { duration: 0.5, ease: 'easeIn' },
            }}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none'
          >
            <div className='text-9xl font-black font-mono tracking-tighter text-white mix-blend-difference drop-shadow-2xl'>
              {progress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Text Content — always above floating cards */}
      <motion.div
        variants={textContainerVariants}
        initial={hasPlayedAlready ? 'visible' : 'hidden'}
        animate={stage !== 'loading' ? 'visible' : 'hidden'}
        className='relative z-[60] flex max-w-xl flex-col items-center p-6 text-center pointer-events-none md:p-8'
      >
        <motion.p
          variants={textItemVariants}
          className='mb-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground-subtle md:text-sm'
        >
          {heroEyebrow?.trim() || 'Senior frontend developer & digital artist'}
        </motion.p>
        <motion.div
          variants={textItemVariants}
          className='mb-4 w-full max-w-2xl pointer-events-auto'
        >
          {reducedMotion ? (
            <h1 className='text-5xl font-black leading-none tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl'>
              {displayName}
            </h1>
          ) : (
            <div className='h-20 w-full md:h-28 lg:h-32'>
              <TextPressure
                text={displayName}
                minFontSize={44}
                flex
                weight
                width
                className='leading-none tracking-tighter'
              />
            </div>
          )}
        </motion.div>
        {overview?.length ? (
          <motion.div
            variants={textItemVariants}
            className='max-w-sm text-base font-medium leading-relaxed text-foreground-subtle md:text-lg [&_p]:m-0'
          >
            <PortableText value={overview} />
          </motion.div>
        ) : (
          <motion.p
            variants={textItemVariants}
            className='max-w-sm text-base font-medium leading-relaxed text-foreground-subtle md:text-lg'
          >
            I&apos;m a design engineer, painter and maker. Explore paintings, projects, and
            experiments from my portfolio.
          </motion.p>
        )}

        {/* Double Call to Actions (serving both paintings & projects) */}
        <motion.div
          variants={buttonVariants}
          className='mt-6 flex flex-col sm:flex-row items-center gap-3 pointer-events-auto'
        >
          <Link
            href='/paintings'
            className='inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-bold tracking-wide text-accent-contrast shadow-lg transition-all hover:scale-105 hover:bg-accent-hover'
          >
            View Paintings
          </Link>
          <Link
            href='/projects'
            className='inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-6 py-2.5 text-sm font-bold tracking-wide text-foreground shadow-md backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] duration-300 hover:scale-105 hover:border-accent/45 hover:bg-surface hover:shadow-lg'
          >
            Explore Projects
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Images Container */}
      <div
        className='absolute inset-0 overflow-visible pointer-events-none max-w-[1776px] mx-auto'
        style={{ transformStyle: 'preserve-3d' }}
      >
        {visibleItems.map((item, index) => {
          const { image, slug, title } = item;
          if (!image) return null;

          const isPainting = item._type === 'painting';
          const cardAspectRatio = resolveHeroCardAspectRatio(item, index);
          const imageUrl =
            (item.image
              ? urlForImage(item.image)
                  ?.width(800)
                  .height(Math.round(800 / cardAspectRatio))
                  .fit('crop')
                  .auto('format')
                  .quality(85)
                  .url()
              : '') || '';

          // Deterministic sizing based on index
          const sizes = [
            'w-44 md:w-72 lg:max-w-[18vw]',
            'w-52 md:w-80 lg:max-w-[19vw]',
            'w-40 md:w-64 lg:max-w-[17vw]',
            'w-48 md:w-72 lg:max-w-[18vw]',
          ];
          const isPriority = index === 0;
          const size = sizes[index % sizes.length];

          // Target configuration — item index maps to a shuffled slot, not a mirrored pair.
          const slotIndex = slotOrder[index] ?? index;
          const pos: HeroCardPosition = positions[slotIndex] ?? {
            top: '50%',
            left: '50%',
            rotation: 0,
            scale: 1,
            side: index % 2 === 0 ? 'left' : 'right',
            band: 'top',
          };
          const scatter = heroCardScatter(
            paintingBrushSeed(`${item._id}:hero-scatter`),
            pos.side,
            pos.band,
          );
          const showNsfwBlur = isPainting && item.isNSFW === true;

          // Stacking coordinates at center
          const stackScale = 1 - index * 0.03;
          const stackOffsetY = -(index * 15);
          const stackRotation = (index % 3) * 3 - 3;

          // Parallax calculation creating a stereoscopic split (disabled on touch devices):
          // tier 0 (Background): moves WITH the mouse, tilts slightly
          // tier 1 (Middleground): moves slightly opposite, tilts normal
          // tier 2 (Foreground): moves strongly opposite, tilts heavily
          // Horizontal drift is biased outward (away from center) per card side so
          // cards never travel into the protected center text column.
          const outward = pos.side === 'left' ? -1 : 1;
          const getParallaxValues = (slot: number) => {
            if (isTouchDevice) {
              return { x: 0, y: 0, rotateX: 0, rotateY: 0, zIndex: (slot % 3) + 1 };
            }

            const tier = slot % 3;
            // Map mouse X to a 0..1 magnitude so horizontal motion has no inward sign.
            const magX = Math.abs(mousePos.x);
            if (tier === 0) {
              return {
                x: outward * magX * 20,
                y: mousePos.y * 24,
                rotateX: mousePos.y * -6,
                rotateY: mousePos.x * 6,
                zIndex: 1,
              };
            } else if (tier === 1) {
              return {
                x: outward * magX * 14,
                y: mousePos.y * -12,
                rotateX: mousePos.y * -12,
                rotateY: mousePos.x * 12,
                zIndex: 2,
              };
            } else {
              return {
                x: outward * magX * 30,
                y: mousePos.y * -42,
                rotateX: mousePos.y * -22,
                rotateY: mousePos.x * 22,
                zIndex: 3,
              };
            }
          };

          const parallax =
            stage === 'floating'
              ? getParallaxValues(slotIndex)
              : { x: 0, y: 0, rotateX: 0, rotateY: 0, zIndex: 1 };

          const offset = scatter;
          const floatMotion = floatKeyframes[slotIndex] ?? {
            y: [0, 12, 0] as [number, number, number],
            x: [0, 0, 0] as [number, number, number],
            rotate: [0, 0, 0] as [number, number, number],
            scaleX: [1, 1, 1] as [number, number, number],
            scaleY: [1, 1, 1] as [number, number, number],
            duration: 5,
            delay: 0,
          };

          const stackY = `calc(-50% + ${stackOffsetY}px)`;

          const cardZIndex =
            stage === 'loading'
              ? index + 1
              : stage === 'exploding'
                ? 1
                : hoveredIndex === index
                  ? 40
                  : parallax.zIndex;
          const isCardHovered = hoveredIndex === index;

          // Animations
          const outerAnimate =
            stage === 'loading'
              ? {
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: stackY,
                  scale: stackScale,
                  rotate: stackRotation,
                  opacity: 1,
                  filter: 'blur(0px)',
                }
              : stage === 'exploding'
                ? {
                    left: pos.left,
                    top: pos.top,
                    x: '-50%',
                    y: '-50%',
                    scale: pos.scale,
                    rotate: pos.rotation + offset.rotate,
                    opacity: 1,
                    filter: 'blur(0px)',
                  }
                : {
                    left: pos.left,
                    top: pos.top,
                    x: '-50%',
                    y: '-50%',
                    scale: pos.scale,
                    rotate: pos.rotation + offset.rotate,
                    opacity: 1,
                    filter: 'blur(0px)',
                  };

          // Soft watercolor bleed for loading stage, snappy spring wobble for explosion stage
          const outerTransition =
            stage === 'loading'
              ? {
                  delay: 0.1 + index * 0.12,
                  duration: 1.4,
                  ease: 'easeOut' as const,
                }
              : stage === 'exploding'
                ? {
                    type: 'spring' as const,
                    stiffness: 110,
                    damping: 11,
                    mass: 0.8,
                  }
                : {
                    duration: 0.6,
                    ease: 'easeOut' as const,
                  };

          // Float animation loop values (stable keyframes from useMemo)
          const floatAnimate =
            stage === 'floating'
              ? {
                  y: floatMotion.y,
                  x: floatMotion.x,
                  rotate: floatMotion.rotate,
                  scaleX: floatMotion.scaleX,
                  scaleY: floatMotion.scaleY,
                }
              : {
                  y: 0,
                  x: 0,
                  rotate: 0,
                  scaleX: 1,
                  scaleY: 1,
                };

          const floatTransition = {
            duration: floatMotion.duration,
            repeat: stage === 'floating' ? Infinity : 0,
            ease: 'easeInOut' as const,
            delay: floatMotion.delay,
          };

          const href = item._type === 'painting' ? `/paintings/${slug}` : `/projects/${slug}`;

          return (
            <motion.div
              key={`${item._type}-${item._id}`}
              initial={
                hasPlayedAlready
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.3,
                      filter: 'blur(30px)',
                      left: '50%',
                      top: '50%',
                      x: '-50%',
                      y: stackY,
                      rotate: stackRotation,
                    }
              }
              animate={outerAnimate}
              transition={outerTransition}
              onMouseEnter={() => {
                if (stage === 'floating') setHoveredIndex(index);
              }}
              onMouseLeave={() => {
                if (stage === 'floating') setHoveredIndex(null);
              }}
              className={`absolute pointer-events-auto ${size} will-change-transform`}
              style={{
                transformStyle: 'preserve-3d',
                zIndex: cardZIndex,
                aspectRatio: cardAspectRatio,
              }}
            >
              {/* Organic client-side scattering offset wrapper */}
              <motion.div
                animate={stage === 'loading' ? { x: 0, y: 0 } : { x: offset.x, y: offset.y }}
                transition={outerTransition}
                className='h-full w-full'
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Mouse Parallax Wrap */}
                <motion.div
                  animate={{
                    x: parallax.x,
                    y: parallax.y,
                    rotateX: parallax.rotateX,
                    rotateY: parallax.rotateY,
                  }}
                  transition={{ type: 'spring', stiffness: 90, damping: 22, mass: 0.4 }}
                  className='h-full w-full'
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Squash on explosion landing */}
                  <motion.div
                    animate={
                      stage === 'exploding' ? EXPLODE_SQUASH_KEYFRAMES : { scaleX: 1, scaleY: 1 }
                    }
                    transition={{
                      ...EXPLODE_SQUASH_TRANSITION,
                      delay: index * 0.03,
                    }}
                    className='h-full w-full'
                    style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                  >
                    {/* Infinite float wrap */}
                    <motion.div
                      animate={floatAnimate}
                      transition={floatTransition}
                      className='h-full w-full'
                      style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                      whileHover={
                        stage === 'floating'
                          ? {
                              scale: 1.04,
                              y: -5,
                              transition: { type: 'spring', stiffness: 420, damping: 24 },
                            }
                          : undefined
                      }
                    >
                      <Link
                        href={href}
                        className={`relative isolate block h-full w-full overflow-hidden rounded-lg ring-1 transition-[box-shadow,ring-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-subtle ${
                          isCardHovered
                            ? 'shadow-[0_28px_50px_-12px_rgba(0,0,0,0.45)] ring-foreground/15'
                            : 'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)] ring-black/10'
                        }`}
                      >
                        <span className='sr-only'>
                          {isPainting ? 'View painting' : 'View project'}:{' '}
                          {title ||
                            (item._type === 'project' ? item.name : null) ||
                            'Portfolio item'}
                        </span>
                        <Image
                          src={imageUrl}
                          alt=''
                          aria-hidden
                          fill
                          priority={isPriority}
                          fetchPriority={isPriority ? 'high' : undefined}
                          className={`object-cover transition-[transform,filter] duration-500 ease-out ${
                            isCardHovered ? 'scale-[1.05] brightness-105' : 'scale-100'
                          }`}
                          sizes='(max-width: 768px) 40vw, 30vw'
                        />
                        {showNsfwBlur ? (
                          <div
                            data-nsfw-blur
                            className='pointer-events-none absolute inset-0 z-[1] bg-background/45 backdrop-blur-xl'
                            aria-hidden
                          />
                        ) : null}
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <HeroScrollIndicator show={showScrollIndicator} />
    </section>
  );
};

export default HeroImageSection;
