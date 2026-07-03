import type { ProjectQueryResult, ProjectsSlugsResult } from '@wisihe/sanity-queries';
import { cn, isNotEmptyObject } from '@wisihe/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { Suspense } from 'react';
import { preload } from 'react-dom';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import Breadcrumbs from '@/app/components/layout/Breadcrumbs/Breadcrumbs';
import {
  hasProjectRelatedContent,
  ProjectCaseStudy,
  ProjectImage,
  ProjectInformation,
  ProjectRelatedContent,
} from '@/app/components/projects/Project';
import {
  getProjectDisplayTitle,
  getProjectSeoFallbackTitle,
} from '@/app/components/projects/projectCardHelpers';
import { resolveProjectContent } from '@/lib/projects/resolveProjectContent';
import { buildBreadcrumbJsonLd, buildPersonReference } from '@/lib/seo/jsonLd';
import { buildContentMetadata, resolveSeoCopy } from '@/lib/seo/metadata';
import { sanityFetch } from '@/sanity/lib/live';
import { projectQuery, projectsSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';

const PROJECT_TYPE_SCHEMA: Record<string, string> = {
  development: 'WebApplication',
  gameDevelopment: 'VideoGame',
  design: 'CreativeWork',
  other: 'CreativeWork',
};

function ProjectSectionSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='h-96 rounded-3xl border border-border/20 bg-surface-subtle' />
      <div className='space-y-3'>
        <div className='h-4 w-3/4 rounded bg-surface-subtle' />
        <div className='h-4 w-1/2 rounded bg-surface-subtle' />
        <div className='h-4 w-5/6 rounded bg-surface-subtle' />
      </div>
    </div>
  );
}

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const { data } = await sanityFetch({
      query: projectsSlugs,
      perspective: 'published',
      stega: false,
    });
    return ((data as ProjectsSlugsResult) ?? [])
      .filter((item): item is typeof item & { slug: string } => !!item.slug)
      .map(({ slug }) => ({ slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const { data: _projectData } = await sanityFetch({
      query: projectQuery,
      params,
      stega: false,
    });
    const project = _projectData as ProjectQueryResult;

    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
      };
    }

    const { seo, _id, name, client } = project;
    const defaultOgImage = `https://www.wisihe.no/api/og?id=${_id}`;
    const seoImage =
      seo?.image && isNotEmptyObject(seo.image)
        ? urlForImage(seo.image)?.width(1200).height(630).url()
        : undefined;

    const displayTitle = getProjectDisplayTitle({ name, client });
    const { title, description, noIndex } = resolveSeoCopy(seo, {
      title: getProjectSeoFallbackTitle({ name, client }),
      description: seo?.description?.trim() || `Project case study: ${displayTitle}`,
    });

    return buildContentMetadata({
      title,
      description,
      path: `/projects/${project.slug}`,
      seoImage: seo?.image,
      fallbackImage: project.image,
      imageAlt: title,
      imageUrlOverride: seoImage ?? defaultOgImage,
      noIndex,
      openGraphType: 'article',
      keywords: project.tags?.map(t => t.name).filter(Boolean) as string[] | undefined,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Project',
      description: 'Project page',
    };
  }
}

export default async function ProjectPage(props: Props) {
  const params = await props.params;

  try {
    const { data: _proj } = await sanityFetch({ query: projectQuery, params });
    const project = _proj as ProjectQueryResult;

    if (!project?._id) {
      return notFound();
    }

    const { connectedVideo, connectedPaintings = [] } = project;
    const connectedVideoUrl = connectedVideo?.videoUrl ?? null;
    const { sidebarSummary, caseStudyBody } = resolveProjectContent(
      project.summary as PortableTextBlock[] | null | undefined,
      project.content as PortableTextBlock[] | null | undefined,
    );

    const displayTitle = getProjectDisplayTitle({ name: project.name, client: project.client });

    if (project.image?.asset?._ref) {
      const lcpUrl = urlForImage(project.image)?.width(1200).fit('max')?.url();
      if (lcpUrl) {
        preload(lcpUrl, { as: 'image', fetchPriority: 'high' });
      }
    }

    const showRelated = hasProjectRelatedContent(project, connectedPaintings, connectedVideoUrl);
    const hasHeroImages =
      Boolean(project.image?.asset?._ref) ||
      (project.extraImages?.some(img => img?.asset?._ref) ?? false);

    const projectUrl = `https://www.wisihe.no/projects/${project.slug}`;
    const imageUrl = project.image
      ? urlForImage(project.image)?.width(1200).height(630).url()
      : null;
    const schemaType = project.projectType
      ? (PROJECT_TYPE_SCHEMA[project.projectType] ?? 'CreativeWork')
      : 'CreativeWork';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: displayTitle,
      description: project.seo?.description || '',
      url: projectUrl,
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(project.projectStart ? { dateCreated: project.projectStart } : {}),
      ...(project.projectEnd ? { datePublished: project.projectEnd } : {}),
      author: buildPersonReference(),
      creator: buildPersonReference(),
      ...(project.tags?.length
        ? { keywords: project.tags.map((t: { name: string }) => t.name).join(', ') }
        : {}),
    };

    const breadcrumbData = buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: displayTitle, path: `/projects/${project.slug}` },
    ]);

    return (
      <div className='min-h-screen pt-28 md:pt-32'>
        <JsonLd data={structuredData} />
        <JsonLd data={breadcrumbData} />

        <div className='mx-auto max-w-7xl px-4'>
          <div className='pt-4 pb-2'>
            <Breadcrumbs
              crumbs={[
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: displayTitle },
              ]}
            />
          </div>

          {hasHeroImages ? (
            <section className='py-4 md:py-6'>
              <ProjectImage project={project} />
            </section>
          ) : null}
        </div>

        <section className='border-t border-border/60 bg-surface-subtle/25'>
          <div className='mx-auto max-w-7xl px-4 py-10 lg:py-14'>
            <div
              className={cn(
                'grid gap-8 lg:gap-12',
                showRelated ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]' : 'grid-cols-1',
              )}
            >
              <Suspense fallback={<ProjectSectionSkeleton />}>
                <ProjectInformation project={project} summary={sidebarSummary} />
              </Suspense>

              {showRelated ? (
                <div className='lg:sticky lg:top-28 lg:self-start'>
                  <Suspense fallback={<ProjectSectionSkeleton />}>
                    <ProjectRelatedContent
                      project={project}
                      connectedPaintings={connectedPaintings}
                      connectedVideoUrl={connectedVideoUrl}
                    />
                  </Suspense>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {caseStudyBody && caseStudyBody.length > 0 ? (
          <Suspense fallback={<ProjectSectionSkeleton />}>
            <ProjectCaseStudy content={caseStudyBody} />
          </Suspense>
        ) : null}
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return notFound();
  }
}
