import { ThemeProvider } from '@teispace/next-themes';
import { getTheme } from '@teispace/next-themes/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AboutQueryResult, SettingsQueryResult } from '@wisihe/sanity-queries';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { ProgressBar, ProgressBarProvider } from 'react-transition-progress';
import HeaderNavigation from '@/app/components/layout/HeaderNavigation';
import { MotionLayoutGroup } from '@/app/components/layout/MotionLayoutGroup';
import {
  HOME_DESCRIPTION_FALLBACK,
  JSON_LD_KNOWS_ABOUT,
  JSON_LD_PERSON_DESCRIPTION,
} from '@/lib/siteCopy';
import { SanityLive, sanityFetch } from '@/sanity/lib/live';
import { aboutQuery, settingsQuery } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';
import { handleError } from './client-utils';
import DraftModeToast from './components/cms/DraftModeToast';
import AppToaster from './components/layout/AppToaster/AppToaster';
import Footer from './components/layout/Footer/Footer';
import './globals.css';
import type React from 'react';
import { JsonLd } from './components/cms/JsonLd/JsonLd';
import { ReactScanDev } from './components/dev/ReactScanDev';
import CustomCursor from './components/layout/CustomCursor';
import { ScrollToTopOnNavigate } from './components/layout/ScrollToTopOnNavigate';
import SmoothScroll from './components/layout/SmoothScroll';
import { PresentationMode } from './components/presentations/PresentationMode';
import { PostHogProvider } from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: 'oklch(65% 0.15 180)', // Using --color-accent from globals.css
  colorScheme: 'dark light',
};

export async function generateMetadata(): Promise<Metadata> {
  const { data: _settingsData } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const settings = _settingsData as SettingsQueryResult;

  if (!settings) {
    return {
      title: {
        template: '%s',
        default: 'WiSiHe',
      },
      description: HOME_DESCRIPTION_FALLBACK,
    };
  }

  const { title = '', description, keywords } = settings;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description,
    keywords: keywords,
    authors: [{ name: 'Henrik Sissener' }],
    creator: 'Henrik Sissener',
    publisher: 'WiSiHe',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://www.wisihe.no'),
    alternates: {
      canonical: 'https://www.wisihe.no',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: title,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@wisihe',
      site: '@wisihe',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    referrer: 'strict-origin-when-cross-origin',
    other: {
      'msapplication-TileColor': 'oklch(65% 0.15 180)',
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Henrik Sissener',
  jobTitle: 'Senior Frontend Developer & Digital Artist',
  description: JSON_LD_PERSON_DESCRIPTION,
  url: 'https://www.wisihe.no',
  sameAs: [
    'https://github.com/wisihe',
    'https://www.linkedin.com/in/henrik-sissener/',
    'https://twitter.com/wisihe',
    'https://www.instagram.com/wisihe/',
    'https://www.youtube.com/@wisihe',
  ],
  knowsAbout: [...JSON_LD_KNOWS_ABOUT],
};

const jsonLdSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WiSiHe | Portfolio',
  description: HOME_DESCRIPTION_FALLBACK,
  url: 'https://www.wisihe.no',
};

/** Single graph avoids multiple <script> siblings in <head> (less fragile vs extensions reordering). */
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [jsonLd, jsonLdSite],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  const [{ data: _settings2 }, { data: _aboutData }] = await Promise.all([
    sanityFetch({ query: settingsQuery, stega: false }),
    sanityFetch({ query: aboutQuery, stega: false }),
  ]);
  const settings = _settings2 as SettingsQueryResult;
  const about = _aboutData as AboutQueryResult | null;

  if (!settings) {
    return (
      <html lang='en' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} bg-background antialiased`}
        >
          <main id='main-content'>Settings not found</main>
        </body>
      </html>
    );
  }

  const { socialLinks } = settings;
  const initialTheme = await getTheme();

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://cdn.sanity.io' crossOrigin='anonymous' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/wisihe.svg' color='oklch(65% 0.15 180)' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} bg-background antialiased`}
      >
        <JsonLd data={jsonLdGraph} />
        <div className='relative z-10'>
          <ReactScanDev />
          <ProgressBarProvider>
            <ProgressBar className='fixed h-1 shadow-lg shadow-accent bg-accent top-0 z-50' />
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              initialTheme={initialTheme ?? undefined}
            >
              <PostHogProvider>
                <PresentationMode />
                <SmoothScroll />
                <ScrollToTopOnNavigate />
                {isDraftMode && (
                  <>
                    <DraftModeToast />
                    <VisualEditing />
                  </>
                )}
                <SanityLive onError={handleError} />
                <HeaderNavigation />
                <main id='main-content' className='bg-transparent'>
                  <MotionLayoutGroup>{children}</MotionLayoutGroup>
                </main>
                <Footer
                  socialLinks={socialLinks}
                  jobTitle={about?.jobTitle}
                  heroSubtitle={about?.heroSubtitle}
                  ctaLabel={about?.ctaButtonText}
                  ctaHref={about?.ctaButtonUrl}
                />
                <Analytics />
                <SpeedInsights />
                <CustomCursor />
                <AppToaster />
              </PostHogProvider>
            </ThemeProvider>
          </ProgressBarProvider>
        </div>
      </body>
    </html>
  );
}
