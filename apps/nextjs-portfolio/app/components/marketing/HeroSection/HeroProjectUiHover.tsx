'use client';

import { motion, type Variants } from 'motion/react';

type HeroProjectUiHoverProps = {
  accentColor: string;
  title?: string | null;
  tags?: string[] | null;
  isHovered?: boolean;
};

const fadeVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

const overlayVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
  },
};

export function HeroProjectUiHover({
  accentColor,
  title,
  tags,
  isHovered = false,
}: HeroProjectUiHoverProps) {
  const visibleTags = (tags ?? []).filter(Boolean).slice(0, 3);
  const motionState = isHovered ? 'hover' : 'initial';

  return (
    <>
      <motion.div
        data-hero-vignette
        variants={fadeVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-0 z-[5]'
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.45) 100%)`,
        }}
        aria-hidden
      />

      <motion.div
        variants={fadeVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-0 z-[6] rounded-[inherit]'
        style={{ boxShadow: `inset 0 0 0 1px ${accentColor}66` }}
        aria-hidden
      />

      <motion.div
        data-hero-overlay
        variants={overlayVariants}
        animate={motionState}
        initial='initial'
        className='pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-2.5'
      >
        {visibleTags.length > 0 ? (
          <div className='flex flex-wrap gap-1' data-hero-tags>
            {visibleTags.map(tag => (
              <span
                key={tag}
                className='rounded-sm border border-white/15 bg-black/55 px-1.5 py-0.5 font-mono text-[8px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md sm:text-[9px]'
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}

        {title ? (
          <div data-hero-title className='mt-auto text-left'>
            <p
              className='line-clamp-2 font-sans text-base font-semibold leading-tight tracking-tight text-white sm:text-lg'
              style={{ textShadow: `0 2px 14px rgba(0,0,0,0.9), 0 0 24px ${accentColor}44` }}
            >
              {title}
            </p>
          </div>
        ) : null}
      </motion.div>
    </>
  );
}
