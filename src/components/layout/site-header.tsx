'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { BrandMark } from './brand-mark';
import { EASE_OUT_EXPO } from '@/components/motion/reveal';

const NAV_ITEMS = [
  { key: 'work', href: '/work' },
  { key: 'expertise', href: '/expertise' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close the mobile menu after navigation (state adjusted during render,
  // which avoids an extra effect-driven re-render).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll, close on Escape, and move focus into the open menu.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const toggle = toggleRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || open
          ? 'border-b border-line bg-canvas/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="relative z-10 -m-2 p-2" aria-label="Lankio Digital Solutions — Home">
          <BrandMark />
        </Link>

        <nav aria-label={t('label')} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative isolate block rounded-full px-4 py-2 text-[0.9rem] transition-colors duration-300',
                      active ? 'text-fg' : 'text-fg-muted hover:text-fg'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitch />
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center rounded-full bg-fg px-5 text-[0.9rem] font-medium text-canvas transition-colors duration-300 hover:bg-white"
          >
            {t('cta')}
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t('closeMenu') : t('openMenu')}
          className="relative z-10 -mr-2 flex size-11 items-center justify-center md:hidden"
        >
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={cn(
                'absolute left-0 h-px w-6 bg-fg transition-transform duration-500 ease-out-expo',
                open ? 'top-1.5 rotate-45' : 'top-0'
              )}
            />
            <span
              className={cn(
                'absolute left-0 h-px w-6 bg-fg transition-transform duration-500 ease-out-expo',
                open ? 'top-1.5 -rotate-45' : 'top-3'
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto bg-canvas md:hidden"
          >
            <nav aria-label={t('label')} className="container-page flex min-h-full flex-col justify-between pb-10 pt-8">
              <ul className="flex flex-col">
                {[{ key: 'home', href: '/' } as const, ...NAV_ITEMS].map((item, index) => {
                  const active = item.href === '/' ? pathname === '/' : isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.key}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.05 + index * 0.05 }}
                      className="border-b border-line"
                    >
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-baseline justify-between py-4 text-[2.25rem] font-medium tracking-[-0.04em]',
                          active ? 'text-fg' : 'text-fg-muted'
                        )}
                      >
                        {t(item.key)}
                        <span className="text-sm tabular-nums tracking-normal text-fg-subtle">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-10 flex items-center justify-between gap-4">
                <LocaleSwitch />
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center rounded-full bg-fg px-6 font-medium text-canvas"
                >
                  {t('cta')}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LocaleSwitch() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const target = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      lang={target}
      aria-label={`${t('switchLanguage')}: ${t('languageName')}`}
      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-[0.8rem] font-medium tracking-[0.08em] text-fg-muted transition-colors hover:text-fg"
    >
      {t('languageShort')}
    </Link>
  );
}
