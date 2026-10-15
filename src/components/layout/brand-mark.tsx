import { useId } from 'react';

/** Lankio wordmark with a small geometric monogram. Purely presentational. */
export function BrandMark({ className }: { className?: string }) {
  // Unique per instance: the mark appears in both header and footer.
  const gradientId = `lankio-mark-${useId().replace(/:/g, '')}`;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7" fill="none">
        <rect x="0.5" y="0.5" width="31" height="31" rx="9" className="stroke-line-strong" />
        <path d="M11 8.5v15h10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="10" r="2.25" fill={`url(#${gradientId})`} />
        <defs>
          <linearGradient id={gradientId} x1="19.75" y1="7.75" x2="24.25" y2="12.25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B7DFF" />
            <stop offset="1" stopColor="#4DA3FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[1.05rem] font-semibold tracking-[-0.03em] text-fg">Lankio</span>
    </span>
  );
}
