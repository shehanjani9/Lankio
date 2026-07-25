'use client';

import { useMemo, useState } from 'react';
import type { PointerEventHandler } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BrowserStage } from './BrowserStage';
import { ConnectionField } from './ConnectionField';
import { ModuleNode } from './ModuleNode';
import {
  BREATHE_CYCLE_S,
  getModuleAnchor,
  MODULE_DEFS,
  PARALLAX_SMOOTHING,
  PARALLAX_STRENGTH_DEG,
  STAGE_MODULE_MAP,
  STAGE_SEQUENCE,
} from './constants';
import { useEngineSequence, useInView } from './useEngineSequence';
import type { DigitalCreationEngineProps, ModuleId } from './types';

const GROUP_COUNTS = MODULE_DEFS.reduce<Record<string, number>>((acc, m) => {
  acc[m.group] = (acc[m.group] ?? 0) + 1;
  return acc;
}, {});

// Ambient particles: fixed, deterministic positions so there is no hydration mismatch
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  delay: (i % 5) * 0.6,
}));

export function DigitalCreationEngine({ modules, browserCopy, ariaLabel, onActiveModuleChange }: DigitalCreationEngineProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { stage } = useEngineSequence(inView);
  const [hoveredModule, setHoveredModule] = useState<ModuleId | null>(null);

  const litModules = useMemo(() => {
    const currentIndex = STAGE_SEQUENCE.indexOf(stage);
    const lit = new Set<ModuleId>();
    if (currentIndex < 0) return lit;
    for (let i = 0; i <= currentIndex; i++) {
      const forStage = STAGE_MODULE_MAP[STAGE_SEQUENCE[i]];
      forStage?.forEach((id) => lit.add(id));
    }
    return lit;
  }, [stage]);

  const handleHoverChange = (id: ModuleId | null) => {
    setHoveredModule(id);
    if (id) onActiveModuleChange?.(id);
  };

  // Subtle pointer parallax -- desktop/fine-pointer only
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 1 / PARALLAX_SMOOTHING });
  const springY = useSpring(rawY, { stiffness: 60, damping: 1 / PARALLAX_SMOOTHING });
  const rotateX = useTransform(springY, [-0.5, 0.5], [PARALLAX_STRENGTH_DEG, -PARALLAX_STRENGTH_DEG]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-PARALLAX_STRENGTH_DEG, PARALLAX_STRENGTH_DEG]);

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const groupIndex: Record<string, number> = {};

  return (
    <div ref={ref} className="relative h-full w-full flex items-center justify-center p-2 sm:p-4" role="group" aria-label={ariaLabel}>
      {/* Screen-reader summary of the process */}
      <p className="sr-only">{ariaLabel}</p>

      {/* Universal 2D Diagram for Mobile, Tablet & Desktop */}
      <motion.div
        className="relative h-full w-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] max-w-5xl mx-auto scale-[0.62] xs:scale-[0.72] sm:scale-85 md:scale-95 lg:scale-100 transition-transform origin-center"
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        animate={{ scale: [1, 1.008, 1] }}
        transition={{ duration: BREATHE_CYCLE_S, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[color:var(--text-secondary)]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0.25 }}
              animate={{ opacity: [0.1, 0.35, 0.1] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <ConnectionField litModules={litModules} hoveredModule={hoveredModule} reduceMotion={false} />
        <BrowserStage stage={stage} hoveredModule={hoveredModule} reduceMotion={false} copy={browserCopy} />

        {MODULE_DEFS.map((def) => {
          const i = groupIndex[def.group] ?? 0;
          groupIndex[def.group] = i + 1;
          const anchor = getModuleAnchor(def.group, i, GROUP_COUNTS[def.group]);
          return (
            <ModuleNode
              key={def.id}
              id={def.id}
              label={modules[def.id].label}
              glyph={modules[def.id].glyph}
              accent={def.accent}
              anchor={anchor}
              isLit={litModules.has(def.id)}
              isHovered={hoveredModule === def.id}
              reduceMotion={false}
              onHoverChange={handleHoverChange}
            />
          );
        })}
      </motion.div>
    </div>
  );
}