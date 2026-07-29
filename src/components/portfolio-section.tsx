'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Globe } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PORTFOLIO_PROJECTS } from '@/lib/projects-data';

export function PortfolioSection() {
  const t = useTranslations('Portfolio');
  const reduceMotion = useReducedMotion();

  return (
    <section id="work" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <span className="font-mono-label text-xs text-[color:var(--text-muted)]">
            {t('eyebrow')}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[color:var(--text-secondary)]">
            {t('subtitle')}
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PORTFOLIO_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                delay: reduceMotion ? 0 : i * 0.08,
              }}
              className="group glass-panel glass-panel-interactive flex flex-col overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-slate-900/60 p-0 shadow-xl transition-all duration-300 hover:border-primary/50"
            >
              {/* 🖥️ Mac Browser Header */}
              <div className="flex items-center justify-between border-b border-[color:var(--glass-border)] bg-slate-950/80 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                {/* Simulated URL Display */}
                <div className="flex items-center gap-1.5 rounded-md bg-slate-900/90 px-3 py-1 text-[11px] font-mono text-[color:var(--text-muted)] border border-white/5 truncate max-w-[180px]">
                  <Globe size={11} className="shrink-0 text-primary" />
                  <span className="truncate">{project.liveUrl.replace('https://', '')}</span>
                </div>
                <div className="w-10" /> {/* Spacer for balance */}
              </div>

              {/* 🖼️ Mac Browser Content / Smooth Hover-Scroll Image */}
              <div className="relative h-[260px] w-full overflow-hidden bg-slate-950/40">
                <Image
                  src={project.image || '/portfolio/placeholder.jpg'}
                  alt={project.name}
                  fill
                  unoptimized
                  className="object-cover object-top transition-all duration-[4000ms] ease-in-out group-hover:object-bottom"
                />
                {/* Overlay Subtle Gradient for Readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
              </div>

              {/* Card Details Body */}
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono-label text-[10px] text-[color:var(--text-muted)] uppercase tracking-wider">
                  {t(`categories.${project.categoryKey}`)}
                </span>

                <h3 className="font-display mt-2 text-lg font-semibold text-[color:var(--text-primary)] group-hover:text-primary transition-colors">
                  {project.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)] line-clamp-3">
                  {t(`projects.${project.id}.description`)}
                </p>

                {/* Tech Stack Badges */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono-label rounded-full border border-[color:var(--glass-border)] bg-slate-900/50 px-2.5 py-1 text-[10px] text-[color:var(--text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div className="mt-auto pt-6">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    {t('viewLive')}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template Hub Redirect Link */}
        <div className="mt-12 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-slate-900/40 px-5 py-2.5 text-sm text-[color:var(--text-secondary)] transition-all hover:border-primary/40 hover:bg-slate-800/60 hover:text-[color:var(--text-primary)]"
          >
            <span>{t('templateHubLink')}</span>
            <ArrowUpRight size={14} className="text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}