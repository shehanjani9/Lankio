'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { getBrowserAnchor, getModuleAnchor, MODULE_DEFS } from './constants';
import type { ModuleId } from './types';

interface ConnectionFieldProps {
  litModules: ReadonlySet<ModuleId>;
  hoveredModule: ModuleId | null;
  reduceMotion: boolean;
}

// Groups are rendered in definition order, so index-within-group is stable
// and matches what ModuleNode instances use for their own anchor.
const GROUP_COUNTS = MODULE_DEFS.reduce<Record<string, number>>((acc, m) => {
  acc[m.group] = (acc[m.group] ?? 0) + 1;
  return acc;
}, {});

function buildPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} Q ${midX} ${from.y} ${to.x} ${to.y}`;
}

// Purely decorative -- the same information (which module feeds into which
// build stage) is available to screen-reader users via the module button
// labels and the sr-only process summary in DigitalCreationEngine.tsx, so
// this whole layer is aria-hidden.
export const ConnectionField = memo(function ConnectionField({
  litModules,
  hoveredModule,
  reduceMotion,
}: ConnectionFieldProps) {
  const groupIndex: Record<string, number> = {};

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {MODULE_DEFS.map((def) => {
        const i = groupIndex[def.group] ?? 0;
        groupIndex[def.group] = i + 1;
        const from = getModuleAnchor(def.group, i, GROUP_COUNTS[def.group]);
        const to = getBrowserAnchor(def.group);
        const active = litModules.has(def.id) || hoveredModule === def.id;

        return (
          <motion.path
            key={def.id}
            d={buildPath(from, to)}
            fill="none"
            stroke={active ? def.accent : 'var(--glass-border)'}
            strokeWidth={active ? 0.45 : 0.28}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            initial={false}
            animate={{ opacity: active ? 0.9 : 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
});
