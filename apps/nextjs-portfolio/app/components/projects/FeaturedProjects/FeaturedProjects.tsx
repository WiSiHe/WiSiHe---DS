'use client';

/**
 * Featured projects — full-bleed scroll panels with a compact section intro.
 */

import { IconArrowRight } from '@tabler/icons-react';
import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import HomeSectionHeader from '@/app/components/marketing/HomeSectionHeader/HomeSectionHeader';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import type { HomeProjectsSection } from '@/lib/homePageBuilder';
import FeaturedProjectCard from './FeaturedProjectCard';

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
      className='relative w-full overflow-hidden border-t border-border/10 bg-background'
      aria-labelledby='featured-projects-heading'
      aria-describedby='featured-projects-desc'
    >
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,#000_20%,transparent_100%)]'
        aria-hidden
      />

      <div className='relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20'>
        <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
          <HomeSectionHeader
            align='left'
            eyebrow={INTRO_EYEBROW}
            title={INTRO_TITLE}
            headingId='featured-projects-heading'
            descriptionId='featured-projects-desc'
            description={descriptionContent}
          />

          <div className='flex shrink-0 flex-col items-start md:items-end'>
            <Button
              as={Link}
              href='/projects'
              variant='secondary'
              size='medium'
              Icon={IconArrowRight}
              iconPosition='right'
              className='rounded-full'
              onClick={() =>
                trackEvent(AnalyticsEvent.EXPLORE_ALL_PROJECTS_CLICKED, { source: 'home_featured' })
              }
            >
              Explore all projects
            </Button>
          </div>
        </div>
      </div>

      <div className='relative z-10 flex w-full flex-col'>
        {displayedProjects.map((project, index) => (
          <FeaturedProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>

      <div className='relative z-10 border-t border-border/10 px-4 py-12 md:px-8 md:py-14'>
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
