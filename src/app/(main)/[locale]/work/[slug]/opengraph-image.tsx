import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Locale } from '@/i18n/routing';
import { getProjectBySlug } from '@/content/projects';
import { OG_SIZE, renderOgImage } from '@/components/seo/og-template';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Lankio project';

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug);

  if (!project) {
    return renderOgImage({ eyebrow: 'Lankio', title: 'Lankio Digital Solutions', footer: 'lankio.it' });
  }

  const cover = await readFile(join(process.cwd(), 'public', project.cover.src));
  const mime = project.cover.src.endsWith('.png') ? 'image/png' : 'image/jpeg';

  return renderOgImage({
    eyebrow: project.discipline[locale],
    title: project.title,
    footer: 'lankio.it — Shehan Janith Hettiarachchi',
    image: `data:${mime};base64,${cover.toString('base64')}`,
    tint: project.tint,
  });
}
