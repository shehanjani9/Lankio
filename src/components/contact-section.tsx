'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, CheckCircle2, Mail } from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactSection() {
  const t = useTranslations('Contact');
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = t('errors.name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = t('errors.email');
    if (!message) nextErrors.message = t('errors.message');

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
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

        <div className="glass-panel mt-8 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
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
                <Field
                  name="name"
                  label={t('fields.name')}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  name="email"
                  type="email"
                  label={t('fields.email')}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field name="message" label={t('fields.message')} error={errors.message} textarea />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === 'submitting' ? t('sending') : t('submit')}
                  <Send size={16} />
                </button>

                {status === 'error' && (
                  <p className="text-center text-sm text-secondary">{t('errors.general')}</p>
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
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
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
          className={`${baseClass} ${borderClass} resize-none`}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          className={`${baseClass} ${borderClass}`}
          aria-invalid={Boolean(error)}
        />
      )}
      {error && <p className="mt-1 text-left text-xs text-secondary">{error}</p>}
    </div>
  );
}
