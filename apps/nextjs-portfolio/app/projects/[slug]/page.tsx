import type { ProjectQueryResult } from '@wisihe/sanity-queries';
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

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({
      query: projectsSlugs,
      perspective: 'published',
      stega: false,
    });
    return data || [];
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
    const { image } = seo ?? {};

    const defaultOgImage = `/api/og?id=${_id}`;
    const imageUrl =
      image && isNotEmptyObject(image)
        ? urlForImage(image)?.width(1200).height(630).url()
        : defaultOgImage;

    const url = `https://www.wisihe.no/projects/${project.slug}`;

    const metadata: Metadata = {
      title: seo?.title || name,
      description: seo?.description || `Project: ${name}`,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: seo?.title || name,
        description: seo?.description || `Project: ${name}`,
        url,
        type: 'article',
        locale: 'no_NO',
        siteName: 'WiSiHe',
        images: [
          {
            url: imageUrl || defaultOgImage,
            width: 1200,
            height: 630,
            alt: seo?.title || name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo?.title || name,
        description: seo?.description || `Project: ${name}`,
        images: [imageUrl || defaultOgImage],
      },
    };

    if (seo?.noIndex) {
      metadata.robots = 'noindex';
    }

    return metadata;
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
      author: {
        '@type': 'Person',
        name: 'Henrik Sissener',
        url: 'https://www.wisihe.no',
      },
      creator: {
        '@type': 'Person',
        name: 'Henrik Sissener',
        url: 'https://www.wisihe.no',
      },
      ...(project.tags?.length
        ? { keywords: project.tags.map((t: { name: string }) => t.name).join(', ') }
        : {}),
    };

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.wisihe.no' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: 'https://www.wisihe.no/projects',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.name,
          item: `https://www.wisihe.no/projects/${project.slug}`,
        },
      ],
    };

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
