# Lankio — Transformation Final Report

Date: 2026-10-15 · Branch: `feat/premium-portfolio-transformation` (not pushed, not deployed)

Companion documents: `LANKIO_FULL_AUDIT.md` (findings before any change) and `LANKIO_TRANSFORMATION_PLAN.md` (decisions).

---

## 1. Initial audit findings (summary)

The most serious issues on the live site were:

- **Broken brand colours.** Tailwind v4 never loaded `tailwind.config.ts`, so `bg-primary` and the other brand utilities did not exist. The main CTAs ("Get Free Audit", "Let's Talk") rendered without a button background in production.
- **Unsupported or invented claims:**
  - "50+ Successful Projects"
  - success stories with made-up metrics (+180%, 3x, 100%)
  - an audit tool that fabricated scores when PageSpeed failed
  - Wildscape listed as WordPress/Elementor, although it is Next.js
- **Public pricing everywhere**, including a €49/mo line in the hero, tier cards, add-ons, a price configurator, template prices, and budget ranges in the contact form.
- **Placeholder legal pages** on a site running Google Analytics and collecting personal data.
- **Broken or missing metadata:**
  - a missing OG image
  - every page canonicalised to the home page
  - a two-URL sitemap
  - mismatched canonical hosts
- **Placeholder social links** (bare facebook.com, linkedin.com and so on).
- **No static generation**: every page rendered dynamically. A heavy canvas animation ran on every device, and there were 18 lint errors.

Full detail, with files and severities, is in `LANKIO_FULL_AUDIT.md`.

## 2. Architecture changes

- **Information architecture:** Home, Work, Work/[slug], Expertise, About, Contact, and the three legal pages, all under `/en` and `/it`.
- **Retired routes** now return permanent (308) redirects: `/templates` → `/work`; `/audit`, `/faq` and `/pricing` → `/contact`.
- **Static generation everywhere.** `setRequestLocale` and `generateStaticParams` are used throughout. Every localized page is now prerendered (SSG) instead of rendered on demand.
- **Typed content registry** in `src/content/projects/`. Each project is one file with English and Italian side by side, a publication status and a classification. A build-time validator blocks incomplete published projects.
- **Shared contact contract** (`src/lib/contact.ts`). The client form and the API use the same validation rules.
- **Single source of brand facts** in `src/config/site.ts`.
- **Removed:**
  - the pricing, planner, success-stories, template-hub, audit, tech-marquee and `DigitalCreationEngine` components (≈2,800 lines of retired features; ≈4,300 lines deleted across `src/components` and `src/lib` overall, including rewritten files)
  - their data files and `/api/audit`
  - the dependencies `react-icons`, `class-variance-authority` and `autoprefixer`
  - the unused public assets
- **`/demo/*` templates kept**, unlinked and `noindex` (robots also disallows them), as the starting point for future concepts.

## 3. Design system

**Concept:** "Quiet confidence".

- **Colour tokens**, defined with Tailwind v4 `@theme` in `globals.css`:
  - canvas `#07080b`, surface `#0d0f14`
  - hairline borders at 8% and 16% white
  - three text tones, chosen for AA contrast
  - one violet accent `#8b7dff` and one blue accent `#4da3ff`
- **Typography:** Inter for everything, plus Instrument Serif italic used as a single editorial accent (one or two words per headline). Font families went from three to two.
- **Utilities:** `container-page`, `section-y`, `text-display`, `text-headline`, `text-title`, `text-lead`, `text-eyebrow`, `font-accent`, plus a subtle film grain and a masked grid.
- **Composition:** numbered editorial section labels ("01 — Selected work"), tinted project panels with inset screenshots, hairline lists, and white pill CTAs with a sliding arrow.

## 4. Pages redesigned

| Page | Contents |
| --- | --- |
| Home | Cinematic hero (headline, intro, CTAs, portrait rising out of its frame), staggered Selected Work, About preview, Expertise rows, Contact CTA |
| Work | Filterable gallery. Only categories that have published work are shown, and the filter is shareable via `?category=` |
| Work/[slug] | Case-study template: overview, role and technologies, highlights, film, gallery (browser and phone frames), approach, outcomes (only if documented), next project |
| Expertise | Five capability groups with deliverables. No prices |
| About | Biography, facts, capabilities, working approach, IATA Foundation Diploma, a confidentiality note |
| Contact | Inquiry form, direct email, location, short FAQ |
| Privacy / Cookies / Terms | Rewritten to describe the processing the site actually performs |
| 404 | Localized, with routes back to home and to the work page |

## 5. Components created

**Layout:** `SiteHeader`, `SiteFooter`, `BrandMark`.

**Motion:** `Reveal`, `MaskedLine`, `Magnetic`, `MotionProvider`.

**Home:** `Hero`, `HeroPortrait`, `HeroSpotlight`, `ExpertiseList`, `ContactCta`.

**Work:** `ProjectCard`, `WorkGallery`, `ProjectGallery`.

**Video:** `VideoPlayer`, `VideoSpecs`.

**Contact:** `ContactForm`.

**SEO:** `JsonLd`, the OG template, `pageOgImage`.

**UI:** `ButtonLink`, `SectionLabel`, `PageHeader`, `LegalPage`.

## 6. Animations implemented

- **Above-the-fold entrances use CSS keyframes:** the hero line reveals, page-header reveals and route fades (`template.tsx`). They start on the first paint of the server HTML, so the largest element never waits for JavaScript.
- **Scroll reveals** use `framer-motion` `whileInView` and animate transform and opacity only.
- **Project cards:** a clip-path image reveal, plus a lift on hover.
- **Navigation:** an animated active pill (`layoutId`), and a staggered full-screen mobile menu with scroll lock, Escape to close, and focus management.
- **Fine pointers only:** magnetic CTAs and a pointer spotlight in the hero. They are not attached on touch devices.
- **Hero:** ambient drifting light, plus a light portrait parallax.
- **Reduced motion:** a global `MotionConfig reducedMotion="user"` plus a CSS rule. Transforms are disabled; colour and opacity feedback stay.
- **Performance:** the old O(n²) canvas particle field is gone.

## 7. Pricing removed

**Removed:**
- the hero "€49/mo" line
- the pricing section, its tiers, billing toggle, add-ons and content packages
- the project price configurator
- template prices and the template hub
- budget ranges in the form (replaced by an optional timeline)
- pricing links in the nav and footer
- FAQ answers about payments
- every pricing message in both languages

**Replaced with:** "Start a project" / "Inizia un progetto" CTAs pointing to `/contact`.

**Verified:** the QA suite checks every published page in both languages for currency patterns (`€`, `/mo`, `/mese`). None were found. One Lankio Learn gallery image showed that product's own price, and it was replaced.

No payment infrastructure existed in the repository, so none was touched.

## 8. Real projects integrated

All facts were verified on 2026-10-15 from the live sites and their HTTP headers. Screenshots were captured with headless Chrome.

| Project | Classification | Categories | Verified technology |
| --- | --- | --- | --- |
| Wildscape Sri Lanka | Professional | Web | Next.js, React, Vercel |
| Lankio Learn | Independent | AI & Apps, Web | Next.js, React, Vercel |
| Lankio AI Document Analyzer | Independent | AI & Apps, Web | Next.js, React, Vercel |
| Lankio Digital Solutions | Independent | Branding, Web | This repository |

No years, client names, metrics or outcomes are published, because none could be verified. The Analyzer's AI provider isn't named, because it isn't named publicly. The Lankio case study has no "visit site" link, to avoid a circular link back to itself.

**Please check:**
- Is Wildscape's classification right? I set it to "Professional project". If you own Wildscape, change it to `independent`.
- Is the role list for each project accurate?

## 9. Creative project templates prepared (unpublished)

Eight drafts are prepared in `src/content/projects/drafts.ts`, each with bilingual summaries, roles and notes on what is missing:

1. Luxury Hotel
2. Premium Restaurant
3. Automotive Campaign
4. Multi Color Flowers Recruitment Ad (Remotion, 35 s, 1080 × 1920, 30 fps, 1050 frames)
5. Luxury Product Commercial
6. Brand Identity Collection
7. Social Media Campaign Collection
8. Cinematic Photography Collection

Drafts are not rendered, not in the sitemap, and return 404 (this is tested). No artwork was generated or published.

## 10. Remotion and motion showcase

There is no Remotion engine in the bundle; the site plays exported files. `VideoPlayer` provides:

- a poster first, with `preload="none"`
- a muted hover preview on fine pointers (skipped with reduced motion or Save-Data)
- click to play with sound
- custom controls: play/pause, seek slider, time, mute, fullscreen (with an iOS `webkitEnterFullscreen` fallback)
- keyboard shortcuts: Space/K, M, F and the arrow keys
- caption tracks
- 16:9, 9:16, 1:1 and 4:5 layouts, with vertical video capped to the viewport height

`VideoSpecs` shows duration, resolution, fps, frames and tool. The "Motion & Animation" filter appears automatically once a motion project is published.

**How it was tested:** I temporarily published the Remotion draft with a throwaway 4-second clip generated in the browser, then reverted. Nothing from that test is committed. Results: 18/18 player checks passed, covering:

- no video bytes before interaction
- playback after a click
- pause, mute, fullscreen and keyboard play
- the 9:16 ratio
- no overflow on mobile

Seeking by mouse was confirmed manually in a separate check (75% of the track → 3.1 s of a 3.97 s clip). The automated seek check fails because Playwright's `fill()` doesn't trigger React's change event on range inputs, not because of a player bug.

## 11. English and Italian localization

- Both message files were rewritten. `npm run check:i18n` enforces identical keys: 328 each.
- The Italian copy was written natively ("Progetto esperienze digitali. Trasformo le idee in realtà."), not translated literally.
- Localized for every page and project: metadata, OG images, alt text, form errors, ARIA labels, the video player labels and the confirmation emails.
- The language switch keeps the current page (for example `/en/work/lankio-learn` → `/it/work/lankio-learn`) and updates `lang`.

## 12. SEO improvements

- **Canonical and hreflang:** every page has a self-referencing canonical, plus `en`, `it` and `x-default` alternates. The canonical host is `https://www.lankio.it`. A production build ignores a localhost `NEXT_PUBLIC_SITE_URL`.
- **Sitemap:** 24 URLs (12 pages × 2 locales), each with hreflang alternates. Drafts are excluded.
- **robots.txt:** points at the correct sitemap and disallows `/api/` and `/demo/`.
- **Generated OG images** for every page and every project (using the project screenshot). The missing `/og-image.png` reference is gone.
- **JSON-LD** (escaped against script injection) contains only verifiable facts:
  - Person, including the IATA credential
  - Organization and WebSite
  - Service (without offers or prices)
  - CreativeWork, CollectionPage, ProfilePage, ContactPage
  - BreadcrumbList

  There are no ratings, reviews or prices.
- **Structure:** one `<h1>` per page, a correct heading order, descriptive alt text in both languages, and internal links between projects.

## 13. Performance

- Static generation for every page.
- Images go through `next/image` with AVIF/WebP. The 1.2 MB and 1.6 MB portraits were previously served `unoptimized`.
- The canvas animation and `react-icons` are gone.
- Most components are server components. Client islands are limited to the header, gallery filter, form, video player and motion wrappers.
- Lighthouse, mobile preset, on the local production server:

  | Page | Performance | Accessibility | Best Practices | SEO* |
  | --- | --- | --- | --- | --- |
  | /en | 90 | 100 | 100 | 92 |
  | /en/work/wildscape-sri-lanka | 91 | 100 | 100 | 92 |
  | /it/contact | 91 | 100 | 100 | 92 |

  CLS is 0 and TBT is 20–30 ms. Lighthouse's simulated LCP is 3.5–3.6 s. Measured directly with 4× CPU and ~1.6 Mbps throttling, LCP was about 1.8 s (the home page's LCP element is the hero portrait).

  \*The SEO deduction comes from the local test only: canonicals point to `www.lankio.it` while the page is served from localhost. It should score 100 in production, but this was not measured.
- About 149 KiB of JavaScript is reported as unused, mostly framer-motion. That's acceptable for the motion system; it could be reduced later with `LazyMotion`.

## 14. Accessibility and security

**Accessibility:**
- axe-core (WCAG 2.0 / 2.1 A–AA plus best practices) found 0 violations on 7 representative pages in both languages.
- A skip link, visible focus rings, labelled form fields with `aria-invalid` and `aria-describedby`, an error summary, focus moved to the first invalid field, and a focused success message.
- The mobile menu has full keyboard support. Filter buttons use `aria-pressed`. Touch targets are at least 44 px.

**Security:**
- Upgraded **Next.js 16.2.11 → 16.4.1** to fix a critical advisory ("Unauthenticated Remote Code Execution"). `npm audit --omit=dev` now reports **0 vulnerabilities**.
- Remaining audit findings are dev-only lint tooling (`braces` via `eslint-config-next`) and don't ship.
- Contact API hardening:
  - JSON-only requests, with a 16 KB body limit
  - a working honeypot and a minimum fill time, both answered with a silent 200 and no email sent
  - shared validation with length caps and CR/LF stripping in values used in email headers
  - HTML-escaped email bodies
  - a best-effort per-IP rate limit (5 per 10 min, per instance)
  - generic error messages
- Headers: `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, and `X-Frame-Options: DENY`. `/demo` pages stay embeddable.
- `.env.local` is git-ignored, and no secrets were found in tracked files.

**Bug found and fixed during QA:** after a failed submission, the form reset its timing clock. A quick retry was then treated as a bot and silently dropped while the UI showed success.

## 15. Test results (all actually run)

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | 0 errors. 58 warnings, all in the legacy `/demo` templates (rules downgraded to warnings for that folder only, with a comment) |
| `npm run check:i18n` | Pass (328 keys) |
| `npm run build` (Next 16.4.1) | Pass. 49 static outputs |
| QA suite (Playwright, production server) | **330/330** |
| Video player suite | 18/18 + seek verified manually (see §10) |
| axe-core | 0 violations (7 pages) |
| Contact UI with mocked network | Error and success states correct; payload has an empty honeypot and a valid timing value |
| Lighthouse | See §13 |

**The QA suite checks:**
- all 24 localized routes return 200, with one `h1`, the correct `lang`, canonical, hreflang, title, description, OG image and valid JSON-LD
- no images without alt text, no horizontal overflow at 390 px, no console errors, and no prices
- redirects (308), 404s for unknown paths and drafts, and the Italian 404 copy
- sitemap content, robots.txt, the icon, OG image responses and security headers
- filtering (including deep links), the language switch and the skip link
- mobile menu behaviour
- client-side form validation
- the API's 415, 400, 413, honeypot, timing, 422 and 429 responses

**Not tested:**
- A real end-to-end email send. It was avoided on purpose, because it would email your inbox and a third party. Please send one test inquiry after deploying.
- Real devices (iOS Safari fullscreen, Android).
- Production Lighthouse.
- Screen-reader walkthroughs beyond automated checks.
- Other browsers (only Chrome was used).

## 16. Remaining issues

1. **Analytics consent.** GA4 loads without a consent banner. Under Italian Garante guidance, analytics cookies generally need prior consent unless configured as anonymised technical cookies. Consider a consent manager or a cookieless analytics tool. The privacy and cookie pages disclose GA accurately, but **they haven't been reviewed by a lawyer.**
2. **The rate limit is per-instance memory.** For stronger protection, add Vercel firewall rules or a shared store such as Upstash.
3. **Confirmation emails go to any address entered,** so the form could be abused to send them to someone else. This is limited by the rate limit and honeypot.
4. **Social links are empty.** Add your verified URLs to `src/config/site.ts`.
5. **Location is "Italy".** The previous site said "Rho, Milan". Change the messages if you want the city shown.
6. **The `/demo` templates** keep their pre-existing lint warnings and use Unsplash images. Fix both before reusing any of them.
7. **The Wildscape classification and the role lists** need your confirmation (§8).

## 17. Missing creative assets

To publish the drafts, I need:

- **Multi Color Flowers ad:** the final MP4 (H.264), a poster frame, ideally Dutch and English WebVTT captions, a short description, and confirmation of the relationship with Multi Color Flowers. If they didn't commission or approve it, it stays labelled "Creative concept" with a line making clear it isn't an official ad.
- **Hotel and restaurant concepts:** original or properly licensed, credited imagery. The current demos use Unsplash.
- **Automotive campaign, product commercial, brand identities, social collection:** the finished visuals or videos.
- **Photography collection:** selected and graded personal images only. No client or event photography without consent.

Also not found in the repository: any Remotion or motion renders. I did not open video files in your personal folders that looked like client work.

## 18. Local preview

```bash
git checkout feat/premium-portfolio-transformation
npm install
npm run build && npm start   # http://localhost:3000/en
```

Use `npm run dev` for development.

## 19. Git summary

Branch: `feat/premium-portfolio-transformation`, 4 commits on top of `main` (`f6f33a1`):

1. `docs: add full website audit and transformation plan`
2. `feat: redesign as premium creative portfolio`
3. `fix: QA findings, security upgrade, real Lankio case-study captures`
4. `docs: final transformation report`

Nothing has been pushed or deployed.

## 20. Deployment readiness

**Ready to deploy once these are done:**

- **Before deploying:**
  - Confirm `NEXT_PUBLIC_SITE_URL=https://www.lankio.it` and the Resend variables in the Vercel project settings.
  - Review the copy, especially the About bio, the project role lists and the Wildscape classification.
  - Decide on analytics consent.
- **After deploying:**
  - Send one real test inquiry and check that both emails arrive.
  - Run Lighthouse on production.
  - Submit the new sitemap in Google Search Console. The old `/templates`, `/audit` and `/faq` URLs permanently redirect.
