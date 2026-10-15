import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { siteConfig, activeSocialLinks } from '@/config/site';
import { getPublishedProjects } from '@/content/projects';
import { BrandMark } from './brand-mark';
import { CookieSettingsButton } from '@/components/consent/consent-manager';

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  github: 'GitHub',
  behance: 'Behance',
};

export function SiteFooter() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');
  const common = useTranslations('Common');
  const projects = getPublishedProjects();
  const social = activeSocialLinks();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] max-w-[140%] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-12 md:py-20">
          <div className="col-span-2 md:col-span-4">
            <BrandMark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-muted">
              {siteConfig.name} — {common('brandTagline')}. {common('basedIn')}.
            </p>
          </div>

          <FooterColumn title={t('navTitle')} className="md:col-span-2">
            {(['work', 'expertise', 'about', 'contact'] as const).map((key) => (
              <li key={key}>
                <FooterLink href={`/${key}`}>{nav(key)}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t('workTitle')} className="md:col-span-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <FooterLink href={`/work/${project.slug}`}>{project.title}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t('contactTitle')} className="col-span-2 md:col-span-3">
            <li>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 text-sm text-fg transition-colors hover:text-white"
              >
                {nav('cta')}
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="text-sm text-fg-subtle">{common('basedIn')}</li>
            {social.length > 0 && (
              <li className="pt-3">
                <span className="sr-only">{t('social')}: </span>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {social.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="text-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        {SOCIAL_LABELS[link.key] ?? link.key}
                        <span className="sr-only"> {common('opensInNewTab')}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            {t('rights', { year: new Date().getFullYear() })} {t('madeBy')}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t('legalTitle')}>
            <li>
              <FooterLink href="/privacy-policy" small>
                {t('privacy')}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/cookie-policy" small>
                {t('cookies')}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/terms" small>
                {t('terms')}
              </FooterLink>
            </li>
            <li>
              <CookieSettingsButton
                label={t('cookieSettings')}
                className="text-xs text-fg-muted transition-colors duration-300 hover:text-fg"
              />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="text-eyebrow text-fg-subtle">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children, small = false }: { href: string; children: React.ReactNode; small?: boolean }) {
  return (
    <Link
      href={href}
      className={`${small ? 'text-xs' : 'text-sm'} text-fg-muted transition-colors duration-300 hover:text-fg`}
    >
      {children}
    </Link>
  );
}
