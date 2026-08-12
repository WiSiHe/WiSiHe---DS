import { createFileRoute, redirect } from '@tanstack/react-router';
import { useMemo } from 'react';
import { NotFoundMessage } from '../../components/layout/PageHero';
import { ThreeDWorkshopClient } from '../../components/three-d/ThreeDWorkshopClient';
import { WORKSHOP_SLUG } from '../../lib/presentations/constants';
import { transformPresentationSlides } from '../../lib/presentations/transformPresentationSlides';
import { buildHead } from '../../lib/seo';
import { presentationSlides as fallbackSlides } from '../../lib/three-d/presentationSlides';
import { getPresentation, getPreviewStatus, imageUrl } from '../../server/fns';

export const Route = createFileRoute('/three-d/')({
  loader: async () => {
    const [presentation, previewStatus] = await Promise.all([
      getPresentation({ data: { slug: WORKSHOP_SLUG } }),
      getPreviewStatus(),
    ]);

    if (!presentation?._id) {
      throw redirect({ to: '/presentations' });
    }

    return { presentation, includeDrafts: previewStatus.enabled };
  },
  head: ({ loaderData }) =>
    buildHead({
      title:
        loaderData?.presentation?.seo?.title ||
        loaderData?.presentation?.title ||
        '3D Workshop | WiSiHe',
      description:
        loaderData?.presentation?.seo?.description ||
        loaderData?.presentation?.description ||
        'Interactive 3D workshop presentation with Three.js and React Three Fiber.',
      path: '/three-d',
      imageUrl: imageUrl(loaderData?.presentation?.seo?.image, 1200, 630),
      noIndex: Boolean(loaderData?.presentation?.seo?.noIndex || loaderData?.presentation?.noIndex),
    }),
  notFoundComponent: () => <NotFoundMessage title='3D workshop not found' />,
  component: ThreeDPage,
});

function ThreeDPage() {
  const { presentation, includeDrafts } = Route.useLoaderData();

  const slides = useMemo(() => {
    const transformed = transformPresentationSlides(presentation.slides, { includeDrafts });
    if (transformed?.length) return transformed;
    return fallbackSlides;
  }, [presentation.slides, includeDrafts]);

  return (
    <ThreeDWorkshopClient
      slides={slides}
      tldr={presentation.tldr}
      tldrPosition={presentation.tldrPosition}
    />
  );
}
