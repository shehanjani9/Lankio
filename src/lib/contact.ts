/**
 * Contact form contract shared by the client form and the API route, so
 * both validate with exactly the same rules.
 */

export const PROJECT_TYPES = ['website', 'brand', 'motion', 'media', 'marketing', 'collaboration', 'other'] as const;
export const TIMELINES = ['flexible', 'soon', 'quarter', 'later'] as const;
export const REPLY_LANGUAGES = ['en', 'it'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Timeline = (typeof TIMELINES)[number];
export type ReplyLanguage = (typeof REPLY_LANGUAGES)[number];

export const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  messageMin: 20,
  message: 5000,
} as const;

/** Submissions faster than this after the form renders are treated as bots. */
export const MIN_FILL_TIME_MS = 3000;

export type ContactInput = {
  name: string;
  email: string;
  company?: string;
  projectType: ProjectType;
  timeline?: Timeline;
  language: ReplyLanguage;
  message: string;
};

export type ContactErrorCode = 'name' | 'email' | 'projectType' | 'message' | 'tooLong';
export type ContactErrors = Partial<Record<keyof ContactInput, ContactErrorCode>>;

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Collapses control characters and CR/LF so values are safe in headers. */
export function singleLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

/**
 * Normalises raw input and returns either clean data or per-field error
 * codes. Accepts `unknown` so it can validate untrusted JSON directly.
 */
export function validateContact(raw: unknown): { data: ContactInput; errors: null } | { data: null; errors: ContactErrors } {
  const input = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const str = (key: string) => (typeof input[key] === 'string' ? (input[key] as string) : '');

  const name = singleLine(str('name'));
  const email = singleLine(str('email')).toLowerCase();
  const company = singleLine(str('company'));
  // Messages keep their line breaks but lose other control characters.
  const message = str('message').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();

  const errors: ContactErrors = {};
  if (!name) errors.name = 'name';
  else if (name.length > LIMITS.name) errors.name = 'tooLong';

  if (!EMAIL_PATTERN.test(email)) errors.email = 'email';
  else if (email.length > LIMITS.email) errors.email = 'tooLong';

  if (company.length > LIMITS.company) errors.company = 'tooLong';

  if (!isOneOf(PROJECT_TYPES, input.projectType)) errors.projectType = 'projectType';

  if (message.length < LIMITS.messageMin) errors.message = 'message';
  else if (message.length > LIMITS.message) errors.message = 'tooLong';

  if (Object.keys(errors).length > 0) return { data: null, errors };

  return {
    data: {
      name,
      email,
      company: company || undefined,
      projectType: input.projectType as ProjectType,
      timeline: isOneOf(TIMELINES, input.timeline) ? input.timeline : undefined,
      language: isOneOf(REPLY_LANGUAGES, input.language) ? input.language : 'en',
      message,
    },
    errors: null,
  };
}
