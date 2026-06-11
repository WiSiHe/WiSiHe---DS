import type { GetAllProjectsResult, HomeSectionCopyQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import ProjectsListingAnalytics from '@/app/components/analytics/ProjectsListingAnalytics';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllProjects, homeSectionCopyQuery } from '@/sanity/lib/queries';
import { portableTextToPlainText } from '@/sanity/lib/utils';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import ProjectCategories from '../components/projects/ProjectCategories/ProjectCategories';

const PROJECTS_CANONICAL = 'https://www.wisihe.no/projects';
const PROJECTS_TITLE_FALLBACK = 'Projects';
const PROJECTS_DESCRIPTION_FALLBACK =
  'A collection of creative and technical projects — design systems, web apps, games, and more.';
const PROJECTS_PAGE_INTRO_FALLBACK =
  'A mix of professional work, side projects, and experiments — filtered by tag.';
const PROJECTS_OG_IMAGE = {
  url: 'https://www.wisihe.no/images/hell.jpg',
  width: 1200,
  height: 630,
};

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: homeSectionCopyQuery,
    stega: false,
  });
  const home = data as HomeSectionCopyQueryResult | null;
  const title = home?.projectsTitle?.trim() || PROJECTS_TITLE_FALLBACK;
  const description =
    portableTextToPlainText(home?.projectsListingDescription, 160) || PROJECTS_DESCRIPTION_FALLBACK;

  return {
    title,
    description,
    alternates: { canonical: PROJECTS_CANONICAL },
    openGraph: {
      title,
      description,
      url: PROJECTS_CANONICAL,
      siteName: 'WiSiHe',
      locale: 'en_US',
      type: 'website',
      images: [PROJECTS_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [PROJECTS_OG_IMAGE.url],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function ProjectsPage() {
  const [{ data: projectsData }, { data: homeData }] = await Promise.all([
    sanityFetch({ query: getAllProjects }),
    sanityFetch({ query: homeSectionCopyQuery }),
  ]);
  const { ongoingProjects, pastProjects, tags } = (projectsData ?? {}) as GetAllProjectsResult;
  const home = homeData as HomeSectionCopyQueryResult | null;
  const pageTitle = home?.projectsTitle?.trim() || PROJECTS_TITLE_FALLBACK;
  const listingDescription = home?.projectsListingDescription;
  const hasCmsIntro = Boolean(portableTextToPlainText(listingDescription));

  return (
    <>
      <ProjectsListingAnalytics
        ongoingCount={ongoingProjects?.length ?? 0}
        pastCount={pastProjects?.length ?? 0}
        tagCount={tags?.length ?? 0}
        hasCmsIntro={hasCmsIntro}
      />
      <div className='flex items-start justify-start w-full h-full min-h-screen pt-32 mx-auto max-w-7xl'>
        <div className='w-full p-4'>
          <div className='pb-8'>
            <h1 className='font-semibold text-foreground text-3xl md:text-4xl mb-3'>{pageTitle}</h1>
            {hasCmsIntro && listingDescription ? (
              <div className='text-foreground-subtle text-base md:text-lg max-w-prose text-pretty leading-relaxed [&_p]:m-0'>
                <PortableText value={listingDescription as PortableTextBlock[]} />
              </div>
            ) : (
              <p className='text-foreground-subtle text-base md:text-lg max-w-prose text-pretty leading-relaxed'>
                {PROJECTS_PAGE_INTRO_FALLBACK}
              </p>
            )}
          </div>

          <ProjectCategories
            ongoingProjects={ongoingProjects ?? []}
            pastProjects={pastProjects ?? []}
            tags={tags ?? []}
          />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
