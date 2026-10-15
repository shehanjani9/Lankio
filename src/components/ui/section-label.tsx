import { cn } from '@/lib/utils';

/** Numbered editorial label, e.g. "01 — Selected work". */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-eyebrow flex items-center gap-3 text-fg-subtle', className)}>
      {index && <span className="tabular-nums text-fg-muted">{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}
