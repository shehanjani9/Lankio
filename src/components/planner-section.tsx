'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BUSINESS_TYPES,
  PAGE_TIERS,
  FEATURES,
  computePlan,
  type BusinessType,
  type PageTier,
  type FeatureKey,
  type Timeline,
  type PlannerSelection,
} from '@/lib/planner-data';

const STEP_COUNT = 4;

export function PlannerSection() {
  const t = useTranslations('Planner');
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<PlannerSelection>({
    businessType: null,
    pageTier: null,
    features: [],
    timeline: 'standard',
  });

  const result = useMemo(() => computePlan(selection), [selection]);

  const canAdvance =
    (step === 0 && selection.businessType !== null) ||
    (step === 1 && selection.pageTier !== null) ||
    step === 2 ||
    step === 3;

  function toggleFeature(key: FeatureKey) {
    setSelection((prev) => ({
      ...prev,
      features: prev.features.includes(key)
        ? prev.features.filter((f) => f !== key)
        : [...prev.features, key],
    }));
  }

  function goNext() {
    if (step < STEP_COUNT - 1 && canAdvance) setStep((s) => s + 1);
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <section id="planner" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
            {t('eyebrow')}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-10 rounded-full transition-colors',
                i <= step ? 'bg-primary' : 'bg-[color:var(--glass-border)]'
              )}
            />
          ))}
        </div>

        <div className="glass-panel mt-6 min-h-[340px] overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -24 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              {step === 0 && (
                <StepGrid title={t('steps.businessType')}>
                  {BUSINESS_TYPES.map(({ key }) => (
                    <OptionCard
                      key={key}
                      selected={selection.businessType === key}
                      onClick={() => setSelection((p) => ({ ...p, businessType: key as BusinessType }))}
                    >
                      {t(`businessTypes.${key}`)}
                    </OptionCard>
                  ))}
                </StepGrid>
              )}

              {step === 1 && (
                <StepGrid title={t('steps.pages')}>
                  {PAGE_TIERS.map(({ key, label }) => (
                    <OptionCard
                      key={key}
                      selected={selection.pageTier === key}
                      onClick={() => setSelection((p) => ({ ...p, pageTier: key as PageTier }))}
                    >
                      {label} {t('pages')}
                    </OptionCard>
                  ))}
                </StepGrid>
              )}

              {step === 2 && (
                <StepGrid title={t('steps.features')}>
                  {FEATURES.map(({ key }) => (
                    <OptionCard
                      key={key}
                      selected={selection.features.includes(key)}
                      onClick={() => toggleFeature(key)}
                    >
                      {t(`features.${key}`)}
                    </OptionCard>
                  ))}
                </StepGrid>
              )}

              {step === 3 && result && (
                <div>
                  <h3 className="font-display mb-6 text-center text-lg font-semibold text-[color:var(--text-primary)]">
                    {t('steps.timeline')}
                  </h3>
                  <div className="mb-8 grid grid-cols-2 gap-3">
                    {(['standard', 'rush'] as Timeline[]).map((option) => (
                      <OptionCard
                        key={option}
                        selected={selection.timeline === option}
                        onClick={() => setSelection((p) => ({ ...p, timeline: option }))}
                      >
                        {t(`timeline.${option}`)}
                      </OptionCard>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[color:var(--glass-border)] p-6 text-center">
                    <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
                      {t('estimate')}
                    </span>
                    <div className="font-display mt-2 text-4xl font-semibold text-[color:var(--text-primary)]">
                      €{result.totalPrice.toLocaleString()}
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--text-secondary)]">
                      {t('delivery')}: {result.totalWeeks} {t('weeks')}
                    </div>
                    <div className="font-mono-label mt-4 inline-block rounded-full bg-[color:var(--accent-primary-soft)] px-3 py-1 text-xs text-primary">
                      {t(`packages.${result.packageTier}`)}
                    </div>
                    <a
                      href="#contact"
                      className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
                    >
                      {t('cta')}
                      <Check size={16} />
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] disabled:opacity-0"
          >
            <ArrowLeft size={16} />
            {t('back')}
          </button>

          {step < STEP_COUNT - 1 && (
            <button
              onClick={goNext}
              disabled={!canAdvance}
              className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              {t('next')}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function StepGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display mb-6 text-center text-lg font-semibold text-[color:var(--text-primary)]">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-xl border px-4 py-3 text-center text-sm transition-colors',
        selected
          ? 'border-transparent bg-primary text-white'
          : 'border-[color:var(--glass-border)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
      )}
    >
      {children}
    </button>
  );
}
