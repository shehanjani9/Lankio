import type { EngineStage, ModuleGroup, ModuleId } from './types';

// ---------------------------------------------------------------------------
// PALETTE -- copied verbatim from the old HeroCube/constants.ts. The brief
// requires the existing color palette to stay untouched, so these hex values
// are not "inspired by" the old cube -- they ARE the old cube's palette,
// reused so the new visual reads as the same product, not a reskin.
// ---------------------------------------------------------------------------
export const PALETTE = {
  obsidian: '#0B0D12',
  deepCyan: '#0E7C86',
  electricIndigo: '#6C4BFF',
  neonTeal: '#28E0C4',
  softRoseCoral: '#FF8F79',
  brightViolet: '#A64BFF',
  rimLight: '#CFE8FF',
} as const;

export const ACCENT_COLORS: readonly string[] = [
  PALETTE.deepCyan,
  PALETTE.electricIndigo,
  PALETTE.neonTeal,
  PALETTE.softRoseCoral,
  PALETTE.brightViolet,
];

interface ModuleDef {
  id: ModuleId;
  group: ModuleGroup;
  accent: string;
}

// Static definition of every module: which column it lives in and which
// accent it glows. Accent assignment cycles through ACCENT_COLORS so the
// existing 5-color rotation used by the cube's six faces carries over
// exactly, just spread across 14 modules instead of 6.
export const MODULE_DEFS: readonly ModuleDef[] = [
  { id: 'idea', group: 'input', accent: ACCENT_COLORS[0] },
  { id: 'strategy', group: 'input', accent: ACCENT_COLORS[1] },
  { id: 'research', group: 'input', accent: ACCENT_COLORS[2] },
  { id: 'content', group: 'input', accent: ACCENT_COLORS[3] },
  { id: 'brand', group: 'input', accent: ACCENT_COLORS[4] },
  { id: 'development', group: 'execution', accent: ACCENT_COLORS[0] },
  { id: 'seo', group: 'execution', accent: ACCENT_COLORS[1] },
  { id: 'analytics', group: 'execution', accent: ACCENT_COLORS[2] },
  { id: 'performance', group: 'execution', accent: ACCENT_COLORS[3] },
  { id: 'marketing', group: 'execution', accent: ACCENT_COLORS[4] },
  { id: 'deployment', group: 'outcome', accent: ACCENT_COLORS[0] },
  { id: 'hosting', group: 'outcome', accent: ACCENT_COLORS[1] },
  { id: 'maintenance', group: 'outcome', accent: ACCENT_COLORS[2] },
  { id: 'growth', group: 'outcome', accent: ACCENT_COLORS[3] },
];

// ---------------------------------------------------------------------------
// LAYOUT -- percentage coordinates inside a 0-100 x 0-100 box. Both the
// module nodes and the SVG connection paths are positioned from these same
// numbers, so a line drawn from a module's anchor always terminates exactly
// at that module's rendered center regardless of the container's real pixel
// size. This is the desktop/tablet ("engine diagram") layout only -- mobile
// uses a separate stacked-list layout (see DigitalCreationEngine.tsx).
// ---------------------------------------------------------------------------
export const BROWSER_RECT = { x: 28, y: 20, width: 44, height: 42 } as const; // percent
export const BROWSER_CENTER = { x: 50, y: 41 } as const;

const LEFT_COLUMN_X = 6;
const RIGHT_COLUMN_X = 94;
const SIDE_COLUMN_TOP_Y = 10;
const SIDE_COLUMN_BOTTOM_Y = 76;

const BOTTOM_ROW_Y = 92;
const BOTTOM_ROW_LEFT_X = 32;
const BOTTOM_ROW_RIGHT_X = 68;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Returns the {x, y} percentage anchor for a module given its group and its index within that group. */
export function getModuleAnchor(group: ModuleGroup, indexInGroup: number, groupSize: number): { x: number; y: number } {
  const t = groupSize <= 1 ? 0.5 : indexInGroup / (groupSize - 1);
  if (group === 'input') {
    return { x: LEFT_COLUMN_X, y: lerp(SIDE_COLUMN_TOP_Y, SIDE_COLUMN_BOTTOM_Y, t) };
  }
  if (group === 'execution') {
    return { x: RIGHT_COLUMN_X, y: lerp(SIDE_COLUMN_TOP_Y, SIDE_COLUMN_BOTTOM_Y, t) };
  }
  return { x: lerp(BOTTOM_ROW_LEFT_X, BOTTOM_ROW_RIGHT_X, t), y: BOTTOM_ROW_Y };
}

/** Where a connection line should touch the browser window, given the module's group. */
export function getBrowserAnchor(group: ModuleGroup): { x: number; y: number } {
  if (group === 'input') return { x: BROWSER_RECT.x, y: BROWSER_CENTER.y };
  if (group === 'execution') return { x: BROWSER_RECT.x + BROWSER_RECT.width, y: BROWSER_CENTER.y };
  return { x: BROWSER_CENTER.x, y: BROWSER_RECT.y + BROWSER_RECT.height };
}

// ---------------------------------------------------------------------------
// STAGE SEQUENCE + TIMING
// ---------------------------------------------------------------------------
export const STAGE_SEQUENCE: EngineStage[] = [
  'idea',
  'wireframe',
  'design',
  'development',
  'optimization',
  'launch',
  'growth',
];

// ms each stage "holds" before the next one begins. Kept short and additive
// (never a jump-cut) -- see useEngineSequence.ts for how these compose.
export const STAGE_DURATIONS_MS: Record<EngineStage, number> = {
  idle: 0,
  idea: 650,
  wireframe: 900,
  design: 1400,
  development: 900,
  optimization: 950,
  launch: 950,
  growth: 1200,
};

// Which modules light up on which stage. Used to drive both the module glow
// and the matching connection line illumination.
export const STAGE_MODULE_MAP: Partial<Record<EngineStage, ModuleId[]>> = {
  idea: ['idea'],
  wireframe: ['strategy', 'research'],
  design: ['content', 'brand'],
  development: ['development'],
  optimization: ['seo', 'performance'],
  launch: ['deployment', 'hosting'],
  growth: ['analytics', 'marketing', 'maintenance', 'growth'],
};

export const STAGE_GAP_MS = 180; // small pause between stages, never a jump
export const INITIAL_DELAY_MS = 450; // settle pause before the sequence begins
export const BREATHE_CYCLE_S = 4.4; // seconds per gentle "breathing" cycle once settled
export const PARALLAX_STRENGTH_DEG = 3.5; // max tilt in degrees -- deliberately small
export const PARALLAX_SMOOTHING = 0.12; // spring damping factor
