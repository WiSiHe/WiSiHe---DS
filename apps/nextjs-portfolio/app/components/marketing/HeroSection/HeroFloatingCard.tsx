'use client';

import { motion, type TargetAndTransition, type Transition } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ShowcaseItem } from '@/app/components/marketing/HeroSection/HeroSection';
import type { HeroCardPosition } from '@/app/components/marketing/HeroSection/heroArcLayout';
import {
  EXPLODE_SQUASH_KEYFRAMES,
  EXPLODE_SQUASH_TRANSITION,
} from '@/app/components/marketing/HeroSection/heroSquashStretch';

type FloatMotion = {
  y: [number, number, number];
  x: [number, number, number];
  rotate: [number, number, number];
  scaleX: [number, number, number];
  scaleY: [number, number, number];
  duration: number;
  delay: number;
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
  sizeClass: string;
  layout: 'arc' | 'mobile';
  stage: 'loading' | 'exploding' | 'floating';
  hasPlayedAlready: boolean;
  hoverEnabled: boolean;
  isCardHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  pos?: HeroCardPosition;
  scatter?: { x: number; y: number; rotate: number };
  parallax?: { x: number; y: number; rotateX: number; rotateY: number; zIndex: number };
  floatMotion?: FloatMotion;
  stackY?: string;
  stackScale?: number;
  stackRotation?: number;
  cardZIndex?: number;
  outerAnimate?: TargetAndTransition;
  outerTransition?: Transition;
  mobileRotation?: number;
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
  sizeClass,
  layout,
  stage,
  hasPlayedAlready,
  hoverEnabled,
  isCardHovered,
  onHoverStart,
  onHoverEnd,
  pos,
  scatter = { x: 0, y: 0, rotate: 0 },
  parallax = { x: 0, y: 0, rotateX: 0, rotateY: 0, zIndex: 1 },
  floatMotion = {
    y: [0, 12, 0],
    x: [0, 0, 0],
    rotate: [0, 0, 0],
    scaleX: [1, 1, 1],
    scaleY: [1, 1, 1],
    duration: 5,
    delay: 0,
  },
  stackY = '-50%',
  stackScale = 1,
  stackRotation = 0,
  cardZIndex = 1,
  outerAnimate,
  outerTransition,
  mobileRotation = 0,
}: HeroFloatingCardProps) {
  const isPainting = item._type === 'painting';

  const floatAnimate =
    layout === 'arc' && stage === 'floating' && !isCardHovered && hoverEnabled
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
    repeat: layout === 'arc' && stage === 'floating' ? Infinity : 0,
    ease: 'easeInOut' as const,
    delay: floatMotion.delay,
  };

  const cardLink = (
    <Link
      href={href}
      className={`relative isolate block h-full w-full overflow-hidden rounded-xl ring-1 transition-[box-shadow,ring-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-subtle ${
        isCardHovered && hoverEnabled
          ? 'shadow-[0_32px_56px_-14px_rgba(0,0,0,0.42)] ring-accent/35'
          : 'shadow-[0_18px_28px_-8px_rgba(0,0,0,0.28),0_8px_12px_-6px_rgba(0,0,0,0.18)] ring-black/10 dark:ring-white/10'
      }`}
    >
      <span className='sr-only'>
        {isPainting ? 'View painting' : 'View project'}: {displayTitle}
      </span>
      <Image
        src={imageUrl}
        alt=''
        aria-hidden
        fill
        priority={isPriority}
        fetchPriority={isPriority ? 'high' : undefined}
        className={`object-cover transition-[transform,filter] duration-500 ease-out ${
          isCardHovered && hoverEnabled
            ? 'scale-[1.06] brightness-[1.08] saturate-[1.06]'
            : 'scale-100 brightness-100 saturate-100'
        }`}
        sizes={layout === 'mobile' ? '40vw' : '(max-width: 768px) 40vw, 30vw'}
      />
      {showNsfwBlur ? (
        <div
          data-nsfw-blur
          className='pointer-events-none absolute inset-0 z-[1] bg-background/45 backdrop-blur-xl'
          aria-hidden
        />
      ) : null}
    </Link>
  );

  if (layout === 'mobile') {
    return (
      <motion.div
        initial={hasPlayedAlready ? false : { opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: mobileRotation }}
        transition={{ duration: 0.55, delay: 0.08 + index * 0.08, ease: 'easeOut' }}
        className={`${sizeClass} mx-auto will-change-transform`}
        style={{ aspectRatio: cardAspectRatio }}
      >
        {cardLink}
      </motion.div>
    );
  }

  const defaultOuterAnimate =
    outerAnimate ??
    (stage === 'loading'
      ? {
          left: '50%',
          top: '50%',
          x: '-50%',
          y: stackY,
          scale: stackScale,
          rotate: stackRotation,
          opacity: 1,
        }
      : {
          left: pos?.left ?? '50%',
          top: pos?.top ?? '50%',
          x: '-50%',
          y: '-50%',
          scale: pos?.scale ?? 1,
          rotate: (pos?.rotation ?? 0) + scatter.rotate,
          opacity: 1,
        });

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
      animate={defaultOuterAnimate}
      transition={outerTransition}
      onMouseEnter={hoverEnabled ? onHoverStart : undefined}
      onMouseLeave={hoverEnabled ? onHoverEnd : undefined}
      className={`absolute pointer-events-auto ${sizeClass} will-change-transform`}
      style={{
        transformStyle: 'preserve-3d',
        zIndex: cardZIndex,
        aspectRatio: cardAspectRatio,
      }}
    >
      <motion.div
        animate={stage === 'loading' ? { x: 0, y: 0 } : { x: scatter.x, y: scatter.y }}
        transition={outerTransition}
        className='h-full w-full'
        style={{ transformStyle: 'preserve-3d' }}
      >
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
          <motion.div
            animate={stage === 'exploding' ? EXPLODE_SQUASH_KEYFRAMES : { scaleX: 1, scaleY: 1 }}
            transition={{ ...EXPLODE_SQUASH_TRANSITION, delay: index * 0.03 }}
            className='h-full w-full'
            style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
          >
            <motion.div
              animate={floatAnimate}
              transition={floatTransition}
              className='h-full w-full'
              style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
              whileHover={
                hoverEnabled && stage === 'floating'
                  ? {
                      scale: 1.05,
                      y: -8,
                      rotate: 0,
                      transition: { type: 'spring', stiffness: 380, damping: 22 },
                    }
                  : undefined
              }
            >
              {cardLink}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
