'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { CASE_STUDIES } from '@/lib/case-studies-data';

export function CaseStudiesSection() {
  const t = useTranslations('CaseStudies');
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
          {CASE_STUDIES.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.1 }}
              className="glass-panel flex flex-col p-6"
            >
              <div
                className="mb-5 h-1 w-12 rounded-full"
                style={{ background: `hsl(${study.accentHue} 70% 55%)` }}
              />

              <h3 className="font-display text-lg font-semibold text-[color:var(--text-primary)]">
                {study.client}
              </h3>
              <span className="font-mono-label mt-1 text-[10px] text-[color:var(--text-muted)]">
                {t(`industries.${study.industry}`)}
              </span>

              <div className="mt-5 flex flex-col gap-4 text-sm">
                <div className="flex gap-2.5">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-secondary" />
                  <p className="text-[color:var(--text-secondary)]">{t(study.problem)}</p>
                </div>
                <div className="flex gap-2.5">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary" />
                  <p className="text-[color:var(--text-secondary)]">{t(study.solution)}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-[color:var(--glass-border)] px-4 py-3">
                <TrendingUp size={20} className="text-primary" />
                <div>
                  <div className="font-display text-xl font-semibold text-[color:var(--text-primary)]">
                    {study.resultValue}
                  </div>
                  <div className="text-xs text-[color:var(--text-muted)]">{t(study.resultLabel)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
