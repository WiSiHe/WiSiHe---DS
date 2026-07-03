'use client';

import { cn } from '@wisihe/utils';
import { motion, type Variants } from 'motion/react';
import type { CSSProperties } from 'react';

type HeroProjectUiHoverProps = {
  accentColor: string;
  title?: string | null;
  client?: string | null;
  tags?: string[] | null;
  isHovered?: boolean;
};

const OVERLAY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const scrimVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3, ease: OVERLAY_EASE } },
};

const bandVariants: Variants = {
  initial: { opacity: 0, scaleY: 0.35 },
  hover: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.42, ease: OVERLAY_EASE, delay: 0.04 },
  },
};

const ringVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

const contentRootVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.07 },
  },
};

const contentItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: OVERLAY_EASE },
  },
};

export function HeroProjectUiHover({
  accentColor,
  title,
  client,
  tags,
  isHovered = false,
}: HeroProjectUiHoverProps) {
  const visibleTags = (tags ?? []).filter(Boolean).slice(0, 3);
  const motionState = isHovered ? 'hover' : 'initial';
  const displayTitle = title?.trim() || 'Project';
  const displayClient = client?.trim() || null;

  return (
    <>
      <motion.div
        data-hero-vignette
        variants={scrimVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-0 z-[5] bg-black/20'
        aria-hidden
      />

      <motion.div
        variants={bandVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[58%] origin-bottom rounded-[inherit]'
        style={{
          background: `linear-gradient(to top, color-mix(in srgb, ${accentColor} 28%, black) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.08) 100%)`,
        }}
        aria-hidden
      />

      <motion.div
        variants={ringVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-0 z-[7] rounded-[inherit]'
        style={{ boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accentColor} 55%, white)` }}
        aria-hidden
      />

      <motion.div
        data-hero-overlay
        variants={contentRootVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-3.5'
      >
        <div className='flex max-w-full flex-col items-center justify-center text-center'>
          <motion.span
            variants={contentItemVariants}
            data-hero-label
            className='mb-1.5 inline-flex items-center rounded-full border border-white/20 bg-black/45 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm sm:text-[9px]'
          >
            Project
          </motion.span>

          {displayClient ? (
            <motion.p
              variants={contentItemVariants}
              data-hero-client
              className='mb-1 line-clamp-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-white/70 sm:text-[10px]'
            >
              {displayClient}
            </motion.p>
          ) : null}

          {displayTitle ? (
            <motion.p
              variants={contentItemVariants}
              data-hero-title
              className={cn(
                'line-clamp-3 font-serif text-base font-medium italic leading-snug text-white sm:text-lg',
                '[@supports(color:contrast-color(red))]:text-[contrast-color(var(--hero-project-accent))]',
              )}
              style={{ '--hero-project-accent': accentColor } as CSSProperties}
            >
              {displayTitle}
            </motion.p>
          ) : null}

          {visibleTags.length > 0 ? (
            <motion.div
              variants={contentItemVariants}
              data-hero-tags
              className='mt-2.5 flex max-w-full flex-wrap items-center justify-center gap-1'
            >
              {visibleTags.map(tag => (
                <span
                  key={tag}
                  className='rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-sans text-[8px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm sm:text-[9px]'
                  style={{
                    borderColor: `color-mix(in srgb, ${accentColor} 35%, white)`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
}
