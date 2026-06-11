'use client';

import { AnimatePresence, animate, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import { useEffect, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

import { getHeroStrokeColors, HeroPaintingSvgHover } from './HeroPaintingSvgHover';
import { HeroProjectUiHover } from './HeroProjectUiHover';
import HeroScrollIndicator from './HeroScrollIndicator';

type ShowcasePainting = {
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
  } | null;
  tagsV2?: { name: string | null }[] | null;
};

type ShowcaseProject = {
  _type: 'project';
  _id: string;
  slug: string | null;
  title: string | null;
  name?: string | null;
  description?: string | null;
  seoDescription?: string | null;
  image?: {
    asset?: { _ref: string };
    lqip?: string | null;
    alt?: string;
  } | null;
  tags?: { name: string | null }[] | null;
};

type ShowcaseItem = ShowcasePainting | ShowcaseProject;

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
  { top: '15%', left: '20%', rotation: -12, scale: 0.9 },
  { top: '20%', left: '80%', rotation: 15, scale: 0.85 },
  { top: '30%', left: '15%', rotation: -5, scale: 1.0 },
  { top: '25%', left: '85%', rotation: 10, scale: 0.95 },
  { top: '75%', left: '20%', rotation: -15, scale: 0.85 },
  { top: '80%', left: '80%', rotation: 5, scale: 1.0 },
  { top: '12%', left: '50%', rotation: -8, scale: 0.9 },
  { top: '88%', left: '50%', rotation: 12, scale: 0.9 },
];

// Mobile positions - use space both above and below text
const FIXED_POSITIONS_MOBILE = [
  // Above text (top area)
  { top: '10%', left: '15%', rotation: -12, scale: 0.8 },
  { top: '15%', left: '85%', rotation: 15, scale: 0.75 },
  { top: '8%', left: '50%', rotation: -8, scale: 0.8 },
  { top: '20%', left: '20%', rotation: -10, scale: 0.75 },
  { top: '25%', left: '80%', rotation: 12, scale: 0.8 },
  { top: '12%', left: '30%', rotation: -5, scale: 0.75 },
  // Below text (bottom area)
  { top: '70%', left: '20%', rotation: -15, scale: 0.8 },
  { top: '75%', left: '80%', rotation: 5, scale: 0.75 },
  { top: '85%', left: '50%', rotation: 12, scale: 0.8 },
  { top: '80%', left: '15%', rotation: -8, scale: 0.75 },
  { top: '78%', left: '85%', rotation: 10, scale: 0.8 },
  { top: '88%', left: '30%', rotation: -12, scale: 0.75 },
];

const HeroImageSection = ({ items, overview, heroEyebrow, heroName }: HeroImageSectionProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'exploding' | 'floating'>('loading');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasPlayedAlready, setHasPlayedAlready] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [flares, setFlares] = useState<
    Array<{ id: number; top: string; left: string; color: string }>
  >([]);
  const [activeFlareId, setActiveFlareId] = useState<number | null>(null);
  const [cardOffsets, setCardOffsets] = useState<Array<{ x: number; y: number; rotate: number }>>(
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

  // Initialize background spark coordinates and organic card offsets once on mount
  useEffect(() => {
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      color: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-brand-2-500)',
    }));
    setFlares(generated);

    const offsets = Array.from({ length: 15 }).map(() => ({
      x: (Math.random() - 0.5) * 50, // ±25px translation
      y: (Math.random() - 0.5) * 50, // ±25px translation
      rotate: (Math.random() - 0.5) * 20, // ±10 degrees rotation
    }));
    setCardOffsets(offsets);
  }, []);

  // Trigger coordinate sparks at random intervals during active floating
  useEffect(() => {
    if (stage !== 'floating' || flares.length === 0) return;

    const triggerRandomFlare = () => {
      const randomIndex = Math.floor(Math.random() * flares.length);
      setActiveFlareId(randomIndex);
      setTimeout(() => {
        setActiveFlareId(null);
      }, 1500);
    };

    const interval = setInterval(
      () => {
        triggerRandomFlare();
      },
      Math.random() * 2000 + 2000,
    ); // Trigger every 2-4 seconds

    return () => clearInterval(interval);
  }, [stage, flares.length]);

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
      ? items.slice(0, 12)
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

  if (!items || items.length === 0) {
    return <div className='text-center py-20'>No items available.</div>;
  }

  const positions = isMobile ? FIXED_POSITIONS_MOBILE : FIXED_POSITIONS_DESKTOP;

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
      className='relative flex min-h-lvh w-full items-center justify-center transition-colors duration-500 bg-background-subtle overflow-x-clip'
      style={{ perspective: 1200 }}
    >
      {/* Background Cyber-Blueprint Dot Grid */}
      <div
        className='absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-500 animate-fade-in'
        style={{
          backgroundImage: 'radial-gradient(var(--color-foreground) 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Blueprint Constellation Spark Flares (Randomly plays sparks) */}
      {stage === 'floating' &&
        flares.map(flare => {
          const isActive = activeFlareId === flare.id;
          return (
            <motion.div
              key={flare.id}
              className='absolute w-2.5 h-2.5 rounded-full pointer-events-none z-10'
              style={{
                top: flare.top,
                left: flare.left,
                backgroundColor: flare.color,
              }}
              animate={
                isActive
                  ? {
                      scale: [1, 2.5, 1],
                      opacity: [0, 0.85, 0],
                      filter: ['blur(0px)', 'blur(3px)', 'blur(0px)'],
                    }
                  : { opacity: 0 }
              }
              transition={{ duration: 1.5, ease: 'easeInOut' as const }}
            />
          );
        })}

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
        <motion.h1
          variants={textItemVariants}
          className='text-7xl md:text-9xl font-serif font-black tracking-tighter mb-6 leading-none text-foreground'
        >
          {heroDisplayName(heroName)}
        </motion.h1>
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
            className='inline-flex items-center justify-center px-8 py-3 rounded-full border border-foreground/15 bg-background hover:bg-foreground/5 text-foreground font-bold tracking-wide transition-all hover:scale-105 shadow-md'
          >
            Explore Projects
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Images Container */}
      <div
        className='absolute inset-0 pointer-events-none max-w-[1776px] mx-auto pt-10'
        style={{ transformStyle: 'preserve-3d' }}
      >
        {visibleItems.map((item, index) => {
          const { image, slug, title } = item;
          if (!image) return null;

          const imageUrl = urlForImage(image)?.width(800).auto('format').quality(85).url() || '';

          // Deterministic styling based on index (aspectRatios, sizes)
          const aspectRatios = ['aspect-square', 'aspect-video', 'aspect-[3/4]', 'aspect-[4/5]'];
          const sizes = [
            'w-48 md:w-80 lg:max-w-[20vw]',
            'w-56 md:w-96 lg:max-w-[22vw]',
            'w-40 md:w-64 lg:max-w-[18vw]',
            'w-52 md:w-80 lg:max-w-[20vw]',
          ];
          const isPriority = index < 4;
          const aspectRatio = aspectRatios[index % aspectRatios.length];
          const size = sizes[index % sizes.length];

          // Target configuration based on layout
          const pos = positions[index % positions.length] || {
            top: '50%',
            left: '50%',
            rotation: 0,
            scale: 1,
          };
          const { accentColor, secondaryColor } = getHeroStrokeColors(index);

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

          const parallax = getParallaxValues(index);
          const isCurrentlyHovered = hoveredIndex === index;
          const offset = cardOffsets[index] || { x: 0, y: 0, rotate: 0 };

          // Animations
          const outerAnimate =
            stage === 'loading'
              ? {
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: `calc(-50% + ${stackOffsetY}px)`,
                  scale: stackScale,
                  rotate: stackRotation,
                  opacity: 1,
                  filter: 'blur(0px)',
                  zIndex: index + 1,
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
                    zIndex: 1,
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
                    zIndex: isCurrentlyHovered ? 50 : parallax.zIndex, // Raise zIndex dynamically
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

          // Float animation loop values
          const floatAnimate =
            stage === 'floating'
              ? {
                  y: [0, Math.random() * 20 + 10, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                  rotate: [0, Math.random() * 6 - 3, 0],
                }
              : {
                  y: 0,
                  x: 0,
                  rotate: 0,
                };

          const floatTransition = {
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: index * 0.1,
          };

          const href = item._type === 'painting' ? `paintings/${slug}` : `projects/${slug}`;
          const isPainting = item._type === 'painting';

          // Extract project properties if type is project
          const projectTags =
            item._type === 'project' && item.tags
              ? item.tags.map(t => t.name).filter((name): name is string => name !== null)
              : null;

          // Extract painting properties if type is painting
          const paintingTags =
            item._type === 'painting' && item.tagsV2
              ? item.tagsV2.map(t => t.name).filter((name): name is string => name !== null)
              : null;
          const paintingMedium = item._type === 'painting' ? item.medium : null;
          const paintingYear =
            item._type === 'painting' && item.paintedAt
              ? new Date(item.paintedAt).getFullYear().toString()
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
                      filter: 'blur(30px)', // Watercolor dissolve start
                      left: '50%',
                      top: '50%',
                      x: '-50%',
                      y: stackOffsetY,
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
              className={`absolute pointer-events-auto ${size} ${aspectRatio} will-change-transform`}
              style={{ transformStyle: 'preserve-3d' }}
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
                  {/* Infinite float wrap */}
                  <motion.div
                    animate={floatAnimate}
                    transition={floatTransition}
                    className='h-full w-full'
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Scale & Hover wrap: moved whileHover here to allow correct variant propagation down to child components */}
                    <motion.div
                      initial='initial'
                      animate={isCurrentlyHovered ? 'hover' : 'initial'}
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.2 },
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className='h-full w-full cursor-pointer'
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <Link
                        href={href}
                        className='block h-full w-full rounded-lg overflow-hidden relative isolate transition-all duration-300'
                        style={{
                          boxShadow: isCurrentlyHovered
                            ? `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 25px ${accentColor}33`
                            : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <Image
                          src={imageUrl}
                          alt={item.title || 'Portfolio Item'}
                          fill
                          priority={isPriority}
                          className='object-cover'
                          sizes='(max-width: 768px) 40vw, 30vw'
                        />

                        {isPainting ? (
                          <HeroPaintingSvgHover
                            useMotion
                            accentColor={accentColor}
                            secondaryColor={secondaryColor}
                            title={title}
                            medium={paintingMedium}
                            year={paintingYear}
                            tags={paintingTags}
                          />
                        ) : (
                          <HeroProjectUiHover
                            accentColor={accentColor}
                            secondaryColor={secondaryColor}
                            title={title || item.name}
                            tags={projectTags}
                          />
                        )}
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
