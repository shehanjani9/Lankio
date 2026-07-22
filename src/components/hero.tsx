'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  const t = useTranslations('Hero');
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="bg-ambient-glow relative flex min-h-screen items-center justify-center px-6 pt-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          variants={item}
          className="font-mono-label mb-6 inline-block rounded-full border border-[color:var(--glass-border)] px-4 py-1.5 text-xs text-[color:var(--text-secondary)]"
        >
          {t('eyebrow')}
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[color:var(--text-primary)] sm:text-5xl md:text-6xl"
        >
          {t('headline')}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base text-[color:var(--text-secondary)] sm:text-lg"
        >
          {t('subheadline')}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#audit"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
          >
            {t('primaryCta')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#work"
            className="glass-panel glass-panel-interactive inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[color:var(--text-primary)]"
          >
            <Play size={14} />
            {t('secondaryCta')}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
