import ProjectImage from '@/app/components/Project/ProjectImage';
import ProjectInformation from '@/app/components/Project/ProjectInformation';
import { ProjectQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { projectQuery, projectsSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { isNotEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
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
  props: Props
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { data: project } = await sanityFetch({
    query: projectQuery,
    params,
    stega: false,
  });

  if (!project) {
    return {};
  }

  // const fallbackDescription = 'Explore this project from WiSiHe.';
  // const title = project.seo.title;
  // const description = project?.description || fallbackDescription;

  // const parentMetadata = await parent;
  // const previousImages = parentMetadata.openGraph?.images || [];
  // const ogImage = resolveOpenGraphImage(project?.image);

  // // If no project image is available, fall back to a default image
  // const defaultOgImage = 'https://wisihe.no/images/hell.jpg';
  // const ogImages = ogImage
  //   ? [ogImage, ...previousImages]
  //   : [{ url: defaultOgImage }, ...previousImages];

  // const slug = params.slug;
  // const url = `https://wisihe.no/project/${slug}`;

  // return {
  //   title,
  //   description,
  //   alternates: {
  //     canonical: url,
  //   },
  //   openGraph: {
  //     title,
  //     description,
  //     url,
  //     siteName: 'WiSiHe',
  //     locale: 'en_US',
  //     type: 'article',
  //     images: ogImages,
  //   },
  //   twitter: {
  //     card: 'summary_large_image',
  //     title,
  //     description,
  //     images: ogImage ? [ogImage.url] : [defaultOgImage],
  //   },
  // } satisfies Metadata;

  const { seo, _id } = project;

  const { image } = seo;

  const metadata: Metadata = {
    title: project.seo.title,
    description: project.seo.description,
    alternates: {
      canonical: `https://wisihe.no/projects/${project.slug}`,
    },
  };

  if (image && isNotEmptyObject(image)) {
    const imageUrl = urlForImage(image)?.width(1200).height(630).url() || '';
    metadata.openGraph = {
      images: [
        {
          url: image ? imageUrl : `/api/og?id=${_id}`,
          width: 1200,
          height: 630,
        },
      ],
      title: project.seo.title || '',
      description: project.seo.description,
      type: 'article',
      locale: 'no_NO',
      siteName: 'WiSiHe',
    };
  }

  if (project.seo.noIndex) {
    metadata.robots = 'noindex';
  }

  return metadata;
}

export default async function ProjectPage(props: Props) {
  const params = await props.params;

  const [{ data: project }]: [{ data: ProjectQueryResult }] = await Promise.all(
    [sanityFetch({ query: projectQuery, params })]
  );

  if (!project?._id) {
    return notFound();
  }

  const { connectedVideo, connectedPaintings = [], extraImages = [] } = project;

  return (
    <div className="h-full min-h-screen p-4 bg-dark ">
      <section className="grid grid-cols-12 pt-16">
        <div className="relative flex flex-col gap-4 text-white col-span-full lg:col-span-8">
          <ProjectImage project={project} />

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
              {extraImages.map((extraImage) => {
                if (!extraImage) {
                  return null;
                }

                const imageUrl = urlForImage(extraImage)
                  ?.width(600)
                  .height(400);
                return (
                  <div key={extraImage._key} className="relative aspect-video">
                    <Image
                      src={imageUrl?.url() || ''}
                      alt="Default Alt Text"
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {connectedPaintings?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 px-4 lg:p-0 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center justify-center bg-primary">
                <h2 className="text-lg">Connected Paintings</h2>
              </div>
              {connectedPaintings.map((painting) => {
                const { image, slug, title } = painting;
                if (!image) {
                  return null;
                }
                return (
                  <Link
                    href={`/paintings/${slug}`}
                    key={title}
                    className="relative aspect-video"
                  >
                    <Image
                      src={
                        urlForImage(image)?.width(600).fit('max')?.url() || ''
                      }
                      alt={painting.title || 'Default Alt Text'}
                      fill
                      className="object-cover"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 prose col-span-full lg:col-span-4 prose-invert">
          <ProjectInformation project={project} />
        </div>
      </section>
    </div>
  );
}
