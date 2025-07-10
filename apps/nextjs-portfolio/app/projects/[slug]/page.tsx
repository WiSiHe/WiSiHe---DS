import ProjectImage from '@/app/components/Project/ProjectImage';
import ProjectInformation from '@/app/components/Project/ProjectInformation';
import { ProjectQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { projectQuery, projectsSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { isNotEmptyArray, isNotEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Utility function for extracting YouTube video ID with better error handling
function getYouTubeVideoId(url: string): string | null {
  try {
    const videoUrl = new URL(url);

    // Handle youtu.be format
    if (videoUrl.hostname === 'youtu.be') {
      return videoUrl.pathname.slice(1);
    }

    // Handle youtube.com formats including shorts
    if (videoUrl.hostname.includes('youtube.com')) {
      if (videoUrl.pathname.includes('/shorts/')) {
        return videoUrl.pathname.split('/shorts/')[1];
      }
      const videoId = videoUrl.searchParams.get('v');
      if (videoId) return videoId;
    }

    return null;
  } catch (error) {
    console.error('Invalid YouTube URL:', url, error);
    return null;
  }
}

// Component for connected paintings grid
function ConnectedPaintingsGrid({
  paintings,
}: {
  paintings: NonNullable<ProjectQueryResult>['connectedPaintings'];
}) {
  if (!isNotEmptyArray(paintings)) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Connected Paintings</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {paintings.map(painting => {
          const { image, slug, title } = painting;
          if (!image || !slug) return null;

          return (
            <Link
              href={`/paintings/${slug}`}
              key={`${slug}-${title}`}
              className="relative aspect-square group transition-transform hover:scale-105"
            >
              <Image
                src={urlForImage(image)?.width(400).fit('max')?.url() || ''}
                alt={title || 'Connected painting'}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover rounded-xl transition-opacity group-hover:opacity-90"
                loading="lazy"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Component for embedded video
function EmbeddedVideo({ videoUrl }: { videoUrl: string }) {
  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <section className="relative py-8 lg:py-20 bg-surface ring">
        <div className="max-w-screen-lg mx-auto aspect-video flex items-center justify-center">
          <p className="text-text-secondary">Invalid video URL</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 lg:py-20 bg-surface ring">
      <div className="max-w-screen-lg mx-auto aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Project video"
          loading="lazy"
        />
      </div>
    </section>
  );
}

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
      <div className="min-h-screen bg-background">
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
                <ConnectedPaintingsGrid paintings={connectedPaintings} />
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
