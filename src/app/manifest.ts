import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/** Web app manifest: brand icons for Android home screens and browser UI. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    start_url: '/',
    display: 'browser',
    background_color: '#07080b',
    theme_color: '#07080b',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
