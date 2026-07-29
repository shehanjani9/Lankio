'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Palette, Sparkles, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_KEYS, type ServiceKey } from '@/lib/services-data';

const ICONS: Record<ServiceKey, typeof Code2> = {
  webDev: Code2,
  branding: Palette,
  ai: Sparkles,
  marketing: TrendingUp,
};

// Presentation-only hierarchy hint: which of the current four services reads
// as a complementary add-on rather than a core offering. This is a local,
// hardcoded list -- NOT sourced from services-data.ts -- so it can be
// removed/replaced once the service catalog itself is restructured into
// primary vs. supporting capabilities in a later phase.
const ADDON_KEYS: ServiceKey[] = ['ai'];

export function ServicesSection() {
  const t = useTranslations('Services');
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
            {t('eyebrow')}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[color:var(--text-secondary)]">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICE_KEYS.map((key, i) => {
            const Icon = ICONS[key];
            const features = t.raw(`items.${key}.features`) as string[];
            const isAddon = ADDON_KEYS.includes(key);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.08 }}
                className="glass-panel glass-panel-interactive flex flex-col p-7"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl',
                    isAddon ? 'bg-[color:var(--glass-border)]' : 'bg-[color:var(--accent-primary-soft)]'
                  )}
                >
                  <Icon size={22} className={isAddon ? 'text-[color:var(--text-muted)]' : 'text-primary'} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-semibold text-[color:var(--text-primary)]">
                    {t(`items.${key}.title`)}
                  </h3>
                  {isAddon && (
                    <span className="font-mono-label rounded-full border border-[color:var(--glass-border)] px-2.5 py-1 text-[10px] text-[color:var(--text-muted)]">
                      {t('addonLabel')}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  {t(`items.${key}.description`)}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[color:var(--text-secondary)]">
                      <Check
                        size={15}
                        className={cn('mt-0.5 shrink-0', isAddon ? 'text-[color:var(--text-muted)]' : 'text-primary')}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-5">
                  <a
                    href="#contact"
                    className={cn(
                      'inline-flex items-center gap-1.5 text-sm font-medium',
                      isAddon ? 'text-[color:var(--text-secondary)]' : 'text-primary'
                    )}
                  >
                    {t('learnMore')}
                    <ArrowRight size={14} />
                  </a>
                  <a
                    href="#planner"
                    className="text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
                  >
                    {t('getStarted')}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
