import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getPublishedProjects } from '@/content/projects';
import { languageAlternates, localizedUrl } from '@/lib/seo';

const STATIC_PATHS: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/expertise', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

/** Every published page in every locale, each with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    ...STATIC_PATHS,
    ...getPublishedProjects().map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.8,
      changeFrequency: 'yearly' as const,
    })),
  ];

  return entries.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    }))
  );
}
