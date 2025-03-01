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
    notFound();
  }

  const { seo, _id } = project;
  const { image } = seo ?? {};

  const defaultOgImage = `/api/og?id=${_id}`;
  const imageUrl =
    image && isNotEmptyObject(image)
      ? urlForImage(image)?.width(1200).height(630).url()
      : defaultOgImage;

  const url = `https://wisihe.no/projects/${project.slug}`;

  const metadata: Metadata = {
    title: project.seo.title,
    description: project.seo.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: project.seo.title || '',
      description: project.seo.description,
      url,
      type: 'article',
      locale: 'no_NO',
      siteName: 'WiSiHe',
      images: [
        {
          url: imageUrl || defaultOgImage,
          width: 1200,
          height: 630,
          alt: project.seo.title || 'Project Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.seo.title || '',
      description: project.seo.description,
      images: [imageUrl || defaultOgImage],
    },
  };

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
    <>
      <div className="grid items-start h-full min-h-screen grid-cols-12 mx-auto max-w-(--breakpoint-2xl)  gap-8 p-4 py-20 text-white bg-dark">
        <section className="relative flex flex-col gap-6 text-white col-span-full">
          <ProjectImage project={project} />
        </section>
        <section className="col-span-full lg:col-span-6 max-w-prose">
          <ProjectInformation project={project} />
        </section>
        <section className="flex flex-col gap-6 col-span-full lg:col-span-6">
          {isNotEmptyArray(connectedPaintings) && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="col-span-full ">
                <h2 className="text-2xl font-bold">Connected Paintings</h2>
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
                    className="relative aspect-square"
                  >
                    <Image
                      src={
                        urlForImage(image)?.width(400).fit('max')?.url() || ''
                      }
                      alt={painting.title || 'Default Alt Text'}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover rounded-xl"
                    />
                  </Link>
                );
              })}
            </div>
          )}
          {isNotEmptyArray(extraImages) && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="col-span-full">
                <h2 className="text-2xl font-bold">Extra Images</h2>
              </div>
              {extraImages.map((extraImage) => {
                if (!extraImage) {
                  return null;
                }

                return (
                  <div
                    key={extraImage._key}
                    className="relative rounded-xl aspect-square"
                  >
                    <Image
                      src={
                        urlForImage(extraImage)?.width(400).fit('max')?.url() ||
                        ''
                      }
                      alt="Default Alt Text"
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
      {connectedVideo && (
        <section className="relative py-8 lg:py-20 bg-[#111] ring ">
          <div className="max-w-screen-lg mx-auto aspect-video">
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
        </section>
      )}
    </>
  );
}
