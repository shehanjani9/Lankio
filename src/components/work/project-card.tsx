'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ProjectCardData } from '@/content/projects/view';
import { EASE_OUT_EXPO } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

/**
 * Editorial project card: a tinted panel with the screenshot inset and
 * cropped at the bottom, revealed with a clip-path wipe and scaled gently
 * on hover. The whole card is one link with a descriptive accessible name.
 */
export function ProjectCard({
  project,
  index,
  sizes,
  priority = false,
  className,
}: {
  project: ProjectCardData;
  index: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const tint = project.tint ?? '#2c2470';

  return (
    <article className={cn('group relative', className)}>
      <Link
        href={`/work/${project.slug}`}
        className="block rounded-[1.75rem] focus-visible:outline-offset-4"
        aria-label={`${project.title} — ${project.discipline}`}
      >
        <motion.div
          initial={{ clipPath: 'inset(10% 6% 0% 6% round 1.75rem)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 1.75rem)', opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line bg-surface"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${tint} 0%, transparent 70%), linear-gradient(180deg, ${tint}55, transparent)`,
            }}
          />
          <div aria-hidden="true" className="bg-grain absolute inset-0" />

          <div className="absolute inset-x-[7%] bottom-0 top-[9%] overflow-hidden rounded-t-xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/10 transition-transform duration-[1.1s] ease-out-expo group-hover:-translate-y-2 group-hover:scale-[1.015]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover object-top"
            />
          </div>

          {project.hasVideo && (
            <span className="absolute left-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-canvas/70 backdrop-blur-md">
              <Play size={14} className="translate-x-px" aria-hidden="true" />
            </span>
          )}

          <span
            aria-hidden="true"
            className="absolute right-4 top-4 inline-flex size-11 scale-75 items-center justify-center rounded-full bg-fg text-canvas opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100"
          >
            <ArrowUpRight size={18} strokeWidth={1.75} />
          </span>
        </motion.div>

        <div className="mt-6 flex items-start gap-5">
          <span className="pt-1 text-sm tabular-nums text-fg-subtle">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <h3 className="text-title text-fg transition-colors duration-300">{project.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{project.discipline}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
