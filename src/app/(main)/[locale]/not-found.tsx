import { getTranslations } from 'next-intl/server';
import { Compass } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// Server Component -- uses getTranslations/next-intl's request-scoped
// context rather than route params, since not-found.tsx does not reliably
// receive the [locale] param the way a normal page does.
export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base px-6 text-center">
      <span className="font-mono-label text-xs text-[color:var(--text-muted)]">404</span>
      <h1 className="font-display mt-4 text-3xl font-semibold text-[color:var(--text-primary)] sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mt-4 max-w-md text-base text-[color:var(--text-secondary)]">
        {t('description')}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
      >
        <Compass size={16} />
        {t('backHome')}
      </Link>
    </main>
  );
}
