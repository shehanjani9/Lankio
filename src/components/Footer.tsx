'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * Site Footer.
 */

type FooterLink = {
  href: string;
  label: string;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="font-mono-label text-xs text-[color:var(--text-muted)]">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-[color:var(--text-secondary)] transition-colors duration-200 hover:text-[color:var(--text-primary)] focus-visible:text-[color:var(--text-primary)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const navigationLinks: FooterLink[] = [
    { href: '/', label: t('columns.navigation.home') },
    { href: '/#services', label: t('columns.navigation.services') },
    { href: '/#templates', label: t('columns.navigation.templates') },
    { href: '/#pricing', label: t('columns.navigation.pricing') },
    { href: '/#about', label: t('columns.navigation.about') },
    { href: '/#contact', label: t('columns.navigation.contact') },
  ];

  const serviceLinks: FooterLink[] = [
    { href: '/#services', label: t('columns.services.webDesign') },
    { href: '/#services', label: t('columns.services.graphicDesign') },
    { href: '/#services', label: t('columns.services.smm') },
    { href: '/#services', label: t('columns.services.branding') },
    { href: '/#services', label: t('columns.services.seo') },
    { href: '/#services', label: t('columns.services.aiSolutions') },
  ];

  const resourceLinks: FooterLink[] = [
    { href: '/#services', label: t('columns.resources.websiteAudit') },
    { href: '/templates', label: t('columns.resources.templateLibrary') },
    { href: '/faq', label: t('columns.resources.faq') },
    { href: '/privacy-policy', label: t('columns.resources.privacyPolicy') },
    { href: '/terms', label: t('columns.resources.terms') },
    { href: '/cookie-policy', label: t('columns.resources.cookiePolicy') },
  ];

  return (
    <footer
      ref={footerRef}
      aria-label="Site Footer"
      className="relative mt-32 border-t border-[color:var(--glass-border)] bg-elevated"
    >
      <div className="bg-ambient-glow pointer-events-none absolute inset-0 opacity-60" />

      <div
        className={`reveal-on-scroll relative mx-auto max-w-7xl px-6 py-16 lg:px-8 ${
          isVisible ? 'is-visible' : ''
        }`}
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Column 1 — Brand & Socials */}
          <div>
            <Link href="/" className="font-display text-xl font-semibold tracking-tight text-[color:var(--text-primary)]">
              Lankio
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {t('brand.description')}
            </p>

            <ul className="mt-6 flex items-center gap-3" aria-label={t('social.ariaLabel')}>
              {/* Facebook */}
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.facebook')}
                  className="glass-panel glass-panel-interactive flex h-10 w-10 items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.instagram')}
                  className="glass-panel glass-panel-interactive flex h-10 w-10 items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </li>

              {/* LinkedIn */}
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.linkedin')}
                  className="glass-panel glass-panel-interactive flex h-10 w-10 items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </li>

              {/* GitHub */}
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('social.github')}
                  className="glass-panel glass-panel-interactive flex h-10 w-10 items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 — Navigation */}
          <FooterColumn title={t('columns.navigation.title')} links={navigationLinks} />

          {/* Column 3 — Services */}
          <FooterColumn title={t('columns.services.title')} links={serviceLinks} />

          {/* Column 4 — Resources & Legal */}
          <FooterColumn title={t('columns.resources.title')} links={resourceLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--glass-border)] pt-8 text-xs text-[color:var(--text-muted)] sm:flex-row">
          <p>{t('bottom.rights', { year: new Date().getFullYear() })}</p>
          
        </div>
      </div>
    </footer>
  );
}