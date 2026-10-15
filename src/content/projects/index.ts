import { routing } from '@/i18n/routing';
import { draftProjects } from './drafts';
import { lankioAnalyzer } from './lankio-analyzer';
import { lankioDigitalSolutions } from './lankio-digital-solutions';
import { lankioLearn } from './lankio-learn';
import {
  PROJECT_CATEGORIES,
  type ImageAsset,
  type Project,
  type ProjectCategory,
  type PublishedProject,
} from './types';
import { wildscapeSriLanka } from './wildscape-sri-lanka';

export * from './types';

/** Every project, published or not. Add new project files here. */
const ALL_PROJECTS: Project[] = [
  wildscapeSriLanka,
  lankioLearn,
  lankioAnalyzer,
  lankioDigitalSolutions,
  ...draftProjects,
];

const VALID_RATIOS = new Set(['16:9', '9:16', '1:1', '4:5']);

/**
 * Structural checks that run whenever the registry is loaded (build, dev,
 * tests). A published project with missing essentials fails loudly instead
 * of shipping a half-finished page.
 */
function validate(projects: Project[]): void {
  const errors: string[] = [];
  const slugs = new Set<string>();

  const checkImage = (slug: string, label: string, image: ImageAsset) => {
    if (!image.src.startsWith('/')) errors.push(`${slug}: ${label} src must be an absolute /public path`);
    if (!(image.width > 0 && image.height > 0)) errors.push(`${slug}: ${label} needs width and height`);
    for (const locale of routing.locales) {
      if (!image.alt[locale]?.trim()) errors.push(`${slug}: ${label} is missing ${locale} alt text`);
    }
  };

  for (const project of projects) {
    const { slug } = project;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${slug}: slug must be kebab-case`);
    if (slugs.has(slug)) errors.push(`${slug}: duplicate slug`);
    slugs.add(slug);

    for (const category of project.categories) {
      if (!PROJECT_CATEGORIES.includes(category)) errors.push(`${slug}: unknown category "${category}"`);
    }

    if (project.status !== 'published') continue;

    if (!project.cover) errors.push(`${slug}: published projects need a cover image`);
    else checkImage(slug, 'cover', project.cover);
    project.gallery?.forEach((image, i) => checkImage(slug, `gallery[${i}]`, image));

    for (const locale of routing.locales) {
      if (!project.summary[locale]?.trim()) errors.push(`${slug}: missing ${locale} summary`);
      if (!project.description[locale]?.length) errors.push(`${slug}: missing ${locale} description`);
    }

    project.videos?.forEach((video, i) => {
      if (!VALID_RATIOS.has(video.aspectRatio)) errors.push(`${slug}: videos[${i}] has an invalid aspect ratio`);
      if (!video.poster) errors.push(`${slug}: videos[${i}] needs a poster image`);
    });
  }

  if (errors.length > 0) {
    throw new Error(`Invalid project content:\n  - ${errors.join('\n  - ')}`);
  }
}

validate(ALL_PROJECTS);

function isPublished(project: Project): project is PublishedProject {
  return project.status === 'published' && Boolean(project.cover);
}

/** Published projects in display order. */
export function getPublishedProjects(): PublishedProject[] {
  return ALL_PROJECTS.filter(isPublished).sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): PublishedProject[] {
  return getPublishedProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): PublishedProject | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

/** The next published project, wrapping around -- used for "Next project". */
export function getNextProject(slug: string): PublishedProject | undefined {
  const projects = getPublishedProjects();
  if (projects.length < 2) return undefined;
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

/** Categories that currently have at least one published project. */
export function getActiveCategories(): ProjectCategory[] {
  const used = new Set(getPublishedProjects().flatMap((project) => project.categories));
  return PROJECT_CATEGORIES.filter((category) => used.has(category));
}
