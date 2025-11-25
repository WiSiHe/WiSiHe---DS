import type { NextConfig } from 'next';
import { fetchRedirects } from './sanity/lib/fetchRedirects';

const nextConfig: NextConfig = {
  reactCompiler: true,
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
    ],
    // Optimize image loading performance
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Additional performance optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [30, 75, 80],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['motion', '@tabler/icons-react', 'react-icons']
  },

  poweredByHeader: false,

  async redirects() {
    try {
      const redirects = await fetchRedirects();

      return redirects
        .filter(
          (redirect): redirect is { source: string; destination: string; permanent: boolean } =>
            Boolean(redirect.source && redirect.destination),
        )
        .map(redirect => ({
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
