import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/motion/magnetic';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-fg text-canvas hover:bg-white',
  secondary: 'border border-line-strong text-fg hover:border-fg/40 hover:bg-white/[0.04]',
  ghost: 'text-fg hover:text-white px-0',
};

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  /** External links open in a new tab with safe rel attributes. */
  external?: boolean;
  magnetic?: boolean;
  className?: string;
  ariaLabel?: string;
  /** Hide the trailing arrow. */
  plain?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  magnetic = false,
  className,
  ariaLabel,
  plain = false,
}: ButtonLinkProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = cn(
    'group/button relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-[background-color,border-color,color] duration-300',
    VARIANTS[variant],
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {!plain && (
        <span
          aria-hidden="true"
          className="relative inline-flex size-5 items-center justify-center overflow-hidden"
        >
          <Icon
            size={18}
            strokeWidth={1.75}
            className="transition-transform duration-500 ease-out-expo group-hover/button:translate-x-[140%]"
          />
          <Icon
            size={18}
            strokeWidth={1.75}
            className="absolute -translate-x-[140%] transition-transform duration-500 ease-out-expo group-hover/button:translate-x-0"
          />
        </span>
      )}
    </>
  );

  const link = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  );

  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
