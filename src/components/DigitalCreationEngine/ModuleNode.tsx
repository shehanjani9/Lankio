'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { ModuleId } from './types';

interface ModuleNodeProps {
  id: ModuleId;
  label: string;
  glyph: string;
  accent: string;
  anchor: { x: number; y: number };
  isLit: boolean;
  isHovered: boolean;
  reduceMotion: boolean;
  onHoverChange: (id: ModuleId | null) => void;
}

// A single floating module. Positioned absolutely via percentage `anchor`
// coordinates so it always lines up with the SVG connection line drawn to
// the same anchor in ConnectionField.tsx.
export const ModuleNode = memo(function ModuleNode({
  id,
  label,
  glyph,
  accent,
  anchor,
  isLit,
  isHovered,
  reduceMotion,
  onHoverChange,
}: ModuleNodeProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      className="glass-panel glass-panel-interactive absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-3 py-1.5 text-left"
      style={{
        left: `${anchor.x}%`,
        top: `${anchor.y}%`,
        boxShadow: isLit || isHovered ? `0 0 0 1px ${accent}55, 0 8px 24px -8px ${accent}66` : undefined,
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.06 : 1,
      }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
      onMouseEnter={() => onHoverChange(id)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(id)}
      onBlur={() => onHoverChange(null)}
    >
      <span
        className="font-mono-label flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors duration-300"
        style={{
          color: isLit || isHovered ? accent : 'var(--text-secondary)',
          backgroundColor: isLit || isHovered ? `${accent}22` : 'transparent',
          border: `1px solid ${isLit || isHovered ? `${accent}66` : 'var(--glass-border)'}`,
        }}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <span className="whitespace-nowrap text-xs font-medium text-[color:var(--text-primary)] sm:text-sm">
        {label}
      </span>
    </motion.button>
  );
});
