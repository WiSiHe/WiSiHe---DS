import Chip from '@/app/components/Chip/Chip';
import CustomPortableText from '@/app/components/PortableText/PortableText';
import { ProjectQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { projectQuery, projectsSlugs } from '@/sanity/lib/queries';
import { resolveOpenGraphImage, urlForImage } from '@/sanity/lib/utils';
import { Metadata, ResolvingMetadata } from 'next';
import { PortableTextBlock } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: projectsSlugs,
    perspective: 'published',
    stega: false,
  });
  return data;
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { data: project } = await sanityFetch({
    query: projectQuery,
    params,
    stega: false,
  });

  const fallbackTitle = 'Untitled Project | WiSiHe';
  const fallbackDescription = 'Explore this project from WiSiHe.';
  const title = project?.title || fallbackTitle;
  const description = project?.description || fallbackDescription;

  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(project?.image);

  // If no project image is available, fall back to a default image
  const defaultOgImage = 'https://wisihe.no/images/hell.jpg';
  const ogImages = ogImage
    ? [ogImage, ...previousImages]
    : [{ url: defaultOgImage }, ...previousImages];

  const slug = params.slug;
  const url = `https://wisihe.no/project/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'WiSiHe',
      locale: 'en_US',
      type: 'article',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage.url] : [defaultOgImage],
    },
  } satisfies Metadata;
}

export default async function ProjectPage(props: Props) {
  const params = await props.params;

  const [{ data: project }]: [{ data: ProjectQueryResult }] = await Promise.all(
    [sanityFetch({ query: projectQuery, params })]
  );

  if (!project?._id) {
    return notFound();
  }

  const {
    title,
    image,
    tags,
    status,
    projectEnd,
    projectStart,
    connectedVideo,
    connectedPaintings = [],
    extraImages = [],
    connectedPage,
  } = project;

  const projectContent = project.content as PortableTextBlock[];

  return (
    <div className="h-full min-h-screen lg:p-4 bg-dark">
      <section className="grid grid-cols-12 pt-16">
        <div className="relative flex flex-col gap-4 text-white col-span-full lg:col-span-8">
          <div className="relative rounded-xl aspect-video overflow-clip">
            {image && (
              <Image
                src={urlForImage(image)?.width(1200)?.height(800)?.url() || ''}
                alt={title || 'Default Alt Text'}
                fill
                className="object-cover"
              />
            )}

            {connectedPage && (
              <iframe
                src={connectedPage}
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>

          {connectedVideo && (
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${new URL(
                  connectedVideo.videoUrl
                ).pathname.slice(1)}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Connected Video"
              />
            </div>
          )}

          {extraImages?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 px-4 lg:p-0 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center justify-center bg-primary">
                <h2 className="text-lg">Extra Images</h2>
              </div>
              {extraImages.map((extraImage) => (
                <div key={extraImage._key} className="relative aspect-video">
                  <Image
                    src={
                      urlForImage(extraImage)?.width(600)?.height(400)?.url() ||
                      ''
                    }
                    alt="Default Alt Text"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {connectedPaintings?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 px-4 lg:p-0 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center justify-center bg-primary">
                <h2 className="text-lg">Connected Paintings</h2>
              </div>
              {connectedPaintings.map((painting) => (
                <Link
                  href={`/paintings/${painting.slug}`}
                  key={painting.title}
                  className="relative aspect-video"
                >
                  <Image
                    src={
                      urlForImage(painting.image)
                        ?.width(600)
                        ?.height(400)
                        ?.url() || ''
                    }
                    alt={painting.title || 'Default Alt Text'}
                    fill
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 prose col-span-full lg:col-span-4 prose-invert">
          <h1>{title}</h1>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Chip key={tag.name} label={tag.name} />
            ))}
            <Chip label={`Status: ${status}`} />
            <Chip label={`Started: ${projectStart}`} />
            <Chip label={`Ended: ${projectEnd}`} />
          </div>
          {projectContent && (
            <CustomPortableText
              value={projectContent}
              className="prose-invert"
            />
          )}
        </div>
      </section>
    </div>
  );
}
