import { NextRequest, NextResponse } from 'next/server';
import { getEmailConfig, getResend } from '@/lib/resend';
import { adminNotificationEmail, leadConfirmationEmail } from '@/lib/email-templates';
import { MIN_FILL_TIME_MS, validateContact } from '@/lib/contact';

const MAX_BODY_BYTES = 16_000;

// Best-effort sliding-window limit per client IP. On serverless hosting each
// instance keeps its own map, so this slows down bursts rather than being a
// hard guarantee -- pair with platform-level protection for stronger limits.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.CONTACT_RATE_LIMIT_MAX) || 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

type SendResult = { error: { name?: string; statusCode?: number | null; message?: string } | null };

/** Rate limits, 5xx and network failures are worth one more attempt. */
function isTransient(error: SendResult['error']): boolean {
  if (!error) return false;
  const status = error.statusCode ?? 0;
  return status === 429 || status >= 500 || error.name === 'rate_limit_exceeded' || error.name === 'application_error';
}

async function sendWithRetry(send: () => Promise<SendResult>): Promise<SendResult> {
  let result: SendResult;
  try {
    result = await send();
  } catch (error) {
    result = { error: { name: 'network_error', message: String(error) } };
  }
  if (!isTransient(result.error)) return result;
  await new Promise((resolve) => setTimeout(resolve, 700));
  try {
    return await send();
  } catch (error) {
    return { error: { name: 'network_error', message: String(error) } };
  }
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
  }

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Bots: a filled honeypot or an impossibly fast submission gets a silent
  // success so the bot learns nothing, and no email is sent.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  const elapsed = typeof body.elapsed === 'number' ? body.elapsed : 0;
  if (honeypot || elapsed < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '600' } });
  }

  const result = validateContact(body);
  if (result.errors) {
    return NextResponse.json({ error: 'Invalid form data', fields: result.errors }, { status: 422 });
  }
  const data = result.data;

  const emailConfig = getEmailConfig();
  if (!emailConfig.ok) {
    // Names of the misconfigured variables only -- never their values.
    console.error('Contact form is not configured:', emailConfig.problems.join('; '));
    return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 });
  }
  if (emailConfig.warnings.length > 0) console.warn('Contact form:', emailConfig.warnings.join('; '));
  const { apiKey, adminEmail, fromEmail } = emailConfig.config;
  const resend = getResend(apiKey);

  const admin = await sendWithRetry(() =>
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: data.email,
      // validateContact has already collapsed CR/LF in `name`.
      subject: `New project inquiry from ${data.name}`,
      html: adminNotificationEmail(data),
    })
  );

  if (admin.error) {
    console.error('Contact admin email failed:', admin.error.name, admin.error.statusCode ?? '', admin.error.message ?? '');
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }

  // The inquiry has reached the studio. A failed confirmation is logged but
  // must not make the visitor resend (and duplicate) the inquiry.
  try {
    const confirmation = await resend.emails.send({
      from: fromEmail,
      to: data.email,
      replyTo: adminEmail,
      subject: data.language === 'it' ? 'Ho ricevuto il tuo messaggio — Lankio' : 'I’ve received your message — Lankio',
      html: leadConfirmationEmail({ name: data.name, language: data.language }),
    });
    if (confirmation.error) {
      console.error('Contact confirmation email failed:', confirmation.error.name, confirmation.error.message ?? '');
    }
  } catch (error) {
    console.error('Contact confirmation email threw:', error);
  }

  return NextResponse.json({ ok: true });
}
