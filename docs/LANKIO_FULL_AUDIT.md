# Lankio — Full Website Audit

Audit date: 2026-10-15
Branch audited: `main` @ `f6f33a1` (feat: add google analytics setup)
Production: https://www.lankio.it (the apex domain `lankio.it` 308-redirects to `www`)

This audit covers the repository and the live production site as rendered in headless Chrome. It was written before any changes. Every finding cites the file it comes from.

Severity scale: **Critical** (misleading to visitors, a legal/security exposure, or broken core UI) · **High** (hurts credibility, SEO, or accessibility noticeably) · **Medium** (quality or maintainability) · **Low** (polish).

---

## 1. Stack and architecture

| Item | Finding |
| --- | --- |
| Next.js | `16.2.11`, App Router, Turbopack builds. `src/proxy.ts` (the v16 replacement for `middleware.ts`) runs next-intl. |
| React | `19.2.4` |
| TypeScript | `^5`, `strict: true`. `tsc --noEmit` passes. |
| Tailwind | `4.3.3` via `@tailwindcss/postcss`. A v3-style `tailwind.config.ts` is present but **never loaded** (see C-1). |
| i18n | `next-intl 4.13.3`, locales `en`/`it`, `localePrefix: 'always'`, messages in `messages/*.json` (691 lines each). |
| Animation | `framer-motion 12.42.2` (25 files), a hand-written canvas particle field, and CSS keyframes. |
| Email | `resend` via `src/app/api/contact/route.ts`. |
| Analytics | `@next/third-parties` GoogleAnalytics, with a hard-coded fallback ID in the layout. |
| Route groups | `(main)/[locale]/…` holds the site. `(templates)/demo/*` is a second root layout with 16 standalone template demos (noindex). |

### Routes at audit time

`/[locale]` (home), `/[locale]/audit`, `/[locale]/templates`, `/[locale]/faq`, `/[locale]/privacy-policy`, `/[locale]/terms`, `/[locale]/cookie-policy`, `/api/contact`, `/api/audit`, `/demo/*` (16), `/robots.txt`, `/sitemap.xml`.

### Baseline checks (run before any change)

- `tsc --noEmit`: **pass**
- `eslint src`: **65 problems (18 errors, 47 warnings)**. These include `react-hooks/set-state-in-effect`, `no-explicit-any`, `no-html-link-for-pages` and `prefer-const`.
- `next build`: **pass**. Every `[locale]` route is reported as `ƒ (Dynamic)` because no page calls `setRequestLocale` (see P-1).

---

## 2. Findings

### Critical

| ID | Finding | Affected files | Fix |
| --- | --- | --- | --- |
| C-1 | **Brand colour utilities don't exist.** Tailwind v4 ignores `tailwind.config.ts` unless it is linked with `@config`. `bg-primary`, `bg-base`, `bg-elevated`, `text-primary` and `rounded-glass` therefore generate no CSS. On production the main CTAs ("Get Free Audit", "Let's Talk") render as **text with no button background** (confirmed in a live screenshot). `globals.css` also still contains the v3 `@tailwind base/components/utilities` directives. | `tailwind.config.ts`, `src/app/globals.css`, every component using `bg-primary` | Move tokens to `@theme` in `globals.css`, delete the dead config, remove the v3 directives. |
| C-2 | **Unsupported claim: "50+ Successful Projects".** It is hard-coded in English on both locales. | `src/components/hero-portrait.tsx:183-199` | Remove. |
| C-3 | **Fabricated case studies and metrics.** "+180% organic traffic", "3x faster load", "100% automated", described as "representative estimates". `CaseStudies` messages contain more invented outcomes. | `src/lib/success-stories-data.ts`, `src/components/success-stories.tsx`, `messages/*.json` (`SuccessStories`, `CaseStudies`) | Remove the component, data and messages. |
| C-4 | **The audit tool invents scores.** When PageSpeed fails, `fallbackAudit()` returns made-up scores derived from the URL length. The API also fabricates Accessibility and Best-Practices as `performance + 12` / `+ 8`, and defaults missing scores to 75/85. Visitors see numbers that were never measured. | `src/components/audit-section.tsx:27-40`, `src/app/api/audit/route.ts:40-45` | Retire the audit feature: misleading as built and off-brand for a portfolio. |
| C-5 | **Legal pages are placeholders.** For example: "Details about data collected during your use of our services." Meanwhile the site loads Google Analytics and processes contact-form personal data (GDPR applies in Italy). `terms/page.tsx` is also exported as `PrivacyPolicyPage`. | `src/app/(main)/[locale]/privacy-policy`, `terms`, `cookie-policy`, `messages/*.json` | Write real content describing actual processing; recommend legal review. |
| C-6 | **Public pricing throughout.** Includes €49/mo in the hero micro-trust line, a full pricing section with 4 tiers + monthly billing + add-ons + content packages, a price configurator ("Configure your project, see the price"), template `priceFrom` values, contact-form budget ranges in €, and FAQ answers about payments and maintenance plans. | `hero.tsx`, `pricing-section.tsx`, `planner-section.tsx`, `lib/pricing-data.ts`, `lib/planner-data.ts`, `lib/templates-data.ts`, `template-hub.tsx`, `contact-section.tsx`, `navbar.tsx`, `Footer.tsx`, `messages/*.json` | Remove (requirement §5). |

### High

| ID | Finding | Affected files | Fix |
| --- | --- | --- | --- |
| H-1 | **Wrong technology claim.** Wildscape is listed as `WordPress, Elementor, Tailwind CSS`. The live site serves `/_next/static` assets with `x-nextjs-prerender` headers from Vercel, so it is Next.js. | `src/lib/projects-data.ts:15` | Correct to verified stack. |
| H-2 | **Template demos with stock imagery presented as portfolio work.** "Modern Corporate Business" and "Luxury Villa & Resort" link to `/demo/*` pages built on Unsplash photos. The second card's link actually goes to `/demo/restaurant`. | `src/lib/projects-data.ts`, `public/portfolio/template-*.png` | Remove from the published portfolio. Keep as unpublished drafts. |
| H-3 | **Placeholder social links**: `https://facebook.com`, `https://instagram.com`, `https://linkedin.com`, `https://github.com`. | `src/components/Footer.tsx:57-115` | Render only verified profile URLs from config. |
| H-4 | **Missing OG image.** Metadata references `/og-image.png`, which does not exist in `public/`, so every share preview is broken. | `src/app/(main)/[locale]/layout.tsx:66` | Generate OG images with `opengraph-image.tsx`. |
| H-5 | **Canonical host mismatch.** Layout default is `https://lankio.it`, while sitemap and robots use `https://www.lankio.it` and the apex 308-redirects to `www`. `.env.local` sets `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, so a deploy that copies local env would emit localhost canonicals. | `layout.tsx:31`, `sitemap.ts`, `robots.ts` | One `siteUrl` helper, default `https://www.lankio.it`. |
| H-6 | **Sitemap lists two URLs only**, with a hard-coded date and no `hreflang` alternates. There is no `x-default`. | `src/app/sitemap.ts` | Generate from route + project registry with alternates. |
| H-7 | **Every page shares the home metadata.** Sub-pages (FAQ, legal, templates, audit) define no `generateMetadata`, so canonical always points to `/{locale}`. That tells search engines every page is a duplicate of the home page. | all `[locale]/*/page.tsx` | Per-page metadata helper. |
| H-8 | **Duplicate navbars.** `templates/page.tsx` and `audit/page.tsx` render `<Navbar />` although the layout already renders one, so two fixed headers stack. | `templates/page.tsx:17`, `audit/page.tsx:17` | Retire routes. |
| H-9 | **Contact form honeypot not wired.** The API checks `body.website`, but the form never renders or sends that field. There is no rate limiting or length limits, and `name` goes unescaped into the email subject (header-injection hardening). | `contact-section.tsx`, `api/contact/route.ts` | Add hidden honeypot, timing check, length caps, newline stripping, best-effort rate limit. |
| H-10 | **Location inconsistency** with the brief. The site states "Rho, Milan" in several places. The brief positions Shehan as "based in Italy". | `messages/*.json` (`About`, `Footer`) | Use "Italy". Easy to make more specific later. |
| H-11 | **Unverified positioning.** "Agency Quality • Freelance Speed • Fair Pricing", "Guaranteed response within 24 hours", "European reliability", "Full-Stack Developer & AI Specialist", "24/7 Priority Support". | `messages/*.json` | Rewrite to the new, verifiable positioning. |
| H-12 | **No `<main>` landmark on home.** Sections render directly under `<body>`. Legal/FAQ pages use shadcn tokens (`text-muted-foreground`, `bg-card`, `border-border`) that don't exist in this project, so they render unstyled. | `[locale]/page.tsx`, `faq/page.tsx`, legal pages | Rebuild pages on the shared layout system. |
| H-13 | **Hard-coded English inside localized UI**: "Send another message", "Open menu"/"Close menu", the 50+ card, `aria-label="Site Footer"`, audit metric labels. | `contact-section.tsx:170`, `navbar.tsx:66`, `hero-portrait.tsx`, `Footer.tsx:117` | Move to messages. |

### Medium

| ID | Finding | Affected files | Fix |
| --- | --- | --- | --- |
| P-1 | **No static rendering.** All locale pages are dynamic because `setRequestLocale` is never called; the comments in `templates/page.tsx` even note this. | all pages | Call `setRequestLocale` in layout + pages. |
| P-2 | **Heavy hero canvas.** An O(n²) particle-link loop runs every frame (up to 90 particles ≈ 4k distance checks/frame) and listens to global `mousemove`, including on touch devices. | `hero-portrait.tsx:20-190` | Replace with CSS/transform-only ambient layer and a pointer spotlight on fine pointers only. |
| P-3 | **Unoptimized images.** `hero-person.png` (1.2 MB) and the portfolio screenshots use `unoptimized`. `shehan.jpg` is actually a 1.6 MB PNG with a `.jpg` extension. `wildscape.png` is 1208×8968. | `hero-portrait.tsx:65`, `portfolio-section.tsx:66` | Let `next/image` optimize; use right-sized screenshots. |
| P-4 | **Large icon dependency for a marquee.** `react-icons` is used only by `tech-marquee.tsx`. The marquee runs a CSS animation forever and is duplicated 4×. | `tech-marquee.tsx` | Remove marquee + dependency. |
| P-5 | **Everything is a client component.** Home sections, footer and about are all `'use client'` just to use `motion` for reveals. | `components/*` | Server components with small client islands (`Reveal`, nav, form, filter, video). |
| M-1 | **Dead code.** `DigitalCreationEngine/*` (8 files, ~800 lines) is never imported. `ui/button.tsx` is used only by the audit section. `template-mockup.tsx` is used only by the template hub. `services-data.ts`'s `SERVICE_ICON_NAMES` is unused. Messages carry unused namespaces (`Hero.engine`, `Hero.services`, `CTA`, `CaseStudies`). | `src/components/DigitalCreationEngine/`, `src/lib/services-data.ts`, `messages/*.json` | Delete. |
| M-2 | **Unused dependencies**: `class-variance-authority` (0 imports), `autoprefixer` (Tailwind v4 handles prefixing). `react-icons` becomes unused after P-4. | `package.json` | Remove. |
| M-3 | `next.config.ts`: `reactStrictMode: false` hides effect-cleanup bugs; comments are in mixed languages. `minimumCacheTTL` is fine. | `next.config.ts` | Enable strict mode; add redirects for retired routes; add security headers. |
| M-4 | **GA loads without consent.** The fallback ID is hard-coded, and there is no consent banner while the cookie policy is a placeholder. Under the Italian Garante's guidance, analytics cookies need consent unless anonymized/configured as technical. | `layout.tsx:32,105` | Out of scope to build a CMP. Documented as a remaining issue. The privacy/cookie text now discloses GA accurately, and the hard-coded fallback is removed so GA only loads when the env var is set. |
| M-5 | **Lint errors (18).** | see §1 | Fix in touched files; retired files disappear. |
| M-6 | The locale switcher is a plain `<a>` (full reload) built with a regex. It has no `hreflang`/`lang` hints and no `aria` labelling. | `navbar.tsx:69-90` | Use next-intl `Link` with `locale` prop. |
| M-7 | **Contact email promises.** "We'll follow up within one business day" in the confirmation email, plus "Template", "Budget" rows tied to retired features. | `lib/email-templates.ts` | Update copy and fields. |

### Low

- `README.md` is the create-next-app boilerplate with a stray `#   L a n k i o` line (UTF-16 artifact).
- Default create-next-app SVGs (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) are unused in `public/`.
- `prefers-reduced-motion` CSS kills **all** transitions (including focus/hover colour changes) with `!important`. A narrower rule is preferable.
- `scroll-behavior: smooth` is set globally. In Next 16 it now also applies during route navigation unless `data-scroll-behavior="smooth"` is set on `<html>`.
- `robots.ts` disallows `/admin/`, which doesn't exist (harmless).

---

## 3. Content-honesty review

| Content | Verdict |
| --- | --- |
| "50+ Successful Projects" | Unsupported, remove |
| Success stories / case-study metrics | Invented, remove |
| "Agency Quality • Freelance Speed • Fair Pricing" | Marketing claim tied to pricing, replace |
| "Guaranteed response within 24 hours" | Unverifiable guarantee, soften |
| "Full-Stack Developer & AI Solutions Specialist" | Replace with brief's title: *Creative Developer & Multidisciplinary Digital Designer* |
| Template Hub "Lighthouse 94–98" scores per template | Not measured in repo, remove with the hub |
| Wildscape "WordPress, Elementor" | Factually wrong, fix (Next.js) |
| Template demos as "Featured Work" | Built on stock photography, unpublish |
| Placeholder social links | Remove until real URLs supplied |

## 4. Verified facts about the four real projects

Gathered by fetching each live site and inspecting response headers on 2026-10-15. Nothing below is inferred.

- **Wildscape Sri Lanka** (wildscapesrilanka.com): tailor-made Sri Lanka wildlife tour operator. Pages: Home, Tours (Wildlife, Cultural & Heritage, Adventure, Bird Watching), About, Gallery, Blog, Testimonials, FAQ, Plan Your Trip. Trip enquiries through a planning page and WhatsApp; no online checkout. Served by Next.js on Vercel.
- **Lankio Learn** (learn.lankio.it, product name "Lankio Italian"): practical Italian for Sinhala speakers living in Italy. Sinhala–Italian dictionary with examples, free A1 lessons, quizzes, flashcards, progress tracking (XP, streaks, badges), accounts (optional to start), premium tier. Next.js on Vercel (`x-powered-by: Next.js`).
- **Lankio Analyzer** (analyzer.lankio.it): upload an Italian administrative document (PDF/JPG/PNG/WEBP, ≤15 MB). The tool recognises the type (busta paga, CUD, permesso di soggiorno, certificato di residenza, contratto di lavoro, bolletta) and returns an analysis in Sinhala, English or Tamil. The interface states that document data is not stored on the server. The AI provider is not named publicly, so this audit does not name it. Next.js on Vercel.
- **Lankio Digital Solutions** (www.lankio.it): this repository.

No project years, client names, traffic numbers or outcomes could be verified, so none are published.

## 5. Assets inventory

| Asset | Status |
| --- | --- |
| `public/hero-person.png` | Real portrait cutout (1254², 1.2 MB). Keep, serve optimized. |
| `public/images/shehan.jpg` | Real portrait (PNG data, 1.6 MB). Keep, serve optimized. |
| `public/portfolio/wildscape.png` | Real full-page capture, 1208×8968. Superseded by new captures. |
| `public/portfolio/template-*.png` | Template demos, retire. |
| `public/templates/*.jpg` | Template hub thumbnails, retire with hub. |
| Remotion / motion renders | **None found in the repository.** |

## 6. Implementation priorities

1. Fix the design-token pipeline (C-1). This is the root cause of broken buttons.
2. Remove every unsupported claim and all pricing (C-2, C-3, C-4, C-6, H-11).
3. Rebuild IA: Home, Work (+ detail), Expertise, About, Contact, with a typed project registry.
4. SEO: per-page metadata, canonical/hreflang, sitemap, JSON-LD, OG images.
5. Static rendering and client-boundary reduction (P-1, P-5), replace canvas hero (P-2).
6. Contact hardening (H-9) and accurate legal pages (C-5).
7. Lint clean-up, dead code and dependency removal.
