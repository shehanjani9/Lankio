'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { HeroPortrait, ParticleField } from './hero-portrait';
import { TechMarquee } from './tech-marquee';

export function Hero() {
  const t = useTranslations('Hero');
  const reduceMotion = useReducedMotion();

  const container: Variants = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
    }),
    [reduceMotion]
  );

  const item: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
      show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' } },
    }),
    [reduceMotion]
  );

  return (
    <div className="relative flex flex-col w-full">
      {/* Main Hero Section */}
      <section className="bg-ambient-glow relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-12">
        {/* Full-Bleed Animated Background Canvas */}
        <ParticleField />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.span
              variants={item}
              className="font-mono-label mb-6 inline-block rounded-full border border-[color:var(--glass-border)] px-4 py-1.5 text-xs text-[color:var(--text-secondary)]"
            >
              {t('badge')}
            </motion.span>

            <motion.h1
              variants={item}
              className="font-display max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-[color:var(--text-primary)] sm:text-5xl md:text-6xl"
            >
              {t('headline')}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base text-[color:var(--text-secondary)] sm:text-lg"
            >
              {t('tagline')}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
            >
              <Link
                href="/audit"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
              >
                {t('primaryCta')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#work"
                className="glass-panel glass-panel-interactive inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[color:var(--text-primary)]"
              >
                <Play size={14} />
                {t('secondaryCta')}
              </a>
            </motion.div>

            <motion.span
              variants={item}
              className="font-mono-label mt-4 inline-flex items-center rounded-full border border-[color:var(--glass-border)] px-4 py-1.5 text-[11px] text-[color:var(--text-secondary)]"
            >
              {t('microTrust')}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.15 }}
            className="w-full"
          >
            <HeroPortrait alt={t('portraitAlt')} />
          </motion.div>
        </div>
      </section>

      {/* Modern Tech Stack Logos Strip Below Hero */}
      <TechMarquee />
    </div>
  );
}