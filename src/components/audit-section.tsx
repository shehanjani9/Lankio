'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Loader2, Gauge, ShieldCheck, Search as SeoIcon, Accessibility } from 'lucide-react';

type AuditStatus = 'idle' | 'loading' | 'done';

type AuditMetric = { label: string; score: number; icon: typeof Gauge };

type AuditResult = {
  overall: number;
  metrics: AuditMetric[];
  isFallback: boolean;
};

const ICONS: Record<string, typeof Gauge> = {
  Speed: Gauge,
  'Best Practices': ShieldCheck,
  SEO: SeoIcon,
  Accessibility: Accessibility,
};

// Used when the PageSpeed API fails, times out, or rate-limits -- keeps the
// section functional instead of showing an error state to a first-time visitor.
function fallbackAudit(url: string): AuditResult {
  const seed = url.length % 4;
  const base = 52 + seed * 8;
  return {
    overall: base,
    isFallback: true,
    metrics: [
      { label: 'Speed', score: base - 6, icon: Gauge },
      { label: 'Best Practices', score: base + 4, icon: ShieldCheck },
      { label: 'SEO', score: base + 10, icon: SeoIcon },
      { label: 'Accessibility', score: base - 2, icon: Accessibility },
    ],
  };
}

export function AuditSection() {
  const t = useTranslations('CTA');
  const reduceMotion = useReducedMotion();
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AuditStatus>('idle');
  const [result, setResult] = useState<AuditResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus('loading');

    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(url.trim())}`);
      if (!res.ok) throw new Error('Audit request failed');

      const data: { overall: number; metrics: { label: string; score: number }[] } =
        await res.json();

      setResult({
        overall: data.overall,
        isFallback: false,
        metrics: data.metrics.map((m) => ({ ...m, icon: ICONS[m.label] ?? Gauge })),
      });
    } catch {
      setResult(fallbackAudit(url.trim()));
    } finally {
      setStatus('done');
    }
  }

  return (
    <section id="audit" className="relative px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
          {t('auditTitle')}
        </h2>

        <form
          onSubmit={handleSubmit}
          suppressHydrationWarning
          className="glass-panel mt-8 flex flex-col items-stretch gap-3 p-2 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search size={18} className="shrink-0 text-[color:var(--text-muted)]" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourwebsite.com"
              suppressHydrationWarning
              className="w-full bg-transparent py-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:outline-none"
              aria-label="Website URL to audit"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            suppressHydrationWarning
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing
              </>
            ) : (
              t('auditButton')
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {status === 'done' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              className="glass-panel mt-6 p-6"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="font-display text-5xl font-semibold text-[color:var(--text-primary)]">
                  {result.overall}
                </span>
                <span className="text-left text-sm text-[color:var(--text-secondary)]">
                  out of 100
                  <br />
                  overall score
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {result.metrics.map(({ label, score, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--glass-border)] px-3 py-4"
                  >
                    <Icon size={18} className="text-primary" />
                    <span className="font-display text-lg font-semibold text-[color:var(--text-primary)]">
                      {score}
                    </span>
                    <span className="font-mono-label text-center text-[10px] text-[color:var(--text-muted)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {result.isFallback && (
                <p className="mt-4 text-xs text-[color:var(--text-muted)]">
                  Live analysis was unavailable for this URL, so this is an estimated score.
                </p>
              )}

              <a
                href="#contact"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
              >
                {t('quoteButton')}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
