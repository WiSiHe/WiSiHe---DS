import type { PhotographyQueryResult, PhotographySlugsResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { PhotographyDetailView } from '@/app/components/photography/PhotographyDetailView';
import { buildBreadcrumbJsonLd, buildPersonReference } from '@/lib/seo/jsonLd';
import { buildContentMetadata, truncateMetaDescription } from '@/lib/seo/metadata';
import { sanityFetch } from '@/sanity/lib/live';
import { photographyQuery, photographySlugs } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data } = await sanityFetch({
    query: photographySlugs,
    perspective: 'published',
    stega: false,
  });
  return ((data as PhotographySlugsResult) ?? [])
    .filter((item): item is typeof item & { slug: string } => !!item.slug)
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data } = await sanityFetch({
    query: photographyQuery,
    params,
    stega: false,
  });
  const photo = data as PhotographyQueryResult;

  if (!photo?.title) {
    return { title: 'Photo not found' };
  }

  const placeLabel = [photo.place?.name, photo.place?.countryName].filter(Boolean).join(', ');
  const fallbackDescription =
    truncateMetaDescription(photo.caption ?? '', 300) ||
    (placeLabel ? `Photograph from ${placeLabel}` : `Photograph: ${photo.title}`);

  return buildContentMetadata({
    title: photo.title,
    description: fallbackDescription,
    path: `/photography/${params.slug}`,
    fallbackImage: photo.image,
    imageAlt: photo.image?.alt ?? photo.title,
    openGraphType: 'article',
    keywords: photo.tagsV2?.map(tag => tag.name).filter(Boolean) as string[] | undefined,
  });
}

export default async function PhotographyDetailPage(props: Props) {
  const params = await props.params;
  const { data } = await sanityFetch({ query: photographyQuery, params });
  const photo = data as PhotographyQueryResult;

  if (!photo?._id || !photo.slug) {
    return notFound();
  }

  const pageUrl = `https://www.wisihe.no/photography/${photo.slug}`;
  const description =
    truncateMetaDescription(photo.caption ?? '', 300) || `Photograph: ${photo.title}`;

  const place = photo.place;
  const image = photo.image;
  const contentUrl = image ? resolveOpenGraphImage(image as any)?.url : undefined;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': pageUrl,
    url: pageUrl,
    name: photo.title,
    description,
    ...(image?.alt ? { alternateName: image.alt } : {}),
    ...(contentUrl ? { contentUrl, thumbnailUrl: contentUrl } : {}),
    ...(image?.width && image?.height
      ? { width: { '@type': 'QuantitativeValue', value: image.width, unitCode: 'PX' } }
      : {}),
    ...(image?.width && image?.height
      ? { height: { '@type': 'QuantitativeValue', value: image.height, unitCode: 'PX' } }
      : {}),
    ...(photo.capturedAt ? { dateCreated: photo.capturedAt } : {}),
    creator: buildPersonReference(),
    copyrightNotice: 'Henrik Sissener',
    creditText: 'Henrik Sissener',
    representativeOfPage: { '@type': 'WebPage', '@id': pageUrl },
    ...(place?.name
      ? {
          contentLocation: {
            '@type': 'Place',
            name: [place.name, place.countryName].filter(Boolean).join(', '),
          },
        }
      : {}),
  };

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Photography', path: '/photography' },
    { name: photo.title ?? 'Photo', path: `/photography/${photo.slug}` },
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />
      <PhotographyDetailView photo={photo} />
    </>
  );
}
