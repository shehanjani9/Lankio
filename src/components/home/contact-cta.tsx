import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/button-link';
import { SectionLabel } from '@/components/ui/section-label';
import { Reveal, MaskedLine } from '@/components/motion/reveal';

export function ContactCta({ index }: { index?: string }) {
  const t = useTranslations('Home.cta');

  return (
    <section aria-labelledby="cta-title" className="section-y relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[50rem] max-w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <div className="container-page">
        <SectionLabel index={index}>{t('eyebrow')}</SectionLabel>
        <h2 id="cta-title" className="text-display mt-10 max-w-5xl">
          <MaskedLine>{t('titleLead')}</MaskedLine>
          <MaskedLine delay={0.1}>
            <span className="font-accent">{t('titleAccent')}</span>
          </MaskedLine>
        </h2>
        <Reveal delay={0.15} className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="text-lead max-w-xl text-fg-muted">{t('body')}</p>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <ButtonLink href="/contact" magnetic>
              {t('button')}
            </ButtonLink>
            <p className="text-sm text-fg-subtle">
              {t('or')}{' '}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
