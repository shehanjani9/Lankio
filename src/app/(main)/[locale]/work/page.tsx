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
import { SectionLabel } from '@/components/ui/section-label';
import { Reveal } from '@/components/motion/reveal';
import { YouTubeNotice, YouTubeVideoCard } from '@/components/video/youtube-video';
import { FEATURED_FILM, SHORTS } from '@/content/videos';

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

      {/* Motion & video: featured film and Shorts from the Lankio YouTube channel */}
      <section aria-labelledby="video-title" className="section-y border-t border-line">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel>{t('video.eyebrow')}</SectionLabel>
              <h2 id="video-title" className="text-headline mt-8">
                {t('video.title')} <span className="font-accent text-fg-muted">{t('video.titleAccent')}</span>
              </h2>
            </div>
            <Reveal className="md:col-span-4" delay={0.1}>
              <p className="text-fg-muted">{t('video.intro')}</p>
            </Reveal>
          </div>

          <Reveal className="mt-14 md:mt-20">
            <h3 className="text-eyebrow text-fg-subtle">{t('video.featured')}</h3>
            <YouTubeVideoCard video={FEATURED_FILM} headingLevel="h4" className="mt-5" sizes="(min-width: 1440px) 1312px, 100vw" />
          </Reveal>

          <div className="mt-20">
            <div className="flex items-baseline justify-between gap-6">
              <h3 className="text-eyebrow text-fg-subtle">{t('video.shorts')}</h3>
              <p className="text-sm text-fg-subtle">{t('video.shortsCount', { count: SHORTS.length })}</p>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {SHORTS.map((video, i) => (
                <Reveal as="li" key={video.id} delay={(i % 7) * 0.04}>
                  <YouTubeVideoCard
                    video={video}
                    headingLevel="h4"
                    sizes="(min-width: 1024px) 14vw, (min-width: 768px) 24vw, (min-width: 640px) 32vw, 50vw"
                  />
                </Reveal>
              ))}
            </ul>
          </div>

          <YouTubeNotice className="mt-12" />
        </div>
      </section>

      <ContactCta />
    </>
  );
}
