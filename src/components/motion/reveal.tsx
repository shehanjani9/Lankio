'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

// Reduced motion is handled globally by <MotionConfig reducedMotion="user">
// (see motion-provider.tsx): transforms become instant and only the opacity
// fade remains. Branching on the preference here would make the server and
// client render differently and break hydration.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type RevealProps = Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'> & {
  delay?: number;
  /** Vertical offset in px before reveal. */
  y?: number;
  as?: 'div' | 'li' | 'section' | 'article' | 'figure' | 'header';
};

/** Fades and lifts content into view once, using transform/opacity only. */
export function Reveal({ delay = 0, y = 24, as = 'div', children, ...rest }: RevealProps) {
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

type MaskedLineProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * One line of display text that slides up from behind a mask: the classic
 * editorial reveal, built from a single transform per line.
 */
export function MaskedLine({ children, delay = 0, className, immediate = false }: MaskedLineProps) {
  // The visible wrapper is what gets observed: the inner line starts fully
  // clipped by the mask, so observing it directly would never intersect.
  const trigger = immediate
    ? { animate: 'shown' }
    : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -8% 0px' } };

  return (
    // The padding/negative margin pair keeps descenders from being clipped.
    <motion.span
      className={`block overflow-hidden pb-[0.14em] -mb-[0.14em] ${className ?? ''}`}
      initial="hidden"
      {...trigger}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: '115%' }, shown: { y: '0%' } }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
