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
import Link from 'next/link';
import { handleError } from './client-utils';
import DraftModeToast from './components/DraftModeToast';
import Footer from './components/Footer/Footer';
import './globals.css';
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
  themeColor: '#DE0D92',
  colorScheme: 'dark light',
};

// export const metadata = {
//   metadataBase: new URL('/', 'https://wisihe.no'),
//   title: 'Home | WiSiHe',
//   description: 'A gallery of some of my paintings and other projects',
//   locale: 'no_NO',
//   lang: 'en',
//   type: 'website',
//   url: 'https://wisihe.no',
//   openGraph: {
//     images: [
//       {
//         url: 'https://wisihe.no/images/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'WiSiHe',
//       },
//     ],
//   },
//   keywords: [
//     'wisihe',
//     'art',
//     'painting',
//     'gallery',
//     'projects',
//     'portfolio',
//     'website',
//     'web development',
//     'web design',
//     'web developer',
//     'web designer',
//     'developer',
//     'designer',
//   ],
//   author: { name: 'Henrik Wilhelm Sissener', url: 'https://wisihe.no' },
//   applicationName: 'WiSiHe',
// };

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
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    keywords: keywords,
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WiSiHe | Portfolio',
  description:
    "Explore Henrik's stunning portfolio featuring paintings, creative projects, and video works.",
  url: 'https://wisihe.no',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://wisihe.no/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdSite = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://wisihe.no',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Projects',
      item: 'https://wisihe.no/projects',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Project1',
      item: 'https://wisihe.no/projects/project1',
    },
  ],
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
        <link rel="icon" href="/wisihe.svg" sizes="any" />
        <meta name="theme-color" content="#DE0D92" />
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
      <PostHogProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable}  ${inter.variable} antialiased`}
        >
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          <SanityLive onError={handleError} />
          <Link
            href="#main-content"
            className="fixed z-10 px-4 py-2 text-sm font-bold text-white transition-opacity duration-300 rounded shadow opacity-0 bg-primary bottom-4 left-20 focus:opacity-100"
          >
            Skip to main content
          </Link>
          {/* <IntroSplash /> */}
          <HeaderNavigation />
          <main id="main-content" className="bg-dark">
            {children}
          </main>
          <Footer socialLinks={socialLinks} />
          <Analytics />
          <SpeedInsights />
        </body>
      </PostHogProvider>
    </html>
  );
}
