# Lankio — Pre-Deployment Report

Date: 2026-10-15 · Branch: `feat/premium-portfolio-transformation` · Not pushed, not deployed.

This review followed the redesign (see `LANKIO_TRANSFORMATION_FINAL_REPORT.md`). The redesign was preserved: both languages, the four published projects, the eight drafts, the motion showcase, the pricing removal, SEO, the contact form and the accessibility work.

---

## 1. Issues found and fixed

| # | Issue | Severity | Fix |
| --- | --- | --- | --- |
| 1 | Google Analytics loaded on every page view **before any consent** (`@next/third-parties`, unconditional). | High (legal) | Consent system (§2). GA4 now loads only after opt-in. The dependency was removed. |
| 2 | **Live production canonical is malformed:** `https://www.lankio.it//en` (double slash). This almost certainly means `NEXT_PUBLIC_SITE_URL` on Vercel has a trailing slash. | High (SEO) | `resolveSiteUrl()` normalises the value to a bare origin (trims whitespace and trailing slashes, ignores non-http(s) values, and ignores localhost in production builds). Unit-tested. You may still want to tidy the Vercel value (§7). |
| 3 | `new Resend()` ran at import time. It **throws when `RESEND_API_KEY` is missing**, crashing the route with an unhandled 500. | Medium | Lazy client plus request-time configuration validation. Misconfiguration now returns a clean 503 and logs only the *names* of missing variables. |
| 4 | A single transient provider error (rate limit or 5xx) lost the inquiry. | Medium | One server-side retry after 700 ms for 429, 5xx and network errors on the notification email. |
| 5 | The confirmation email had no `replyTo`. Its copy says "just reply to this email", but replies went to the sender address. | Low | `replyTo` is now the studio inbox (`LANKIO_ADMIN_EMAIL`). |
| 6 | Wildscape's live link pointed at the apex domain, which 308-redirects. | Low | Now links to `https://www.wildscapesrilanka.com/`. |
| 7 | The About copy said "grew up in Sri Lanka", which is an assumption. | Low | Rewritten to the brief in EN and IT (§4). |
| 8 | The first visitor's LCP was delayed by the client-only banner (measured 2.8 s → banner became the LCP element). | Medium (perf) | The banner is now server-rendered. A pre-paint inline script hides it for returning visitors, so there's no flash. Measured LCP is now **1.37 s** under the same throttling. |
| 9 | No automated tests in the repository. | Medium | Added a Playwright suite: unit, end-to-end and axe, 75 tests (§3). |

## 2. Consent implementation

**Where:** `src/lib/consent.ts`, `src/components/consent/consent-manager.tsx` and `src/components/consent/analytics.tsx`.

### What each cookie does

| Cookie | Type | Lifetime | Set when |
| --- | --- | --- | --- |
| `lankio_consent` | Technical (stores the choice) | 6 months | The visitor makes a choice |
| `NEXT_LOCALE` | Technical (next-intl) | Session | Only when the chosen language differs from the browser's |
| `_ga`, `_ga_<ID>` | Analytics (GA4) | Up to 2 years | **Only after consent** |

The site uses no other third-party scripts, fonts or embeds: fonts are self-hosted by `next/font`, and the Wildscape, Learn and Analyzer links are plain links.

### Behaviour

- **Banner** (EN/IT):
  - "Reject" and "Accept" have identical styling and size; "Preferences" is a text link.
  - The banner is non-blocking (no cookie wall), and the site works fully either way.
  - The **X** button records "no consent", in line with the Garante's 2021 cookie guidelines on closing the banner.
- **Preferences dialog:**
  - A native `<dialog>`, keyboard accessible, closed with Escape.
  - "Necessary" is always on. "Analytics (Google Analytics 4)" is a switch that is **off by default**, even when the visitor arrives from the banner.
  - Offers Reject all, Accept all and Save preferences. Reject and Accept sit side by side at every screen size.
- **Before consent:**
  - No Google script is requested and no `_ga` cookie is set.
  - The test suite also confirms the page makes **no third-party requests at all**.
- **After consent:**
  - `gtag.js` is injected with `allow_google_signals: false` and `allow_ad_personalization_signals: false`.
  - SPA page views rely on GA4's *Enhanced measurement → page changes based on browser history events* setting. It's on by default; confirm it in the GA property.
- **Withdrawing consent:**
  - Use "Cookie settings" in every footer, or the button on the cookie policy page.
  - GA is disabled immediately (`ga-disable-<ID>`), and `_ga` and `_ga_<ID>` are deleted on the host and its parent domains.
  - Note: Google's script stays in memory until the next page load, but it is disabled and its cookies are gone.
- **Re-asking:** expired (>180 days), malformed or older-version records show the banner again. Bump `CONSENT_VERSION` when the policy changes in a way that needs fresh consent.
- **No flash and no LCP penalty:** the banner is in the static HTML, and an inline `<head>` script hides it before first paint when a valid record exists. Unit tests prove the inline script and `parseConsent` agree on every case.
- **Documentation:** the cookie policy and the privacy policy's analytics section (EN/IT) were rewritten to describe exactly this behaviour. The legal basis for GA is now stated as consent (Art. 6(1)(a) GDPR).

No compliance certification is claimed anywhere. **The legal texts have not been reviewed by a lawyer**, and that is recommended.

## 3. Test results

Every result below was executed on the final committed state (`b5375a8`).

| Check | Command | Result |
| --- | --- | --- |
| TypeScript | `npm run typecheck` | Pass |
| ESLint | `npm run lint` | **0 errors**; 58 warnings, all in the unlinked legacy `/demo` templates (unchanged) |
| i18n parity | `npm run check:i18n` | Pass: 350 identical keys in EN and IT |
| Production build | `npm run build` | Pass (Next.js 16.4.1), 49 static outputs |
| Full suite | `npm test` | **75 passed, 0 failed** (fresh build, then Playwright) |
| Dependency audit | `npm audit --omit=dev` | 0 vulnerabilities |
| Secrets scan | git grep over tracked files | No keys or private keys; `.env*` is not tracked |

The 75 tests cover:

- **Unit (14):**
  - contact validation, including header-injection stripping and length caps
  - consent parsing and expiry, and boot-script/parser agreement
  - email-config validation (secret values never echoed)
  - site-URL normalisation, including the trailing-slash case
- **Consent (12):**
  - no GA requests, cookies or `gtag` before consent; zero third-party requests on three pages
  - Accept and Reject styled identically; the site is usable with the banner open
  - Italian banner
  - Reject persists across navigation and reloads; X counts as no consent
  - Accept loads GA with the privacy config and persists
  - preferences default to off; opt-in through preferences; withdrawal from the footer deletes `_ga` cookies and sets `ga-disable`
  - keyboard-accessible dialog
  - the cookie-policy button reopens preferences
  - expired records ask again
  - the banner is in the server HTML and stays hidden pre-hydration for returning visitors
- **Contact (8):** see §5.
- **Routes (28)**, for all 24 localized pages on mobile:
  - status 200, one `h1`, `lang`, canonical `https://www.lankio.it/...`, `hreflang` en/it/x-default
  - OG image, valid JSON-LD
  - no images without alt, no horizontal overflow at 390 px, no prices, no console errors

  Plus: redirects (308), 404s (including drafts), sitemap (24 URLs, no localhost), robots, OG image responses, security headers, and locale negotiation from `/` (en/it).
- **Interactions (5):** filtering and deep links, the language switch, the skip link, the safe external project link, and the mobile menu (scroll lock, Escape, closing on navigation).
- **Accessibility (8):** axe-core (WCAG 2.0/2.1 A–AA plus best practices) found **0 violations** on 7 pages, plus the consent banner and dialog in Italian.

**Lighthouse** (mobile preset, local production server, fresh profile, so the banner is showing):

| Page | Performance | Accessibility | Best Practices | SEO* |
| --- | --- | --- | --- | --- |
| /en | 90 | 100 | 100 | 92 |
| /it/about | 92 | 100 | 100 | 92 |
| /en/contact | 93 | 100 | 100 | 92 |

CLS is 0 and TBT is 10 ms. \*The SEO deduction is local-only: canonicals point to `www.lankio.it` while the page is served from localhost.

Visual review: I checked screenshots of the banner and dialog (desktop and mobile, IT) and of the About page.

**Not tested:**
- real devices (iOS Safari, Android)
- browsers other than Chrome
- Lighthouse on production
- screen-reader walkthroughs
- **a real email send**: deliberately avoided, see §5

## 4. Content review

**About page (EN/IT).** It now states that Shehan Janith Hettiarachchi is a Sri Lankan creative professional based in Italy. It lists professional experience in:

- web development, web design and graphic design
- photography, videography and video editing
- 2D animation and motion graphics
- social media marketing and SEO
- tourism

It also names the IATA Foundation Diploma. No durations, employers or extra credentials were added. The capability chips match that list, plus UI/UX design and digital marketing from the original brief.

**Project attribution.** Re-checked against the live sites on 2026-10-15:

- **Wildscape Sri Lanka:** kept as **Professional project**. The site's own name is "Wildscape Sri Lanka" (singular, 25 occurrences on the home page), so that spelling is used rather than "Wildscapes". The technologies (Next.js, React, Vercel) are verified from response headers. All highlights are visible on the site.
- **Lankio Learn** and **Lankio AI Document Analyzer:** the features and technologies are verified. The Analyzer's AI provider is still not named, because it isn't public. Its data-handling claim is phrased as what the interface states.
- **Lankio Digital Solutions:** the technologies match this repository.

**Please confirm** (the content can't verify this): the **role lists**, and the **"Approach" bullets**, which describe working method. For example, Wildscape's "UX and content structure" and "design the mobile layouts alongside desktop", and "Full-stack development" for Learn. Edit `src/content/projects/*.ts` if anything is off.

## 5. Contact form readiness

**Flow:** client validation → `POST /api/contact` → bot checks → rate limit → validation → configuration check → notification email (one retry if transient) → confirmation email (a failure is logged only) → `{ ok: true }`.

| Area | Status |
| --- | --- |
| **Validation** | Shared rules on client and server; length caps; header-injection characters stripped; HTML-escaped emails (tested with a `<script>` payload) |
| **Spam** | Hidden honeypot field plus a 3-second minimum fill time; both get a silent 200 and no email is sent (tested) |
| **Rate limit** | 5 per IP per 10 minutes by default (`CONTACT_RATE_LIMIT_MAX`). The 429 response carries `Retry-After: 600` (tested). Note: the limit is per server instance |
| **Retry behaviour** | Server retries the notification once on transient errors (tested with a flaky provider). After a hard failure the visitor sees the error, their input is kept, and an immediate retry succeeds without being mistaken for a bot (tested) |
| **States** | Error summary, focus on the first invalid field, `aria-invalid`/`aria-describedby`, a focused success heading, and an error message with an email fallback. All in EN and IT (tested) |
| **Sender/recipient** | From `LANKIO_FROM_EMAIL` to `LANKIO_ADMIN_EMAIL`, `replyTo` = visitor. Confirmation goes to the visitor with `replyTo` = studio inbox. Subjects are localized (tested against the mock) |
| **Env validation** | Missing key → 503 plus a log line naming the variable. Malformed addresses are rejected. Missing admin/from addresses fall back to the previous defaults with a warning (unit-tested) |
| **Secrets** | Never logged or returned; `.env.local` is git-ignored |

Every email test ran against the local Resend mock with a fake key. **No real email was sent.**

### Production email test checklist (after deploying)

1. In Vercel → Project → Settings → Environment Variables (Production), confirm `RESEND_API_KEY`, `LANKIO_ADMIN_EMAIL` and `LANKIO_FROM_EMAIL` exist. Don't paste their values anywhere public.
2. In Resend → Domains, confirm the domain in `LANKIO_FROM_EMAIL` (e.g. `lankio.it`) is **verified** (SPF and DKIM green). Otherwise sends fail with a 403 and the form shows its error state.
3. On https://www.lankio.it/en/contact, wait a few seconds, then submit a real inquiry **to an address you own** (not a third party). Use the type "Something else" and a message starting "TEST".
4. Check that:
   - the notification arrives at `LANKIO_ADMIN_EMAIL`
   - **Reply** on the notification goes to the visitor's address
   - the confirmation arrives at your test address, in English, and **Reply** goes to the studio inbox
   - neither email landed in spam (check both folders)
5. Repeat once from `/it/contact`, choosing Italian as the reply language, and check the Italian confirmation.
6. In Resend → Emails (logs), confirm both sends show "Delivered".
7. In Vercel → Logs, filter for `Contact`. There should be no `not configured` or `failed` lines. The warnings `LANKIO_..._EMAIL is not set; using the default` mean a variable is missing.
8. Optional: submit twice quickly to confirm a second inquiry still goes through. Don't hammer the form, because the rate limit is 5 per 10 minutes.

## 6. Remaining manual checks

- [ ] Review the project roles and approach bullets (§4).
- [ ] Have the privacy, cookie and terms pages reviewed by a professional. Confirm the data-controller details: the pages currently name you as Shehan Janith Hettiarachchi, operating as Lankio Digital Solutions, Italy, with info@lankio.it. Add your VAT number or address if you have one and want it shown.
- [ ] In GA4: confirm enhanced measurement (history events) is on. Optionally shorten data retention and confirm the property's region and data-sharing settings.
- [ ] Add verified social profile URLs in `src/config/site.ts` (currently none are shown).
- [ ] Run the production email checklist (§5).
- [ ] Spot-check on a real iPhone and Android device: the hero, the mobile menu, the consent banner, and the contact form keyboard behaviour.
- [ ] After deploying: run Lighthouse on https://www.lankio.it/en, and resubmit `https://www.lankio.it/sitemap.xml` in Google Search Console.

## 7. Environment variables required

| Variable | Scope | Required | Value / notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Build-time (public) | Recommended | `https://www.lankio.it`, **with no trailing slash**. The code now normalises it, but the current production value appears to end in `/` (see §1, issue 2). Because it is inlined at build time, changing it needs a redeploy. |
| `RESEND_API_KEY` | Server | **Yes** | Without it the form returns 503 |
| `LANKIO_ADMIN_EMAIL` | Server | Recommended | Inbox for inquiries (falls back to the previous default) |
| `LANKIO_FROM_EMAIL` | Server | Recommended | `Lankio <info@lankio.it>` format, on a Resend-verified domain |
| `NEXT_PUBLIC_GA_ID` | Build-time (public) | Optional | GA4 ID; the code falls back to the existing ID. Loaded only after consent. |
| `CONTACT_RATE_LIMIT_MAX` | Server | Optional | Defaults to 5 |

`RESEND_BASE_URL` is used only by the test suite. **Don't set it in production.**

No environment variables were modified.

## 8. Domains and routing (verified live)

| Request | Response |
| --- | --- |
| `http://lankio.it/` | 308 → `https://lankio.it/` → 308 → `https://www.lankio.it/` |
| `http://www.lankio.it/` | 308 → `https://www.lankio.it/` |
| `https://lankio.it/en/work` | 308 → `https://www.lankio.it/en/work` (path preserved) |
| `https://www.lankio.it/` | 307 → `/en` or `/it` (language negotiation, so temporary is correct) |

Redirects are consistent: everything is permanent to the HTTPS www host. The app's canonical URLs, sitemap and robots all use `https://www.lankio.it` (tested). Old `/templates`, `/audit`, `/faq` and `/pricing` URLs redirect permanently.

## 9. Production deployment instructions

1. Review the diff: `git log --oneline main..feat/premium-portfolio-transformation` (6 commits) and `git diff main --stat`.
2. Locally: `npm ci && npm test`. This should report 75 passed.
3. In Vercel: set or confirm the environment variables in §7. In particular, correct `NEXT_PUBLIC_SITE_URL` to `https://www.lankio.it`.
4. Push the branch and open a pull request: `git push -u origin feat/premium-portfolio-transformation`. Vercel will build a **Preview** deployment.
5. On the preview:
   - click through EN/IT
   - check the consent banner
   - check one case study and the contact page

   The preview has the production env only if you scoped it that way, so avoid real sends there unless intended.
6. Merge to `main`. Vercel deploys to production.
7. Run the production email checklist (§5) and the post-deploy checks (§6).
8. **Rollback:** in Vercel → Deployments, promote the previous production deployment. No database or data migrations are involved.

## 10. Unresolved risks

1. **Legal review is pending** for the cookie, privacy and terms texts. The implementation follows the Garante's 2021 guidance as I understand it, but this is not legal advice or a certification.
2. **Analytics opt-in rates.** Most visitors reject or ignore banners, so GA traffic numbers will drop compared with the old unconditional setup. That's expected.
3. **The rate limit is per serverless instance** (in memory). For stronger abuse protection, add Vercel Firewall rate-limit rules or a shared store such as Upstash.
4. **Confirmation emails go to whatever address is entered.** That could be used to send someone an unwanted confirmation; it is limited by the honeypot, timing check and rate limit. If it becomes an issue, consider a CAPTCHA (e.g. Cloudflare Turnstile, which would itself need consent review) or dropping the confirmation email.
5. **Untested surfaces:** real email delivery, real devices, non-Chrome browsers and production Lighthouse (§3).
6. **Legacy `/demo` templates** still have pre-existing lint warnings and Unsplash imagery. They're unlinked and `noindex`, but reachable by URL.
