import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal/legal-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy-policy'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.privacy' });
  return buildMetadata({ locale, path: '/privacy-policy', title: t('title'), description: t('description') });
}

export default async function PrivacyPolicyPage({ params }: PageProps<'/[locale]/privacy-policy'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return <LegalPage document="privacy" />;
}
