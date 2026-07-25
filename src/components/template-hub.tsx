'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Gauge, Clock, ArrowUpRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES, CATEGORIES, type TemplateCategory, type Template } from '@/lib/templates-data';
import { TemplatePreviewImage } from './template-mockup';
import { TemplatePreviewModal } from './template-preview-modal';
import { Button } from '@/components/ui/button';

export function TemplateHub() {
  const t = useTranslations('TemplateHub');
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

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
            <Button
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
            </Button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="relative h-36 overflow-hidden p-3">
                  <TemplatePreviewImage
                    src={template.image}
                    alt={`${template.name} template preview`}
                    category={template.category}
                  />

                  <Button
                    onClick={() => setPreviewTemplate(template)}
                    className="absolute inset-3 flex items-center justify-center gap-2 rounded-lg bg-black/0 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100 group-hover:backdrop-blur-[1px]"
                  >
                    <Maximize2 size={15} />
                    {t('liveDemo')}
                  </Button>
                </div>

                <div className="p-5 pt-0">
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

                    <Button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5"
                      aria-label={`${t('preview')} ${template.name}`}
                    >
                      {t('preview')}
                      <ArrowUpRight size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
    </section>
  );
}