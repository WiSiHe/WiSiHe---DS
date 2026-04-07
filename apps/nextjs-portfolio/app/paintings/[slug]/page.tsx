import type { PaintingQueryResult } from '@wisihe/sanity-queries';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import PaintingDetail from '@/app/components/paintings/PaintingDetails/PaintingsDetails';
import { sanityFetch } from '@/sanity/lib/live';
import { paintingQuery, paintingsSlugs } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';

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

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;

  const { data: painting } = await sanityFetch({
    query: paintingQuery,
    params,
    stega: false,
  });

  const title = painting?.title || 'Untitled Painting';
  const description = painting?.seoDescription || painting?.description || 'View this painting.';
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

  const [{ data: painting }]: [{ data: PaintingQueryResult }] = await Promise.all([
    sanityFetch({ query: paintingQuery, params }),
  ]);

  if (!painting?._id) {
    return notFound();
  }

  // Create structured data for the painting
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `https://www.wisihe.no/paintings/${params.slug}`,
    name: painting.title,
    description:
      painting.description || painting.seoDescription || `Digital painting: ${painting.title}`,
    contentUrl: painting.image ? resolveOpenGraphImage(painting.image)?.url : undefined,
    creator: {
      '@type': 'Person',
      name: 'Henrik Sissener',
      url: 'https://www.wisihe.no',
    },
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    acquireLicensePage: 'https://www.wisihe.no/contact',
    copyrightNotice: 'Henrik Sissener',
    creditText: 'Henrik Sissener',
    ...(painting.tagsV2 &&
      painting.tagsV2.length > 0 && {
        keywords: painting.tagsV2.map((tag: { name: string }) => tag.name).join(', '),
      }),
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <PaintingDetail paintingData={painting} />
    </>
  );
}
