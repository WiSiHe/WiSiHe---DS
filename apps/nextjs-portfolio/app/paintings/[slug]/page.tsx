import type { PaintingQueryResult, PaintingsSlugsResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import PaintingDetail from '@/app/components/paintings/PaintingDetails/PaintingsDetails';
import { buildBreadcrumbJsonLd, buildPersonReference } from '@/lib/seo/jsonLd';
import { buildContentMetadata, resolveSeoCopy, truncateMetaDescription } from '@/lib/seo/metadata';
import { sanityFetch } from '@/sanity/lib/live';
import { paintingQuery, paintingsSlugs } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data } = await sanityFetch({
    query: paintingsSlugs,
    perspective: 'published',
    stega: false,
  });
  return ((data as PaintingsSlugsResult) ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { data: _paintingData } = await sanityFetch({
    query: paintingQuery,
    params,
    stega: false,
  });
  const painting = _paintingData as PaintingQueryResult;

  if (!painting?.title) {
    return { title: 'Painting not found' };
  }

  const fallbackDescription =
    truncateMetaDescription(painting.description ?? '', 300) ||
    `Digital painting: ${painting.title}`;

  const { title, description, noIndex } = resolveSeoCopy(painting.seo, {
    title: painting.title,
    description: fallbackDescription,
  });

  return buildContentMetadata({
    title,
    description,
    path: `/paintings/${params.slug}`,
    seoImage: painting.seo?.image,
    fallbackImage: painting.image,
    imageAlt: painting.image?.altText ?? painting.title,
    noIndex,
    openGraphType: 'article',
    keywords: painting.tagsV2?.map(tag => tag.name).filter(Boolean) as string[] | undefined,
  });
}

export default async function PaintingPage(props: Props) {
  const params = await props.params;

  const [{ data: _painting }] = await Promise.all([sanityFetch({ query: paintingQuery, params })]);
  const painting = _painting as PaintingQueryResult;

  if (!painting?._id) {
    return notFound();
  }

  const pageUrl = `https://www.wisihe.no/paintings/${params.slug}`;
  const description =
    painting.seo?.description?.trim() ||
    painting.description ||
    painting.seoDescription ||
    `Digital painting: ${painting.title}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': pageUrl,
    name: painting.seo?.title?.trim() || painting.title,
    description: truncateMetaDescription(description, 300),
    contentUrl: painting.image ? resolveOpenGraphImage(painting.image)?.url : undefined,
    ...(painting.paintedAt ? { dateCreated: painting.paintedAt } : {}),
    creator: buildPersonReference(),
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    acquireLicensePage: 'https://www.wisihe.no/contact',
    copyrightNotice: 'Henrik Sissener',
    creditText: 'Henrik Sissener',
    ...(painting.tagsV2?.length
      ? {
          keywords: painting.tagsV2
            .map(tag => tag.name ?? '')
            .filter(Boolean)
            .join(', '),
        }
      : {}),
  };

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Paintings', path: '/paintings' },
    { name: painting.title ?? 'Painting', path: `/paintings/${params.slug}` },
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />
      <PaintingDetail
        paintingData={painting}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Paintings', href: '/paintings' },
          { label: painting.title ?? 'Painting' },
        ]}
      />
    </>
  );
}
