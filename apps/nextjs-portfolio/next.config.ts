import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['motion', '@tabler/icons-react', 'react-icons'],
    // Additional performance features
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  // Bundle analyzer (uncomment for debugging)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Help resolve workspace packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@wisihe/utils': require.resolve('@wisihe/utils'),
    };

    return config;
  },
  async redirects() {
    try {
      const { fetchRedirects } = await import('./sanity/lib/fetchRedirects');
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
