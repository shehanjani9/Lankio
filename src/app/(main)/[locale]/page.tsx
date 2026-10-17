import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { getFeaturedProjects } from '@/content/projects';
import { toCardData } from '@/content/projects/view';
import { buildMetadata } from '@/lib/seo';
import { graph, organizationSchema, personSchema, websiteSchema } from '@/lib/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Hero } from '@/components/home/hero';
import { ExpertiseList } from '@/components/home/expertise-list';
import { ContactCta } from '@/components/home/contact-cta';
import { ProjectCard } from '@/components/work/project-card';
import { ButtonLink } from '@/components/ui/button-link';
import { SectionLabel } from '@/components/ui/section-label';
import { MaskedLine, Reveal } from '@/components/motion/reveal';
import { YouTubeNotice, YouTubeVideoCard } from '@/components/video/youtube-video';
import { introVideo } from '@/content/videos';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return buildMetadata({
    locale,
    path: '/',
    title: t('siteTitle'),
    description: t('siteDescription'),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const meta = await getTranslations('Meta');
  const video = await getTranslations('Video');
  const projects = getFeaturedProjects().map((project) => toCardData(project, locale));

  return (
    <>
      <JsonLd
        data={graph(
          websiteSchema(locale),
          organizationSchema(meta('siteDescription')),
          personSchema(locale, meta('jobTitle'), meta('about.description'))
        )}
      />

      <Hero />

      {/* 01 — Selected work */}
      <section aria-labelledby="work-title" className="section-y">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel index="01">{t('work.eyebrow')}</SectionLabel>
              <h2 id="work-title" className="text-headline mt-8 max-w-4xl">
                <MaskedLine>{t('work.title')}</MaskedLine>
                <MaskedLine delay={0.08}>
                  <span className="font-accent text-fg-muted">{t('work.titleAccent')}</span>
                </MaskedLine>
              </h2>
            </div>
            <Reveal className="md:col-span-4" delay={0.1}>
              <p className="text-fg-muted">{t('work.body')}</p>
            </Reveal>
          </div>

          <ul className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2 md:gap-y-0">
            {projects.map((project, index) => (
              <li key={project.slug} className={index % 2 === 1 ? 'md:mt-40' : 'md:mb-24'}>
                <ProjectCard project={project} index={index} sizes="(min-width: 768px) 46vw, 100vw" />
              </li>
            ))}
          </ul>

          <Reveal className="mt-16 flex justify-center md:mt-8">
            <ButtonLink href="/work" variant="secondary" magnetic>
              {t('work.cta')}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 02 — About preview */}
      <section aria-labelledby="about-title" className="section-y border-t border-line bg-surface/40">
        <div className="container-page grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-line">
              <Image
                src="/images/shehan.jpg"
                alt={t('hero.portraitAlt')}
                fill
                sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 100vw"
                className="object-cover object-[50%_20%] grayscale-[35%] transition-[filter,transform] duration-1000 ease-out-expo hover:scale-[1.02] hover:grayscale-0"
              />
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <SectionLabel index="02">{t('about.eyebrow')}</SectionLabel>
            <h2 id="about-title" className="text-headline mt-8">
              <MaskedLine>{t('about.title')}</MaskedLine>
            </h2>
            <Reveal delay={0.1}>
              <p className="text-lead mt-8 max-w-2xl text-fg-muted">{t('about.body')}</p>
              <div className="mt-10">
                <ButtonLink href="/about" variant="secondary">
                  {t('about.cta')}
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal className="mt-14" delay={0.15}>
              <p className="text-eyebrow text-fg-subtle">{video('introLabel')}</p>
              <YouTubeVideoCard
                video={introVideo(locale)}
                className="mt-5"
                sizes="(min-width: 1024px) 52vw, (min-width: 768px) 55vw, 100vw"
              />
              <YouTubeNotice className="mt-3" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — Expertise */}
      <section aria-labelledby="expertise-title" className="section-y">
        <div className="container-page">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="03">{t('expertise.eyebrow')}</SectionLabel>
              <h2 id="expertise-title" className="text-headline mt-8">
                <MaskedLine>{t('expertise.title')}</MaskedLine>
                <MaskedLine delay={0.08}>
                  <span className="font-accent text-fg-muted">{t('expertise.titleAccent')}</span>
                </MaskedLine>
              </h2>
            </div>
            <Reveal>
              <ButtonLink href="/expertise" variant="ghost">
                {t('expertise.cta')}
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14">
            <ExpertiseList />
          </div>
        </div>
      </section>

      <ContactCta index="04" />
    </>
  );
}
