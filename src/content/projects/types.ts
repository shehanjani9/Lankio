import type { Locale } from '@/i18n/routing';

/** A value provided in every supported locale. */
export type Localized<T> = Record<Locale, T>;

export const PROJECT_CATEGORIES = ['web', 'apps', 'branding', 'motion', 'photo-video'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * Internal classification. It drives a quiet attribution line on the
 * project page ("Independent project", "Creative concept"), never a badge.
 * - professional: delivered for a client or employer and cleared for display
 * - independent:  self-initiated product or brand that is live and owned
 * - concept:      self-initiated creative exploration, not a commission
 */
export type ProjectClassification = 'professional' | 'independent' | 'concept';

/**
 * Only `published` projects are rendered, listed in the sitemap, or given
 * metadata. `draft` entries document planned work without exposing it.
 */
export type PublicationStatus = 'published' | 'draft';

export type ImageAsset = {
  /** Path under /public, e.g. /projects/<slug>/cover.jpg */
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
  /** Frames the image in a desktop or phone chrome in galleries. */
  frame?: 'desktop' | 'mobile' | 'none';
};

export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type VideoAsset = {
  /** H.264 MP4 under /public (e.g. a Remotion export). */
  src: string;
  /** Optional VP9/AV1 WebM, offered first when present. */
  webm?: string;
  poster: string;
  aspectRatio: VideoAspectRatio;
  title: Localized<string>;
  /** WebVTT captions/subtitles, strongly recommended for dialogue. */
  captions?: { src: string; srcLang: string; label: string }[];
  /** Technical specs shown next to the player. */
  specs?: {
    durationSeconds?: number;
    width?: number;
    height?: number;
    fps?: number;
    frames?: number;
    tool?: string;
  };
};

export type ProjectSection = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  status: PublicationStatus;
  classification: ProjectClassification;
  /** Lower numbers appear first. */
  order: number;
  /** Shown on the home page "Selected work" section. */
  featured?: boolean;

  title: string;
  categories: ProjectCategory[];
  /** Human-readable discipline line, e.g. "Web design · Development · Tourism". */
  discipline: Localized<string>;
  /** Only set when verified. */
  year?: number;

  summary: Localized<string>;
  description: Localized<string[]>;
  role: Localized<string[]>;
  /** Only verified technologies. */
  technologies?: string[];
  highlights?: Localized<ProjectSection[]>;
  approach?: Localized<string[]>;
  /** Only documented outcomes -- never estimates. */
  outcomes?: Localized<string[]>;

  /** Hex colour used for the soft backdrop behind the cover in cards. */
  tint?: string;

  /** Required once published; drafts may not have assets yet. */
  cover?: ImageAsset;
  gallery?: ImageAsset[];
  videos?: VideoAsset[];

  liveUrl?: string;
  repositoryUrl?: string;
  /** Internal note about what is still missing (never rendered). */
  notes?: string;
};

export type PublishedProject = Project & { status: 'published'; cover: ImageAsset };
