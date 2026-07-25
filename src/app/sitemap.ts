import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lankio.it';

export default function sitemap(): MetadataRoute.Sitemap {
  // Google Multilingual SEO වලට Alternates map එකක් සාදාගැනීම
  const languageAlternates: Record<string, string> = {};
  routing.locales.forEach((locale) => {
    languageAlternates[locale] = `${BASE_URL}/${locale}`;
  });

  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: languageAlternates,
    },
  }));
}