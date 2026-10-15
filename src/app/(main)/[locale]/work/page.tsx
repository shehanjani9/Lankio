import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getActiveCategories, getPublishedProjects } from '@/content/projects';
import { toCardData } from '@/content/projects/view';
import { buildMetadata, localizedUrl } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/ui/page-header';
import { WorkGallery } from '@/components/work/work-gallery';
import { ContactCta } from '@/components/home/contact-cta';

export async function generateMetadata({ params }: PageProps<'/[locale]/work'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.work' });
  return buildMetadata({ locale, path: '/work', title: t('title'), description: t('description') });
}

export default async function WorkPage({ params }: PageProps<'/[locale]/work'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations('Work');
  const nav = await getTranslations('Nav');
  const projects = getPublishedProjects();

  return (
    <>
      <JsonLd
        data={graph(
          {
            '@type': 'CollectionPage',
            name: `${t('title')} ${t('titleAccent')}`,
            url: localizedUrl(locale, '/work'),
            inLanguage: locale,
            hasPart: projects.map((project) => ({
              '@type': 'CreativeWork',
              name: project.title,
              url: localizedUrl(locale, `/work/${project.slug}`),
            })),
          },
          breadcrumbSchema([
            { name: nav('home'), url: localizedUrl(locale) },
            { name: nav('work'), url: localizedUrl(locale, '/work') },
          ])
        )}
      />
      <PageHeader eyebrow={t('eyebrow')} titleLead={t('title')} titleAccent={t('titleAccent')} intro={t('intro')} />
      <section className="pb-24 md:pb-32" aria-label={`${t('title')} ${t('titleAccent')}`}>
        <div className="container-page">
          <WorkGallery
            projects={projects.map((project) => toCardData(project, locale))}
            categories={getActiveCategories()}
          />
        </div>
      </section>
      <ContactCta />
    </>
  );
}
