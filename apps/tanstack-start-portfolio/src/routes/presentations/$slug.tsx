import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { useMemo } from 'react';
import { NotFoundMessage } from '../../components/layout/PageHero';
import { PresentationSlideDeck } from '../../components/presentations/PresentationSlideDeck';
import { WORKSHOP_SLUG } from '../../lib/presentations/constants';
import { transformPresentationSlides } from '../../lib/presentations/transformPresentationSlides';
import { buildHead } from '../../lib/seo';
import { getPresentation, getPreviewStatus, imageUrl } from '../../server/fns';

export const Route = createFileRoute('/presentations/$slug')({
  loader: async ({ params }) => {
    if (params.slug === WORKSHOP_SLUG) {
      throw redirect({ to: '/three-d' });
    }

    const [presentation, previewStatus] = await Promise.all([
      getPresentation({ data: { slug: params.slug } }),
      getPreviewStatus(),
    ]);

    if (!presentation?._id || !presentation.slug) throw notFound();
    return { presentation, includeDrafts: previewStatus.enabled };
  },
  head: ({ loaderData }) =>
    buildHead({
      title:
        loaderData?.presentation?.seo?.title || loaderData?.presentation?.title || 'Presentation',
      description:
        loaderData?.presentation?.seo?.description ||
        loaderData?.presentation?.description ||
        'Presentation by Henrik Sissener',
      path: `/presentations/${loaderData?.presentation?.slug}`,
      imageUrl: imageUrl(loaderData?.presentation?.seo?.image, 1200, 630),
      noIndex: Boolean(loaderData?.presentation?.seo?.noIndex || loaderData?.presentation?.noIndex),
    }),
  notFoundComponent: () => (
    <NotFoundMessage
      title='Presentation not found'
      description='This presentation does not exist.'
    />
  ),
  component: PresentationDetail,
});

function PresentationDetail() {
  const { presentation, includeDrafts } = Route.useLoaderData();

  const slides = useMemo(
    () => transformPresentationSlides(presentation.slides, { includeDrafts }),
    [presentation.slides, includeDrafts],
  );

  return (
    <PresentationSlideDeck
      slides={slides}
      tldr={presentation.tldr}
      tldrPosition={presentation.tldrPosition}
    />
  );
}
