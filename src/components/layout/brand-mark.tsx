import { LOGO_BLUE, LOGO_VIEWBOX, MARK_ACCENT, MARK_INK, WORDMARK_INK, WORDMARK_O, WORDMARK_PIXEL } from '@/lib/brand-logo';

/**
 * Official Lankio logo (Concept 01, "Frame L"): the Frame L mark beside the
 * custom LANKiO wordmark. The ink follows `currentColor`; the frame corner and
 * the i's pixel are the brand electric blue. Purely presentational.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg role="img" aria-label="Lankio" viewBox={LOGO_VIEWBOX} className={`block h-5 w-auto text-fg lg:h-7 ${className ?? ''}`}>
      <g transform="translate(-12 -12)">
        <path fill="currentColor" d={MARK_INK} />
        <path fill={LOGO_BLUE} d={MARK_ACCENT} />
      </g>
      <g transform="translate(94 16) scale(0.44)">
        <path fill="currentColor" d={WORDMARK_INK} />
        <circle cx={WORDMARK_O.cx} cy={WORDMARK_O.cy} r={WORDMARK_O.r} fill="none" stroke="currentColor" strokeWidth={WORDMARK_O.strokeWidth} />
        <path fill={LOGO_BLUE} d={WORDMARK_PIXEL} />
      </g>
    </svg>
  );
}
