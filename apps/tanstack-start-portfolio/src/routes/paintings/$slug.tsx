import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundMessage } from '../../components/layout/PageHero';
import { PaintingDetailView } from '../../components/paintings/PaintingDetailView';
import { buildHead } from '../../lib/seo';
import { buildBreadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { buildPaintingStructuredData } from '../../lib/seo/structuredData';
import { getPainting, type PaintingDetailData } from '../../server/fns';

export const Route = createFileRoute('/paintings/$slug')({
  loader: async ({ params }) => {
    const painting = await getPainting({ data: { slug: params.slug } });
    if (!painting) throw notFound();
    return painting;
  },
  head: ({ loaderData, params }) => {
    const painting = loaderData as PaintingDetailData | undefined;
    const structuredData = painting
      ? buildPaintingStructuredData({
          slug: params.slug,
          title: painting.title,
          description: painting.description,
          imageUrl: painting.images[0]?.url,
          paintedAt: painting.paintedAt,
          tags: painting.tags,
        })
      : null;
    const breadcrumbData = buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Paintings', path: '/paintings' },
      { name: painting?.title || 'Painting', path: `/paintings/${params.slug}` },
    ]);

    return buildHead({
      title: `${painting?.title || 'Painting'} | WiSiHe`,
      description: painting?.description || `Painting by Henrik Sissener`,
      path: `/paintings/${params.slug}`,
      imageUrl: painting?.images[0]?.url,
      noIndex: painting?.isNSFW,
      type: 'article',
      jsonLd: structuredData ? [structuredData, breadcrumbData] : undefined,
    });
  },
  notFoundComponent: () => (
    <NotFoundMessage title='Painting not found' description='This painting does not exist.' />
  ),
  component: PaintingDetailPage,
});

function PaintingDetailPage() {
  const painting = Route.useLoaderData() as PaintingDetailData;
  return <PaintingDetailView painting={painting} />;
}
