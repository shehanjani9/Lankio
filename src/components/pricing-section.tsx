'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Minus, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRICING_TIERS, PRICING_FEATURE_KEYS, PRICING_ADDONS, type BillingMode } from '@/lib/pricing-data';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const t = useTranslations('Pricing');
  const reduceMotion = useReducedMotion();
  const [billing, setBilling] = useState<BillingMode>('oneTime');

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
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

        {/* Toggle Billing Mode */}
        <div className="mt-8 flex justify-center">
          <div className="glass-panel inline-flex gap-1 p-1">
            {(['oneTime', 'monthly'] as BillingMode[]).map((mode) => (
              <Button
                key={mode}
                onClick={() => setBilling(mode)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-colors',
                  billing === mode
                    ? 'bg-primary text-white'
                    : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                )}
              >
                {t(`billing.${mode}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_TIERS.map((tier, i) => {
            const price = billing === 'oneTime' ? tier.oneTimePrice : tier.monthlyPrice;

            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.08 }}
                className={cn(
                  'glass-panel relative flex flex-col p-6',
                  tier.popular && 'border-primary/60 ring-1 ring-primary/40'
                )}
              >
                {tier.popular && (
                  <span className="font-mono-label absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] text-white">
                    <Star size={11} className="fill-white" />
                    {t('mostPopular')}
                  </span>
                )}

                <h3 className="font-display text-lg font-semibold text-[color:var(--text-primary)]">
                  {t(`tiers.${tier.key}.name`)}
                </h3>
                <p className="mt-1 text-xs text-[color:var(--text-secondary)] min-h-[36px]">
                  {t(`tiers.${tier.key}.description`)}
                </p>

                <div className="mt-6">
                  {price === null ? (
                    <span className="font-display text-2xl font-semibold text-[color:var(--text-primary)]">
                      {t('customQuote')}
                    </span>
                  ) : (
                    <span className="font-display text-3xl font-semibold text-[color:var(--text-primary)]">
                      €{price.toLocaleString()}
                      <span className="text-xs font-normal text-[color:var(--text-muted)]">
                        {billing === 'monthly' ? t('perMonth') : ''}
                      </span>
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {PRICING_FEATURE_KEYS.map((featureKey, idx) => {
                    const included = idx < tier.featureCount;
                    return (
                      <li
                        key={featureKey}
                        className={cn(
                          'flex items-start gap-2 text-xs',
                          included ? 'text-[color:var(--text-secondary)]' : 'text-[color:var(--text-muted)] opacity-40'
                        )}
                      >
                        {included ? (
                          <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                        ) : (
                          <Minus size={14} className="mt-0.5 shrink-0" />
                        )}
                        {t(`features.${featureKey}`)}
                      </li>
                    );
                  })}
                </ul>

                <a
                  href="#contact"
                  className={cn(
                    'mt-7 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium transition-transform hover:scale-[1.02]',
                    tier.popular
                      ? 'bg-primary text-white'
                      : 'glass-panel glass-panel-interactive text-[color:var(--text-primary)]'
                  )}
                >
                  {tier.key === 'customEnterprise' ? t('contactSales') : t('getStarted')}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Optional Add-ons Section */}
        <div className="mt-16 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6 md:p-8">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
                {t('addonsTitle')}
              </h3>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {t('addonsSubtitle')}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_ADDONS.map((addon) => (
              <div
                key={addon.key}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-glass)]"
              >
                <div className="flex items-center gap-2">
                  <Plus size={14} className="text-primary" />
                  <span className="text-xs font-medium text-[color:var(--text-primary)]">
                    {t(`addons.${addon.key}`)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[color:var(--text-primary)]">
                  +€{addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}