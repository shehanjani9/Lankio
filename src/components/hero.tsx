'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { DigitalCreationEngine, DigitalCreationEngineStatic, MODULE_IDS } from './DigitalCreationEngine';
import type { BrowserCopy, EngineModule, ModuleId } from './DigitalCreationEngine';

export function Hero() {
  const t = useTranslations('Hero');
  const reduceMotion = useReducedMotion();

  // allowMotion drives WHICH engine variant renders. It must be null during
  // SSR and resolved during hydration -- this is the same guard the old
  // HeroCube used (there as `allowCube`) to avoid a flash where one variant
  // briefly appears before being replaced. Since the new engine has no
  // heavy async chunk to code-split (it's SVG/CSS/Framer Motion, all of
  // which the rest of this page already loads), there's no loading skeleton
  // step any more: the static variant IS the deterministic first paint.
  const [allowMotion, setAllowMotion] = useState<boolean | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<ModuleId | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAllowMotion(!query.matches);
    const onChange = (e: MediaQueryListEvent) => setAllowMotion(!e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // modules map is memoized -- it only changes when the locale changes.
  const modules = useMemo<Record<ModuleId, EngineModule>>(() => {
    return MODULE_IDS.reduce(
      (acc, id) => {
        acc[id] = {
          label: t(`engine.modules.${id}.label`),
          glyph: t(`engine.modules.${id}.glyph`),
        };
        return acc;
      },
      {} as Record<ModuleId, EngineModule>
    );
  }, [t]);

  const browserCopy = useMemo<BrowserCopy>(
    () => ({
      urlPlaceholder: t('engine.browser.urlPlaceholder'),
      domain: t('engine.browser.domain'),
      liveLabel: t('engine.browser.liveLabel'),
      badges: {
        performance: t('engine.browser.badges.performance'),
        accessibility: t('engine.browser.badges.accessibility'),
        speed: t('engine.browser.badges.speed'),
      },
      graphs: {
        traffic: t('engine.browser.graphs.traffic'),
        leads: t('engine.browser.graphs.leads'),
        growth: t('engine.browser.graphs.growth'),
      },
    }),
    [t]
  );

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
            <AnimatePresence mode="wait">
              <motion.span
                key={activeModuleId ?? 'default'}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="font-mono-label inline-block rounded-full border border-[color:var(--glass-border)] px-4 py-1.5 text-xs text-[color:var(--text-secondary)]"
              >
                {activeModuleId
                  ? t('activeServiceBadge', { service: modules[activeModuleId].label })
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
          style={{ minHeight: 320 }}
        >
          {allowMotion ? (
            <DigitalCreationEngine
              modules={modules}
              browserCopy={browserCopy}
              ariaLabel={t('engine.ariaLabel')}
              onActiveModuleChange={setActiveModuleId}
            />
          ) : (
            <DigitalCreationEngineStatic modules={modules} browserCopy={browserCopy} ariaLabel={t('engine.ariaLabel')} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
