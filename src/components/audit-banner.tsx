'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function AuditBanner() {
  const t = useTranslations('AuditBanner');

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="glass-panel glass-panel-interactive flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold text-[color:var(--text-primary)]">
              {t('title')}
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{t('subtitle')}</p>
          </div>

          <Link
            href="/audit"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
          >
            {t('cta')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
