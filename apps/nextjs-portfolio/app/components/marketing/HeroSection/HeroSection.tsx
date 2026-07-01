'use client';

import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import { useEffect, useMemo, useState } from 'react';
import { getHeroStrokeColors } from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';
import { BrushRevealLayer } from '@/app/components/paintings/BrushReveal/BrushRevealLayer';
import { BrushRevealWrap } from '@/app/components/paintings/BrushReveal/BrushRevealWrap';
import { TextPressure } from '@/app/components/ui/TextPressure';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import { useCanBrushReveal } from '@/lib/paintings/mediaCapabilities';
import { paintingBrushSeed } from '@/lib/paintings/paintingCardImage';
import { urlForImage } from '@/sanity/lib/utils';
import { HeroDotGrid } from './HeroDotGrid';
import { HeroProjectUiHover } from './HeroProjectUiHover';
import HeroScrollIndicator from './HeroScrollIndicator';
import {
  EXPLODE_SQUASH_KEYFRAMES,
  EXPLODE_SQUASH_TRANSITION,
  HERO_SQUASH_RATIOS,
  HERO_SQUASH_SPRING,
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

// Positions that avoid the center text area but are closer together
const FIXED_POSITIONS_DESKTOP = [
  { top: '15%', left: '20%', rotation: -12, scale: 0.95 },
  { top: '20%', left: '80%', rotation: 15, scale: 0.92 },
  { top: '28%', left: '15%', rotation: -5, scale: 1.0 },
  { top: '24%', left: '85%', rotation: 10, scale: 0.98 },
  { top: '68%', left: '20%', rotation: -15, scale: 0.92 },
  { top: '72%', left: '80%', rotation: 5, scale: 1.0 },
  { top: '12%', left: '50%', rotation: -8, scale: 0.95 },
  { top: '76%', left: '50%', rotation: 12, scale: 0.95 },
];

// Mobile positions - use space both above and below text
const FIXED_POSITIONS_MOBILE = [
  { top: '10%', left: '15%', rotation: -12, scale: 0.9 },
  { top: '14%', left: '80%', rotation: 15, scale: 0.88 },
  { top: '10%', left: '50%', rotation: -8, scale: 0.9 },
  { top: '66%', left: '20%', rotation: -15, scale: 0.9 },
  { top: '70%', left: '80%', rotation: 5, scale: 0.88 },
  { top: '74%', left: '50%', rotation: 12, scale: 0.9 },
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

const HeroImageSection = ({ items, overview, heroEyebrow, heroName }: HeroImageSectionProps) => {
  const canBrushReveal = useCanBrushReveal();
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

  const cardOffsets = useMemo(
    () =>
      Array.from({ length: 15 }).map(() => ({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        rotate: (Math.random() - 0.5) * 20,
      })),
    [],
  );

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
      ? items.slice(0, 6)
      : isTablet
        ? items.slice(0, 7)
        : items.slice(0, 8)
    : [];

  // Auto-cycling highlight timer on mobile/touch screens
  useEffect(() => {
    if (!isTouchDevice || stage !== 'floating' || visibleItems.length === 0) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      setHoveredIndex(currentIndex);
      currentIndex = (currentIndex + 1) % visibleItems.length;
    }, 3000); // Highlight a different card every 3 seconds

    return () => clearInterval(interval);
  }, [isTouchDevice, stage, visibleItems.length]);

  const basePositions = isMobile ? FIXED_POSITIONS_MOBILE : FIXED_POSITIONS_DESKTOP;
  const [positions, setPositions] = useState(basePositions);

  useEffect(() => {
    // Shuffle positions on client mount/resize to randomize collage layout safely
    const shuffled = [...basePositions].sort(() => Math.random() - 0.5);
    setPositions(shuffled);
  }, [basePositions]);

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

      {/* Central Text Content */}
      <motion.div
        variants={textContainerVariants}
        initial={hasPlayedAlready ? 'visible' : 'hidden'}
        animate={stage !== 'loading' ? 'visible' : 'hidden'}
        className='relative z-50 flex flex-col items-center text-center p-8 max-w-2xl pointer-events-none'
      >
        <motion.p
          variants={textItemVariants}
          className='text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4 text-foreground-subtle'
        >
          {heroEyebrow?.trim() || 'My name is'}
        </motion.p>
        <motion.div
          variants={textItemVariants}
          className='mb-6 w-full max-w-3xl pointer-events-auto'
        >
          {reducedMotion ? (
            <h1 className='text-7xl font-black tracking-tighter leading-none text-foreground md:text-9xl'>
              {displayName}
            </h1>
          ) : (
            <div className='h-24 w-full md:h-36'>
              <TextPressure
                text={displayName}
                minFontSize={56}
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
            className='text-lg md:text-xl font-medium max-w-md leading-relaxed text-foreground-subtle [&_p]:m-0'
          >
            <PortableText value={overview} />
          </motion.div>
        ) : (
          <motion.p
            variants={textItemVariants}
            className='text-lg md:text-xl font-medium max-w-md leading-relaxed text-foreground-subtle'
          >
            I&apos;m a design engineer, painter and a maker.
            <br />
            Explore my work.
          </motion.p>
        )}

        {/* Double Call to Actions (serving both paintings & projects) */}
        <motion.div
          variants={buttonVariants}
          className='mt-8 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto'
        >
          <Link
            href='/paintings'
            className='inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent text-accent-contrast font-bold tracking-wide transition-all hover:scale-105 hover:bg-accent-hover shadow-lg'
          >
            View Paintings
          </Link>
          <Link
            href='/projects'
            className='inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-8 py-3 font-bold tracking-wide text-foreground shadow-md backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] duration-300 hover:scale-105 hover:border-accent/45 hover:bg-surface hover:shadow-lg'
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
            'w-52 md:w-84 lg:max-w-[22vw]',
            'w-60 md:w-96 lg:max-w-[24vw]',
            'w-48 md:w-80 lg:max-w-[21vw]',
            'w-56 md:w-96 lg:max-w-[23vw]',
          ];
          const isPriority = index === 0;
          const size = sizes[index % sizes.length];

          // Target configuration based on layout
          const pos = positions[index % positions.length] || {
            top: '50%',
            left: '50%',
            rotation: 0,
            scale: 1,
          };
          const { accentColor } = getHeroStrokeColors(index);
          const brushIndex = isPainting ? paintingBrushSeed(item._id) : index;
          const paintingStrokeColors = isPainting
            ? getBrushStrokeColors(brushIndex, item.image?.palette ?? null)
            : null;
          const cardAccentColor = paintingStrokeColors?.accentColor ?? accentColor;

          const showNsfwBlur = isPainting && item.isNSFW === true;

          // Stacking coordinates at center
          const stackScale = 1 - index * 0.03;
          const stackOffsetY = -(index * 15);
          const stackRotation = (index % 3) * 3 - 3;

          // Parallax calculation creating a stereoscopic split (disabled on touch devices):
          // tier 0 (Background): moves WITH the mouse, tilts slightly
          // tier 1 (Middleground): moves slightly opposite, tilts normal
          // tier 2 (Foreground): moves strongly opposite, tilts heavily
          const getParallaxValues = (idx: number) => {
            if (isTouchDevice) {
              return { x: 0, y: 0, rotateX: 0, rotateY: 0, zIndex: (idx % 3) + 1 };
            }

            const tier = idx % 3;
            if (tier === 0) {
              return {
                x: mousePos.x * 24,
                y: mousePos.y * 24,
                rotateX: mousePos.y * -6,
                rotateY: mousePos.x * 6,
                zIndex: 1,
              };
            } else if (tier === 1) {
              return {
                x: mousePos.x * -12,
                y: mousePos.y * -12,
                rotateX: mousePos.y * -12,
                rotateY: mousePos.x * 12,
                zIndex: 2,
              };
            } else {
              return {
                x: mousePos.x * -42,
                y: mousePos.y * -42,
                rotateX: mousePos.y * -22,
                rotateY: mousePos.x * 22,
                zIndex: 3,
              };
            }
          };

          const parallax =
            stage === 'floating'
              ? getParallaxValues(index)
              : { x: 0, y: 0, rotateX: 0, rotateY: 0, zIndex: 1 };

          const isCurrentlyHovered = hoveredIndex === index;
          const offset = cardOffsets[index] ?? { x: 0, y: 0, rotate: 0 };
          const floatMotion = floatKeyframes[index] ?? {
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
                : isCurrentlyHovered
                  ? 50
                  : parallax.zIndex;

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

          const href = item._type === 'painting' ? `paintings/${slug}` : `projects/${slug}`;

          const projectTags =
            item._type === 'project' && item.tags
              ? item.tags.map(t => t.name).filter((name): name is string => name !== null)
              : null;

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
                    >
                      {/* Hover stretch — elongated spring instead of uniform scale */}
                      <motion.div
                        initial='initial'
                        animate={isCurrentlyHovered ? 'hover' : 'initial'}
                        variants={{
                          initial: { scaleX: 1, scaleY: 1 },
                          hover: {
                            scaleX: HERO_SQUASH_RATIOS.stretchX,
                            scaleY: HERO_SQUASH_RATIOS.stretchY,
                          },
                        }}
                        transition={HERO_SQUASH_SPRING}
                        className='h-full w-full cursor-pointer'
                        style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                      >
                        <Link
                          href={href}
                          className='block h-full w-full rounded-lg overflow-hidden relative isolate transition-all duration-300'
                          style={{
                            boxShadow: isCurrentlyHovered
                              ? `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 25px ${cardAccentColor}33`
                              : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <span className='sr-only'>
                            {isPainting ? 'View painting' : 'View project'}:{' '}
                            {title ||
                              (item._type === 'project' ? item.name : null) ||
                              'Portfolio item'}
                          </span>
                          {!isPainting && (
                            <motion.div
                              className='absolute inset-0'
                              animate={
                                isCurrentlyHovered
                                  ? {
                                      scale: 1.05,
                                      filter: 'brightness(1.1) saturate(1.15) contrast(1.02)',
                                    }
                                  : { scale: 1, filter: 'brightness(1) saturate(1) contrast(1)' }
                              }
                              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Image
                                src={imageUrl}
                                alt=''
                                aria-hidden
                                fill
                                priority={isPriority}
                                fetchPriority={isPriority ? 'high' : undefined}
                                className='object-cover'
                                sizes='(max-width: 768px) 40vw, 30vw'
                              />
                            </motion.div>
                          )}

                          {isPainting ? (
                            <BrushRevealWrap
                              className='relative isolate h-full w-full overflow-hidden'
                              enabled={canBrushReveal}
                              hovered={canBrushReveal && stage === 'floating' && isCurrentlyHovered}
                            >
                              <Image
                                src={imageUrl}
                                alt=''
                                aria-hidden
                                fill
                                priority={isPriority}
                                fetchPriority={isPriority ? 'high' : undefined}
                                className='object-cover'
                                sizes='(max-width: 768px) 40vw, 30vw'
                              />
                              {showNsfwBlur ? (
                                <div
                                  data-nsfw-blur
                                  className='pointer-events-none absolute inset-0 z-[8] bg-background/45 backdrop-blur-xl'
                                  aria-hidden
                                />
                              ) : null}
                              {canBrushReveal && paintingStrokeColors ? (
                                <BrushRevealLayer
                                  {...paintingStrokeColors}
                                  strokeVariantIndex={brushIndex}
                                  title={title}
                                  isNsfwBlurred={showNsfwBlur}
                                />
                              ) : null}
                            </BrushRevealWrap>
                          ) : (
                            <div aria-hidden>
                              <HeroProjectUiHover
                                isHovered={isCurrentlyHovered}
                                accentColor={accentColor}
                                title={title || item.name}
                                tags={projectTags}
                              />
                            </div>
                          )}
                        </Link>
                      </motion.div>
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
