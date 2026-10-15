import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { routing, type Locale } from '@/i18n/routing';

/** Absolute URL for an internal path in a given locale. `path` starts with "/". */
export function localizedUrl(locale: Locale, path = '/'): string {
  const suffix = path === '/' ? '' : path;
  return `${siteConfig.url}/${locale}${suffix}`;
}

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** hreflang map for a path, including x-default (English). */
export function languageAlternates(path = '/'): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = localizedUrl(locale, path);
  languages['x-default'] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', it: 'it_IT' };

type BuildMetadataInput = {
  locale: Locale;
  /** Locale-less path, e.g. "/work/lankio-learn". */
  path: string;
  title: string;
  description: string;
  /** Use the root title as-is instead of applying the "%s — Lankio" template. */
  absoluteTitle?: boolean;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
};

/**
 * Per-page metadata with a self-referencing canonical and hreflang
 * alternates. Open Graph images come from the opengraph-image file
 * convention, so they are intentionally not set here.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  type = 'website',
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = localizedUrl(locale, path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

/** Serialises JSON-LD safely for a <script> tag (escapes "<"). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
