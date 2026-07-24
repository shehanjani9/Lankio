'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Palette, Sparkles, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { SERVICE_KEYS, type ServiceKey } from '@/lib/services-data';

const ICONS: Record<ServiceKey, typeof Code2> = {
  webDev: Code2,
  branding: Palette,
  ai: Sparkles,
  marketing: TrendingUp,
};

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

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.08 }}
                className="glass-panel glass-panel-interactive flex flex-col p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-primary-soft)]">
                  <Icon size={22} className="text-primary" />
                </div>

                <h3 className="font-display mt-5 text-xl font-semibold text-[color:var(--text-primary)]">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  {t(`items.${key}.description`)}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[color:var(--text-secondary)]">
                      <Check size={15} className="mt-0.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-5">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
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
