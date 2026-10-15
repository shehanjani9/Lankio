/**
 * Single source of truth for brand facts used across UI, metadata and
 * structured data. Only verified information belongs here.
 */

export const PRODUCTION_URL = 'https://www.lankio.it';

/**
 * Production serves from www (the apex 308-redirects there). The env value
 * is normalised to a bare origin -- the live site once emitted
 * "https://www.lankio.it//en" because the variable had a trailing slash --
 * and is ignored when it is not an http(s) URL, or when it points at
 * localhost in a production build, so canonical URLs can't be corrupted.
 */
export function resolveSiteUrl(
  value: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
  nodeEnv: string | undefined = process.env.NODE_ENV
): string {
  const raw = value?.trim();
  if (!raw) return PRODUCTION_URL;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return PRODUCTION_URL;
    if (nodeEnv === 'production' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname)) return PRODUCTION_URL;
    return url.origin;
  } catch {
    return PRODUCTION_URL;
  }
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
