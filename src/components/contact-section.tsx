'use client';

import { Suspense, useMemo, useState, type FormEvent, type ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, CheckCircle2, Mail, X, Tag } from 'lucide-react';
import { TEMPLATES } from '@/lib/templates-data';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const SERVICE_KEYS = ['templateCustomization', 'customDevelopment', 'seoBranding', 'other'] as const;
const BUDGET_KEYS = ['range500to1000', 'range1000to2500', 'range2500plus'] as const;

export function ContactSection() {
  return (
    <Suspense fallback={<ContactSectionFallback />}>
      <ContactSectionInner />
    </Suspense>
  );
}

function ContactSectionFallback() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-xl">
        <div className="glass-panel h-[520px] animate-pulse" />
      </div>
    </section>
  );
}

function ContactSectionInner() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();

  const [templateSlug, setTemplateSlug] = useState<string | null>(searchParams.get('template'));
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'it'>(
    locale === 'it' ? 'it' : 'en'
  );

  const matchedTemplate = useMemo(() => {
    if (!templateSlug) return null;
    return TEMPLATES.find((template) => template.demoUrl.endsWith(`/${templateSlug}`)) ?? null;
  }, [templateSlug]);

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const company = String(form.get('company') || '').trim();
    const serviceType = String(form.get('serviceType') || '').trim();
    const budget = String(form.get('budget') || '').trim();
    const message = String(form.get('message') || '').trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = t('errors.name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = t('errors.email');
    if (!message) nextErrors.message = t('errors.message');
    if (!serviceType) nextErrors.serviceType = t('errors.serviceType');
    if (!budget) nextErrors.budget = t('errors.budget');

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          templateName: matchedTemplate?.name,
          serviceType,
          budget,
          preferredLanguage,
          message,
        }),
      });

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
            {t('eyebrow')}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-[color:var(--text-secondary)]">{t('subtitle')}</p>
        </div>

        <AnimatePresence>
          {matchedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-panel mt-6 flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
                <Tag size={14} className="text-primary" />
                {t('inquiringAbout', { template: matchedTemplate.name })}
              </span>
              <button
                type="button"
                onClick={() => setTemplateSlug(null)}
                aria-label={t('clearTemplate')}
                suppressHydrationWarning
                className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-panel mt-6 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <CheckCircle2 size={40} className="text-primary" />
                <h3 className="font-display mt-4 text-lg font-semibold text-[color:var(--text-primary)]">
                  {t('successTitle')}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  {t('successBody')}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                noValidate
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    name="name"
                    label={t('fields.name')}
                    error={errors.name}
                    onChange={() => clearError('name')}
                    autoComplete="name"
                  />
                  <Field name="company" label={t('fields.company')} autoComplete="organization" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    name="email"
                    type="email"
                    label={t('fields.email')}
                    error={errors.email}
                    onChange={() => clearError('email')}
                    autoComplete="email"
                  />
                  <Field name="phone" label={t('fields.phone')} autoComplete="tel" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    name="serviceType"
                    label={t('fields.serviceType')}
                    placeholder={t('selectPlaceholder')}
                    error={errors.serviceType}
                    onChange={() => clearError('serviceType')}
                    options={SERVICE_KEYS.map((key) => ({ value: key, label: t(`services.${key}`) }))}
                  />
                  <SelectField
                    name="budget"
                    label={t('fields.budget')}
                    placeholder={t('selectPlaceholder')}
                    error={errors.budget}
                    onChange={() => clearError('budget')}
                    options={BUDGET_KEYS.map((key) => ({ value: key, label: t(`budgets.${key}`) }))}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-left text-xs text-[color:var(--text-secondary)]">
                    {t('fields.preferredLanguage')}
                  </label>
                  <div className="flex gap-2">
                    {(['en', 'it'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setPreferredLanguage(lang)}
                        suppressHydrationWarning
                        className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                          preferredLanguage === lang
                            ? 'border-transparent bg-primary text-white'
                            : 'border-[color:var(--glass-border)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                        }`}
                      >
                        {t(`languages.${lang}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <Field
                  name="message"
                  label={t('fields.message')}
                  error={errors.message}
                  onChange={() => clearError('message')}
                  textarea
                />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  suppressHydrationWarning
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === 'submitting' ? t('sending') : t('submit')}
                  <Send size={16} />
                </button>

                {status === 'error' && (
                  <p role="alert" className="text-center text-sm text-secondary">
                    {t('errors.general')}
                  </p>
                )}

                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[color:var(--text-muted)]">
                  <Mail size={12} />
                  {t('directEmailNote')}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  error,
  type = 'text',
  autoComplete,
  textarea = false,
  onChange,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const baseClass =
    'w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:outline-none transition-colors';
  const borderClass = error
    ? 'border-secondary'
    : 'border-[color:var(--glass-border)] focus:border-[color:var(--accent-primary)]';

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-left text-xs text-[color:var(--text-secondary)]">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          onChange={onChange}
          suppressHydrationWarning
          className={`${baseClass} ${borderClass} resize-none`}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          onChange={onChange}
          suppressHydrationWarning
          className={`${baseClass} ${borderClass}`}
          aria-invalid={Boolean(error)}
        />
      )}
      {error && <p className="mt-1 text-left text-xs text-secondary">{error}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  placeholder,
  error,
  options,
  onChange,
}: {
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  options: { value: string; label: string }[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const borderClass = error
    ? 'border-secondary'
    : 'border-[color:var(--glass-border)] focus:border-[color:var(--accent-primary)]';

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-left text-xs text-[color:var(--text-secondary)]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        onChange={onChange}
        aria-invalid={Boolean(error)}
        suppressHydrationWarning
        className={`w-full rounded-xl border bg-[color:var(--glass-panel-bg,transparent)] px-4 py-3 text-sm text-[color:var(--text-primary)] focus:outline-none transition-colors ${borderClass}`}
      >
        <option value="" disabled className="bg-slate-900 text-[color:var(--text-muted)]">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900 text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-left text-xs text-secondary">{error}</p>}
    </div>
  );
}
