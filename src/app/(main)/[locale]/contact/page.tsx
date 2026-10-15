import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { buildMetadata, localizedUrl } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/ui/page-header';
import { ContactForm } from '@/components/contact/contact-form';
import { Reveal } from '@/components/motion/reveal';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.contact' });
  return buildMetadata({ locale, path: '/contact', title: t('title'), description: t('description') });
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations('Contact');
  const nav = await getTranslations('Nav');
  const faq = t.raw('faq') as { q: string; a: string }[];

  return (
    <>
      <JsonLd
        data={graph(
          {
            '@type': 'ContactPage',
            url: localizedUrl(locale, '/contact'),
            inLanguage: locale,
            mainEntity: { '@id': `${siteConfig.url}/#organization` },
          },
          breadcrumbSchema([
            { name: nav('home'), url: localizedUrl(locale) },
            { name: nav('contact'), url: localizedUrl(locale, '/contact') },
          ])
        )}
      />

      <PageHeader eyebrow={t('eyebrow')} titleLead={t('titleLead')} titleAccent={t('titleAccent')} intro={t('intro')} />

      <section aria-label={t('form.legend')} className="pb-24 md:pb-32">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="enter-fade-up lg:col-span-7" style={{ '--d': '0.4s' } as React.CSSProperties}>
            <ContactForm />
          </div>

          <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
            <Reveal>
              <h2 className="text-eyebrow text-fg-subtle">{t('directTitle')}</h2>
              <p className="mt-4 text-fg-muted">{t('directBody')}</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-2 inline-block text-xl tracking-[-0.02em] text-fg underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-fg"
              >
                {siteConfig.email}
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-eyebrow text-fg-subtle">{t('locationTitle')}</h2>
              <p className="mt-4 leading-relaxed text-fg-muted">{t('locationBody')}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-eyebrow text-fg-subtle">{t('faqTitle')}</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {faq.map((item) => (
                  <details key={item.q} className="group py-1">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[0.95rem] text-fg marker:hidden [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="relative size-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:bg-fg-muted after:absolute after:left-1/2 after:top-0 after:h-3 after:w-px after:bg-fg-muted after:transition-transform after:duration-300 group-open:after:scale-y-0"
                      />
                    </summary>
                    <p className="pb-4 pr-6 text-sm leading-relaxed text-fg-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
