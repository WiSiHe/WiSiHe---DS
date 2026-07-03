'use client';

import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import { useEffect, useMemo, useState } from 'react';
import { TextPressure } from '@/app/components/ui/TextPressure';
import { paintingBrushSeed } from '@/lib/paintings/paintingCardImage';
import { urlForImage } from '@/sanity/lib/utils';
import { HeroDotGrid } from './HeroDotGrid';
import { HeroFloatingCard } from './HeroFloatingCard';
import HeroScrollIndicator from './HeroScrollIndicator';
import {
  buildArcPositions,
  type HeroViewport,
  heroCardScatter,
  heroVisibleCount,
  resolveHeroViewport,
  seededSlotOrder,
} from './heroArcLayout';
import { heroFloatSquashStretch } from './heroSquashStretch';

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

const MOBILE_CARD_ROTATIONS = [-8, 7, -5, 6] as const;
const MOBILE_CARD_SIZES = [
  'w-[38vw] max-w-[148px]',
  'w-[40vw] max-w-[156px]',
  'w-[38vw] max-w-[148px]',
  'w-[40vw] max-w-[156px]',
] as const;

function heroDisplayName(heroSubtitle?: string | null): string {
  const trimmed = heroSubtitle?.trim();
  if (!trimmed) return 'Henrik';
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function resolveHeroCardAspectRatio(item: ShowcaseItem, index: number): number {
  const seed = paintingBrushSeed(`${item._id}:${index}`);
  return HERO_CARD_ASPECT_PRESETS[seed % HERO_CARD_ASPECT_PRESETS.length] ?? 4 / 3;
}

function itemDisplayTitle(item: ShowcaseItem): string {
  return item.title || (item._type === 'project' ? item.name : null) || 'Portfolio item';
}

type HeroImageSectionProps = {
  items?: ShowcaseItem[] | null;
  overview?: PortableTextBlock[] | null;
  heroEyebrow?: string | null;
  heroName?: string | null;
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
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

type HeroCopyProps = {
  stage: 'loading' | 'exploding' | 'floating';
  hasPlayedAlready: boolean;
  heroEyebrow?: string | null;
  displayName: string;
  overview?: PortableTextBlock[] | null;
  reducedMotion: boolean;
  className?: string;
};

function HeroCopy({
  stage,
  hasPlayedAlready,
  heroEyebrow,
  displayName,
  overview,
  reducedMotion,
  className = '',
}: HeroCopyProps) {
  return (
    <motion.div
      variants={textContainerVariants}
      initial={hasPlayedAlready ? 'visible' : 'hidden'}
      animate={stage !== 'loading' ? 'visible' : 'hidden'}
      className={`relative z-[60] flex w-full max-w-xl flex-col items-center px-4 text-center pointer-events-none sm:px-6 ${className}`}
    >
      <motion.p
        variants={textItemVariants}
        className='mb-3 max-w-[16rem] text-pretty text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-subtle sm:max-w-xs sm:text-xs sm:tracking-[0.2em] md:text-sm'
      >
        {heroEyebrow?.trim() || 'Senior frontend developer & digital artist'}
      </motion.p>

      <motion.div variants={textItemVariants} className='mb-3 w-full pointer-events-auto md:mb-4'>
        <h1 className='text-4xl font-black leading-none tracking-tighter text-foreground sm:text-5xl md:hidden'>
          {displayName}
        </h1>
        {!reducedMotion ? (
          <div className='hidden h-28 w-full md:block lg:h-32'>
            <TextPressure
              text={displayName}
              minFontSize={44}
              flex
              weight
              width
              className='leading-none tracking-tighter'
            />
          </div>
        ) : (
          <h1 className='hidden text-5xl font-black leading-none tracking-tighter text-foreground md:block lg:text-8xl'>
            {displayName}
          </h1>
        )}
      </motion.div>

      {overview?.length ? (
        <motion.div
          variants={textItemVariants}
          className='max-w-[17rem] text-pretty text-sm font-medium leading-relaxed text-foreground-subtle sm:max-w-xs md:max-w-sm md:text-base lg:text-lg [&_p]:m-0'
        >
          <PortableText value={overview} />
        </motion.div>
      ) : (
        <motion.p
          variants={textItemVariants}
          className='max-w-[17rem] text-pretty text-sm font-medium leading-relaxed text-foreground-subtle sm:max-w-xs md:max-w-sm md:text-base lg:text-lg'
        >
          I&apos;m a design engineer, painter and maker. Explore paintings, projects, and
          experiments from my portfolio.
        </motion.p>
      )}

      <motion.div
        variants={buttonVariants}
        className='mt-5 flex w-full max-w-xs flex-col items-stretch gap-2.5 pointer-events-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3 md:mt-6'
      >
        <Link
          href='/paintings'
          className='inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold tracking-wide text-accent-contrast shadow-lg transition-all hover:scale-105 hover:bg-accent-hover sm:px-6'
        >
          View Paintings
        </Link>
        <Link
          href='/projects'
          className='inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-bold tracking-wide text-foreground shadow-md backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] duration-300 hover:scale-105 hover:border-accent/45 hover:bg-surface hover:shadow-lg sm:px-6'
        >
          Explore Projects
        </Link>
      </motion.div>
    </motion.div>
  );
}

const HeroImageSection = ({ items, overview, heroEyebrow, heroName }: HeroImageSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const displayName = heroDisplayName(heroName);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'exploding' | 'floating'>('loading');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasPlayedAlready, setHasPlayedAlready] = useState(false);
  const [viewport, setViewport] = useState<HeroViewport>('desktop');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  const floatKeyframes = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const y = [0, Math.random() * 20 + 10, 0] as [number, number, number];
        const squashStretch = heroFloatSquashStretch(y[1]);
        return {
          y,
          x: [0, Math.random() * 10 - 5, 0] as [number, number, number],
          rotate: [0, Math.random() * 2 - 1, 0] as [number, number, number],
          scaleX: squashStretch.scaleX,
          scaleY: squashStretch.scaleY,
          duration: Math.random() * 3 + 4,
          delay: i * 0.1,
        };
      }),
    [],
  );

  useEffect(() => {
    const handleResize = () => setViewport(resolveHeroViewport(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('hero-splash-played');
    const isDev = process.env.NODE_ENV === 'development';

    if (hasPlayed && !isDev) {
      setStage('floating');
      setProgress(100);
      setHasPlayedAlready(true);
      return;
    }

    if (!isDev) sessionStorage.setItem('hero-splash-played', 'true');

    const controls = animate(0, 100, {
      duration: 2.5,
      ease: 'easeInOut',
      onUpdate: latest => setProgress(Math.round(latest)),
      onComplete: () => {
        setStage('exploding');
        setTimeout(() => setStage('floating'), 1200);
      },
    });

    return () => controls.stop();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setShowScrollIndicator(scrollY <= 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMobile = viewport === 'mobile';
  const visibleCount = heroVisibleCount(viewport);
  const visibleItems = items ? items.slice(0, visibleCount) : [];
  const arcPositions = useMemo(
    () => buildArcPositions(visibleCount, viewport === 'mobile' ? 'tablet' : viewport),
    [visibleCount, viewport],
  );
  const slotOrder = useMemo(() => seededSlotOrder(visibleCount), [visibleCount]);
  const hoverEnabled = canHover && stage === 'floating';

  if (!items || items.length === 0) {
    return <div className='py-20 text-center'>No items available.</div>;
  }

  const renderCardData = (item: ShowcaseItem, index: number) => {
    if (!item.image) return null;
    const cardAspectRatio = resolveHeroCardAspectRatio(item, index);
    const imageUrl =
      urlForImage(item.image)
        ?.width(800)
        .height(Math.round(800 / cardAspectRatio))
        .fit('crop')
        .auto('format')
        .quality(85)
        .url() ?? '';
    const href = item._type === 'painting' ? `/paintings/${item.slug}` : `/projects/${item.slug}`;
    const showNsfwBlur = item._type === 'painting' && item.isNSFW === true;

    return {
      cardAspectRatio,
      imageUrl,
      href,
      displayTitle: itemDisplayTitle(item),
      showNsfwBlur,
    };
  };

  const renderArcCard = (item: ShowcaseItem, index: number) => {
    const data = renderCardData(item, index);
    if (!data) return null;

    const slotIndex = slotOrder[index] ?? index;
    const pos = arcPositions[slotIndex] ?? arcPositions[index] ?? arcPositions[0];
    if (!pos) return null;

    const scatter = heroCardScatter(
      paintingBrushSeed(`${item._id}:hero-scatter`),
      pos.side,
      pos.band,
    );
    const stackScale = 1 - index * 0.03;
    const stackOffsetY = -(index * 15);
    const stackRotation = (index % 3) * 1.5 - 1.5;
    const stackY = `calc(-50% + ${stackOffsetY}px)`;

    const isCardHovered = hoveredIndex === index;
    const parallax = {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: (slotIndex % 3) + 1,
    };
    const floatMotion = floatKeyframes[slotIndex] ??
      floatKeyframes[0] ?? {
        y: [0, 12, 0] as [number, number, number],
        x: [0, 0, 0] as [number, number, number],
        rotate: [0, 0, 0] as [number, number, number],
        scaleX: [1, 1, 1] as [number, number, number],
        scaleY: [1, 1, 1] as [number, number, number],
        duration: 5,
        delay: 0,
      };

    const arcSizes = [
      'w-44 lg:w-52 xl:max-w-[14vw]',
      'w-48 lg:w-56 xl:max-w-[15vw]',
      'w-40 lg:w-48 xl:max-w-[13vw]',
      'w-44 lg:w-52 xl:max-w-[14vw]',
    ];
    const sizeClass = arcSizes[index % arcSizes.length] ?? arcSizes[0] ?? 'w-44';

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
        : {
            left: pos.left,
            top: pos.top,
            x: '-50%',
            y: '-50%',
            scale: pos.scale,
            rotate: pos.rotation + scatter.rotate,
            opacity: 1,
            filter: 'blur(0px)',
          };

    const outerTransition =
      stage === 'loading'
        ? { delay: 0.1 + index * 0.12, duration: 1.4, ease: 'easeOut' as const }
        : stage === 'exploding'
          ? { type: 'spring' as const, stiffness: 110, damping: 11, mass: 0.8 }
          : { duration: 0.6, ease: 'easeOut' as const };

    const cardZIndex =
      stage === 'loading'
        ? index + 1
        : stage === 'exploding'
          ? 1
          : isCardHovered
            ? 40
            : parallax.zIndex;

    return (
      <HeroFloatingCard
        key={`${item._type}-${item._id}`}
        item={item}
        index={index}
        layout='arc'
        stage={stage}
        hasPlayedAlready={hasPlayedAlready}
        hoverEnabled={hoverEnabled}
        isCardHovered={isCardHovered}
        onHoverStart={() => setHoveredIndex(index)}
        onHoverEnd={() => setHoveredIndex(null)}
        isPriority={index === 0}
        sizeClass={sizeClass}
        outerAnimate={outerAnimate}
        outerTransition={outerTransition}
        pos={pos}
        scatter={scatter}
        parallax={parallax}
        floatMotion={floatMotion}
        stackY={stackY}
        stackScale={stackScale}
        stackRotation={stackRotation}
        cardZIndex={cardZIndex}
        {...data}
      />
    );
  };

  const renderMobileCard = (item: ShowcaseItem, index: number) => {
    const data = renderCardData(item, index);
    if (!data) return null;

    return (
      <HeroFloatingCard
        key={`${item._type}-${item._id}`}
        item={item}
        index={index}
        layout='mobile'
        stage={stage}
        hasPlayedAlready={hasPlayedAlready}
        hoverEnabled={false}
        isCardHovered={false}
        onHoverStart={() => {}}
        onHoverEnd={() => {}}
        isPriority={index === 0}
        sizeClass={MOBILE_CARD_SIZES[index] ?? MOBILE_CARD_SIZES[0] ?? 'w-[38vw] max-w-[148px]'}
        mobileRotation={MOBILE_CARD_ROTATIONS[index] ?? 0}
        {...data}
      />
    );
  };

  return (
    <section
      className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background-subtle pt-16 pb-10 transition-colors duration-500 md:overflow-visible md:pt-20 md:pb-12'
      style={{ perspective: 1200 }}
    >
      <HeroDotGrid />

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
            className='pointer-events-none absolute top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center'
          >
            <div className='font-mono text-9xl font-black tracking-tighter text-white mix-blend-difference drop-shadow-2xl'>
              {progress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile — 2 cards above · copy · 2 cards below */}
      <div className='relative z-10 flex w-full flex-col items-center gap-5 py-4 md:hidden'>
        <div className='grid w-full max-w-md grid-cols-2 gap-3 px-3'>
          {visibleItems.slice(0, 2).map((item, index) => renderMobileCard(item, index))}
        </div>

        <HeroCopy
          stage={stage}
          hasPlayedAlready={hasPlayedAlready}
          heroEyebrow={heroEyebrow}
          displayName={displayName}
          overview={overview}
          reducedMotion={reducedMotion}
        />

        <div className='grid w-full max-w-md grid-cols-2 gap-3 px-3'>
          {visibleItems.slice(2, 4).map((item, index) => renderMobileCard(item, index + 2))}
        </div>
      </div>

      {/* md+ — orbit collage + vertically centered copy */}
      <div className='relative hidden w-full md:flex md:min-h-[calc(100svh-5rem)] md:items-center md:justify-center'>
        <div
          className='pointer-events-none absolute inset-0 overflow-visible'
          style={{ transformStyle: 'preserve-3d' }}
        >
          {!isMobile ? visibleItems.map((item, index) => renderArcCard(item, index)) : null}
        </div>

        <HeroCopy
          stage={stage}
          hasPlayedAlready={hasPlayedAlready}
          heroEyebrow={heroEyebrow}
          displayName={displayName}
          overview={overview}
          reducedMotion={reducedMotion}
          className='px-6 py-8 md:px-10'
        />
      </div>

      <HeroScrollIndicator show={showScrollIndicator} />
    </section>
  );
};

export default HeroImageSection;
