'use client';

/**
 * Featured projects — scroll stack (ScrollStack + Lenis). Panel accents use `@wisihe/tokens` CSS variables.
 */

import { IconArrowRight } from '@tabler/icons-react';
import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import { useEffect, useState } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import type { HomeProjectsSection } from '@/lib/homePageBuilder';
import FeaturedProjectCard from './FeaturedProjectCard';

type FeaturedProjectsProps = {
  showcaseProjects?: HomeProjectsSection['showcaseProjects'];
  projectsDescription?: BlockContentMinimal | null;
};

const MAX_PROJECTS = 3;

const sectionEase = [0.22, 1, 0.36, 1] as const;

const introContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05,
    },
  },
};

const introEyebrowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: sectionEase },
  },
};

const introLineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.75, ease: sectionEase },
  },
};

const introTitleVariants = {
  hidden: { opacity: 0, y: 44, filter: 'blur(10px)', scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.8, ease: sectionEase },
  },
};

const introDescVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: sectionEase },
  },
};

const introGlowVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: 'easeOut' as const },
  },
};

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

const FeaturedProjects = ({ showcaseProjects, projectsDescription }: FeaturedProjectsProps) => {
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
      className='w-full bg-background relative overflow-hidden border-t border-border/10'
      aria-labelledby='featured-projects-heading'
      aria-describedby='featured-projects-desc'
    >
      {/* Glowing background grid effects */}
      <div className='absolute inset-x-0 top-0 h-[600px] bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0' />
      <motion.div
        className='absolute top-[200px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none select-none z-0'
        aria-hidden
        variants={reducedMotion ? undefined : introGlowVariants}
        initial={reducedMotion ? false : 'hidden'}
        whileInView={reducedMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-40px' }}
      />

      {/* Intro Block */}
      <div className='relative mx-auto max-w-7xl px-4 py-24 md:py-32 flex flex-col items-center text-center z-10'>
        <motion.div
          className='flex flex-col items-center'
          variants={reducedMotion ? undefined : introContainerVariants}
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.span
            variants={reducedMotion ? undefined : introEyebrowVariants}
            className='mb-4 font-mono text-[10px] md:text-xs tracking-[0.3em] text-accent uppercase font-bold select-none'
          >
            {'// Selected Works'}
          </motion.span>

          <motion.div
            variants={reducedMotion ? undefined : introLineVariants}
            className='mb-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-accent/60 to-transparent md:w-24'
            aria-hidden
          />

          <motion.h2
            id='featured-projects-heading'
            variants={reducedMotion ? undefined : introTitleVariants}
            className='mb-4 font-serif text-4xl font-extrabold leading-[1.1] text-foreground md:text-6xl lg:text-7xl xl:text-8xl tracking-tight bg-gradient-to-b from-foreground via-foreground to-foreground/45 bg-clip-text text-transparent'
          >
            Featured Projects
          </motion.h2>

          {projectsDescription?.length ? (
            <motion.div
              id='featured-projects-desc'
              variants={reducedMotion ? undefined : introDescVariants}
              className='text-base leading-relaxed text-foreground-subtle md:text-xl max-w-2xl font-light tracking-wide [&_p]:m-0'
            >
              <PortableText value={projectsDescription as PortableTextBlock[]} />
            </motion.div>
          ) : (
            <motion.p
              id='featured-projects-desc'
              variants={reducedMotion ? undefined : introDescVariants}
              className='text-base leading-relaxed text-foreground-subtle md:text-xl max-w-2xl font-light tracking-wide'
            >
              A curated gallery of engineering and design projects built with modern web
              technologies.
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Full-screen Projects List */}
      <div className='flex flex-col w-full'>
        {displayedProjects.map((project, index) => (
          <FeaturedProjectCard
            key={project._id}
            project={project}
            index={index}
            panelColor={stackPanelColor(index)}
          />
        ))}
      </div>

      {/* View all — open footer, matches section intro rhythm */}
      <div className='relative border-t border-border/10 px-4 py-24 md:py-32'>
        <motion.div
          className='pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[90px]'
          aria-hidden
          variants={reducedMotion ? undefined : introGlowVariants}
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-60px' }}
        />
        <motion.div
          className='relative mx-auto flex max-w-3xl flex-col items-center text-center'
          variants={reducedMotion ? undefined : introContainerVariants}
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.span
            variants={reducedMotion ? undefined : introEyebrowVariants}
            className='mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs'
          >
            {'// Full archive'}
          </motion.span>

          <motion.div
            variants={reducedMotion ? undefined : introLineVariants}
            className='mb-6 h-px w-12 origin-center bg-gradient-to-r from-transparent via-accent/50 to-transparent md:w-20'
            aria-hidden
          />

          <motion.h2
            variants={reducedMotion ? undefined : introTitleVariants}
            className='mb-5 font-serif text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl'
          >
            More to explore
          </motion.h2>

          <motion.p
            variants={reducedMotion ? undefined : introDescVariants}
            className='mb-8 max-w-lg text-base font-light leading-relaxed tracking-wide text-foreground-subtle md:text-lg'
          >
            Dozens of projects across engineering and design.
          </motion.p>

          <motion.div variants={reducedMotion ? undefined : introDescVariants}>
            <Link
              href='/projects'
              className='group inline-flex items-center gap-2.5 border-b-2 border-accent/35 pb-0.5 font-serif text-xl font-semibold text-foreground transition-[color,border-color,gap] duration-300 hover:border-accent hover:text-accent md:text-2xl'
              onClick={() =>
                trackEvent(AnalyticsEvent.EXPLORE_ALL_PROJECTS_CLICKED, { source: 'home_featured' })
              }
            >
              Explore all projects
              <IconArrowRight
                aria-hidden
                className='size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 md:size-6'
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
