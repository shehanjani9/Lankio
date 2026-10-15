import { Resend } from 'resend';

/**
 * Email configuration, validated at request time.
 *
 * The Resend client is created lazily: constructing it at import time throws
 * when RESEND_API_KEY is missing, which used to crash the whole route with an
 * unhandled 500 instead of a clear, logged configuration error.
 *
 * Values are never logged; only the names of missing variables are.
 */

const ADDRESS = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
// Accepts "addr@domain.tld" or "Display Name <addr@domain.tld>".
const SENDER = /^(?:[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>|[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)$/;

// Defaults preserve the behaviour the site already had in production.
const DEFAULT_ADMIN_EMAIL = 'info.lankio@gmail.com';
const DEFAULT_FROM_EMAIL = 'Lankio <info@lankio.it>';

export type EmailConfig = { apiKey: string; adminEmail: string; fromEmail: string };

export type EmailConfigResult =
  | { ok: true; config: EmailConfig; warnings: string[] }
  | { ok: false; problems: string[] };

export function getEmailConfig(env: Record<string, string | undefined> = process.env): EmailConfigResult {
  const problems: string[] = [];
  const warnings: string[] = [];

  const apiKey = env.RESEND_API_KEY?.trim() ?? '';
  if (!apiKey) problems.push('RESEND_API_KEY is not set');

  const adminEmail = env.LANKIO_ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
  if (!env.LANKIO_ADMIN_EMAIL?.trim()) warnings.push('LANKIO_ADMIN_EMAIL is not set; using the default inbox');
  if (!ADDRESS.test(adminEmail)) problems.push('LANKIO_ADMIN_EMAIL is not a valid email address');

  const fromEmail = env.LANKIO_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
  if (!env.LANKIO_FROM_EMAIL?.trim()) warnings.push('LANKIO_FROM_EMAIL is not set; using the default sender');
  if (!SENDER.test(fromEmail)) problems.push('LANKIO_FROM_EMAIL must be "address" or "Name <address>"');

  if (problems.length > 0) return { ok: false, problems };
  return { ok: true, config: { apiKey, adminEmail, fromEmail }, warnings };
}

let client: Resend | null = null;
let clientKey = '';

export function getResend(apiKey: string): Resend {
  if (!client || clientKey !== apiKey) {
    client = new Resend(apiKey);
    clientKey = apiKey;
  }
  return client;
}
