'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname as useRawPathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = ['services', 'templates', 'caseStudies', 'pricing', 'contact'] as const;
const LOCALES = ['en', 'it'] as const;

export function Navbar() {
  const t = useTranslations('Navbar');
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass-panel glass-panel-interactive flex w-full max-w-5xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-[color:var(--text-primary)]"
        >
          Lankio
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className="text-sm text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitch />
          <a
            href="#contact"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
          >
            {t('bookCall')}
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[color:var(--text-primary)] md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          suppressHydrationWarning
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="glass-panel absolute top-20 mx-4 flex w-[calc(100%-2rem)] max-w-5xl flex-col gap-4 p-5 md:hidden"
          >
            {NAV_ITEMS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
              >
                {t(key)}
              </a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <LocaleSwitch />
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                {t('bookCall')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LocaleSwitch() {
  const locale = useLocale();
  // Raw Next.js pathname -- always includes whatever locale prefix is
  // actually in the URL (e.g. "/it/services"), unlike next-intl's own
  // usePathname wrapper, whose exact stripping behavior has been the
  // source of a previous bug here. We strip it ourselves for certainty.
  const rawPathname = useRawPathname();
  const nextLocale = locale === 'it' ? 'en' : 'it';

  const localePrefixPattern = new RegExp(`^/(${LOCALES.join('|')})(?=/|$)`);
  const internalPath = rawPathname.replace(localePrefixPattern, '') || '/';
  const targetHref = `/${nextLocale}${internalPath === '/' ? '' : internalPath}`;

  // Deliberately a plain <a>, not next-intl's <Link> -- a real anchor
  // forces a full browser navigation (full page reload) on click, which
  // bypasses Next's client-side Router Cache entirely. That cache is what
  // was serving stale (pre-switch-locale) rendered content after a Link
  // click even though the URL itself updated correctly. Trades a brief
  // full-page reload for guaranteed-correct content on every switch.
  return (
    <a
      href={targetHref}
      className={cn(
        'font-mono-label text-xs uppercase tracking-wider text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]'
      )}
    >
      {nextLocale.toUpperCase()}
    </a>
  );
}
