'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import type { ProjectCategory } from '@/content/projects/types';
import type { ProjectCardData } from '@/content/projects/view';
import { cn } from '@/lib/utils';
import { ProjectCard } from './project-card';

type Filter = 'all' | ProjectCategory;

/**
 * Filterable gallery. Filters are toggle buttons (aria-pressed) and the
 * active filter is mirrored to ?category= so a filtered view can be shared.
 * Only categories with published work are offered.
 */
export function WorkGallery({
  projects,
  categories,
}: {
  projects: ProjectCardData[];
  categories: ProjectCategory[];
}) {
  const t = useTranslations('Work');
  const tc = useTranslations('Categories');
  const [filter, setFilter] = useState<Filter>('all');

  // Restore a shared ?category= link after hydration.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('category');
    if (requested && (categories as string[]).includes(requested)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL, which is unavailable during static render
      setFilter(requested as ProjectCategory);
    }
  }, [categories]);

  function select(next: Filter) {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', next);
    window.history.replaceState(window.history.state, '', url);
  }

  const visible = filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter));
  const filters: Filter[] = ['all', ...categories];

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <LayoutGroup id="work-filters">
          <div role="group" aria-label={t('filterLabel')} className="-mx-1 flex flex-wrap gap-1">
            {filters.map((key) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(key)}
                  className={cn(
                    'relative isolate min-h-11 rounded-full px-4 text-sm transition-colors duration-300',
                    active ? 'text-canvas' : 'text-fg-muted hover:text-fg'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter-active"
                      className="absolute inset-0 -z-10 rounded-full bg-fg"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{tc(key)}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <p aria-live="polite" className="text-sm tabular-nums text-fg-subtle">
          {t('showing', { count: visible.length })}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-fg-muted">{t('empty')}</p>
      ) : (
        <motion.ul layout className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard
                  project={project}
                  index={projects.indexOf(project)}
                  priority={index < 2}
                  sizes="(min-width: 768px) 46vw, 100vw"
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
