import { MODULE_DEFS } from './constants';
import type { DigitalCreationEngineStaticProps } from './types';

// No animation, no Framer Motion -- used for prefers-reduced-motion visitors
// and as the deterministic server-rendered frame before hydration decides
// whether motion is allowed. Shows the engine already fully connected: the
// end state of the story, described rather than performed.
export function DigitalCreationEngineStatic({ modules, browserCopy, ariaLabel }: DigitalCreationEngineStaticProps) {
  return (
    <div className="glass-panel flex h-full w-full flex-col items-center justify-center gap-5 p-6" role="group" aria-label={ariaLabel}>
      <p className="sr-only">{ariaLabel}</p>

      <div className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--glass-border)] px-4 py-3" aria-hidden="true">
        <span className="font-mono-label text-[10px] text-[color:var(--text-secondary)]">{browserCopy.domain}</span>
        <span
          className="font-mono-label rounded-full px-2 py-0.5 text-[9px]"
          style={{ color: '#28E0C4', backgroundColor: '#28E0C41a' }}
        >
          {browserCopy.liveLabel}
        </span>
      </div>

      {(['input', 'execution', 'outcome'] as const).map((group) => (
        <ul key={group} className="flex flex-wrap items-center justify-center gap-2" aria-label={group}>
          {MODULE_DEFS.filter((d) => d.group === group).map((def) => (
            <li
              key={def.id}
              className="font-mono-label rounded-full border border-[color:var(--glass-border)] px-3 py-1 text-xs text-[color:var(--text-secondary)]"
            >
              {modules[def.id].label}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
