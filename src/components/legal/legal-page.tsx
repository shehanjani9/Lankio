import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { CookieSettingsButton } from '@/components/consent/consent-manager';

type LegalKey = 'privacy' | 'cookies' | 'terms';

export async function LegalPage({ document }: { document: LegalKey }) {
  const t = await getTranslations('Legal');
  const consent = await getTranslations('Consent');
  const sections = t.raw(`${document}.sections`) as { title: string; body: string }[];

  return (
    <>
      <PageHeader eyebrow={t('lastUpdated', { date: t('updatedDate') })} titleLead={t(`${document}.title`)} intro={t(`${document}.intro`)} />
      <section className="pb-24 md:pb-32">
        <div className="container-page grid md:grid-cols-12">
          <div className="space-y-12 md:col-span-8 md:col-start-3 lg:col-span-7 lg:col-start-4">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-medium tracking-[-0.02em] text-fg">{section.title}</h2>
                <p className="mt-4 leading-relaxed text-fg-muted">{section.body}</p>
              </section>
            ))}
            {document === 'cookies' && (
              <CookieSettingsButton
                label={consent('openSettings')}
                className="inline-flex min-h-12 items-center rounded-full bg-fg px-6 font-medium text-canvas transition-colors hover:bg-white"
              />
            )}
            <p className="border-t border-line pt-8 text-sm text-fg-subtle">{t('reviewNote')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
