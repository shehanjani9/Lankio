/**
 * Geometry of the official Lankio logo (Concept 01, "Frame L"), shared by the
 * site header/footer and the Open Graph images. Source of truth:
 * brand-assets/logo-exploration/logo-light.svg.
 */

export const LOGO_VIEWBOX = '6 6 320.32 64';
export const LOGO_ASPECT = 320.32 / 64;
export const LOGO_BLUE = '#4DA3FF';

/** Frame L mark, drawn on a 100-unit grid and shifted by (-12, -12). */
export const MARK_INK = 'M18,18 35,18 35,82 18,82Z M18,65 64,65 64,82 18,82Z';
export const MARK_ACCENT = 'M46,18 82,18 82,25 46,25Z M75,18 82,18 82,54 75,54Z';

/** LANKiO wordmark on a 100-unit cap height, placed at (94, 16) and scaled 0.44. */
export const WORDMARK_INK =
  'M0,0 15,0 15,100 0,100Z M0,85 56,85 56,100 0,100Z M107.05,0 122.95,0 87.89,100 72,100Z M158,100 142.11,100 107.05,0 122.95,0Z M90.92,63 139.08,63 139.08,75.3 90.92,75.3Z M182,0 197,0 197,100 182,100Z M247,0 262,0 262,100 247,100Z M182,0 199.02,0 262,100 244.98,100Z M284,0 299,0 299,100 284,100Z M339.68,0 358.6,0 298.5,68.82 284,68.82 284,63.76Z M296.77,50 314.18,50 357.84,100 340.43,100Z M381,24 396,24 396,100 381,100Z';
export const WORDMARK_O = { cx: 475, cy: 50, r: 45.05, strokeWidth: 15.9 };
export const WORDMARK_PIXEL = 'M381,0 396,0 396,15 381,15Z';

/** Standalone SVG markup of the logo in a given ink (for image renderers). */
export function logoSvg(ink: string): string {
  const o = WORDMARK_O;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}">` +
    `<g transform="translate(-12 -12)"><path fill="${ink}" d="${MARK_INK}"/><path fill="${LOGO_BLUE}" d="${MARK_ACCENT}"/></g>` +
    `<g transform="translate(94 16) scale(0.44)"><path fill="${ink}" d="${WORDMARK_INK}"/>` +
    `<circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" fill="none" stroke="${ink}" stroke-width="${o.strokeWidth}"/>` +
    `<path fill="${LOGO_BLUE}" d="${WORDMARK_PIXEL}"/></g></svg>`
  );
}
