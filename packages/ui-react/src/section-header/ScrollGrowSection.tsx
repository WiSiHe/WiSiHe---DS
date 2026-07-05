'use client';

import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import { type ComponentPropsWithoutRef, type ReactNode, useEffect, useState } from 'react';
import {
  headerStaggerContainerVariants,
  MOTION_EASE_OUT,
  MOTION_REVEAL_Y,
  SECTION_REVEAL_VIEWPORT,
  sectionRevealTransition,
  staggerFadeUpItemVariants,
} from '../motion/motionTokens';

type ScrollGrowSectionProps = {
  children: ReactNode;
  className?: string;
} & Pick<ComponentPropsWithoutRef<'section'>, 'aria-labelledby' | 'aria-describedby' | 'id'>;

/**
 * Section entrance — one-shot fade + rise on first scroll into view.
 * Avoids scroll-linked scale/opacity (expensive with Lenis + heavy section trees).
 */
export function ScrollGrowSection({ children, className, ...rest }: ScrollGrowSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const reducedMotion = mounted && Boolean(prefersReducedMotion);
  const transition = sectionRevealTransition(reducedMotion);

  return (
    <motion.section
      initial={reducedMotion ? false : { y: MOTION_REVEAL_Y + 8 }}
      whileInView={{ y: 0 }}
      viewport={SECTION_REVEAL_VIEWPORT}
      transition={{ ...transition, duration: 0.65, ease: MOTION_EASE_OUT }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

export type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  headingId?: string;
  descriptionId?: string;
  align?: 'center' | 'left';
  /** Compact display title for teaser sections (videos, shop). */
  variant?: 'default' | 'display';
  /** When false, renders static markup without scroll-triggered motion. */
  animated?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  headingId,
  descriptionId,
  align = 'center',
  variant = 'default',
  animated = true,
}: SectionHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const reducedMotion = mounted && Boolean(prefersReducedMotion);
  const useMotion = animated && !reducedMotion;
  const containerVariants = headerStaggerContainerVariants(reducedMotion);
  const itemVariants = staggerFadeUpItemVariants(reducedMotion);
  const isCenter = align === 'center';

  const rootClassName = isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl';
  const eyebrowClassName =
    'mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs';
  const titleClassName = cn(
    'font-serif font-extrabold tracking-tight text-foreground',
    variant === 'display'
      ? 'max-w-xl text-[clamp(2rem,8vw,3.75rem)] leading-[0.95]'
      : 'text-3xl md:text-5xl lg:text-6xl',
  );
  const descriptionClassName =
    'mt-4 text-base leading-relaxed text-foreground-subtle md:text-lg text-pretty';

  if (!useMotion) {
    return (
      <div className={rootClassName}>
        <span className={eyebrowClassName}>{eyebrow}</span>
        <h2 id={headingId} className={titleClassName}>
          {title}
        </h2>
        {description ? (
          typeof description === 'string' ? (
            <p id={descriptionId} className={descriptionClassName}>
              {description}
            </p>
          ) : (
            <div id={descriptionId} className={cn(descriptionClassName, '[&_p]:m-0')}>
              {description}
            </div>
          )
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={SECTION_REVEAL_VIEWPORT}
      variants={containerVariants}
      className={rootClassName}
    >
      <motion.span variants={itemVariants} className={eyebrowClassName}>
        {eyebrow}
      </motion.span>
      <motion.h2 variants={itemVariants} id={headingId} className={titleClassName}>
        {title}
      </motion.h2>
      {description ? (
        typeof description === 'string' ? (
          <motion.p variants={itemVariants} id={descriptionId} className={descriptionClassName}>
            {description}
          </motion.p>
        ) : (
          <motion.div
            variants={itemVariants}
            id={descriptionId}
            className={cn(descriptionClassName, '[&_p]:m-0')}
          >
            {description}
          </motion.div>
        )
      ) : null}
    </motion.div>
  );
}
