'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Gauge, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES, CATEGORIES, type TemplateCategory } from '@/lib/templates-data';

export function TemplateHub() {
  const t = useTranslations('TemplateHub');
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return TEMPLATES;
    return TEMPLATES.filter((template) => template.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="templates" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
            {t('eyebrow')}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-[color:var(--text-secondary)]">{t('subtitle')}</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm transition-colors',
                activeCategory === key
                  ? 'border-transparent bg-primary text-white'
                  : 'border-[color:var(--glass-border)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
              )}
            >
              {t(`categories.${labelKey}`)}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
                className="glass-panel glass-panel-interactive group overflow-hidden"
              >
                <div
                  className="flex h-40 items-center justify-center text-4xl font-semibold text-white/90"
                  style={{
                    background: `linear-gradient(135deg, hsl(${template.accentHue} 70% 55% / 0.9), hsl(${template.accentHue + 40} 70% 40% / 0.9))`,
                  }}
                >
                  {template.name.charAt(0)}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-[color:var(--text-primary)]">
                      {template.name}
                    </h3>
                    <span className="font-mono-label text-[10px] text-[color:var(--text-muted)]">
                      {t(`categories.${template.category}`)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-[color:var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <Gauge size={14} className="text-primary" />
                      {template.lighthouseScore}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      {template.buildWeeks} {t('weeks')}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-[color:var(--text-secondary)]">
                      {t('from')}{' '}
                      <span className="font-display font-semibold text-[color:var(--text-primary)]">
                        €{template.priceFrom.toLocaleString()}
                      </span>
                    </span>
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5"
                      aria-label={`${t('preview')} ${template.name}`}
                    >
                      {t('preview')}
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
