# Lankio — Transformation Plan

Companion to `LANKIO_FULL_AUDIT.md`. This plan was written before implementation and records the decisions that shaped the work.

## Creative direction: "Quiet confidence"

- **Palette.** Near-black canvas (`#07080B`) with a slightly lifted surface (`#0D0F14`). Hairline borders use white at 7–12% alpha. One violet accent (`#7C6CFF`) and one electric-blue accent (`#4DA3FF`), used sparingly for focus, active states and a single ambient glow. No orange secondary.
- **Type.** Inter for everything functional, set tight for display sizes. *Instrument Serif* italic as the single editorial accent, used for one or two words per headline, never for body text. Two families total; the previous Sora and JetBrains Mono are dropped.
- **Layout.** Editorial 12-column grid, generous vertical rhythm (`clamp`-based section padding), numbered section labels (`01 — Selected work`), and large imagery with thin frames rather than glass cards.
- **Motion.** Masked line reveals in the hero, staggered fades on scroll, clip-path image reveals, an animated nav indicator (`layoutId`), magnetic CTAs on fine pointers only, and a soft route fade via `template.tsx`. Everything is transform/opacity based and respects `prefers-reduced-motion`.

## Information architecture

| Route | Purpose |
| --- | --- |
| `/{locale}` | Hero → Selected work → About preview → Expertise → Contact CTA |
| `/{locale}/work` | Filterable gallery (All / Web & Development / AI & Applications / Branding & Design / Motion & Animation / Photography & Video). Categories without published work are hidden automatically. |
| `/{locale}/work/[slug]` | Case-study template: overview, role, technologies, approach, gallery, video, live link, next project |
| `/{locale}/expertise` | Five capability groups with deliverables. No prices. |
| `/{locale}/about` | Biography, background, approach, IATA Foundation Diploma, confidentiality note |
| `/{locale}/contact` | Inquiry form (Resend), direct email, short FAQ |
| `/{locale}/privacy-policy`, `/cookie-policy`, `/terms` | Rewritten to describe actual processing |

**Retired, with permanent redirects:** `/{locale}/templates` → `/work`, `/{locale}/audit` → `/contact`, `/{locale}/faq` → `/contact`. The `/demo/*` pages stay reachable and `noindex`, but are no longer linked. They are the starting point for the hotel/restaurant concepts.

## Content architecture

- `src/content/projects/*.ts`: one typed file per project, with English and Italian in the same file.
- `src/content/projects/index.ts` is the registry. A build-time validator checks unique slugs, cover presence, alt text in both locales, and video aspect ratios. Drafts are excluded from production rendering, the sitemap and metadata.
- Classification (`professional` / `independent` / `concept`) drives a quiet attribution line ("Independent project", "Creative concept"), not a badge.
- Media: `public/projects/<slug>/` (images, posters, MP4s).

## Pricing removal

Delete the pricing section, planner, pricing and planner data, the template hub and its data, the €49/mo micro-trust line, budget ranges in the contact form, and the nav/footer links. Replace them with "Start a project" / "Discuss your idea" CTAs pointing to `/contact`.

## Engineering

- Tailwind v4 `@theme` tokens in `globals.css`. Delete `tailwind.config.ts`.
- `setRequestLocale` everywhere for static generation; `generateStaticParams` for project slugs.
- `lib/seo.ts`: `buildMetadata()` (canonical, `hreflang` + `x-default`, OG/Twitter) and JSON-LD builders (`Person`, `Organization`, `WebSite`, `CreativeWork`, `BreadcrumbList`). No ratings or reviews.
- `opengraph-image.tsx` per locale root and per project.
- Contact API: honeypot, minimum fill time, length caps, CRLF stripping, best-effort per-IP rate limit, generic error messages.
- `next.config.ts`: strict mode, redirects, security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` except `/demo`, `Permissions-Policy`).
- Remove `react-icons`, `class-variance-authority`, `autoprefixer`, the dead `DigitalCreationEngine`, and the unused public assets.

## Testing

`tsc`, `eslint`, `next build`, then a Playwright run against `next start`. It checks every route in both locales (HTTP 200, one `<h1>`, no horizontal overflow at 390 px, no console errors), work filtering, the video player (using a locally generated test clip that is not committed), contact validation, and the honeypot. Screenshots are taken at desktop and mobile widths.
