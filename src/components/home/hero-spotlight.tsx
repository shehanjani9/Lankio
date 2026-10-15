'use client';

import { useEffect, useRef } from 'react';

/**
 * A soft light that follows the pointer across the hero. It writes two CSS
 * variables once per animation frame (no React re-renders) and is only
 * attached for fine pointers that can hover, without reduced motion.
 */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const section = node?.parentElement;
    if (!node || !section) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const apply = () => {
      frame = 0;
      node.style.setProperty('--x', `${targetX}px`);
      node.style.setProperty('--y', `${targetY}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      node.style.opacity = '1';
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      node.style.opacity = '0';
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
      style={{
        background:
          'radial-gradient(520px circle at var(--x, 50%) var(--y, 40%), rgb(139 125 255 / 0.10), transparent 65%)',
      }}
    />
  );
}
