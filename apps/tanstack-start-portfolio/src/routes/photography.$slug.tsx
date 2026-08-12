import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundMessage } from '../components/layout/PageHero';
import { PhotographyDetailView } from '../components/photography/PhotographyDetailView';
import { buildHead } from '../lib/seo';
import { buildBreadcrumbJsonLd } from '../lib/seo/jsonLd';
import { buildPhotographyStructuredData } from '../lib/seo/structuredData';
import { getPhotography, imageUrl } from '../server/fns';

export const Route = createFileRoute('/photography/$slug')({
  loader: async ({ params }) => {
    const photo = await getPhotography({ data: { slug: params.slug } });
    if (!photo?._id || !photo.slug) throw notFound();
    return photo;
  },
  head: ({ loaderData }) => {
    const placeLabel = [loaderData?.place?.name, loaderData?.place?.countryName]
      .filter(Boolean)
      .join(', ');
    const structuredData = loaderData
      ? buildPhotographyStructuredData({
          slug: loaderData.slug,
          title: loaderData.title || 'Photograph',
          description:
            loaderData.caption || (placeLabel ? `Photograph from ${placeLabel}` : undefined),
          imageUrl: imageUrl(loaderData.image, 1200, 630),
          width: loaderData.image?.width,
          height: loaderData.image?.height,
          capturedAt: loaderData.capturedAt,
          placeName: placeLabel || null,
        })
      : null;
    const breadcrumbData = buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Photography', path: '/photography' },
      { name: loaderData?.title || 'Photo', path: `/photography/${loaderData?.slug}` },
    ]);

    return buildHead({
      title: `${loaderData?.title || 'Photograph'} | WiSiHe`,
      description: loaderData?.caption || placeLabel || 'Photograph by Henrik Sissener',
      path: `/photography/${loaderData?.slug}`,
      imageUrl: imageUrl(loaderData?.image, 1200, 630),
      type: 'article',
      jsonLd: structuredData ? [structuredData, breadcrumbData] : undefined,
    });
  },
  notFoundComponent: () => (
    <NotFoundMessage title='Photograph not found' description='This photo does not exist.' />
  ),
  component: PhotographyDetailPage,
});

function PhotographyDetailPage() {
  const photo = Route.useLoaderData();
  return <PhotographyDetailView photo={photo} />;
}
