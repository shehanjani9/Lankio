# Lankio Digital Solutions

Portfolio and studio website of Shehan Janith Hettiarachchi: https://www.lankio.it

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (framer-motion) · next-intl (English / Italian) · Resend

## Local development

```bash
npm install
npm run dev            # http://localhost:3000 (redirects to /en)
```

Environment variables (`.env.local`, never committed):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends contact-form emails |
| `LANKIO_ADMIN_EMAIL` | Inbox that receives inquiries |
| `LANKIO_FROM_EMAIL` | Verified sender, e.g. `Lankio <info@lankio.it>` |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Set to `https://www.lankio.it` in production. Localhost values are ignored in production builds. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (loaded only after analytics consent) |
| `CONTACT_RATE_LIMIT_MAX` | Optional. Contact submissions per IP per 10 minutes (default 5) |

## Checks

```bash
npm run typecheck      # next typegen + tsc
npm run lint
npm run check:i18n     # en/it message files must have identical keys
npm run build
npm start              # serve the production build
npm test               # build, then the Playwright suite (unit + end-to-end)
npm run test:e2e       # Playwright only, against an existing build
```

The test suite starts the production build on port 3100 and a local mock of
the Resend API on port 3901 (`tests/support/mock-resend.mjs`). The app runs
with a fake API key pointed at the mock, so **tests never send real email**.
Google Analytics requests are intercepted and never reach Google. Tests use
the locally installed Google Chrome; see `playwright.config.ts` to use
Playwright's bundled browser instead.

## Cookie consent

Google Analytics 4 is loaded only after a visitor accepts analytics in the
consent banner (`src/components/consent/`). The choice is stored for six
months in the technical cookie `lankio_consent`; bump `CONSENT_VERSION` in
`src/lib/consent.ts` when the cookie policy changes in a way that needs fresh
consent. Visitors can change their choice from "Cookie settings" in the footer
or on the cookie policy page.

## Project structure

```
src/
  app/(main)/[locale]/     Localized pages: home, work, work/[slug], expertise, about, contact, legal
  app/(templates)/demo/    Legacy standalone template demos (unlinked, noindex)
  app/api/contact/         Contact form endpoint (Resend)
  components/              layout, home, work, video, contact, motion, seo, ui
  content/projects/        Portfolio content (one typed file per project)
  config/site.ts           Brand facts and social links
  lib/                     SEO helpers, structured data, contact validation, email templates
messages/                  en.json / it.json UI copy
public/projects/<slug>/    Project screenshots, posters and videos
docs/                      Audit, transformation plan and final report
```

## Adding a project

1. Put the assets in `public/projects/<slug>/`:
   - `cover.jpg`, ideally 1600 × 1000 (desktop screenshot or key visual)
   - optional gallery images (`frame: 'desktop'` for browser captures, `'mobile'` for 780 × 1688 phone captures)
   - optional video: H.264 `.mp4` (and optionally `.webm`), a `poster.jpg`, and WebVTT captions if there is speech or on-screen text
2. Create `src/content/projects/<slug>.ts`, copying an existing project. Every user-facing string has an `en` and an `it` value.
3. Register it in `src/content/projects/index.ts`.
4. Set `classification` honestly: `professional` (client work you are cleared to show), `independent` (your own live product) or `concept` (self-initiated creative work). Concepts are labelled "Creative concept" on the page.
5. Leave `status: 'draft'` until the work is finished. Drafts are never rendered, listed or indexed.
6. Run `npm run build`. The build fails if a published project is missing a cover, alt text in either language, or a valid video aspect ratio.

Unpublished creative projects are prepared in `src/content/projects/drafts.ts`, with notes on what each one still needs.

### Exporting Remotion videos for the site

Render to H.264 MP4 (for example `npx remotion render <id> out/ad.mp4 --codec=h264 --crf=20`) and export a poster frame (`npx remotion still <id> out/poster.jpg --frame=<n>`). Keep files reasonably small. The player uses `preload="none"`, so nothing downloads until a visitor presses play (or hovers, for a muted preview on desktop). Set `aspectRatio` to `9:16` for vertical ads and `16:9` for landscape. Fill `specs` (duration, resolution, fps, frames, tool) from the Remotion composition.

## Social links

Add verified profile URLs to `social` in `src/config/site.ts`. Empty entries are not rendered anywhere, including structured data.
