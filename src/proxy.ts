import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Excludes api/trpc/_next/_vercel/static-file paths (standard next-intl
  // exclusions) AND /demo -- the standalone template preview pages live
  // outside src/app/(main)/[locale]/ on purpose and must never be
  // redirected into a /en or /it prefix.
  matcher: ['/((?!api|trpc|_next|_vercel|demo|.*\\..*).*)'],
};