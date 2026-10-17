import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, localizedUrl } from '@/lib/seo';
import { breadcrumbSchema, graph, personSchema } from '@/lib/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/ui/page-header';
import { SectionLabel } from '@/components/ui/section-label';
import { ButtonLink } from '@/components/ui/button-link';
import { Reveal } from '@/components/motion/reveal';
import { YouTubeNotice, YouTubeVideoCard } from '@/components/video/youtube-video';
import { introVideo } from '@/content/videos';

const FACT_KEYS = ['base', 'origin', 'studio', 'qualification', 'languages'] as const;

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta.about' });
  return buildMetadata({ locale, path: '/about', title: t('title'), description: t('description'), type: 'profile' });
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations('About');
  const meta = await getTranslations('Meta');
  const nav = await getTranslations('Nav');
  const video = await getTranslations('Video');
  const bio = t.raw('bio') as string[];
  const capabilities = t.raw('capabilities') as string[];
  const approach = t.raw('approach') as { title: string; body: string }[];

  return (
    <>
      <JsonLd
        data={graph(
          { '@type': 'ProfilePage', url: localizedUrl(locale, '/about'), mainEntity: personSchema(locale, meta('jobTitle'), meta('about.description')) },
          breadcrumbSchema([
            { name: nav('home'), url: localizedUrl(locale) },
            { name: nav('about'), url: localizedUrl(locale, '/about') },
          ])
        )}
      />

      <PageHeader eyebrow={t('eyebrow')} titleLead={t('titleLead')} titleAccent={t('titleAccent')}>
        <p className="enter-fade-up mt-6 text-lg text-fg-muted" style={{ '--d': '0.3s' } as React.CSSProperties}>
          {t('role')}
        </p>
      </PageHeader>

      {/* Portrait + biography */}
      <section aria-label={t('eyebrow')} className="pb-24 md:pb-32">
        <div className="container-page grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <div
              className="enter-fade relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-line md:sticky md:top-28"
              style={{ '--d': '0.4s' } as React.CSSProperties}
            >
              <Image
                src="/images/shehan.jpg"
                alt={t('portraitAlt')}
                fill
                priority
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6 lg:col-start-6">
            <div className="space-y-6">
              {bio.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className={i === 0 ? 'text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-[-0.02em]' : 'text-lead text-fg-muted'}>
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14">
              <h2 className="text-eyebrow text-fg-subtle">{video('introLabel')}</h2>
              <YouTubeVideoCard
                video={introVideo(locale)}
                className="mt-5"
                sizes="(min-width: 1024px) 52vw, (min-width: 768px) 55vw, 100vw"
              />
              <YouTubeNotice className="mt-3" />
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="text-eyebrow text-fg-subtle">{t('factsTitle')}</h2>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {FACT_KEYS.map((key) => (
                  <div key={key} className="grid grid-cols-[9rem_1fr] gap-4 py-4 text-[0.95rem] sm:grid-cols-[12rem_1fr]">
                    <dt className="text-fg-subtle">{t(`facts.${key}.label`)}</dt>
                    <dd className="text-fg">{t(`facts.${key}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="text-eyebrow text-fg-subtle">{t('capabilitiesTitle')}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {capabilities.map((item) => (
                  <li key={item} className="rounded-full border border-line px-4 py-2 text-sm text-fg-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="border-t border-line section-y">
        <div className="container-page">
          <SectionLabel index="01">{t('approachTitle')}</SectionLabel>
          <h2 id="approach-title" className="sr-only">
            {t('approachTitle')}
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-2">
            {approach.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 2) * 0.08} className="bg-canvas p-8 md:p-12">
                <span className="text-sm tabular-nums text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-title mt-8">{item.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-fg-muted">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Confidentiality */}
      <section aria-labelledby="confidential-title" className="pb-24 md:pb-32">
        <div className="container-page grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel index="02">
              <span id="confidential-title">{t('confidentialTitle')}</span>
            </SectionLabel>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <p className="text-title max-w-3xl text-fg">{t('confidentialBody')}</p>
            </Reveal>
            <Reveal className="mt-10" delay={0.1}>
              <ButtonLink href="/contact" magnetic>
                {t('cta')}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
