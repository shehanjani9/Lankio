'use client';

import { MotionConfig } from 'framer-motion';

/**
 * "user" makes every motion component honour prefers-reduced-motion:
 * transform and layout animations complete instantly, opacity still fades.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
