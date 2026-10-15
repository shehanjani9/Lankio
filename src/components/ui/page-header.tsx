import { SectionLabel } from './section-label';

const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as React.CSSProperties;

/**
 * Header for inner pages. Uses the CSS line reveal (not JS) because it is
 * above the fold and usually the LCP element.
 */
export function PageHeader({
  eyebrow,
  titleLead,
  titleAccent,
  intro,
  children,
}: {
  eyebrow: string;
  titleLead: string;
  titleAccent?: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="animate-drift absolute -left-[10%] -top-1/2 h-[32rem] w-[32rem] rounded-full bg-accent/[0.1] blur-[120px]" />
        <div className="bg-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
      </div>
      <div className="container-page">
        <div className="enter-fade-up" style={delay(0.05)}>
          <SectionLabel>{eyebrow}</SectionLabel>
        </div>
        <h1 className="text-display mt-8 max-w-6xl text-balance-pretty">
          <span className="line-mask">
            <span style={delay(0.12)}>
              {titleLead}
              {titleAccent && (
                <>
                  {' '}
                  <span className="font-accent text-fg-muted">{titleAccent}</span>
                </>
              )}
            </span>
          </span>
        </h1>
        {intro && (
          <p className="enter-fade-up text-lead mt-8 max-w-2xl text-fg-muted" style={delay(0.35)}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
