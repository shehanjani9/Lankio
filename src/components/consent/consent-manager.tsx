'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  getConsent,
  onOpenConsentPreferences,
  openConsentPreferences,
  saveConsent,
  subscribeConsent,
} from '@/lib/consent';
import { cn } from '@/lib/utils';
import { Analytics } from './analytics';

// Accept and Reject share one style so neither choice is visually favoured.
const CHOICE =
  'inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-medium text-fg transition-colors hover:border-fg/50 hover:bg-white/[0.06] sm:flex-none';

/**
 * Consent banner + preferences dialog + consent-gated analytics.
 *
 * - Nothing optional runs until the visitor actively accepts.
 * - The banner is non-blocking (no cookie wall); closing it with X keeps
 *   the defaults, i.e. analytics stays off, and records that choice.
 * - The choice can be changed at any time from the footer or cookie policy.
 * - Server render returns nothing, so static pages never vary by visitor.
 */
export function ConsentManager({ gaId }: { gaId?: string }) {
  const t = useTranslations('Consent');
  // undefined = not yet known (server render / before hydration)
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => undefined);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const openPreferences = useCallback(() => {
    // Start from the stored choice; with no choice yet, optional is off.
    setAnalyticsDraft(getConsent()?.analytics ?? false);
    setDialogOpen(true);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  useEffect(() => onOpenConsentPreferences(openPreferences), [openPreferences]);

  function decide(analytics: boolean) {
    saveConsent({ analytics });
    setAnnouncement(t('saved'));
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  // While consent is unknown (server render and hydration) the banner is
  // rendered; the inline boot script + CSS hide it for returning visitors.
  const showBanner = (consent === undefined || consent === null) && !dialogOpen;

  return (
    <>
      {gaId && <Analytics gaId={gaId} enabled={consent?.analytics === true} />}

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {showBanner && (
        <section
          data-consent-banner
          aria-labelledby="consent-title"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-[1.25rem] border border-line-strong bg-surface/95 p-5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <button
            type="button"
            onClick={() => decide(false)}
            aria-label={t('close')}
            className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <h2 id="consent-title" className="pr-10 text-base font-medium tracking-[-0.01em] text-fg">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {t.rich('body', {
              link: (chunks) => (
                <Link href="/cookie-policy" className="text-fg underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => decide(false)} className={CHOICE}>
              {t('reject')}
            </button>
            <button type="button" onClick={() => decide(true)} className={CHOICE}>
              {t('accept')}
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="inline-flex min-h-11 w-full items-center justify-center px-3 text-sm text-fg-muted underline underline-offset-4 transition-colors hover:text-fg sm:ml-auto sm:w-auto"
            >
              {t('preferences')}
            </button>
          </div>
        </section>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="consent-dialog-title"
        onClose={() => setDialogOpen(false)}
        className="m-auto w-[min(36rem,calc(100vw-1.5rem))] rounded-[1.5rem] border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="consent-dialog-title" className="text-xl font-medium tracking-[-0.02em]">
              {t('dialogTitle')}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={t('closeDialog')}
              className="-mr-2 -mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t('dialogIntro')}</p>

          <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-medium">{t('necessaryTitle')}</h3>
                <span className="text-xs text-fg-subtle">{t('alwaysOn')}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t('necessaryBody')}</p>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 id="consent-analytics-label" className="text-sm font-medium">
                  {t('analyticsTitle')}
                </h3>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsDraft}
                  aria-labelledby="consent-analytics-label"
                  onClick={() => setAnalyticsDraft((value) => !value)}
                  className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors',
                    analyticsDraft ? 'border-fg bg-fg' : 'border-line-strong bg-canvas'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute size-5 rounded-full transition-transform duration-300 ease-out-expo',
                      analyticsDraft ? 'translate-x-[1.45rem] bg-canvas' : 'translate-x-1 bg-fg-muted'
                    )}
                  />
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t('analyticsBody')}</p>
            </div>
          </div>

          {/* Reject and Accept sit side by side at every size, so neither is harder to reach. */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button type="button" onClick={() => decide(false)} className={CHOICE}>
              {t('rejectAll')}
            </button>
            <button type="button" onClick={() => decide(true)} className={CHOICE}>
              {t('acceptAll')}
            </button>
            <button
              type="button"
              onClick={() => decide(analyticsDraft)}
              className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-full bg-fg px-5 text-sm font-medium text-canvas transition-colors hover:bg-white sm:ml-auto"
            >
              {t('save')}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

/** Text button that reopens the preferences dialog (footer, cookie policy). */
export function CookieSettingsButton({ className, label }: { className?: string; label: string }) {
  return (
    <button
      type="button"
      onClick={openConsentPreferences}
      className={className}
    >
      {label}
    </button>
  );
}
