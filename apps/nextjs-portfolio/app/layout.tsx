import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { SpeedInsights } from "@vercel/speed-insights/next";

import HeaderNavigation from "@/app/components/HeaderNavigation";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { handleError } from "./client-utils";
import DraftModeToast from "./components/DraftModeToast";
import Footer from "./components/Footer/Footer";
import "./globals.css";
import { PostHogProvider } from "./providers";
import React from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#DE0D92",
  colorScheme: "dark light",
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
        template: "%s",
        default: "WiSiHe",
      },
      description: "A gallery of some of my paintings and other projects",
    };
  }

  const { title = "", description, keywords } = settings;

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
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Henrik Sissener",
  jobTitle: "Frontend Developer",
  description:
    "Frontend developer specializing in React and Svelte, with a passion for drawing and game development.",
  url: "https://wisihe.no",
  sameAs: [
    "https://github.com/wisihe",
    "https://www.linkedin.com/in/henrik-sissener/",
    "https://twitter.com/wisihe",
    "https://www.instagram.com/wisihe/",
    "https://www.youtube.com/@wisihe",
  ],
  knowsAbout: [
    "React",
    "Svelte",
    "Frontend Development",
    "Game Development",
    "Digital Art",
  ],
};

const jsonLdSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WiSiHe | Portfolio",
  description:
    "Portfolio of Henrik Sissener, a frontend developer and creative.",
  url: "https://wisihe.no",
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
          <main id="main-content" className="bg-dark">
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
