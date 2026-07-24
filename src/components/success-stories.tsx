'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { SUCCESS_STORIES } from '@/lib/success-stories-data';

export function SuccessStories() {
  const t = useTranslations('SuccessStories');
  const reduceMotion = useReducedMotion();

  return (
    <section id="caseStudies" className="px-6 py-24">
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

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SUCCESS_STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.1 }}
              className="glass-panel flex flex-col p-6"
            >
              <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
                {t(`categories.${story.categoryKey}`)}
              </span>

              <div className="mt-5 flex flex-col gap-4 text-sm">
                <div className="flex gap-2.5">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-secondary" />
                  <p className="text-[color:var(--text-secondary)]">
                    {t(`stories.${story.id}.problem`)}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary" />
                  <p className="text-[color:var(--text-secondary)]">
                    {t(`stories.${story.id}.solution`)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-[color:var(--glass-border)] px-4 py-3">
                <TrendingUp size={20} className="text-primary" />
                <div>
                  <div className="font-display text-xl font-semibold text-[color:var(--text-primary)]">
                    {story.metricValue}
                  </div>
                  <div className="text-xs text-[color:var(--text-muted)]">
                    {t(`metrics.${story.metricLabelKey}`)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-[color:var(--text-muted)]">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
