'use client';

import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { paintingBrushSeed } from '@/lib/paintings/paintingCardImage';
import { urlForImage } from '@/sanity/lib/utils';
import { HeroDotGrid } from './HeroDotGrid';
import { HeroFloatingCard } from './HeroFloatingCard';
import { HeroPersistentName } from './HeroPersistentName';
import HeroScrollIndicator from './HeroScrollIndicator';
import {
  buildArcPositions,
  type HeroViewport,
  type HeroViewportSize,
  heroCardOrganicScatter,
  heroCardScatter,
  heroVisibleCount,
  resolveHeroViewport,
  seededSlotOrder,
  usesRingLayout,
} from './heroArcLayout';
import { heroFloatSquashStretch } from './heroSquashStretch';
import {
  BODY_DELAY_AFTER_EXPLODE,
  heroEntranceCompleteMs,
  heroExplodeAtMs,
  heroStackLayout,
} from './heroStackConfig';

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

const ARC_CARD_SIZES = [
  'w-[34vw] max-w-[148px] sm:w-44 sm:max-w-none md:w-56 lg:w-72 xl:w-72 xl:max-w-72 2xl:max-w-80 min-[2560px]:max-w-[20rem]',
  'w-[36vw] max-w-[156px] sm:w-48 sm:max-w-none md:w-60 lg:w-80 xl:w-80 xl:max-w-80 2xl:max-w-[21rem] min-[2560px]:max-w-[22rem]',
  'w-[32vw] max-w-[140px] sm:w-40 sm:max-w-none md:w-52 lg:w-64 xl:w-64 xl:max-w-64 2xl:max-w-72 min-[2560px]:max-w-[19rem]',
  'w-[34vw] max-w-[148px] sm:w-44 sm:max-w-none md:w-56 lg:w-72 xl:w-72 xl:max-w-72 2xl:max-w-80 min-[2560px]:max-w-[20rem]',
] as const;

function readViewportSize(): HeroViewportSize {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

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
  heroEyebrow?: string | null;
  heroName?: string | null;
};

const bodyItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

const buttonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

type HeroBodyCopyProps = {
  heroEyebrow?: string | null;
  show: boolean;
  reserveSpace: boolean;
  skipEntrance: boolean;
};

const eyebrowClassName =
  'mb-2 w-full text-center text-pretty text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-subtle sm:text-xs sm:tracking-[0.2em] md:mb-3 md:text-sm';

function HeroBodyCopy({ heroEyebrow, show, reserveSpace, skipEntrance }: HeroBodyCopyProps) {
  if (!show && !skipEntrance && !reserveSpace) return null;

  const isVisible = show || skipEntrance;

  return (
    <motion.div
      initial={skipEntrance ? 'visible' : 'hidden'}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
      }}
      aria-hidden={!isVisible}
      className={cn(
        'flex w-full flex-col items-center',
        !isVisible && reserveSpace && 'invisible pointer-events-none',
      )}
    >
      <motion.div variants={bodyItemVariants} className='w-full'>
        <p className={eyebrowClassName}>
          {heroEyebrow?.trim() || 'Senior frontend developer & digital artist'}
        </p>
      </motion.div>

      <motion.div
        variants={buttonVariants}
        className='mt-4 flex w-full max-w-xs flex-col items-stretch gap-2.5 pointer-events-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3 md:mt-5'
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
          View projects
        </Link>
      </motion.div>
    </motion.div>
  );
}

const HeroImageSection = ({ items, heroEyebrow, heroName }: HeroImageSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const displayName = heroDisplayName(heroName);
  const [hasExploded, setHasExploded] = useState(reducedMotion);
  const [showHeroBody, setShowHeroBody] = useState(reducedMotion);
  const [entranceComplete, setEntranceComplete] = useState(reducedMotion);
  const [showScrollIndicator, setShowScrollIndicator] = useState(reducedMotion);
  const [viewport, setViewport] = useState<HeroViewport>(() =>
    typeof window === 'undefined' ? 'desktop' : resolveHeroViewport(window.innerWidth),
  );
  const [viewportSize, setViewportSize] = useState<HeroViewportSize>(readViewportSize);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  const floatKeyframes = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const yPeak = Math.random() * 10 + 5;
        const squashStretch = heroFloatSquashStretch(yPeak);
        return {
          y: [0, yPeak, 0] as [number, number, number],
          x: [0, Math.random() * 6 - 3, 0] as [number, number, number],
          rotate: [0, Math.random() * 1.2 - 0.6, 0] as [number, number, number],
          scaleX: squashStretch.scaleX,
          scaleY: squashStretch.scaleY,
          duration: Math.random() * 1.5 + 5.5,
          delay: i * 0.1,
        };
      }),
    [],
  );

  const visibleCount = heroVisibleCount(viewport);
  const visibleItems = items ? items.slice(0, visibleCount) : [];
  const explodeAtMs = heroExplodeAtMs(visibleItems.length);
  const entranceCompleteMs = heroEntranceCompleteMs(visibleItems.length);

  useEffect(() => {
    if (!reducedMotion) return;

    setHasExploded(true);
    setShowHeroBody(true);
    setEntranceComplete(true);
    setShowScrollIndicator(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const explodeTimer = window.setTimeout(() => {
      setHasExploded(true);
    }, explodeAtMs);

    const bodyTimer = window.setTimeout(
      () => {
        setShowHeroBody(true);
      },
      explodeAtMs + BODY_DELAY_AFTER_EXPLODE * 1000,
    );

    const doneTimer = window.setTimeout(() => {
      setEntranceComplete(true);
      setShowScrollIndicator(true);
    }, entranceCompleteMs);

    return () => {
      window.clearTimeout(explodeTimer);
      window.clearTimeout(bodyTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reducedMotion, explodeAtMs, entranceCompleteMs]);

  useEffect(() => {
    const handleResize = () => {
      setViewport(resolveHeroViewport(window.innerWidth));
      setViewportSize(readViewportSize());
    };
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
    const handleScroll = () => {
      if ((window.scrollY || window.pageYOffset) > 100) {
        setShowScrollIndicator(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const arcPositions = useMemo(
    () => buildArcPositions(visibleCount, viewport, viewportSize),
    [visibleCount, viewport, viewportSize],
  );
  const slotOrder = useMemo(() => seededSlotOrder(visibleCount), [visibleCount]);
  const ringLayout = usesRingLayout(viewport, viewportSize);
  const hoverEnabled = canHover && entranceComplete;
  const floatActive = entranceComplete && !reducedMotion;

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
      imageLqip: item.image.lqip ?? null,
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

    const scatterSeed = paintingBrushSeed(`${item._id}:hero-scatter`);
    const scatter = ringLayout
      ? heroCardOrganicScatter(scatterSeed)
      : heroCardScatter(scatterSeed, pos.side, pos.band);

    const isCardHovered = hoveredIndex === index;
    const cardZIndex = (slotIndex % 3) + 1;

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

    const arcSizeClass =
      ARC_CARD_SIZES[index % ARC_CARD_SIZES.length] ?? ARC_CARD_SIZES[0] ?? 'w-44';

    return (
      <HeroFloatingCard
        key={`${item._type}-${item._id}`}
        item={item}
        index={index}
        reducedMotion={reducedMotion}
        hasExploded={hasExploded}
        floatActive={floatActive}
        hoverEnabled={hoverEnabled}
        isCardHovered={isCardHovered}
        onHoverStart={() => setHoveredIndex(index)}
        onHoverEnd={() => setHoveredIndex(null)}
        isPriority={index === 0}
        arcSizeClass={arcSizeClass}
        pos={pos}
        scatter={scatter}
        floatMotion={floatMotion}
        stackLayout={heroStackLayout(index)}
        cardZIndex={cardZIndex}
        {...data}
      />
    );
  };

  return (
    <section className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background-subtle pt-16 pb-10 md:overflow-visible md:pt-20 md:pb-12'>
      <HeroDotGrid />

      <div className='relative flex w-full min-h-[calc(100svh-4.5rem)] items-center justify-center md:min-h-[calc(100svh-5rem)]'>
        <div className='pointer-events-none absolute inset-0 z-[45] overflow-visible'>
          {visibleItems.map((item, index) => renderArcCard(item, index))}
        </div>

        <div className='pointer-events-none absolute inset-0 z-[60] flex items-center justify-center px-4 py-8 sm:px-6 md:px-10'>
          <div className='relative flex w-full max-w-md flex-col items-center text-center sm:max-w-lg md:max-w-xl'>
            <HeroPersistentName
              text={displayName}
              hasExploded={hasExploded}
              reducedMotion={reducedMotion}
            />
            <HeroBodyCopy
              heroEyebrow={heroEyebrow}
              show={showHeroBody}
              reserveSpace={hasExploded}
              skipEntrance={reducedMotion}
            />
          </div>
        </div>
      </div>

      <HeroScrollIndicator show={showScrollIndicator} />
    </section>
  );
};

export default HeroImageSection;
