'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { VideoAspectRatio } from '@/content/projects/types';
import { cn } from '@/lib/utils';

export type VideoPlayerData = {
  src: string;
  webm?: string;
  poster: string;
  aspectRatio: VideoAspectRatio;
  title: string;
  captions?: { src: string; srcLang: string; label: string }[];
};

const ASPECT: Record<VideoAspectRatio, string> = {
  '16:9': 'aspect-video w-full',
  '9:16': 'aspect-[9/16] w-full max-w-[min(100%,calc(80svh*9/16))]',
  '1:1': 'aspect-square w-full max-w-[min(100%,80svh)]',
  '4:5': 'aspect-[4/5] w-full max-w-[min(100%,calc(80svh*4/5))]',
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * Accessible, performance-conscious player for exported videos (e.g.
 * Remotion MP4s). Nothing is downloaded until the visitor shows intent:
 * preload="none", a static poster, a muted preview on hover for fine
 * pointers, and full playback with sound only after a click.
 */
export function VideoPlayer({ video, priority = false }: { video: VideoPlayerData; priority?: boolean }) {
  const t = useTranslations('Video');
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [canPreview, setCanPreview] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability detection is client-only
    setCanPreview(fine && !reduce && !saveData);

    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const start = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    if (!started) el.currentTime = 0;
    setStarted(true);
    void el.play().catch(() => {
      // Autoplay with sound can be refused; fall back to muted playback.
      el.muted = true;
      setMuted(true);
      void el.play().catch(() => undefined);
    });
  }, [started]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!started) return start();
    if (el.paused) void el.play();
    else el.pause();
  }, [start, started]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    const el = videoRef.current as WebkitVideo | null;
    if (!container || !el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (container.requestFullscreen) {
      void container.requestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      // iOS Safari only supports fullscreen on the video element itself.
      el.webkitEnterFullscreen();
    }
  }, []);

  function seek(seconds: number) {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(Math.max(seconds, 0), el.duration);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!started) return;
    // Let the native slider handle its own arrow keys.
    if ((event.target as HTMLElement).tagName === 'INPUT') return;
    const el = videoRef.current;
    switch (event.key) {
      case ' ':
      case 'k':
        event.preventDefault();
        togglePlay();
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'ArrowRight':
        if (el) seek(el.currentTime + 5);
        break;
      case 'ArrowLeft':
        if (el) seek(el.currentTime - 5);
        break;
    }
  }

  // Muted hover preview before the visitor commits to playback.
  function previewStart() {
    const el = videoRef.current;
    if (!el || started || !canPreview) return;
    el.muted = true;
    void el.play().catch(() => undefined);
  }
  function previewStop() {
    const el = videoRef.current;
    if (!el || started) return;
    el.pause();
    el.currentTime = 0;
  }

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        onKeyDown={onKeyDown}
        onPointerEnter={previewStart}
        onPointerLeave={previewStop}
        className={cn(
          'group/video relative overflow-hidden rounded-[1.5rem] border border-line bg-black',
          fullscreen ? 'flex h-full w-full max-w-none items-center justify-center rounded-none border-0' : ASPECT[video.aspectRatio]
        )}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          preload="none"
          playsInline
          poster={video.poster}
          aria-label={video.title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => started && setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onClick={started ? togglePlay : undefined}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.src} type="video/mp4" />
          {video.captions?.map((track) => (
            <track key={track.src} kind="captions" src={track.src} srcLang={track.srcLang} label={track.label} />
          ))}
          <p>
            {t('unsupported')} <a href={video.src}>{t('download')}</a>
          </p>
        </video>

        {!started && (
          <button
            type="button"
            onClick={start}
            aria-label={t('playTitle', { title: video.title })}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Static poster keeps the first paint light and optimised. */}
            <Image
              src={video.poster}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={cn(
                'object-cover transition-opacity duration-500',
                canPreview && 'group-hover/video:opacity-0'
              )}
            />
            <span className="relative inline-flex size-20 items-center justify-center rounded-full bg-fg/95 text-canvas shadow-2xl transition-transform duration-500 ease-out-expo group-hover/video:scale-110">
              <Play size={26} className="translate-x-0.5" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}

        {started && (
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10 text-white transition-opacity duration-300 sm:gap-3 sm:px-4',
              playing ? 'opacity-0 focus-within:opacity-100 group-hover/video:opacity-100' : 'opacity-100'
            )}
          >
            <ControlButton label={playing ? t('pause') : t('play')} onClick={togglePlay}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </ControlButton>
            <span className="w-10 text-right text-xs tabular-nums text-white/80">{formatTime(current)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={t('seek')}
              aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
              className="h-1 min-w-0 flex-1 cursor-pointer accent-white"
            />
            <span className="w-10 text-xs tabular-nums text-white/60">{formatTime(duration)}</span>
            <ControlButton label={muted ? t('unmute') : t('mute')} onClick={toggleMute}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </ControlButton>
            <ControlButton label={fullscreen ? t('exitFullscreen') : t('fullscreen')} onClick={toggleFullscreen}>
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </ControlButton>
          </div>
        )}
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
