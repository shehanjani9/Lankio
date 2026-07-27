import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import Footer from '@/components/Footer';
import '../../globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lankio.it';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = `${BASE_URL}/${loc}`;
  });

  return {
    metadataBase: new URL(BASE_URL),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}`,
      siteName: 'Lankio',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      type: 'website',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-base text-[color:var(--text-primary)] antialiased">
        {/*
          key={locale} forces React to fully unmount and remount this
          provider (and everything below it) when the locale changes,
          instead of reconciling in place. Without this, navigating between
          /en and /it via next-intl's Link can leave the client tree
          reconciled rather than remounted, which is what was causing the
          URL to update while the rendered translations stayed stale.
        */}
        <NextIntlClientProvider key={locale} messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
