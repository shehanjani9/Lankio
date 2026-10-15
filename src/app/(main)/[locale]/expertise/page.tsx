import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, localizedUrl } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/ui/page-header';
import { ExpertiseList, EXPERTISE_KEYS } from '@/components/home/expertise-list';
import { ButtonLink } from '@/components/ui/button-link';
import { Reveal } from '@/components/motion/reveal';

export async function generateMetadata({ params }: PageProps<'/[locale]/expertise'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.expertise' });
  return buildMetadata({ locale, path: '/expertise', title: t('title'), description: t('description') });
}

export default async function ExpertisePage({ params }: PageProps<'/[locale]/expertise'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations('Expertise');
  const nav = await getTranslations('Nav');

  return (
    <>
      <JsonLd
        data={graph(
          // Services without prices or offers: what is done, not what it costs.
          ...EXPERTISE_KEYS.map((key) => ({
            '@type': 'Service',
            name: t(`groups.${key}.title`),
            description: t(`groups.${key}.summary`),
            provider: { '@id': `${siteConfig.url}/#organization` },
            areaServed: 'Worldwide',
            url: `${localizedUrl(locale, '/expertise')}#${key}`,
          })),
          breadcrumbSchema([
            { name: nav('home'), url: localizedUrl(locale) },
            { name: nav('expertise'), url: localizedUrl(locale, '/expertise') },
          ])
        )}
      />
      <PageHeader eyebrow={t('eyebrow')} titleLead={t('title')} titleAccent={t('titleAccent')} intro={t('intro')} />

      <section aria-label={t('eyebrow')} className="pb-24 md:pb-32">
        <div className="container-page">
          <ExpertiseList detailed />
        </div>
      </section>

      <section className="border-t border-line section-y">
        <Reveal className="container-page flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-headline max-w-3xl">{t('ctaTitle')}</h2>
            <p className="text-lead mt-6 max-w-xl text-fg-muted">{t('ctaBody')}</p>
          </div>
          <ButtonLink href="/contact" magnetic>
            {nav('cta')}
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
