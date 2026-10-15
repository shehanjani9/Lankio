import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getNextProject, getProjectBySlug, getPublishedProjects } from '@/content/projects';
import { buildMetadata, localizedUrl } from '@/lib/seo';
import { breadcrumbSchema, graph, projectSchema } from '@/lib/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button-link';
import { SectionLabel } from '@/components/ui/section-label';
import { Reveal } from '@/components/motion/reveal';
import { ProjectGallery } from '@/components/work/project-gallery';
import { VideoPlayer } from '@/components/video/video-player';
import { VideoSpecs } from '@/components/video/video-specs';
import { ContactCta } from '@/components/home/contact-cta';

// Only published slugs exist; anything else (including drafts) is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/work/[slug]'>): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/work/${slug}`,
    title: `${project.title} — ${project.discipline[locale]}`,
    description: project.summary[locale],
    type: 'article',
  });
}

const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as React.CSSProperties;

export default async function ProjectPage({ params }: PageProps<'/[locale]/work/[slug]'>) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations('Work.detail');
  const nav = await getTranslations('Nav');
  const classification = await getTranslations('Classification');
  const next = getNextProject(slug);
  const tint = project.tint ?? '#2c2470';
  const highlights = project.highlights?.[locale] ?? [];
  const approach = project.approach?.[locale] ?? [];
  const outcomes = project.outcomes?.[locale] ?? [];

  let section = 0;
  const nextIndex = () => String(++section).padStart(2, '0');

  return (
    <article>
      <JsonLd
        data={graph(
          projectSchema(project, locale),
          breadcrumbSchema([
            { name: nav('home'), url: localizedUrl(locale) },
            { name: t('breadcrumbWork'), url: localizedUrl(locale, '/work') },
            { name: project.title, url: localizedUrl(locale, `/work/${project.slug}`) },
          ])
        )}
      />

      {/* Header */}
      <header className="relative isolate overflow-hidden pt-28 md:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[46rem] opacity-70"
          style={{ background: `radial-gradient(60% 70% at 70% 0%, ${tint}, transparent 70%)` }}
        />
        <div aria-hidden="true" className="bg-grain absolute inset-0 -z-10" />

        <div className="container-page">
          <Link
            href="/work"
            className="enter-fade-up group inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            style={delay(0)}
          >
            <ArrowLeft size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" aria-hidden="true" />
            {t('back')}
          </Link>

          <p className="enter-fade-up text-eyebrow mt-10 text-fg-subtle" style={delay(0.05)}>
            {project.discipline[locale]}
          </p>
          <h1 className="text-display mt-6 max-w-5xl">
            <span className="line-mask">
              <span style={delay(0.1)}>{project.title}</span>
            </span>
          </h1>
          <p className="enter-fade-up text-lead mt-8 max-w-3xl text-fg-muted" style={delay(0.3)}>
            {project.summary[locale]}
          </p>

          <dl
            className="enter-fade-up mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4"
            style={delay(0.4)}
          >
            <div>
              <dt className="text-eyebrow text-fg-subtle">{t('role')}</dt>
              <dd className="mt-3 space-y-1 text-[0.95rem] text-fg">
                {project.role[locale].map((item) => (
                  <span key={item} className="block">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
            {project.technologies && (
              <div>
                <dt className="text-eyebrow text-fg-subtle">{t('technologies')}</dt>
                <dd className="mt-3 space-y-1 text-[0.95rem] text-fg">
                  {project.technologies.map((item) => (
                    <span key={item} className="block">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt className="text-eyebrow text-fg-subtle">{t('year')}</dt>
                <dd className="mt-3 text-[0.95rem] text-fg">{project.year}</dd>
              </div>
            )}
            <div className="sm:col-span-2 lg:col-span-1 lg:col-start-4 lg:justify-self-end">
              <dt className="sr-only">{classification(project.classification)}</dt>
              <dd>
                <p aria-hidden="true" className="text-sm text-fg-subtle">
                  {classification(project.classification)}
                </p>
                <div className="mt-4">
                  {project.liveUrl ? (
                    <ButtonLink
                      href={project.liveUrl}
                      external
                      magnetic
                      ariaLabel={t('visitAria', { title: project.title })}
                    >
                      {t('visit')}
                    </ButtonLink>
                  ) : (
                    <span className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm text-fg-muted">
                      {t('youAreHere')}
                    </span>
                  )}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Cover */}
      <div className="container-page mt-16 md:mt-24">
        <div
          className="enter-fade relative overflow-hidden rounded-[1.75rem] border border-line px-[5%] pt-[5%]"
          style={{ ...delay(0.45), background: `radial-gradient(120% 90% at 50% 0%, ${tint}, transparent 75%)` }}
        >
          <div aria-hidden="true" className="bg-grain absolute inset-0" />
          <div className="relative overflow-hidden rounded-t-xl shadow-[0_40px_120px_-30px_rgb(0_0_0/0.85)] ring-1 ring-white/10">
            <Image
              src={project.cover.src}
              alt={project.cover.alt[locale]}
              width={project.cover.width}
              height={project.cover.height}
              priority
              sizes="(min-width: 1408px) 1190px, 85vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      {/* Overview */}
      <section aria-labelledby="overview" className="section-y">
        <div className="container-page grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel as="h2" id="overview" index={nextIndex()}>
              {t('overview')}
            </SectionLabel>
          </div>
          <Reveal className="space-y-6 md:col-span-8">
            {project.description[locale].map((paragraph, i) => (
              <p key={i} className={i === 0 ? 'text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-[-0.02em] text-fg' : 'text-lead text-fg-muted'}>
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section aria-labelledby="highlights" className="pb-24 md:pb-32">
          <div className="container-page">
            <SectionLabel as="h2" id="highlights" index={nextIndex()}>
              {t('highlights')}
            </SectionLabel>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-2">
              {highlights.map((item, i) => (
                <Reveal as="li" key={item.title} delay={(i % 2) * 0.08} className="bg-canvas p-8 md:p-10">
                  <span className="text-sm tabular-nums text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 text-xl font-medium tracking-[-0.02em] text-fg">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-fg-muted">{item.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Film */}
      {project.videos && project.videos.length > 0 && (
        <section aria-labelledby="film" className="pb-24 md:pb-32">
          <div className="container-page">
            <SectionLabel as="h2" id="film" index={nextIndex()}>
              {t('film')}
            </SectionLabel>
            <div className="mt-12 space-y-16">
              {project.videos.map((video) => (
                <Reveal key={video.src} className="grid items-center gap-10 lg:grid-cols-12">
                  <div className={video.aspectRatio === '16:9' ? 'lg:col-span-12' : 'lg:col-span-7'}>
                    <VideoPlayer
                      video={{
                        src: video.src,
                        webm: video.webm,
                        poster: video.poster,
                        aspectRatio: video.aspectRatio,
                        title: video.title[locale],
                        captions: video.captions,
                      }}
                    />
                  </div>
                  <div className={video.aspectRatio === '16:9' ? 'lg:col-span-12' : 'lg:col-span-5'}>
                    <h3 className="text-xl font-medium tracking-[-0.02em]">{video.title[locale]}</h3>
                    {video.specs && <VideoSpecs specs={video.specs} />}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section aria-labelledby="gallery" className="pb-24 md:pb-32">
          <div className="container-page">
            <SectionLabel as="h2" id="gallery" index={nextIndex()}>
              {t('gallery')}
            </SectionLabel>
            <div className="mt-12">
              <ProjectGallery images={project.gallery} locale={locale} tint={project.tint} />
            </div>
          </div>
        </section>
      )}

      {/* Approach & outcomes */}
      {(approach.length > 0 || outcomes.length > 0) && (
        <section aria-label={t('approach')} className="border-t border-line section-y">
          <div className="container-page grid gap-16 md:grid-cols-2">
            {approach.length > 0 && (
              <div>
                <SectionLabel as="h2" index={nextIndex()}>{t('approach')}</SectionLabel>
                <ol className="mt-10 space-y-6">
                  {approach.map((item, i) => (
                    <Reveal as="li" key={i} delay={i * 0.06} className="flex gap-5 border-b border-line pb-6">
                      <span className="pt-0.5 text-sm tabular-nums text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-lg leading-relaxed text-fg">{item}</p>
                    </Reveal>
                  ))}
                </ol>
              </div>
            )}
            {outcomes.length > 0 && (
              <div>
                <SectionLabel as="h2" index={nextIndex()}>{t('outcomes')}</SectionLabel>
                <ul className="mt-10 space-y-4">
                  {outcomes.map((item, i) => (
                    <li key={i} className="text-lg text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next project */}
      {next && (
        <section aria-label={t('nextProject')} className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group block">
            <div className="container-page grid items-center gap-10 py-20 md:grid-cols-12 md:py-28">
              <div className="md:col-span-7">
                <p className="text-eyebrow text-fg-subtle">{t('nextProject')}</p>
                <p className="text-headline mt-6 flex items-center gap-5 transition-transform duration-700 ease-out-expo group-hover:translate-x-2">
                  {next.title}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-8 shrink-0 text-fg-muted transition-[transform,color] duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-fg md:size-12"
                    strokeWidth={1.25}
                  />
                </p>
                <p className="mt-4 text-fg-muted">{next.discipline[locale]}</p>
              </div>
              <div className="md:col-span-5">
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-line"
                  style={{ background: `radial-gradient(120% 90% at 50% 0%, ${next.tint ?? tint}, transparent 75%)` }}
                >
                  <div className="absolute inset-x-[8%] bottom-0 top-[10%] overflow-hidden rounded-t-lg ring-1 ring-white/10 transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]">
                    <Image src={next.cover.src} alt="" fill sizes="(min-width: 768px) 38vw, 100vw" className="object-cover object-top" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <ContactCta />
    </article>
  );
}
