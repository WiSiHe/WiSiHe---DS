import PaintingDetail from '@/app/components/PaintingDetails/PaintingsDetails';
import { PaintingQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { paintingQuery, paintingsSlugs } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: paintingsSlugs,
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

  const { data: painting } = await sanityFetch({
    query: paintingQuery,
    params,
    stega: false,
  });

  const title = painting?.title || 'Untitled Painting';
  const description =
    painting?.seoDescription || painting?.description || 'View this painting.';
  const ogImage = resolveOpenGraphImage(painting?.image);
  const previousImages = (await parent).openGraph?.images || [];
  const url = `https://www.wisihe.no/paintings/${params.slug}`;

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
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  } satisfies Metadata;
}

export default async function PaintingPage(props: Props) {
  const params = await props.params;

  const [{ data: painting }]: [{ data: PaintingQueryResult }] =
    await Promise.all([sanityFetch({ query: paintingQuery, params })]);

  if (!painting?._id) {
    return notFound();
  }

  return <PaintingDetail paintingData={painting} />;
}
