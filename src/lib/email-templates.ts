type LeadDetails = {
  name: string;
  email: string;
  message: string;
};

// Email clients don't support backdrop-filter/blur, so these templates use
// solid dark panels instead of the site's glassmorphism -- same palette,
// email-safe rendering.

export function adminNotificationEmail({ name, email, message }: LeadDetails): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#0a0b0f; padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#101219;border:1px solid rgba(255,255,255,0.09);border-radius:16px;padding:32px;">
      <p style="font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:#9ca3af;margin:0 0 12px;">New Lead -- Lankio</p>
      <h2 style="margin:0 0 20px;font-size:20px;color:#f3f4f6;">${escapeHtml(name)}</h2>
      <p style="margin:0 0 8px;color:#9ca3af;font-size:14px;">
        <strong style="color:#f3f4f6;">Email:</strong> ${escapeHtml(email)}
      </p>
      <p style="margin:16px 0 0;color:#9ca3af;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  </div>`;
}

export function leadConfirmationEmail({ name }: { name: string }): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#0a0b0f; padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#101219;border:1px solid rgba(255,255,255,0.09);border-radius:16px;padding:32px;">
      <h2 style="margin:0 0 16px;font-size:20px;color:#f3f4f6;">Thanks, ${escapeHtml(name)}.</h2>
      <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.6;">
        We've received your message and will follow up within one business day.
        Feel free to reply directly to this email with anything else useful --
        project links, timeline, or budget range.
      </p>
      <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">-- Lankio</p>
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
