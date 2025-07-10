import {
  ProjectImage,
  ProjectInformation,
  ConnectedPaintingsCarousel,
  EmbeddedVideo,
} from '@/app/components/Project';
import { ProjectQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { projectQuery, projectsSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { isNotEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Loading component for Suspense boundaries
function ProjectSectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-96 bg-surface rounded-xl" />
      <div className="space-y-3">
        <div className="h-4 bg-surface rounded w-3/4" />
        <div className="h-4 bg-surface rounded w-1/2" />
        <div className="h-4 bg-surface rounded w-5/6" />
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
    const { data: project } = await sanityFetch({
      query: projectQuery,
      params,
      stega: false,
    });

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

    const url = `https://wisihe.no/projects/${project.slug}`;

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
    const [{ data: project }]: [{ data: ProjectQueryResult }] = await Promise.all([
      sanityFetch({ query: projectQuery, params }),
    ]);

    if (!project?._id) {
      return notFound();
    }

    const { connectedVideo, connectedPaintings = [] } = project;

    return (
      <div className="min-h-screen bg-background pt-32">
        {/* Hero Section with Project Image */}
        <section className="relative py-8 lg:py-12">
          <div className="max-w-screen-2xl mx-auto px-4">
            <Suspense fallback={<ProjectSectionSkeleton />}>
              <ProjectImage project={project} />
            </Suspense>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-screen-2xl mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Project Information */}
            <section className="lg:col-span-6">
              <Suspense fallback={<ProjectSectionSkeleton />}>
                <ProjectInformation project={project} />
              </Suspense>
            </section>

            {/* Connected Content */}
            <section className="lg:col-span-6 space-y-8">
              <Suspense fallback={<ProjectSectionSkeleton />}>
                <ConnectedPaintingsCarousel paintings={connectedPaintings} />
              </Suspense>
            </section>
          </div>
        </div>

        {/* Video Section */}
        {connectedVideo?.videoUrl && (
          <Suspense fallback={<ProjectSectionSkeleton />}>
            <EmbeddedVideo videoUrl={connectedVideo.videoUrl} />
          </Suspense>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return notFound();
  }
}
