'use client';

/**
 * Featured projects — scroll-stacked cards (React Bits Scroll Stack pattern).
 */

import { useGSAP } from '@gsap/react';
import { IconArrowRight, IconFolder } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import { Button, ScrollGrowSection, SectionHeader } from '@wisihe/ui-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import ScrollStack, { ScrollStackItem } from '@/components/effects/ScrollStack/ScrollStack';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import type { HomeProjectsSection } from '@/lib/homePageBuilder';
import { portableTextToPlainText } from '@/lib/portableText';
import FeaturedProjectStackCard from './FeaturedProjectStackCard';

gsap.registerPlugin(ScrollTrigger);

/** Reveal recipe (animaxxing scroll-effects): items rise in batches as they cross this line. */
const REVEAL_START = 'top 85%';

type FeaturedProjectsProps = {
  showcaseProjects?: HomeProjectsSection['showcaseProjects'];
  projectsDescription?: BlockContentMinimal | null;
};

const MAX_PROJECTS = 3;

const INTRO_EYEBROW = '// Selected works';
const INTRO_TITLE = 'Featured projects';
const FALLBACK_DESCRIPTION =
  'Selected client work and side projects — design systems, shops, campaign sites, and games.';

const FeaturedProjects = ({ showcaseProjects, projectsDescription }: FeaturedProjectsProps) => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasProjects = Boolean(showcaseProjects?.length);

  useGSAP(
    () => {
      if (!hasProjects) return;
      const mm = gsap.matchMedia();

      // Reading progress reports state, so it also runs under reduced motion.
      mm.add(
        {
          full: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        context => {
          const bar = progressRef.current;
          if (!bar || !scopeRef.current) return;
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              transformOrigin: '0% 50%',
              scrollTrigger: {
                trigger: scopeRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: context.conditions?.reduced ? true : 0.3,
              },
            },
          );
        },
      );

      mm.add('(prefers-reduced-motion: no-preference)', context => {
        // Opacity only, so waiting items stay in the accessibility tree and tab order.
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scopeRef.current);
        gsap.set(items, { opacity: 0, y: 16 });
        // Registered on the context so a mid-flight revert (reduced motion switched on) kills the tween.
        if (!context.add) return;
        const reveal = context.add('reveal', (batch: Element[]) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.09,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(batch, { clearProps: 'transform,opacity' });
            },
          }),
        ) as (batch: Element[]) => void;
        // Reveal from any direction (reload below the section, then scroll up) and when already past.
        ScrollTrigger.batch(items, {
          start: REVEAL_START,
          onEnter: reveal,
          onEnterBack: reveal,
          onLeave: reveal,
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef, dependencies: [hasProjects] },
  );

  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  const displayedProjects = showcaseProjects.slice(0, MAX_PROJECTS);
  const descriptionContent = projectsDescription?.length
    ? portableTextToPlainText(projectsDescription)
    : FALLBACK_DESCRIPTION;

  return (
    <ScrollGrowSection
      className='border-t border-border/20 bg-background'
      aria-labelledby='featured-projects-heading'
      aria-describedby='featured-projects-desc'
    >
      <div ref={scopeRef}>
        <div
          ref={progressRef}
          aria-hidden
          style={{ transform: 'scaleX(0)' }}
          className='pointer-events-none sticky top-0 z-20 h-0.5 w-full origin-left bg-accent'
        />
        <div className='mx-auto max-w-7xl px-4 pt-16 pb-4 md:px-8 md:pt-24 md:pb-6'>
          <div className='flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10'>
            <div data-reveal className='lg:col-span-7'>
              <SectionHeader
                align='left'
                eyebrow={INTRO_EYEBROW}
                title={INTRO_TITLE}
                headingId='featured-projects-heading'
                descriptionId='featured-projects-desc'
                description={descriptionContent}
              />
            </div>

            <div
              data-reveal
              className='flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end'
            >
              <p className='inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle md:text-[11px]'>
                <IconFolder className='size-3.5 text-accent' aria-hidden />
                {displayedProjects.length} featured
              </p>
              <Button
                as={Link}
                to='/projects'
                variant='secondary'
                size='medium'
                Icon={IconArrowRight}
                iconPosition='right'
                className='rounded-full'
                onClick={() =>
                  trackEvent(AnalyticsEvent.EXPLORE_ALL_PROJECTS_CLICKED, {
                    source: 'home_featured',
                  })
                }
              >
                Explore all projects
              </Button>
            </div>
          </div>
        </div>

        <ScrollStack
          className='mx-auto max-w-5xl px-4 md:px-6'
          itemDistance={100}
          itemStackDistance={28}
          stackPosition='18%'
          baseScale={0.88}
          itemScale={0.025}
        >
          {displayedProjects.map((project, index) => (
            <ScrollStackItem key={project._id} index={index}>
              <FeaturedProjectStackCard project={project} index={index} />
            </ScrollStackItem>
          ))}
        </ScrollStack>

        <div className='border-t border-border/20 px-4 py-12 md:px-8 md:py-14'>
          <div
            data-reveal
            className='mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'
          >
            <p className='max-w-md text-sm leading-relaxed text-foreground-subtle md:text-base'>
              More engineering and design work in the full archive.
            </p>
            <Link
              to='/projects'
              className='group inline-flex items-center gap-2 font-serif text-lg font-semibold text-foreground transition-[color,gap] duration-300 hover:text-accent md:text-xl'
              onClick={() =>
                trackEvent(AnalyticsEvent.EXPLORE_ALL_PROJECTS_CLICKED, {
                  source: 'home_featured_footer',
                })
              }
            >
              View all projects
              <IconArrowRight
                aria-hidden
                className='size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1'
              />
            </Link>
          </div>
        </div>
      </div>
    </ScrollGrowSection>
  );
};

export default FeaturedProjects;
