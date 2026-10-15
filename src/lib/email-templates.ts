import type { ContactInput, ReplyLanguage } from './contact';

// Email clients don't support backdrop-filter or web fonts reliably, so
// these use solid panels in the site's palette with system fonts.

const PROJECT_TYPE_LABELS: Record<ContactInput['projectType'], string> = {
  website: 'Website or web application',
  brand: 'Branding and design',
  motion: 'Motion design or animation',
  media: 'Photography or video',
  marketing: 'Digital marketing or SEO',
  collaboration: 'Collaboration or partnership',
  other: 'Something else',
};

const TIMELINE_LABELS: Record<NonNullable<ContactInput['timeline']>, string> = {
  flexible: 'Flexible',
  soon: 'Within a month',
  quarter: 'Within three months',
  later: 'Later this year',
};

// User input goes into an HTML body, so every value must be escaped.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label: string, value?: string): string {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:6px 0;color:#7d8290;font-size:13px;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#f4f5f7;font-size:13px;">${escapeHtml(value)}</td>
    </tr>`;
}

const shell = (inner: string) => `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#07080b;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#0d0f14;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
      ${inner}
    </div>
  </div>`;

export function adminNotificationEmail(data: ContactInput): string {
  return shell(`
    <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7d8290;margin:0 0 12px;">New project inquiry — lankio.it</p>
    <h2 style="margin:0 0 20px;font-size:20px;color:#f4f5f7;">${escapeHtml(data.name)}</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Email', data.email)}
      ${row('Company', data.company)}
      ${row('Project type', PROJECT_TYPE_LABELS[data.projectType])}
      ${row('Timeline', data.timeline ? TIMELINE_LABELS[data.timeline] : undefined)}
      ${row('Reply in', data.language === 'it' ? 'Italian' : 'English')}
    </table>
    <p style="margin:24px 0 6px;color:#7d8290;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">Message</p>
    <p style="margin:0;color:#f4f5f7;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(data.message)}</p>`);
}

export function leadConfirmationEmail({ name, language }: { name: string; language: ReplyLanguage }): string {
  const copy =
    language === 'it'
      ? {
          heading: `Grazie, ${escapeHtml(name)}.`,
          body: 'Ho ricevuto il tuo messaggio e ti risponderò personalmente il prima possibile. Se vuoi aggiungere altri dettagli, come link, riferimenti o tempistiche, rispondi pure a questa email.',
          signature: 'Shehan — Lankio Digital Solutions',
        }
      : {
          heading: `Thank you, ${escapeHtml(name)}.`,
          body: 'I’ve received your message and will get back to you personally as soon as I can. If you’d like to add anything, such as links, references or timing, just reply to this email.',
          signature: 'Shehan — Lankio Digital Solutions',
        };

  return shell(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#f4f5f7;">${copy.heading}</h2>
    <p style="margin:0;color:#a3a8b4;font-size:14px;line-height:1.65;">${copy.body}</p>
    <p style="margin:24px 0 0;font-size:13px;color:#7d8290;">${copy.signature}<br/><a href="https://www.lankio.it" style="color:#a3a8b4;">www.lankio.it</a></p>`);
}
