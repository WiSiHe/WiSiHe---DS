'use client';

import { useGSAP } from '@gsap/react';
import { BrushRevealLayer, BrushRevealWrap } from '@wisihe/ui-react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { HeroProjectUiHover } from '@/app/components/marketing/HeroSection/HeroProjectUiHover';
import type { ShowcaseItem } from '@/app/components/marketing/HeroSection/HeroSection';
import type { HeroCardPosition } from '@/app/components/marketing/HeroSection/heroArcLayout';
import {
  EXPLODE_SQUASH_KEYFRAMES,
  EXPLODE_SQUASH_TRANSITION,
} from '@/app/components/marketing/HeroSection/heroSquashStretch';
import {
  CARD_REVEAL_DURATION,
  CARD_REVEAL_STAGGER,
  EXPLODE_STAGGER,
  STACK_CLIP_CLOSED,
  STACK_CLIP_OPEN,
  STACK_REVEAL_DELAY,
} from '@/app/components/marketing/HeroSection/heroStackConfig';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import { getNsfwImageBlurClass } from '@/lib/paintings/nsfwCover';
import { paintingBrushSeed } from '@/lib/paintings/paintingCardImage';

type FloatMotion = {
  y: [number, number, number];
  x: [number, number, number];
  rotate: [number, number, number];
  scaleX: [number, number, number];
  scaleY: [number, number, number];
  duration: number;
  delay: number;
};

type StackLayout = {
  rotation: number;
  offsetX: number;
  stackOffsetY: number;
  stackScale: number;
};

type HeroFloatingCardProps = {
  item: ShowcaseItem;
  index: number;
  imageUrl: string;
  cardAspectRatio: number;
  href: string;
  displayTitle: string;
  showNsfwBlur: boolean;
  isPriority: boolean;
  imageLqip?: string | null;
  arcSizeClass: string;
  reducedMotion: boolean;
  hasExploded: boolean;
  floatActive: boolean;
  hoverEnabled: boolean;
  isCardHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  pos: HeroCardPosition;
  scatter: { x: number; y: number; rotate: number };
  floatMotion: FloatMotion;
  stackLayout: StackLayout;
  cardZIndex: number;
};

export function HeroFloatingCard({
  item,
  index,
  imageUrl,
  cardAspectRatio,
  href,
  displayTitle,
  showNsfwBlur,
  isPriority,
  imageLqip,
  arcSizeClass,
  reducedMotion,
  hasExploded,
  floatActive,
  hoverEnabled,
  isCardHovered,
  onHoverStart,
  onHoverEnd,
  pos,
  scatter,
  floatMotion,
  stackLayout,
  cardZIndex,
}: HeroFloatingCardProps) {
  const revealRef = useRef<HTMLDivElement>(null);
  const [hasLanded, setHasLanded] = useState(reducedMotion);
  const isPainting = item._type === 'painting';
  const strokeVariantIndex = paintingBrushSeed(item._id);
  const paintingBrush = isPainting
    ? getBrushStrokeColors(strokeVariantIndex, item.image?.palette ?? null)
    : null;
  const projectAccent = getBrushStrokeColors(index, null).accentColor;
  const paintingYear =
    isPainting && item.paintedAt ? new Date(item.paintedAt).getFullYear().toString() : null;
  const projectTags =
    item._type === 'project'
      ? (item.tags ?? []).map(tag => tag.name).filter((tag): tag is string => Boolean(tag))
      : [];
  const projectClient = item._type === 'project' ? item.client?.trim() || null : null;
  const projectTitle =
    item._type === 'project'
      ? item.name?.trim() || item.title?.trim() || displayTitle
      : displayTitle;

  const arcRotate = pos.rotation + scatter.rotate;
  const inStack = !reducedMotion && !hasExploded;

  useGSAP(
    () => {
      const el = revealRef.current;
      if (!el || reducedMotion) return;

      gsap.set(el, {
        scale: 0,
        clipPath: STACK_CLIP_CLOSED,
        transformOrigin: 'center center',
      });

      gsap.to(el, {
        scale: 1,
        clipPath: STACK_CLIP_OPEN,
        duration: CARD_REVEAL_DURATION,
        ease: 'power3.inOut',
        delay: STACK_REVEAL_DELAY + index * CARD_REVEAL_STAGGER,
      });
    },
    { dependencies: [index, reducedMotion] },
  );

  const stackPose = {
    left: '50%',
    top: '50%',
    x: `calc(-50% + ${stackLayout.offsetX}px)`,
    y: `calc(-50% + ${stackLayout.stackOffsetY}px)`,
    scale: stackLayout.stackScale,
    rotate: stackLayout.rotation,
    opacity: 1,
  };

  const arcPose = {
    left: pos.left,
    top: pos.top,
    x: '-50%',
    y: '-50%',
    scale: pos.scale,
    rotate: arcRotate,
    opacity: 1,
  };

  const arcTransition = reducedMotion
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: 145,
        damping: 12,
        mass: 0.75,
        delay: index * EXPLODE_STAGGER,
      };

  const floatAnimate = floatActive
    ? {
        y: floatMotion.y,
        x: floatMotion.x,
        rotate: floatMotion.rotate,
        scaleX: floatMotion.scaleX,
        scaleY: floatMotion.scaleY,
      }
    : { y: 0, x: 0, rotate: 0, scaleX: 1, scaleY: 1 };

  const floatTransition = {
    duration: floatMotion.duration,
    repeat: floatActive ? Infinity : 0,
    ease: 'easeInOut' as const,
    delay: floatMotion.delay,
  };

  const baseZIndex = inStack ? index + 1 : cardZIndex;
  const resolvedZIndex = isCardHovered && hoverEnabled ? 50 : baseZIndex;

  const cardLink = (
    <Link
      href={href}
      className='relative isolate block h-full w-full overflow-hidden rounded-xl ring-1 shadow-[0_18px_28px_-8px_rgba(0,0,0,0.28),0_8px_12px_-6px_rgba(0,0,0,0.18)] ring-black/10 transition-[box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-subtle hover:shadow-[0_28px_40px_-10px_rgba(0,0,0,0.35),0_12px_18px_-8px_rgba(0,0,0,0.22)] dark:ring-white/10'
    >
      <span className='sr-only'>
        {isPainting ? 'View painting' : 'View project'}: {displayTitle}
      </span>
      {isPainting ? (
        <BrushRevealWrap
          enabled
          hovered={hoverEnabled && isCardHovered}
          className='absolute inset-0'
        >
          <Image
            src={imageUrl}
            alt=''
            aria-hidden
            fill
            priority={isPriority}
            fetchPriority={isPriority ? 'high' : undefined}
            placeholder={imageLqip ? 'blur' : 'empty'}
            blurDataURL={imageLqip ?? undefined}
            className={`object-cover ${showNsfwBlur ? getNsfwImageBlurClass('card') : ''}`}
            sizes='(max-width: 768px) 52vw, 250px'
          />
          <BrushRevealLayer
            accentColor={paintingBrush!.accentColor}
            secondaryColor={paintingBrush!.secondaryColor}
            strokeVariantIndex={strokeVariantIndex}
            revealSeed={strokeVariantIndex}
            paintingFormat={item.format ?? 'square'}
            title={displayTitle}
            year={paintingYear}
          />
        </BrushRevealWrap>
      ) : (
        <>
          <div className='absolute inset-0 overflow-hidden'>
            <Image
              src={imageUrl}
              alt=''
              aria-hidden
              fill
              priority={isPriority}
              fetchPriority={isPriority ? 'high' : undefined}
              placeholder={imageLqip ? 'blur' : 'empty'}
              blurDataURL={imageLqip ?? undefined}
              className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none'
              sizes='(max-width: 768px) 52vw, 250px'
            />
          </div>
          {hoverEnabled ? (
            <HeroProjectUiHover
              accentColor={projectAccent}
              title={projectTitle}
              client={projectClient}
              tags={projectTags}
            />
          ) : null}
        </>
      )}
    </Link>
  );

  return (
    <motion.div
      initial={reducedMotion ? false : stackPose}
      animate={hasExploded || reducedMotion ? arcPose : stackPose}
      transition={hasExploded && !reducedMotion ? arcTransition : { duration: 0 }}
      onAnimationComplete={() => {
        if (hasExploded && !reducedMotion) {
          setHasLanded(true);
        }
      }}
      onMouseEnter={hoverEnabled ? onHoverStart : undefined}
      onMouseLeave={hoverEnabled ? onHoverEnd : undefined}
      className={`group absolute ${hoverEnabled ? 'pointer-events-auto' : 'pointer-events-none'} ${arcSizeClass} will-change-transform`}
      style={{
        zIndex: resolvedZIndex,
        aspectRatio: cardAspectRatio,
      }}
    >
      <div
        ref={revealRef}
        className='h-full w-full overflow-hidden rounded-xl will-change-[transform,clip-path]'
        style={
          reducedMotion
            ? undefined
            : {
                clipPath: STACK_CLIP_CLOSED,
                transform: 'scale(0)',
                transformOrigin: 'center center',
              }
        }
      >
        <div className='h-full w-full'>
          <motion.div
            animate={{ x: hasExploded ? scatter.x : 0, y: hasExploded ? scatter.y : 0 }}
            transition={arcTransition}
            className='h-full w-full'
          >
            <motion.div
              animate={
                hasLanded && !reducedMotion ? EXPLODE_SQUASH_KEYFRAMES : { scaleX: 1, scaleY: 1 }
              }
              transition={{ ...EXPLODE_SQUASH_TRANSITION, delay: index * 0.03 }}
              className='h-full w-full'
              style={{ transformOrigin: 'center center' }}
            >
              <motion.div
                animate={floatAnimate}
                transition={floatTransition}
                className='h-full w-full'
                style={{ transformOrigin: 'center center' }}
              >
                {cardLink}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
