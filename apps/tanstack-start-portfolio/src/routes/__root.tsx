import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { CustomCursor } from '@wisihe/ui-react';
import { AnimatePresence, motion } from 'motion/react';
import { PostHogProvider } from '../components/analytics/PostHogProvider';
import { DraftModeBanner } from '../components/cms/DraftModeBanner';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { ListScrollPreserver } from '../components/layout/ListScrollPreserver';
import { NotFoundMessage } from '../components/layout/PageHero';
import { RootDocument } from '../components/layout/RootDocument';
import { ScrollToTopOnNavigate } from '../components/layout/ScrollToTopOnNavigate';
import SmoothScroll from '../components/layout/SmoothScroll';
import { PresentationMode } from '../components/presentations/PresentationMode';
import { shouldUsePresentationScrollMode } from '../lib/lenis-registry';
import { pageVariants } from '../lib/motion';
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

function RootComponent() {
  const { pathname } = useLocation();
  const footerData = Route.useLoaderData();
  const immersiveDeck = shouldUsePresentationScrollMode(pathname);

  return (
    <RootDocument>
      <PostHogProvider>
        <CustomCursor />
        <PresentationMode />
        <SmoothScroll />
        <ListScrollPreserver />
        <ScrollToTopOnNavigate />
        <Header />
        <DraftModeBanner enabled={Boolean(footerData.previewEnabled)} />
        <main id='main-content' className='min-h-screen'>
          {immersiveDeck ? (
            <Outlet />
          ) : (
            <AnimatePresence mode='wait'>
              <motion.div
                key={pathname}
                variants={pageVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          )}
        </main>
        <Footer data={footerData} />
      </PostHogProvider>
    </RootDocument>
  );
}
