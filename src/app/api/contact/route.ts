import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { adminNotificationEmail, leadConfirmationEmail } from '@/lib/email-templates';
import { MIN_FILL_TIME_MS, validateContact } from '@/lib/contact';

const ADMIN_EMAIL = process.env.LANKIO_ADMIN_EMAIL || 'info.lankio@gmail.com';
const FROM_EMAIL = process.env.LANKIO_FROM_EMAIL || 'Lankio <info@lankio.it>';
const MAX_BODY_BYTES = 16_000;

// Best-effort sliding-window limit per client IP. On serverless hosting each
// instance keeps its own map, so this slows down bursts rather than being a
// hard guarantee -- pair with platform-level protection for stronger limits.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
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

  try {
    const admin = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      // validateContact has already collapsed CR/LF in `name`.
      subject: `New project inquiry from ${data.name}`,
      html: adminNotificationEmail(data),
    });

    if (admin.error) {
      console.error('Resend admin email error:', admin.error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    const confirmation = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject:
        data.language === 'it'
          ? 'Ho ricevuto il tuo messaggio — Lankio'
          : 'I’ve received your message — Lankio',
      html: leadConfirmationEmail({ name: data.name, language: data.language }),
    });

    // The inquiry already reached the studio; a failed confirmation should
    // not make the visitor resend it.
    if (confirmation.error) console.error('Resend confirmation email error:', confirmation.error);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact route exception:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
