'use client';

import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PALETTE } from './constants';
import type { BrowserCopy, EngineStage, ModuleId } from './types';

interface BrowserStageProps {
  stage: EngineStage;
  hoveredModule: ModuleId | null;
  reduceMotion: boolean;
  copy: BrowserCopy;
}

// Ordering mirrors STAGE_SEQUENCE in constants.ts -- used only to derive
// "has this beat happened yet" booleans below.
const ORDER: EngineStage[] = ['idle', 'idea', 'wireframe', 'design', 'development', 'optimization', 'launch', 'growth'];
function atLeast(stage: EngineStage, target: EngineStage): boolean {
  return ORDER.indexOf(stage) >= ORDER.indexOf(target);
}

function Sparkline({ seed, color, grow }: { seed: number; color: string; grow: boolean }) {
  // Deterministic pseudo-random walk so the graph looks alive without a
  // client-only Math.random() causing hydration mismatch.
  const points = Array.from({ length: 8 }, (_, i) => {
    const n = Math.sin(seed * 12.9898 + i * 3.7) * 43758.5453;
    const frac = n - Math.floor(n);
    return 18 - frac * 14 - i * 0.6;
  });
  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 60} ${y}`).join(' ');

  return (
    <motion.svg
      viewBox="0 0 60 20"
      className="h-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: grow ? 1.12 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export const BrowserStage = memo(function BrowserStage({ stage, hoveredModule, reduceMotion, copy }: BrowserStageProps) {
  const showWireframe = atLeast(stage, 'wireframe') && !atLeast(stage, 'design');
  const showDesigned = atLeast(stage, 'design');
  const isDev = atLeast(stage, 'development');
  const isOptimized = atLeast(stage, 'optimization');
  const isLive = atLeast(stage, 'launch');
  const isGrowing = atLeast(stage, 'growth');

  const brandPulse = hoveredModule === 'brand';
  const seoGlow = hoveredModule === 'seo' || hoveredModule === 'performance';
  const devGlow = hoveredModule === 'development';
  const marketingGrow = hoveredModule === 'marketing';

  return (
    <div
      className="glass-panel absolute flex flex-col overflow-hidden rounded-2xl"
      style={{ left: '28%', top: '20%', width: '44%', height: '42%' }}
      role="img"
      aria-hidden="true"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-[color:var(--glass-border)] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[color:var(--glass-border)]" />
        <span className="h-2 w-2 rounded-full bg-[color:var(--glass-border)]" />
        <span className="h-2 w-2 rounded-full bg-[color:var(--glass-border)]" />
        <div className="ml-2 flex flex-1 items-center justify-between rounded-full border border-[color:var(--glass-border)] px-2 py-0.5">
          <span className="font-mono-label truncate text-[9px] text-[color:var(--text-secondary)] sm:text-[10px]">
            {isLive ? copy.domain : copy.urlPlaceholder}
          </span>
          <AnimatePresence>
            {isLive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-mono-label flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px]"
                style={{ color: PALETTE.neonTeal, backgroundColor: `${PALETTE.neonTeal}1a` }}
              >
                <motion.span
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: PALETTE.neonTeal }}
                  animate={reduceMotion ? undefined : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                {copy.liveLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {(isDev || devGlow) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: devGlow ? 1 : 0.6 }}
              exit={{ opacity: 0 }}
              className="font-mono-label text-[10px]"
              style={{ color: PALETTE.electricIndigo }}
            >
              {'</>'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Content area */}
      <div className="relative flex flex-1 flex-col gap-1.5 p-3">
        <AnimatePresence mode="wait">
          {showWireframe && (
            <motion.div
              key="wireframe"
              className="flex flex-1 flex-col gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="h-2 w-1/3 rounded-full bg-[color:var(--glass-border)]" />
              <div className="h-6 w-full rounded-md bg-[color:var(--glass-border)] opacity-60" />
              <div className="flex flex-1 gap-1.5">
                <div className="flex-1 rounded-md bg-[color:var(--glass-border)] opacity-40" />
                <div className="flex-1 rounded-md bg-[color:var(--glass-border)] opacity-40" />
                <div className="flex-1 rounded-md bg-[color:var(--glass-border)] opacity-40" />
              </div>
              <div className="h-2 w-1/2 self-center rounded-full bg-[color:var(--glass-border)] opacity-50" />
            </motion.div>
          )}

          {showDesigned && (
            <motion.div
              key="designed"
              className="flex flex-1 flex-col gap-1.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                filter: brandPulse ? `hue-rotate(35deg)` : 'hue-rotate(0deg)',
              }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
            >
              <motion.div
                className="h-2 w-1/3 rounded-full"
                style={{ backgroundColor: PALETTE.brightViolet }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              />
              <motion.div
                className="h-6 w-full rounded-md"
                style={{ backgroundColor: `${PALETTE.electricIndigo}33` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              />
              <div className="flex flex-1 gap-1.5">
                {[PALETTE.deepCyan, PALETTE.neonTeal, PALETTE.softRoseCoral].map((c, i) => (
                  <motion.div
                    key={c}
                    className="flex-1 rounded-md"
                    style={{ backgroundColor: `${c}26`, border: `1px solid ${c}55` }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 + i * 0.08 }}
                  />
                ))}
              </div>
              <motion.div
                className="h-2 w-1/4 self-center rounded-full"
                style={{ backgroundColor: PALETTE.brightViolet }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.55 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optimization badges */}
        <AnimatePresence>
          {isOptimized && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-1"
            >
              {[copy.badges.performance, copy.badges.accessibility, copy.badges.speed].map((label) => (
                <motion.span
                  key={label}
                  className="font-mono-label rounded-full border px-1.5 py-0.5 text-[8px]"
                  style={{
                    borderColor: seoGlow ? `${PALETTE.neonTeal}88` : 'var(--glass-border)',
                    color: seoGlow ? PALETTE.neonTeal : 'var(--text-secondary)',
                  }}
                  animate={{ scale: seoGlow ? 1.05 : 1 }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Growth graphs */}
        <AnimatePresence>
          {isGrowing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-1.5 border-t border-[color:var(--glass-border)] pt-1.5"
            >
              <div>
                <Sparkline seed={1} color={PALETTE.deepCyan} grow={marketingGrow} />
                <span className="font-mono-label text-[7px] text-[color:var(--text-secondary)]">{copy.graphs.traffic}</span>
              </div>
              <div>
                <Sparkline seed={2} color={PALETTE.electricIndigo} grow={marketingGrow} />
                <span className="font-mono-label text-[7px] text-[color:var(--text-secondary)]">{copy.graphs.leads}</span>
              </div>
              <div>
                <Sparkline seed={3} color={PALETTE.neonTeal} grow={marketingGrow} />
                <span className="font-mono-label text-[7px] text-[color:var(--text-secondary)]">{copy.graphs.growth}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
