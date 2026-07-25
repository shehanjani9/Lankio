import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // 1. Image Optimization Settings
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // Images cache කර තබාගැනීමට (1 year)
  },

  // 2. Production Build Optimizations
  compiler: {
    // Production එකේදී console.log ඉවත් කර Bundle size එක අඩු කරයි
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 3. Tree-shaking & Package Imports Optimization
  experimental: {
    // Heavy libraries වල මුළු package එකම load නොවී අවශ්‍ය කොටස් විතරක් load කරයි (Mobile CPU lag එක වළක්වයි)
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 4. Performance & Compression
  compress: true, // Gzip/Brotli compression active කරයි
  poweredByHeader: false, // Security සහ slight response header cleanup
};

export default withNextIntl(nextConfig);