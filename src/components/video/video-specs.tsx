import { useTranslations } from 'next-intl';
import type { VideoAsset } from '@/content/projects/types';

/** Technical sheet shown beside a film (duration, resolution, fps, tool). */
export function VideoSpecs({ specs }: { specs: NonNullable<VideoAsset['specs']> }) {
  const t = useTranslations('Video');

  const rows: [string, string][] = [];
  if (specs.durationSeconds) rows.push([t('duration'), t('seconds', { value: specs.durationSeconds })]);
  if (specs.width && specs.height) rows.push([t('resolution'), `${specs.width} × ${specs.height}`]);
  if (specs.fps) rows.push([t('frameRate'), t('fps', { value: specs.fps })]);
  if (specs.frames) rows.push([t('frames'), String(specs.frames)]);
  if (specs.tool) rows.push([t('madeWith'), specs.tool]);

  return (
    <dl className="mt-8 divide-y divide-line border-y border-line">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-6 py-3 text-sm">
          <dt className="text-fg-subtle">{label}</dt>
          <dd className="tabular-nums text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
