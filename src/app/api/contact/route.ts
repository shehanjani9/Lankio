import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { adminNotificationEmail, leadConfirmationEmail } from '@/lib/email-templates';

const ADMIN_EMAIL = process.env.LANKIO_ADMIN_EMAIL || 'hello@lankio.it';
// Resend requires a verified sending domain in production. Until you verify
// lankio.it with Resend, `onboarding@resend.dev` works for testing.
const FROM_EMAIL = process.env.LANKIO_FROM_EMAIL || 'Lankio <onboarding@resend.dev>';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  templateName?: string;
  serviceType?: string;
  budget?: string;
  preferredLanguage?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();
  const phone = (body.phone || '').trim();
  const company = (body.company || '').trim();
  const templateName = (body.templateName || '').trim();
  const serviceType = (body.serviceType || '').trim();
  const budget = (body.budget || '').trim();
  const preferredLanguage: 'en' | 'it' = body.preferredLanguage === 'it' ? 'it' : 'en';

  if (!name || !message || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 422 });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: templateName
        ? `New inquiry from ${name} -- ${templateName}`
        : `New project inquiry from ${name}`,
      html: adminNotificationEmail({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        templateName: templateName || undefined,
        serviceType: serviceType || undefined,
        budget: budget || undefined,
        preferredLanguage,
        message,
      }),
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject:
        preferredLanguage === 'it'
          ? 'Abbiamo ricevuto il tuo messaggio -- Lankio'
          : 'We received your message -- Lankio',
      html: leadConfirmationEmail({ name, preferredLanguage }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Resend send failed:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }
}
