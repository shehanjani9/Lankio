'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Users, Code2 } from 'lucide-react';

const FACT_KEYS = ['location', 'directCollaboration', 'cleanCode'] as const;
type FactKey = (typeof FACT_KEYS)[number];

const FACT_ICONS: Record<FactKey, typeof MapPin> = {
  location: MapPin,
  directCollaboration: Users,
  cleanCode: Code2,
};

type FounderInfo = {
  name: string;
  role: string;
  photoSrc: string;
  intro: string;
};

export function AboutSection({ founder }: { founder?: FounderInfo }) {
  const t = useTranslations('About');
  const reduceMotion = useReducedMotion();

  // Real identity, populated by default. Still overridable via the `founder`
  // prop (e.g. for future A/B copy) without touching layout.
  const resolvedFounder: FounderInfo = founder ?? {
    name: 'Shehan Janith Hettiarachchi',
    role: t('founder.role'),
    photoSrc: '/images/shehan.jpg',
    intro: t('founder.intro'),
  };

  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
            {t('eyebrow')}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[color:var(--text-secondary)]">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="glass-panel p-7 sm:p-8"
          >
            <div className="mb-7 flex items-center gap-4 border-b border-[color:var(--glass-border)] pb-7">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[color:var(--glass-border)] shadow-inner">
                <Image
                  src={resolvedFounder.photoSrc}
                  alt={resolvedFounder.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-[color:var(--text-primary)]">
                  {resolvedFounder.name}
                </div>
                <div className="text-xs text-[color:var(--text-muted)]">{resolvedFounder.role}</div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {resolvedFounder.intro}
            </p>

            <h3 className="font-display mt-7 text-lg font-semibold text-[color:var(--text-primary)]">
              {t('missionTitle')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {t('missionBody')}
            </p>

            <h3 className="font-display mt-7 text-lg font-semibold text-[color:var(--text-primary)]">
              {t('approachTitle')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {t('approachBody')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
            className="glass-panel flex flex-col gap-5 p-7 sm:p-8"
          >
            {FACT_KEYS.map((key) => {
              const Icon = FACT_ICONS[key];
              return (
                <div key={key}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-primary-soft)]">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[color:var(--text-primary)]">
                        {t(`facts.${key}.label`)}
                      </div>
                      <div className="mt-0.5 text-sm text-[color:var(--text-secondary)]">
                        {t(`facts.${key}.value`)}
                      </div>
                    </div>
                  </div>

                  {key === 'location' && (
                    <p className="mt-2 pl-12 text-xs text-[color:var(--text-muted)]">
                      {t('trustNote')}
                    </p>
                  )}
                </div>
              );
            })}

            <a
              href="#contact"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              {t('cta')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
