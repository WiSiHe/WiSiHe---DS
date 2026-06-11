import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Houston, we're coding 3D! | Three.js & React Three Fiber Tutorial",
  description:
    'Learn how to build interactive 3D experiences on the web with Three.js and React Three Fiber. From fundamentals to advanced techniques, this comprehensive guide makes 3D development accessible. Perfect for frontend developers who want to add 3D to their skillset without needing a PhD in rocket science.',
  keywords: [
    'Three.js',
    'React Three Fiber',
    'WebGL',
    'WebGPU',
    '3D web development',
    'interactive 3D',
    'web 3D tutorial',
    '3D graphics',
    'React 3D',
    'frontend 3D',
    'web development tutorial',
    'NoA Ignite',
  ],
  authors: [{ name: 'Henrik Wilhelm Sissener' }],
  creator: 'Henrik Wilhelm Sissener',
  publisher: 'WiSiHe',
  alternates: {
    canonical: 'https://www.wisihe.no/three-d',
  },
  openGraph: {
    title: "Houston, we're coding 3D! 🚀",
    description:
      'Does Three.js have to be rocket science in 2026? Learn 3D web development with Three.js and React Three Fiber in this comprehensive interactive tutorial.',
    type: 'website',
    url: 'https://www.wisihe.no/three-d',
    siteName: 'WiSiHe',
    locale: 'en_US',
    images: [
      {
        // Fallback until /public/images/og-3d-presentation.png is added (1200×630)
        url: 'https://www.wisihe.no/images/hell.jpg',
        width: 1200,
        height: 630,
        alt: "Houston, we're coding 3D! - Interactive Three.js and React Three Fiber tutorial",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Houston, we're coding 3D! 🚀",
    description: 'Learn 3D web development with Three.js and React Three Fiber',
    creator: '@wisihe',
    site: '@wisihe',
    images: ['https://www.wisihe.no/images/hell.jpg'],
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
  other: {
    'article:author': 'Henrik Wilhelm Sissener',
    'article:published_time': '2024-01-01T00:00:00Z',
  },
};

export default function ThreeDLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
