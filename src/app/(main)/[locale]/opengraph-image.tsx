import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { OG_SIZE, renderOgImage } from '@/components/seo/og-template';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Lankio Digital Solutions';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return renderOgImage({
    eyebrow: 'Lankio Digital Solutions',
    title: t('ogTagline'),
    footer: `Shehan Janith Hettiarachchi — ${t('jobTitle')}`,
  });
}
