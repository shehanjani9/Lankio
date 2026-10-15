'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Check, LoaderCircle, RotateCcw } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  LIMITS,
  PROJECT_TYPES,
  REPLY_LANGUAGES,
  TIMELINES,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from '@/lib/contact';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rateLimited';

const FIELD_ORDER: (keyof ContactInput)[] = ['name', 'email', 'company', 'projectType', 'message'];

export function ContactForm() {
  const t = useTranslations('Contact.form');
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const mountedAt = useRef<number>(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ContactErrors>({});

  // Time since the form first appeared (bot heuristic). Set once: resetting
  // it on status changes would make a quick retry after an error look like
  // a bot and get silently dropped by the API.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function errorText(field: keyof ContactInput): string | undefined {
    const code = errors[field];
    if (!code) return undefined;
    return t(`errors.${code}`);
  }

  function clearError(field: keyof ContactInput) {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const result = validateContact(payload);
    if (result.errors) {
      setErrors(result.errors);
      const first = FIELD_ORDER.find((field) => result.errors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.data,
          website: String(form.get('website') ?? ''),
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      if (response.status === 429) return setStatus('rateLimited');
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-[1.75rem] border border-line bg-surface p-8 md:p-12">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Check size={22} aria-hidden="true" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="text-title mt-8 outline-none">
          {t('successTitle')}
        </h2>
        <p className="mt-4 max-w-md text-fg-muted">{t('successBody')}</p>
        <button
          type="button"
          onClick={() => {
            mountedAt.current = Date.now();
            setStatus('idle');
          }}
          className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <RotateCcw size={15} aria-hidden="true" />
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;
  const submitting = status === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="contact-form-legend"
      className="rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8 md:p-10"
    >
      <h2 id="contact-form-legend" className="sr-only">
        {t('legend')}
      </h2>

      {hasErrors && (
        <p role="alert" className="mb-8 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {t('errors.summary')}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label={t('name')}
          autoComplete="name"
          maxLength={LIMITS.name}
          required
          error={errorText('name')}
          onInput={() => clearError('name')}
        />
        <TextField
          name="email"
          type="email"
          label={t('email')}
          autoComplete="email"
          inputMode="email"
          maxLength={LIMITS.email}
          required
          error={errorText('email')}
          onInput={() => clearError('email')}
        />
        <TextField
          name="company"
          label={t('company')}
          optionalLabel={t('optional')}
          autoComplete="organization"
          maxLength={LIMITS.company}
          error={errorText('company')}
          onInput={() => clearError('company')}
        />
        <SelectField
          name="projectType"
          label={t('projectType')}
          placeholder={t('projectTypePlaceholder')}
          required
          options={PROJECT_TYPES.map((value) => ({ value, label: t(`projectTypes.${value}`) }))}
          error={errorText('projectType')}
          onChange={() => clearError('projectType')}
        />
        <SelectField
          name="timeline"
          label={t('timeline')}
          optionalLabel={t('optional')}
          placeholder={t('timelinePlaceholder')}
          options={TIMELINES.map((value) => ({ value, label: t(`timelines.${value}`) }))}
        />
        <fieldset>
          <legend className="mb-2.5 text-sm text-fg-muted">{t('language')}</legend>
          <div className="flex gap-2">
            {REPLY_LANGUAGES.map((value) => (
              <label key={value} className="relative flex-1">
                <input
                  type="radio"
                  name="language"
                  value={value}
                  defaultChecked={value === locale}
                  className="peer sr-only"
                />
                <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-line text-sm text-fg-muted transition-colors peer-checked:border-fg peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {t(`languages.${value}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6">
        <TextField
          name="message"
          label={t('message')}
          hint={t('messageHint')}
          textarea
          maxLength={LIMITS.message}
          required
          error={errorText('message')}
          onInput={() => clearError('message')}
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">{t('honeypot')}</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-fg-subtle">
          {t.rich('privacyNote', {
            link: (chunks) => (
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-fg">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-fg px-7 font-medium text-canvas transition-colors hover:bg-white disabled:cursor-progress disabled:opacity-70"
        >
          {submitting ? t('sending') : t('submit')}
          {submitting ? (
            <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" aria-hidden="true" />
          )}
        </button>
      </div>

      <div aria-live="assertive">
        {(status === 'error' || status === 'rateLimited') && (
          <p className="mt-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {status === 'rateLimited' ? t('errors.rateLimited') : t('errors.general')}
          </p>
        )}
      </div>
    </form>
  );
}

const FIELD_CLASS =
  'w-full rounded-xl border bg-canvas/60 px-4 text-[1rem] text-fg placeholder:text-fg-subtle transition-colors duration-200 focus:border-fg/60 focus:outline-none focus-visible:outline-none';

function FieldShell({
  id,
  label,
  optionalLabel,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 flex items-baseline justify-between gap-3 text-sm text-fg-muted">
        <span>{label}</span>
        {optionalLabel && <span className="text-xs text-fg-subtle">{optionalLabel}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-fg-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;
}

function TextField({
  name,
  label,
  optionalLabel,
  hint,
  error,
  textarea = false,
  type = 'text',
  required,
  autoComplete,
  inputMode,
  maxLength,
  onInput,
}: {
  name: string;
  label: string;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  textarea?: boolean;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  onInput?: () => void;
}) {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    required,
    maxLength,
    onInput,
    'aria-invalid': Boolean(error) || undefined,
    'aria-describedby': describedBy(id, hint, error),
    className: cn(FIELD_CLASS, error ? 'border-danger/70' : 'border-line'),
  };

  return (
    <FieldShell id={id} label={label} optionalLabel={optionalLabel} hint={hint} error={error}>
      {textarea ? (
        <textarea {...shared} rows={6} className={cn(shared.className, 'resize-y py-3.5 leading-relaxed')} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} inputMode={inputMode} className={cn(shared.className, 'h-12')} />
      )}
    </FieldShell>
  );
}

function SelectField({
  name,
  label,
  optionalLabel,
  placeholder,
  options,
  required,
  error,
  onChange,
}: {
  name: string;
  label: string;
  optionalLabel?: string;
  placeholder: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  onChange?: () => void;
}) {
  const id = `contact-${name}`;
  return (
    <FieldShell id={id} label={label} optionalLabel={optionalLabel} error={error}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        onChange={onChange}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, undefined, error)}
        className={cn(FIELD_CLASS, 'h-12 cursor-pointer appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10', error ? 'border-danger/70' : 'border-line')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a3a8b4' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
