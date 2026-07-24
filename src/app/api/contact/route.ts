import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { adminNotificationEmail, leadConfirmationEmail } from '@/lib/email-templates';

const ADMIN_EMAIL = process.env.LANKIO_ADMIN_EMAIL || 'info.lankio@gmail.com';
const FROM_EMAIL = process.env.LANKIO_FROM_EMAIL || 'Lankio <info@lankio.it>';

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
  website?: string; // 🍯 Honeypot field එක (Anti-spam)
};

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // 🤖 1. Honeypot Check (Spam Bot Protection)
  // Human users ලට මේ field එක පෙනෙන්නේ නැති නිසා fill කරන්නේ නැහැ.
  // Bot කෙනෙක් මේක fill කරලා තිබ්බොත්, Silent එකේ 200 Success දීලා මගහරිනවා (Bot එක මනාව trick කිරීමට).
  if (body.website && body.website.trim() !== '') {
    console.log('Spam bot detected and blocked via Honeypot field.');
    return NextResponse.json({ ok: true });
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
    // 2. Send Notification Email to Admin
    const adminEmailResult = await resend.emails.send({
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

    // Check for Resend API error response
    if (adminEmailResult.error) {
      console.error('Resend Admin Email Error:', adminEmailResult.error);
      return NextResponse.json({ error: 'Failed to send admin notification' }, { status: 502 });
    }

    // 3. Send Confirmation Email to Client
    const clientEmailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject:
        preferredLanguage === 'it'
          ? 'Abbiamo ricevuto il tuo messaggio -- Lankio'
          : 'We received your message -- Lankio',
      html: leadConfirmationEmail({ name, preferredLanguage }),
    });

    if (clientEmailResult.error) {
      console.error('Resend Client Confirmation Email Error:', clientEmailResult.error);
      // Admin එකට email එක ගිය නිසා client email එක fail වුණත් form එක successfully submitted ලෙස සලකයි.
    }

    return NextResponse.json({ ok: true, id: adminEmailResult.data?.id });
  } catch (error) {
    console.error('Resend execution exception:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}