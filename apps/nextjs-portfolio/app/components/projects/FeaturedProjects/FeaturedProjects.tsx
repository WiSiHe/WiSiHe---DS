'use client';

/**
 * Featured projects — scroll-stacked cards (React Bits Scroll Stack pattern).
 */

import { IconArrowRight, IconFolder } from '@tabler/icons-react';
import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import HomeSectionHeader from '@/app/components/marketing/HomeSectionHeader/HomeSectionHeader';
import ScrollStack, { ScrollStackItem } from '@/app/components/ui/ScrollStack/ScrollStack';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import type { HomeProjectsSection } from '@/lib/homePageBuilder';
import FeaturedProjectStackCard from './FeaturedProjectStackCard';

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
  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  const displayedProjects = showcaseProjects.slice(0, MAX_PROJECTS);
  const descriptionContent = projectsDescription?.length ? (
    <PortableText value={projectsDescription as PortableTextBlock[]} />
  ) : (
    FALLBACK_DESCRIPTION
  );

  return (
    <section
      className='border-t border-border/20 bg-background'
      aria-labelledby='featured-projects-heading'
      aria-describedby='featured-projects-desc'
    >
      <div className='mx-auto max-w-7xl px-4 pt-16 pb-4 md:px-8 md:pt-24 md:pb-6'>
        <div className='flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10'>
          <div className='lg:col-span-7'>
            <HomeSectionHeader
              align='left'
              eyebrow={INTRO_EYEBROW}
              title={INTRO_TITLE}
              headingId='featured-projects-heading'
              descriptionId='featured-projects-desc'
              description={descriptionContent}
            />
          </div>

          <div className='flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end'>
            <p className='inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle md:text-[11px]'>
              <IconFolder className='size-3.5 text-accent' aria-hidden />
              {displayedProjects.length} featured
            </p>
            <Button
              as={Link}
              href='/projects'
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
        <div className='mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <p className='max-w-md text-sm leading-relaxed text-foreground-subtle md:text-base'>
            More engineering and design work in the full archive.
          </p>
          <Link
            href='/projects'
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
    </section>
  );
};

export default FeaturedProjects;
