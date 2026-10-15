import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/button-link';
import { HeroPortrait } from './hero-portrait';
import { HeroSpotlight } from './hero-spotlight';

const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as React.CSSProperties;

export function Hero() {
  const t = useTranslations('Home.hero');
  const common = useTranslations('Common');

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36 lg:min-h-[min(100dvh,60rem)]"
    >
      {/* Ambient background: drifting light, a faded grid and film grain. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="animate-drift absolute -left-[10%] top-[-20%] h-[38rem] w-[38rem] rounded-full bg-accent/[0.13] blur-[120px]" />
        <div className="animate-drift-slow absolute right-[-15%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-accent-blue/[0.09] blur-[120px]" />
        <div className="bg-grid absolute inset-0" />
        <div className="bg-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-canvas" />
      </div>
      <HeroSpotlight />

      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="enter-fade-up text-eyebrow flex items-center gap-3 text-fg-muted" style={delay(0.05)}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gradient-to-br from-accent to-accent-blue" />
            {t('eyebrow')}
          </p>

          <h1
            id="hero-title"
            className="mt-7 text-[clamp(2.6rem,5.6vw,5.6rem)] font-[550] leading-[1] tracking-[-0.045em] text-balance-pretty"
          >
            <span className="line-mask">
              <span style={delay(0.12)}>{t('titleLine1')}</span>
            </span>
            <span className="line-mask text-fg-muted">
              <span style={delay(0.26)}>
                {t('titleLine2Lead')} <span className="font-accent text-fg">{t('titleLine2Accent')}</span>
              </span>
            </span>
          </h1>

          <p className="enter-fade-up text-lead mt-8 max-w-xl text-fg-muted" style={delay(0.5)}>
            {t('intro')}
          </p>

          <div className="enter-fade-up mt-10 flex flex-wrap items-center gap-3" style={delay(0.62)}>
            <ButtonLink href="/work" magnetic>
              {t('primaryCta')}
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" magnetic>
              {t('secondaryCta')}
            </ButtonLink>
          </div>

          <p className="enter-fade-up mt-12 text-sm tracking-[0.01em] text-fg-subtle" style={delay(0.75)}>
            {t('disciplines')}
          </p>
        </div>

        <div className="lg:col-span-5">
          <HeroPortrait
            alt={t('portraitAlt')}
            captionTop={common('basedIn')}
            captionBottom={common('originallyFrom')}
          />
        </div>
      </div>
    </section>
  );
}
