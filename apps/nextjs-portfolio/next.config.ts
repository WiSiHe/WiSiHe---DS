import type { NextConfig } from 'next';
import { fetchRedirects } from './sanity/lib/fetchRedirects';

// Reverse-proxy PostHog through our own domain so ad blockers that block
// *.posthog.com can't drop analytics events. Derived from the region host.
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
const posthogAssetsHost = posthogHost.replace('.i.posthog.com', '-assets.i.posthog.com');

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Required so the PostHog proxy rewrites below receive trailing-slash paths.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: `${posthogAssetsHost}/static/:path*` },
      { source: '/ingest/:path*', destination: `${posthogHost}/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'w.wallhaven.cc',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
    ],
    // Optimize image loading performance
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Additional performance optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [30, 75, 80, 82],
  },

  experimental: {
    // NOTE: 'motion' intentionally excluded — optimizePackageImports splits its
    // modules and breaks the module-scoped shared-layout (layoutId) registry.
    optimizePackageImports: [
      '@tabler/icons-react',
      'algoliasearch',
      'react-instantsearch',
      'react-instantsearch-nextjs',
      '@wisihe/utils',
    ],
  },

  transpilePackages: [
    '@wisihe/utils',
    '@wisihe/ui-react',
    '@wisihe/constants',
    '@wisihe/sanity-queries',
    '@wisihe/tokens',
    'lenis',
  ],

  poweredByHeader: false,

  async redirects() {
    try {
      const redirects = await fetchRedirects();

      return redirects
        .filter(
          (
            redirect: any,
          ): redirect is { source: string; destination: string; permanent: boolean } =>
            Boolean(redirect.source && redirect.destination),
        )
        .map((redirect: any) => ({
          source: redirect.source!,
          destination: redirect.destination!,
          permanent: redirect.permanent ?? false,
        }));
    } catch (error) {
      console.error('Error fetching redirects:', error);
      return [];
    }
  },
};

export default nextConfig;
