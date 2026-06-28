import type { ProjectQueryResult, ProjectsSlugsResult } from '@wisihe/sanity-queries';
import { isNotEmptyObject } from '@wisihe/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import Breadcrumbs from '@/app/components/layout/Breadcrumbs/Breadcrumbs';
import {
  ConnectedPage,
  ConnectedPaintingsCarousel,
  EmbeddedVideo,
  ProjectImage,
  ProjectInformation,
} from '@/app/components/projects/Project';
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

// Loading component for Suspense boundaries
function ProjectSectionSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='h-96 bg-surface-subtle rounded-xl border border-border/20' />
      <div className='space-y-3'>
        <div className='h-4 bg-surface-subtle rounded w-3/4' />
        <div className='h-4 bg-surface-subtle rounded w-1/2' />
        <div className='h-4 bg-surface-subtle rounded w-5/6' />
      </div>
    </div>
  );
}

type Props = {
  params: Promise<{ slug: string }>;
};

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

    const { seo, _id, name } = project;
    const defaultOgImage = `https://www.wisihe.no/api/og?id=${_id}`;
    const seoImage =
      seo?.image && isNotEmptyObject(seo.image)
        ? urlForImage(seo.image)?.width(1200).height(630).url()
        : undefined;

    const { title, description, noIndex } = resolveSeoCopy(seo, {
      title: name ?? 'Project',
      description: seo?.description?.trim() || `Project case study: ${name}`,
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
    const [{ data: _proj }] = await Promise.all([sanityFetch({ query: projectQuery, params })]);
    const project = _proj as ProjectQueryResult;

    if (!project?._id) {
      return notFound();
    }

    const { connectedVideo, connectedPaintings = [] } = project;

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
      name: project.name,
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
      { name: project.name ?? 'Project', path: `/projects/${project.slug}` },
    ]);

    return (
      <div className='min-h-screen pt-32'>
        <JsonLd data={structuredData} />
        <JsonLd data={breadcrumbData} />
        <div className='max-w-7xl mx-auto px-4 pt-4'>
          <Breadcrumbs
            crumbs={[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: project.name ?? 'Project' },
            ]}
          />
        </div>
        {/* Hero Section with Project Image */}
        <section className='relative py-8 lg:py-12'>
          <div className='max-w-7xl mx-auto px-4'>
            <Suspense fallback={<ProjectSectionSkeleton />}>
              <ProjectImage project={project} />
            </Suspense>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className='max-w-7xl mx-auto px-4 py-8 lg:py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
            {/* Project Information */}
            <section className='lg:col-span-6'>
              <Suspense fallback={<ProjectSectionSkeleton />}>
                <ProjectInformation project={project} />
              </Suspense>
            </section>

            {/* Connected Content */}
            <section className='lg:col-span-6 space-y-8'>
              <Suspense fallback={<ProjectSectionSkeleton />}>
                <ConnectedPaintingsCarousel paintings={connectedPaintings} />
              </Suspense>
              {connectedVideo?.videoUrl && (
                <Suspense fallback={<ProjectSectionSkeleton />}>
                  <div className='space-y-3'>
                    <h2 className='text-xl font-semibold font-serif text-foreground'>
                      Project Video
                    </h2>
                    <EmbeddedVideo videoUrl={connectedVideo.videoUrl} />
                  </div>
                </Suspense>
              )}
            </section>
          </div>
        </div>

        {/* Connected Page Section - Full Width */}
        <Suspense fallback={<ProjectSectionSkeleton />}>
          <ConnectedPage project={project} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return notFound();
  }
}
