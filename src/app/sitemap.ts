import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lankio.it';

export default function sitemap(): MetadataRoute.Sitemap {
  // Phase 1 is a single-page site per locale. As Phase 2 adds real routes
  // (individual template pages, blog posts, case study pages), add their
  // paths here rather than as in-page anchors -- anchors aren't distinct
  // pages to search engines, so they don't belong in a sitemap.
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }));
}
