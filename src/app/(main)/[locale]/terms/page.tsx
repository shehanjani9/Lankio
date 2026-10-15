import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal/legal-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.terms' });
  return buildMetadata({ locale, path: '/terms', title: t('title'), description: t('description') });
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return <LegalPage document="terms" />;
}
