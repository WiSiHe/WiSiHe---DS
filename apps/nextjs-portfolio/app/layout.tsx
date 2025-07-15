import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import { SpeedInsights } from '@vercel/speed-insights/next';

import HeaderNavigation from '@/app/components/HeaderNavigation';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { settingsQuery } from '@/sanity/lib/queries';
import { resolveOpenGraphImage } from '@/sanity/lib/utils';
import { VisualEditing } from 'next-sanity';
import { draftMode } from 'next/headers';
import { handleError } from './client-utils';
import DraftModeToast from './components/DraftModeToast';
import Footer from './components/Footer/Footer';
import './globals.css';
import { PostHogProvider } from './providers';
import React from 'react';

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
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });

  if (!settings) {
    return {
      title: {
        template: '%s',
        default: 'WiSiHe',
      },
      description: 'A gallery of some of my paintings and other projects',
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
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Henrik Sissener',
  jobTitle: 'Frontend Developer',
  description:
    'Frontend developer specializing in React and Svelte, with a passion for drawing and game development.',
  url: 'https://www.wisihe.no',
  sameAs: [
    'https://github.com/wisihe',
    'https://www.linkedin.com/in/henrik-sissener/',
    'https://twitter.com/wisihe',
    'https://www.instagram.com/wisihe/',
    'https://www.youtube.com/@wisihe',
  ],
  knowsAbout: ['React', 'Svelte', 'Frontend Development', 'Game Development', 'Digital Art'],
};

const jsonLdSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WiSiHe | Portfolio',
  description: 'Portfolio of Henrik Sissener, a frontend developer and creative.',
  url: 'https://www.wisihe.no',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });

  if (!settings) {
    return <div>Settings not found</div>;
  }

  const { socialLinks } = settings;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon setup */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/wisihe.svg" color="oklch(65% 0.15 180)" />
        <meta name="msapplication-TileColor" content="oklch(65% 0.15 180)" />
        <meta name="theme-color" content="oklch(65% 0.15 180)" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSite),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${inter.variable} antialiased`}
      >
        <PostHogProvider>
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          <SanityLive onError={handleError} />
          <HeaderNavigation />
          <main id="main-content" className="bg-background">
            {children}
          </main>
          <Footer socialLinks={socialLinks} />
          <Analytics />
          <SpeedInsights />
        </PostHogProvider>
      </body>
    </html>
  );
}
