import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/button-link';

// not-found.tsx does not receive route params; next-intl resolves the locale
// from the request scope set by the layout.
export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <section className="relative isolate flex min-h-[80dvh] items-center overflow-hidden pt-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="animate-drift absolute left-1/4 top-0 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[120px]" />
        <div className="bg-grid absolute inset-0" />
      </div>
      <div className="container-page">
        <p className="text-eyebrow text-fg-subtle">{t('eyebrow')}</p>
        <h1 className="text-display mt-8 max-w-4xl">{t('title')}</h1>
        <p className="text-lead mt-6 max-w-xl text-fg-muted">{t('description')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">{t('home')}</ButtonLink>
          <ButtonLink href="/work" variant="secondary">
            {t('work')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
