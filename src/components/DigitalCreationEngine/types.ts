// ---------------------------------------------------------------------------
// All shared types live here. No Framer Motion or DOM-only imports -- this
// file must remain importable in any context (server, worker, test) without
// pulling in browser-only dependencies. Mirrors the same discipline the old
// HeroCube/types.ts followed.
// ---------------------------------------------------------------------------

export type ModuleGroup = 'input' | 'execution' | 'outcome';

export const MODULE_IDS = [
  // input (left column) -- everything that shapes the idea before it's built
  'idea',
  'strategy',
  'research',
  'content',
  'brand',
  // execution (right column) -- everything that builds and tunes the product
  'development',
  'seo',
  'analytics',
  'performance',
  'marketing',
  // outcome (bottom row) -- everything that ships it and keeps it growing
  'deployment',
  'hosting',
  'maintenance',
  'growth',
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export interface EngineModule {
  label: string;
  glyph: string;
}

// The seven narrative beats from the brief: Strategy -> Planning -> Design ->
// Development -> Optimization -> Launch -> Business Growth. `idle` is the
// pre-play state (nothing lit yet, used for SSR/initial paint).
export type EngineStage =
  | 'idle'
  | 'idea'
  | 'wireframe'
  | 'design'
  | 'development'
  | 'optimization'
  | 'launch'
  | 'growth';

// Every visible string inside the browser mock -- kept out of the component
// tree and passed in from next-intl, so nothing here is ever hardcoded
// English (see hero.tsx for how this is built from translations).
export interface BrowserCopy {
  urlPlaceholder: string;
  domain: string;
  liveLabel: string;
  badges: { performance: string; accessibility: string; speed: string };
  graphs: { traffic: string; leads: string; growth: string };
}

export interface DigitalCreationEngineProps {
  modules: Record<ModuleId, EngineModule>;
  browserCopy: BrowserCopy;
  ariaLabel: string;
  onActiveModuleChange?: (id: ModuleId) => void;
}

export interface DigitalCreationEngineStaticProps {
  modules: Record<ModuleId, EngineModule>;
  browserCopy: BrowserCopy;
  ariaLabel: string;
}
