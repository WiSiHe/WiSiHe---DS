'use client';

/**
 * Featured projects — scroll stack (ScrollStack + Lenis). Panel accents use `@wisihe/tokens` CSS variables.
 */

import { IconArrowRight } from '@tabler/icons-react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import FeaturedProjectCard from './FeaturedProjectCard';
import ScrollStack from './ScrollStack';

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

const MAX_PROJECTS = 3;

/** Vertical strip on each card — cycles through brand + accent primitives from the design system */
const STACK_PANEL_COLORS = [
  'var(--color-brand-1-600)',
  'var(--color-brand-2-500)',
  'var(--color-neon-orange-500)',
  'var(--color-brand-3-600)',
] as const;

function stackPanelColor(index: number): string {
  return STACK_PANEL_COLORS[index % STACK_PANEL_COLORS.length] ?? STACK_PANEL_COLORS[0];
}

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const prefersReducedMotion = useReducedMotion();
  /** SSR + first client paint must match; `useReducedMotion()` is null on the server but can be true on the client. */
  const reducedMotion = mounted && prefersReducedMotion;

  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  const displayedProjects = showcaseProjects.slice(0, MAX_PROJECTS);

  return (
    <section
      className='mx-auto max-w-7xl bg-background px-4 py-4 md:py-8'
      aria-labelledby='featured-projects-heading'
      aria-describedby='featured-projects-desc'
    >
      <motion.div
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-140px' }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
        className='relative max-w-prose pb-4'
      >
        <h2
          id='featured-projects-heading'
          className='mb-1.5 font-serif text-4xl font-bold leading-[1.05] text-foreground md:text-5xl lg:text-6xl xl:text-7xl'
        >
          Featured
          <br />
          Projects
        </h2>
        <p
          id='featured-projects-desc'
          className='max-w-prose text-base leading-snug text-foreground-subtle md:text-lg pb-4'
        >
          A few things I&apos;ve worked on.
        </p>
      </motion.div>

      <ScrollStack
        useWindowScroll
        useLenis={true}
        itemDistance={100}
        itemScale={0.03}
        itemStackDistance={30}
        stackPosition='20%'
        scaleEndPosition='10%'
        baseScale={0.85}
        blurAmount={0}
      >
        {displayedProjects.map((project, index) => (
          <FeaturedProjectCard
            key={project._id}
            project={project}
            index={index}
            panelColor={stackPanelColor(index)}
          />
        ))}
      </ScrollStack>

      <div className='flex items-center justify-center px-4 pt-40'>
        <div className='text-center'>
          <p className='mb-8 text-lg text-foreground-subtle'>Want to see more of my work?</p>
          <Link
            href='/projects'
            className='group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-contrast transition-colors hover:bg-accent-hover md:gap-3 md:px-10 md:py-5 md:text-lg'
          >
            Explore all projects
            <IconArrowRight
              aria-hidden
              className='h-5 w-5 transition-transform group-hover:translate-x-0.5 md:h-6 md:w-6'
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
