import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { adminNotificationEmail, leadConfirmationEmail } from '@/lib/email-templates';

const ADMIN_EMAIL = process.env.LANKIO_ADMIN_EMAIL || 'hello@lankio.it';
// Resend requires a verified sending domain in production. Until you verify
// lankio.it with Resend, `onboarding@resend.dev` works for testing.
const FROM_EMAIL = process.env.LANKIO_FROM_EMAIL || 'Lankio <onboarding@resend.dev>';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();

  if (!name || !message || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 422 });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: adminNotificationEmail({ name, email, message }),
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'We received your message -- Lankio',
      html: leadConfirmationEmail({ name }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Resend send failed:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }
}
