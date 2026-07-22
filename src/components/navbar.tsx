'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = ['services', 'templates', 'caseStudies', 'pricing', 'contact'] as const;

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const pathname = usePathname();
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
          <LocaleSwitch locale={locale} pathname={pathname} />
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
              <LocaleSwitch locale={locale} pathname={pathname} />
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

function LocaleSwitch({ locale, pathname }: { locale: string; pathname: string }) {
  const other = locale === 'en' ? 'it' : 'en';
  return (
    <Link
      href={pathname}
      locale={other}
      className={cn(
        'font-mono-label text-xs text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]'
      )}
    >
      {other.toUpperCase()}
    </Link>
  );
}
