import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { renderOgImage } from './og-template';

export type OgPageKey = 'work' | 'expertise' | 'about' | 'contact' | 'privacy' | 'cookies' | 'terms';

/**
 * Per-page Open Graph image. Each page segment needs its own
 * opengraph-image file because a page's `openGraph` metadata replaces the
 * parent's, including any inherited file-based image.
 */
export async function pageOgImage(params: Promise<{ locale: string }>, key: OgPageKey) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return renderOgImage({
    eyebrow: 'Lankio Digital Solutions',
    title: t(`${key}.title`),
    footer: `Shehan Janith Hettiarachchi — ${t('jobTitle')}`,
  });
}
