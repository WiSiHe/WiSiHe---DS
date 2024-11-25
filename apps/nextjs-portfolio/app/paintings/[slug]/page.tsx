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
    // Metadata should never contain stega
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(painting?.image);

  return {
    title: painting?.title,
    description: painting?.seoDescription || painting?.description,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
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
