'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { INITIAL_DELAY_MS, STAGE_DURATIONS_MS, STAGE_GAP_MS, STAGE_SEQUENCE } from './constants';
import type { EngineStage } from './types';

// ---------------------------------------------------------------------------
// useInView -- fires once, the first time the element crosses the given
// threshold, then disconnects. This is intentionally a one-shot: the brief
// asks for a page-load narrative ("page loads... stage 1... stage 2...")
// and explicitly rules out scroll hijacking or pinning, so re-triggering on
// every scroll in/out would fight that instruction rather than serve it.
// ---------------------------------------------------------------------------
export function useInView<T extends HTMLElement>(threshold = 0.35): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Extremely old browsers: just play immediately rather than never.
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export interface EngineSequenceState {
  /** 'idle' before playback starts, then each beat in STAGE_SEQUENCE, in order. */
  stage: EngineStage;
  /** True once the final stage has been reached and is holding. */
  isSettled: boolean;
}

// ---------------------------------------------------------------------------
// useEngineSequence -- advances through STAGE_SEQUENCE once, driven by
// setTimeout rather than requestAnimationFrame: durations are coarse
// (hundreds of ms) narrative beats, not per-frame animation, so timers are
// the right tool and avoid keeping a rAF loop alive for a state machine that
// only changes ~7 times total.
// ---------------------------------------------------------------------------
export function useEngineSequence(play: boolean): EngineSequenceState {
  const [stageIndex, setStageIndex] = useState(-1);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timerIds.current.forEach(clearTimeout);
    timerIds.current = [];

    if (!play) return;

    let elapsed = INITIAL_DELAY_MS;
    STAGE_SEQUENCE.forEach((stage, index) => {
      const id = setTimeout(() => setStageIndex(index), elapsed);
      timerIds.current.push(id);
      elapsed += STAGE_DURATIONS_MS[stage] + STAGE_GAP_MS;
    });

    return () => {
      timerIds.current.forEach(clearTimeout);
      timerIds.current = [];
    };
  }, [play]);

  const stage: EngineStage = stageIndex >= 0 ? STAGE_SEQUENCE[stageIndex] : 'idle';
  const isSettled = stageIndex === STAGE_SEQUENCE.length - 1;

  return { stage, isSettled };
}
