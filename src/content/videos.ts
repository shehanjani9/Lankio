import type { Locale } from '@/i18n/routing';

export type YouTubeVideo = {
  id: string;
  /** Exact title as published on YouTube (via oEmbed, 2026-10-17). */
  title: string;
  /** Language of the published title, for the `lang` attribute. */
  titleLang: Locale;
  orientation: 'landscape' | 'vertical';
};

/**
 * Videos published on the Lankio YouTube channel. Thumbnails are
 * self-hosted in /public/videos/youtube so no request reaches YouTube
 * (Google) until a visitor presses play.
 */
const INTRO: Record<Locale, YouTubeVideo> = {
  it: {
    id: '2__O6mYxPbY',
    title: 'LANKIO | Dietro la Visione – Creatività, Tecnologia e Innovazione',
    titleLang: 'it',
    orientation: 'landscape',
  },
  en: {
    id: 'xrAsNFO-cwI',
    title: 'LANKIO | The Creator Behind the Vision – Creativity Meets Technology',
    titleLang: 'en',
    orientation: 'landscape',
  },
};

export const FEATURED_FILM: YouTubeVideo = {
  id: 'JyzR3YKbRCc',
  title: 'Create Stunning Videos with Remotion | Lankio Digital Solutions',
  titleLang: 'en',
  orientation: 'landscape',
};

export const SHORTS: YouTubeVideo[] = [
  { id: '6nixCD4p-IE', title: 'Cinematic Motion Graphics & Animation 🚀 | Lankio #Shorts' },
  { id: '5k83Q4Q-S48', title: 'Is your website stuck in 2010?' },
  { id: 'rad43yuCQaE', title: 'We Bring Your Brand to Life! 🌸 | 2D Animation by Lankio #shorts' },
  { id: 'FEjQWV7y6YU', title: 'Italian Restaurant Menu Showcase & Motion Graphics | Lankio Digital Solution' },
  { id: 'Z_FUs2fq6Fs', title: 'Luxury Cocktail Lounge Promo & Motion Graphics | Lankio Digital Solution' },
  { id: 'wYRr_sklrp0', title: 'Sustainable Coffee Branding & Motion Graphics Showcase | Lankio Digital' },
  { id: 'STfka8DCkZE', title: 'Transform Your Brand with High-Converting Motion Graphics | Lankio Digital Solution' },
].map((v) => ({ ...v, titleLang: 'en' as const, orientation: 'vertical' as const }));

export const introVideo = (locale: Locale) => INTRO[locale];

/**
 * Display form of a published title: drops the channel name, hashtags and
 * emoji, keeping the descriptive part only. Nothing is rewritten.
 */
export function displayTitle(title: string): string {
  const parts = title
    .replace(/#\w+/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .split('|')
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter((part) => part && !/^lankio(\s+digital(\s+solutions?)?)?$/i.test(part) && !/\bby lankio$/i.test(part));
  return parts[0] ?? title.trim();
}

export const thumbnail = (video: YouTubeVideo) => `/videos/youtube/${video.id}.jpg`;

export const watchUrl = (video: YouTubeVideo) =>
  video.orientation === 'vertical' ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`;

export const embedUrl = (video: YouTubeVideo, locale: Locale) =>
  `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&hl=${locale}`;
