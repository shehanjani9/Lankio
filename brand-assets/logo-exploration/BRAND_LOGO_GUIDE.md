# Lankio logo guide

Status: **Frame L (Concept 01) is the approved logo of Lankio Digital Solutions.**

It is implemented in the local website code (see [Implementation status](#implementation-status)). At the time of writing (17 October 2026) those changes are **not yet committed to Git and not deployed**, so the live lankio.it still shows the previous logo.

Concepts 02 and 03 are kept for reference only.

Open `logo-comparison.html` in Chrome to see every concept on light and dark, at real sizes. The page records the exploration stage, so it still labels Concept 01 "Recommended".

## The three concepts

| # | Concept | Type | Idea |
| --- | --- | --- | --- |
| 01 | **Frame L** *(approved)* | Monogram | A heavy L corner and a light opposite corner form an implied frame. It reads as a viewfinder crop mark (photo and video), a screen viewport (web) and a code bracket (development). The empty space between the corners is "the work". |
| 02 | **LANKiO** | Wordmark | Custom geometric capitals with a single signature detail: the I carries a square "pixel" in electric blue, echoing the lowercase i of the earlier LANKiO logo. |
| 03 | **Spark** | Signature | A square (structure) and a quarter disc (the idea rising) touch at a single point, beside a geometric lowercase *lankio* and a spaced DIGITAL SOLUTIONS tagline. Uses restrained violet for a separate personality. |

### Why Frame L was chosen

- **It survives small sizes.** The L-plus-corner silhouette stays recognisable at 16 px, which a wordmark (02) or a two-part abstract symbol (03) cannot.
- **It means something for this business.** One shape covers framing an image, a screen and a block of code, so it fits every service without illustrating any of them.
- **It continues the existing brand.** lankio.it already uses an L monogram with an accent at the top right. Frame L is a stronger, more ownable version of that idea, so adopting it does not feel like a rebrand.
- **It is quietly confident.** It uses two flat shapes and one accent colour, with no gradients and no effects.
- **The system is complete.** It is paired with the concept 02 capitals, which gives the approved system a bespoke wordmark too.

## Approved logo files

| File | Use |
| --- | --- |
| `logo-primary.svg` / `logo-primary.png` | Stacked mark, wordmark and tagline, in dark ink for light backgrounds. Documents, proposals, social cover images. PNG: 2400×2335, transparent. |
| `logo-horizontal.svg` | Mark, wordmark and tagline in one line, in dark ink. Letterheads, email signatures, invoices. |
| `logo-light.svg` | Mark and wordmark in light ink. **Intended for dark backgrounds.** Used for the website header and footer (the site canvas is `#07080B`). |
| `logo-dark.svg` | Mark and wordmark in dark ink. **Intended for light backgrounds**: documents, print, light web pages. |
| `logo-icon.svg` / `logo-icon-1024.png` | **The Lankio brand icon**: the Frame L mark on a navy rounded tile. For favicons, app icons and social avatars. PNG: 1024×1024, transparent outside the tile. |

The names *light* and *dark* describe the logo's own ink colour, not the background.

## Colour

| Role | Hex | Notes |
| --- | --- | --- |
| Navy ink | `#0B1020` | Wordmark and L on light backgrounds; icon tile |
| Light ink | `#F4F5F7` | Wordmark and L on dark backgrounds (the site's foreground colour) |
| Electric blue, dark backgrounds | `#4DA3FF` | The site's `accent-blue` |
| Electric blue, light backgrounds | `#2A78F0` | Deeper, so the accent keeps at least 3:1 contrast on white |
| Violet (concept 03 only) | `#8B7DFF` / `#6A5AF0` | The site's accent, and a light-background version |

**One-colour use:** the whole logo may be set in navy ink or light ink, including the corner and the pixel. Never use the blue alone for the full logo.

## Construction

- **Mark:** built on a 100-unit grid. The frame spans 18–82.
  - The L stem and foot are 17 units thick; the foot is 46 long.
  - The opposite corner is 7 units thick, with 36-unit arms.
  - The icon tile is 100 units with a corner radius of 22.
- **Wordmark:** custom capitals at a 100-unit cap height, with 15-unit stems and optically adjusted spacing.
  - The O overshoots by 2 units top and bottom.
  - The I's pixel is one stem-width square, separated from the stem by a 9-unit gap.
- **Tagline:** monoline geometric capitals. Their tracking is solved so the line spans exactly the width of the wordmark.

## Clear space and minimum sizes

- **Clear space:** keep at least the width of the L stem free on every side. That's 17 units at mark scale, about 27% of the mark's visible height.
- **Icon:** minimum 16 px. It's verified on the comparison page at 16, 24, 32, 48, 64 and 128 px.
- **Horizontal logo without tagline** (`logo-light`, `logo-dark`): minimum 20 px tall.
- **Lockups with the tagline:** minimum 48 px tall (horizontal) or 120 px wide (primary). Below that, use a version without the tagline.

## Don't

- Don't recolour, add gradients, glows or shadows.
- Don't stretch the logo or rotate it. The corner must stay at the top right.
- Don't separate the corner from the L in the monogram.
- Don't retype the wordmark in a font. The letters are custom, so always use the files.
- Don't put the light logo on light backgrounds, or the dark logo on dark ones.

## Typography alongside the logo

Keep the site's existing pairing for all other text: **Inter** for UI and body, and **Instrument Serif** italic for editorial accents. Both are SIL Open Font License. The logo uses neither: its letters are drawn geometry.

## Technical notes and licensing

- **Self-contained SVGs.** Every file is a plain SVG of paths and circles: no `<text>`, no embedded or linked fonts, no images, no gradients, no scripts, no external references.
- **Validity.** All files parse as valid XML.
- **Original work.** All geometry was drawn for Lankio for this exploration. It isn't based on stock icons, other logos or font outlines.
- **Trademark status.** The logo is **not registered** as a trademark, and **no legal or trademark clearance search** has been carried out. Before registering it, or relying on it exclusively, have a professional run a clearance search. Simple geometric marks can resemble existing registrations by coincidence.

## Implementation status

Last checked 17 October 2026, on the local branch `feat/premium-portfolio-transformation`. **Not committed, not pushed, not deployed.** Update this section when that changes.

| Where | What | File |
| --- | --- | --- |
| Header (desktop, tablet, mobile), mobile menu, footer | Frame L mark + LANKiO wordmark, from `logo-light.svg`, inline SVG with `currentColor` ink. 28 px tall from 1024 px wide upwards, 20 px below that (so the Italian header stays on one line). | `src/components/layout/brand-mark.tsx`, geometry in `src/lib/brand-logo.ts` |
| Browser icon | `logo-icon.svg`, unchanged | `src/app/icon.svg` |
| Favicon | 16, 32, 48 px, pixel-snapped for small sizes | `src/app/favicon.ico` |
| Apple touch icon | 180×180, full-bleed navy (iOS rounds the corners) | `src/app/apple-icon.png` |
| Android / web manifest | 192, 512 and a 512 maskable icon | `src/app/manifest.ts`, `public/brand/` |
| Social sharing images | The real logo replaces the old placeholder "L" | `src/components/seo/og-template.tsx` |
| Search engines (Organization schema) | 512 px icon | `src/lib/structured-data.ts` |

The approved SVG and PNG files in this folder are the source artwork. Don't edit them in place; export a new version instead.
