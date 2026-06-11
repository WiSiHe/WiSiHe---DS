'use client';

/**
 * Featured projects — scroll stack (ScrollStack + Lenis). Panel accents use `@wisihe/tokens` CSS variables.
 */

import { IconArrowRight } from '@tabler/icons-react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import { useEffect, useState } from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'];
  projectsDescription?: NonNullable<HomePageQueryResult>['projectsDescription'];
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
      <div className='absolute top-[200px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none select-none z-0' />

      {/* Intro Block */}
      <div className='relative mx-auto max-w-7xl px-4 py-24 md:py-32 flex flex-col items-center text-center z-10'>
        <motion.div
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
          className='flex flex-col items-center'
        >
          {/* Eyebrow */}
          <span className='mb-4 font-mono text-[10px] md:text-xs tracking-[0.3em] text-accent uppercase font-bold select-none'>
            {'// Selected Works'}
          </span>

          {/* Section Title */}
          <h2
            id='featured-projects-heading'
            className='mb-4 font-serif text-4xl font-extrabold leading-[1.1] text-foreground md:text-6xl lg:text-7xl xl:text-8xl tracking-tight bg-gradient-to-b from-foreground via-foreground to-foreground/45 bg-clip-text text-transparent'
          >
            Featured Projects
          </h2>

          {projectsDescription?.length ? (
            <div
              id='featured-projects-desc'
              className='text-base leading-relaxed text-foreground-subtle md:text-xl max-w-2xl font-light tracking-wide [&_p]:m-0'
            >
              <PortableText value={projectsDescription as PortableTextBlock[]} />
            </div>
          ) : (
            <p
              id='featured-projects-desc'
              className='text-base leading-relaxed text-foreground-subtle md:text-xl max-w-2xl font-light tracking-wide'
            >
              A curated gallery of engineering and design projects built with modern web
              technologies.
            </p>
          )}

          {/* Flow Indicator Line */}
          <div className='mt-12 w-[1px] h-16 bg-gradient-to-b from-accent/50 to-transparent relative overflow-hidden'>
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className='absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-accent to-transparent'
            />
          </div>
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

      {/* View All Projects CTA */}
      <div className='flex min-h-[50vh] items-center justify-center py-24 px-4 border-t border-border/10'>
        <div className='text-center'>
          <h2 className='mb-6 font-serif text-3xl md:text-5xl font-bold text-foreground'>
            More to explore
          </h2>
          <p className='mb-10 text-base md:text-lg text-foreground-subtle max-w-lg mx-auto'>
            I've worked on dozens of projects across engineering and design. Take a look at the full
            archive.
          </p>
          <Button
            as={Link}
            href='/projects'
            variant='primary'
            size='large'
            Icon={IconArrowRight}
            iconPosition='right'
            className='gap-2 rounded-full px-8 py-4 md:gap-3 md:px-10 md:py-5'
          >
            Explore all projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
