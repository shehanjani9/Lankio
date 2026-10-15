import type { Locale } from '@/i18n/routing';
import type { ProjectCategory, PublishedProject } from './types';

/** Serializable, locale-resolved shape passed to client components. */
export type ProjectCardData = {
  slug: string;
  title: string;
  discipline: string;
  summary: string;
  categories: ProjectCategory[];
  tint?: string;
  hasVideo: boolean;
  cover: { src: string; width: number; height: number; alt: string };
};

export function toCardData(project: PublishedProject, locale: Locale): ProjectCardData {
  return {
    slug: project.slug,
    title: project.title,
    discipline: project.discipline[locale],
    summary: project.summary[locale],
    categories: project.categories,
    tint: project.tint,
    hasVideo: Boolean(project.videos?.length),
    cover: {
      src: project.cover.src,
      width: project.cover.width,
      height: project.cover.height,
      alt: project.cover.alt[locale],
    },
  };
}
