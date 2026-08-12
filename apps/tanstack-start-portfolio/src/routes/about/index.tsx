import { createFileRoute, notFound } from '@tanstack/react-router';
import { ABOUT_PAGE_ENABLED } from '@wisihe/constants';
import { AboutPageClient } from '../../about/AboutPageClient';
import { normalizeTravelPhotos } from '../../about/components/lifeJourneyTypes';
import { NotFoundMessage } from '../../components/layout/PageHero';
import { buildHead } from '../../lib/seo';
import { buildAboutStructuredData } from '../../lib/seo/structuredData';
import { getAbout, getAboutTravelPhotography, imageUrl } from '../../server/fns';

export const Route = createFileRoute('/about/')({
  loader: async () => {
    if (!ABOUT_PAGE_ENABLED) throw notFound();
    const [about, travelPhotosRaw] = await Promise.all([getAbout(), getAboutTravelPhotography()]);
    return {
      about,
      travelPhotos: normalizeTravelPhotos(travelPhotosRaw),
    };
  },
  head: ({ loaderData }) =>
    buildHead({
      title:
        loaderData?.about?.seoTitle ||
        `About ${loaderData?.about?.heroSubtitle || 'Henrik Sissener'} | WiSiHe`,
      description: loaderData?.about?.seoDescription || loaderData?.about?.bio || undefined,
      path: '/about',
      imageUrl: imageUrl(loaderData?.about?.portrait, 1200, 630),
      type: 'profile',
      jsonLd: buildAboutStructuredData(loaderData?.about ?? null),
    }),
  notFoundComponent: () => <NotFoundMessage title='About page unavailable' />,
  component: AboutPage,
});

function AboutPage() {
  const { about, travelPhotos } = Route.useLoaderData();

  return <AboutPageClient about={about} travelPhotos={travelPhotos} />;
}
