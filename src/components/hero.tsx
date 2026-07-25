'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { HeroCubeLoader } from './hero-cube-loader';
import { HeroCubeStatic } from './hero-cube-static';
import { SERVICE_FACE_ORDER, type CubeService, type ServiceId } from './hero-cube';

// ssr:false + this only being referenced inside JSX that's conditionally
// rendered (see `allowCube` below) means the three.js/@react-three bundle is
// only ever fetched for visitors who actually get to see it move.
const HeroCube = dynamic(() => import('./hero-cube').then((mod) => mod.HeroCube), {
  ssr: false,
  loading: () => <HeroCubeLoader />,
});

export function Hero() {
  const t = useTranslations('Hero');
  const reduceMotion = useReducedMotion();

  // Explicit state (rather than only gating animation via reduceMotion)
  // because the decision of WHICH component to import has to happen before
  // render -- disabling animation on an already-loaded 3D component doesn't
  // avoid downloading it in the first place.
  const [allowCube, setAllowCube] = useState<boolean | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<ServiceId | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAllowCube(!query.matches);

    const handleChange = (e: MediaQueryListEvent) => setAllowCube(!e.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  // Translated label/glyph for each of the 6 core services. Built once per
  // locale change; the cube only ever needs to know ids, not translation keys.
  const services = useMemo<Record<ServiceId, CubeService>>(() => {
    return SERVICE_FACE_ORDER.reduce((acc, id) => {
      acc[id] = {
        label: t(`services.${id}.label`),
        glyph: t(`services.${id}.glyph`),
      };
      return acc;
    }, {} as Record<ServiceId, CubeService>);
  }, [t]);

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
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div variants={item} className="mb-6 h-8">
            {/* Crossfades between the default brand badge and whichever
                service the visitor is currently hovering/clicking on the
                cube, so the cube and the copy read as one interaction. */}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeServiceId ?? 'default'}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="font-mono-label inline-block rounded-full border border-[color:var(--glass-border)] px-4 py-1.5 text-xs text-[color:var(--text-secondary)]"
              >
                {activeServiceId
                  ? t('activeServiceBadge', { service: services[activeServiceId].label })
                  : t('badge')}
              </motion.span>
            </AnimatePresence>
          </motion.div>

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

        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.2 }}
          className="mx-auto h-[320px] w-full max-w-md sm:h-[380px] lg:h-[440px]"
        >
          {allowCube === null ? (
            <HeroCubeLoader />
          ) : allowCube ? (
            <HeroCube services={services} onActiveServiceChange={setActiveServiceId} />
          ) : (
            <HeroCubeStatic services={services} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
