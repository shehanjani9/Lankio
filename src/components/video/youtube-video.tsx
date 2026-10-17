'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { displayTitle, embedUrl, thumbnail, watchUrl, type YouTubeVideo } from '@/content/videos';
import { cn } from '@/lib/utils';

/**
 * Click-to-load YouTube video. The card shows a self-hosted thumbnail, so
 * nothing is requested from YouTube until the visitor presses play. Playback
 * opens in a native modal <dialog> (focus trapped, Esc closes) with a
 * youtube-nocookie.com player that is removed again when the dialog closes.
 */
export function YouTubeVideoCard({
  video,
  sizes,
  priority = false,
  className,
  headingLevel: Heading = 'h3',
}: {
  video: YouTubeVideo;
  sizes: string;
  priority?: boolean;
  className?: string;
  headingLevel?: 'h2' | 'h3' | 'h4';
}) {
  const t = useTranslations('Video');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const title = displayTitle(video.title);
  const vertical = video.orientation === 'vertical';

  return (
    <div className={cn('group', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t('playTitle', { title })}
        className={cn(
          'relative block w-full overflow-hidden rounded-[1.25rem] border border-line bg-surface focus-visible:outline-offset-4',
          vertical ? 'aspect-[9/16]' : 'aspect-video'
        )}
      >
        <Image
          src={thumbnail(video)}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className={cn(
            'absolute inline-flex items-center justify-center rounded-full bg-fg/95 text-canvas shadow-2xl transition-transform duration-500 ease-out-expo group-hover:scale-110',
            vertical ? 'bottom-4 left-4 size-11' : 'left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 md:size-20'
          )}
        >
          <Play size={vertical ? 16 : 24} className="translate-x-px" fill="currentColor" />
        </span>
      </button>
      <Heading lang={video.titleLang} className={cn('mt-4 text-fg', vertical ? 'text-sm leading-snug' : 'text-lg font-medium tracking-[-0.01em]')}>
        {title}
      </Heading>
      {open && (
        <YouTubeDialog
          video={video}
          title={title}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

function YouTubeDialog({ video, title, onClose }: { video: YouTubeVideo; title: string; onClose: () => void }) {
  const t = useTranslations('Video');
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const vertical = video.orientation === 'vertical';

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => event.target === event.currentTarget && ref.current?.close()}
      className="m-auto max-h-none max-w-none bg-transparent p-0 text-fg backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} lang={video.titleLang} className="line-clamp-1 text-sm font-medium text-fg sm:text-base">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t('close')}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-fg transition-colors hover:bg-white/20"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <iframe
          src={embedUrl(video, locale)}
          title={t('playerTitle', { title })}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={cn(
            'block rounded-xl border-0 bg-black',
            vertical
              ? 'aspect-[9/16] h-[min(80svh,calc((100vw-2rem)*16/9))] w-auto'
              : 'aspect-video w-[min(calc(100vw-2rem),calc(78svh*16/9),75rem)]'
          )}
        />
        <a
          href={watchUrl(video)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('watchOnYouTubeAria', { title })}
          className="inline-flex items-center gap-1.5 self-start text-sm text-fg-muted transition-colors hover:text-fg"
        >
          {t('watchOnYouTube')}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </dialog>
  );
}

/** Small print under video sections: playback comes from YouTube. */
export function YouTubeNotice({ className }: { className?: string }) {
  const t = useTranslations('Video');
  return (
    <p className={cn('text-xs leading-relaxed text-fg-subtle', className)}>
      {t.rich('youtubeNotice', {
        link: (chunks) => (
          <Link href="/cookie-policy" className="underline decoration-line-strong underline-offset-2 hover:text-fg">
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
