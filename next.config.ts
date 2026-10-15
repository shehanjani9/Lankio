import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Project screenshots and portraits rarely change.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compiler: {
    // Keep errors and warnings in production logs (e.g. failed email sends).
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async redirects() {
    // Retired sections (pricing-led template hub, automated audit, FAQ).
    return [
      { source: '/:locale(en|it)/templates', destination: '/:locale/work', permanent: true },
      { source: '/:locale(en|it)/audit', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|it)/faq', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|it)/pricing', destination: '/:locale/contact', permanent: true },
    ];
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // The site itself must not be framed; /demo pages stay embeddable.
      { source: '/:locale(en|it)/:path*', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] },
      { source: '/:locale(en|it)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] },
    ];
  },
};

export default withNextIntl(nextConfig);
