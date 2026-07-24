export type LeadDetails = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  templateName?: string;
  serviceType?: string;
  budget?: string;
  preferredLanguage: 'en' | 'it';
  message: string;
};

// Email clients don't support backdrop-filter/blur, so these use solid dark
// panels instead of the site's glassmorphism -- same palette, email-safe.

function row(label: string, value?: string): string {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#f3f4f6;font-size:13px;">${escapeHtml(value)}</td>
    </tr>`;
}

export function adminNotificationEmail(details: LeadDetails): string {
  const {
    name,
    email,
    phone,
    company,
    templateName,
    serviceType,
    budget,
    preferredLanguage,
    message,
  } = details;

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#0a0b0f; padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#101219;border:1px solid rgba(255,255,255,0.09);border-radius:16px;padding:32px;">
      <p style="font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:#9ca3af;margin:0 0 12px;">New Lead -- Lankio</p>
      <h2 style="margin:0 0 20px;font-size:20px;color:#f3f4f6;">${escapeHtml(name)}</h2>

      <table style="width:100%;border-collapse:collapse;">
        ${row('Company', company)}
        ${row('Email', email)}
        ${row('Phone / WhatsApp', phone)}
        ${row('Template', templateName)}
        ${row('Service Type', serviceType)}
        ${row('Budget', budget)}
        ${row('Preferred Language', preferredLanguage === 'it' ? 'Italian' : 'English')}
      </table>

      <p style="margin:20px 0 6px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
      <p style="margin:0;color:#f3f4f6;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  </div>`;
}

export function leadConfirmationEmail({
  name,
  preferredLanguage,
}: {
  name: string;
  preferredLanguage: 'en' | 'it';
}): string {
  const copy =
    preferredLanguage === 'it'
      ? {
          heading: `Grazie, ${escapeHtml(name)}.`,
          body: "Abbiamo ricevuto il tuo messaggio e ti risponderemo entro un giorno lavorativo. Rispondi pure direttamente a questa email con qualsiasi altro dettaglio utile -- link al progetto, tempistiche o budget.",
          signature: '-- Lankio',
        }
      : {
          heading: `Thanks, ${escapeHtml(name)}.`,
          body: "We've received your message and will follow up within one business day. Feel free to reply directly to this email with anything else useful -- project links, timeline, or budget range.",
          signature: '-- Lankio',
        };

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#0a0b0f; padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#101219;border:1px solid rgba(255,255,255,0.09);border-radius:16px;padding:32px;">
      <h2 style="margin:0 0 16px;font-size:20px;color:#f3f4f6;">${copy.heading}</h2>
      <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.6;">${copy.body}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">${copy.signature}</p>
    </div>
  </div>`;
}

// Raw user input goes straight into an HTML email body, so it must be escaped
// to prevent HTML/script injection into the rendered message.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
