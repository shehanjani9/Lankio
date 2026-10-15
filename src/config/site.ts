/**
 * Single source of truth for brand facts used across UI, metadata and
 * structured data. Only verified information belongs here.
 */

// Production serves from www (the apex 308-redirects there). An env value is
// only honoured when it is a real public origin, so a copied local
// `http://localhost:3000` can never leak into canonical URLs in production.
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv && (process.env.NODE_ENV !== 'production' || !/localhost|127\.0\.0\.1/.test(fromEnv))) {
    return fromEnv;
  }
  return 'https://www.lankio.it';
}

export const siteConfig = {
  url: resolveSiteUrl(),
  name: 'Lankio Digital Solutions',
  shortName: 'Lankio',
  founder: {
    name: 'Shehan Janith Hettiarachchi',
    givenName: 'Shehan',
  },
  email: 'info@lankio.it',
  location: {
    countryCode: 'IT',
  },
  /**
   * Public profiles. Leave a value empty until the real profile URL is
   * confirmed -- empty entries are not rendered anywhere.
   */
  social: {
    linkedin: '',
    instagram: '',
    github: '',
    behance: '',
  } satisfies Record<string, string>,
} as const;

export type SocialKey = keyof typeof siteConfig.social;

export function activeSocialLinks(): { key: SocialKey; url: string }[] {
  return (Object.entries(siteConfig.social) as [SocialKey, string][])
    .filter(([, url]) => url.trim().length > 0)
    .map(([key, url]) => ({ key, url }));
}
