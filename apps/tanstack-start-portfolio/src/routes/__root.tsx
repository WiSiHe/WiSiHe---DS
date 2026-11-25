import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { CustomCursor } from '@wisihe/ui-react';
import { AskTheArtistChat } from '../components/chat/AskTheArtistChat';
import { DraftModeBanner } from '../components/cms/DraftModeBanner';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { ListScrollPreserver } from '../components/layout/ListScrollPreserver';
import { MotionLayoutGroup } from '../components/layout/MotionLayoutGroup';
import { NavigationProgress } from '../components/layout/NavigationProgress';
import { NotFoundMessage } from '../components/layout/PageHero';
import { PageTransition } from '../components/layout/PageTransition';
import { RootDocument } from '../components/layout/RootDocument';
import { ScrollToTopOnNavigate } from '../components/layout/ScrollToTopOnNavigate';
import { SkipToContentLink } from '../components/layout/SkipToContentLink';
import SmoothScroll from '../components/layout/SmoothScroll';
import { PresentationMode } from '../components/presentations/PresentationMode';
import { shouldUsePresentationScrollMode } from '../lib/lenis-registry';
import { buildHead } from '../lib/seo';
import { buildRootStructuredDataGraph } from '../lib/seo/structuredData';
import { getFooterData } from '../server/fns';
import '../index.css';

export const Route = createRootRoute({
  loader: () => getFooterData(),
  head: () =>
    buildHead({
      jsonLd: buildRootStructuredDataGraph(),
    }),
  notFoundComponent: () => <NotFoundMessage />,
  component: RootComponent,
});

export function RootComponent() {
  const { pathname } = useLocation();
  const footerData = Route.useLoaderData();
  const immersiveDeck = shouldUsePresentationScrollMode(pathname);

  return (
    <RootDocument>
      <SkipToContentLink />
      <CustomCursor />
      <PresentationMode />
      <SmoothScroll />
      <ListScrollPreserver />
      <ScrollToTopOnNavigate />
      <NavigationProgress />
      <Header />
      <DraftModeBanner enabled={Boolean(footerData.previewEnabled)} />
      <MotionLayoutGroup>
        <main id='main-content' tabIndex={-1} className='min-h-screen focus:outline-none'>
          {immersiveDeck ? (
            <Outlet />
          ) : (
            <PageTransition>
              <Outlet />
            </PageTransition>
          )}
        </main>
      </MotionLayoutGroup>
      <Footer data={footerData} />
      <AskTheArtistChat />
    </RootDocument>
  );
}
