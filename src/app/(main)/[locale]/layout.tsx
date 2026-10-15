import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Instrument_Serif } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MotionProvider } from '@/components/motion/motion-provider';
import { ConsentManager } from '@/components/consent/consent-manager';
import { CONSENT_BOOT_SCRIPT } from '@/lib/consent';
import { InlineScript } from '@/components/inline-script';
import '../../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Single editorial accent face, italic only where used.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

// GA4 loads only after analytics consent (see ConsentManager). The fallback
// keeps analytics working if the env var is missing on the host.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-3VNPQ6S0LN';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#07080b',
  colorScheme: 'dark',
};

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('siteTitle'),
      template: `%s — ${siteConfig.shortName}`,
    },
    description: t('siteDescription'),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.founder.name }],
    creator: siteConfig.founder.name,
    publisher: siteConfig.name,
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${instrumentSerif.variable}`}
      data-scroll-behavior="smooth"
      // The consent boot script may add data-consent before hydration.
      suppressHydrationWarning
    >
      <head>
        {/* Runs during HTML parsing, before first paint: hides the
            server-rendered consent banner for visitors who already chose.
            It never loads analytics -- that is gated by ConsentManager. */}
        <InlineScript id="consent-boot" code={CONSENT_BOOT_SCRIPT} />
      </head>
      <body className="min-h-dvh bg-canvas text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-canvas"
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
          <ConsentManager gaId={GA_ID} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
