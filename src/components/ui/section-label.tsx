import { cn } from '@/lib/utils';

/** Numbered editorial label, e.g. "01 — Selected work". */
export function SectionLabel({
  index,
  children,
  className,
  as: Tag = 'p',
  id,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  /** Use 'h2' when the label is the only heading of its section. */
  as?: 'p' | 'h2';
  id?: string;
}) {
  return (
    <Tag id={id} className={cn('text-eyebrow flex items-center gap-3 text-fg-subtle', className)}>
      {index && <span className="tabular-nums text-fg-muted">{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </Tag>
  );
}
