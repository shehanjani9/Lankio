import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal/legal-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/cookie-policy'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.cookies' });
  return buildMetadata({ locale, path: '/cookie-policy', title: t('title'), description: t('description') });
}

export default async function CookiePolicyPage({ params }: PageProps<'/[locale]/cookie-policy'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return <LegalPage document="cookies" />;
}
