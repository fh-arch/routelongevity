import { sendEmail } from './emailClient.js';

const appUrl = (process.env.APP_URL || 'https://routelongevity.com').replace(/\/+$/, '');
const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || '';
const reminderDelayMs = Number(process.env.AGENT_OUTCOME_REMINDER_DELAY_MS || 7 * 24 * 60 * 60 * 1000);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function suggestionLines(suggestions) {
  return suggestions
    .slice(0, 5)
    .map((suggestion, index) => {
      const location = [suggestion.city, suggestion.country].filter(Boolean).join(', ');
      return `${index + 1}. ${suggestion.name}${location ? ` - ${location}` : ''}\n   ${suggestion.reason}`;
    })
    .join('\n');
}

function suggestionListHtml(suggestions) {
  return suggestions
    .slice(0, 5)
    .map((suggestion) => {
      const location = [suggestion.city, suggestion.country].filter(Boolean).join(', ');
      return `
        <li style="margin:0 0 16px;padding:14px 16px;border:1px solid #d8ebe6;border-radius:16px;background:#f9fdfb;">
          <strong style="display:block;color:#042f2c;font-size:16px;">${escapeHtml(suggestion.name)}</strong>
          ${location ? `<span style="display:block;color:#5f7772;font-size:13px;margin-top:3px;">${escapeHtml(location)}</span>` : ''}
          <p style="margin:10px 0 0;color:#38534e;font-size:14px;line-height:1.55;">${escapeHtml(suggestion.reason)}</p>
        </li>
      `;
    })
    .join('');
}

function emailShell({ title, intro, bodyHtml, ctaLabel = 'Open Route Longevity', ctaUrl = appUrl }) {
  return `
    <div style="margin:0;padding:28px;background:#f5faf7;font-family:Arial,Helvetica,sans-serif;color:#042f2c;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8ebe6;border-radius:24px;overflow:hidden;">
        <div style="padding:28px 28px 18px;background:#042f2c;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#79c9b8;font-weight:700;">Route Longevity</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.15;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:26px 28px;">
          <p style="margin:0 0 18px;color:#38534e;font-size:15px;line-height:1.65;">${escapeHtml(intro)}</p>
          ${bodyHtml}
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;margin-top:18px;background:#0e7a70;color:#ffffff;text-decoration:none;border-radius:14px;padding:13px 18px;font-weight:700;">${escapeHtml(ctaLabel)}</a>
          <p style="margin:24px 0 0;color:#7f918d;font-size:12px;line-height:1.5;">Route Longevity is a route discovery platform, not a medical diagnosis service. Consult qualified clinicians for medical decisions.</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendRouteReadyEmail({ user, message, suggestions }) {
  if (!user?.email || !suggestions?.length) return;

  const subject = 'Your Route Longevity plan is ready';
  const text = [
    `Hi ${user.name || 'there'},`,
    '',
    'Your Route Longevity agent route is ready.',
    '',
    `Your request: ${message}`,
    '',
    suggestionLines(suggestions),
    '',
    `Open your route: ${appUrl}`,
    '',
    'Route Longevity is a route discovery platform, not medical advice.',
  ].join('\n');

  await sendEmail({
    to: user.email,
    subject,
    text,
    html: emailShell({
      title: 'Your longevity route is ready',
    intro: `We created a route from your request: "${message}".`,
      bodyHtml: `<ol style="list-style:none;margin:0;padding:0;">${suggestionListHtml(suggestions)}</ol>`,
      ctaLabel: 'Open my route',
    }),
    fallbackLog: `Route ready email for ${user.email}\n${text}`,
  });
}

export async function sendOutcomeReminderEmail({ user, suggestions }) {
  if (!user?.email || !suggestions?.length) return;

  const topSuggestion = suggestions[0];
  const subject = 'How did your Route Longevity experience go?';
  const text = [
    `Hi ${user.name || 'there'},`,
    '',
    'When you complete your visit, please share a quick outcome score. It helps improve future recommendations.',
    topSuggestion?.name ? `Suggested place: ${topSuggestion.name}` : '',
    '',
    `Open favorites and submit feedback: ${appUrl}`,
  ].filter(Boolean).join('\n');

  await sendEmail({
    to: user.email,
    subject,
    text,
    html: emailShell({
      title: 'Share your post-visit outcome',
      intro: 'When your route experience is complete, a quick 1-10 outcome score helps improve future Route Longevity recommendations.',
      bodyHtml: topSuggestion?.name
        ? `<p style="margin:0;color:#38534e;font-size:15px;line-height:1.65;">Suggested place: <strong>${escapeHtml(topSuggestion.name)}</strong></p>`
        : '',
      ctaLabel: 'Open favorites',
    }),
    fallbackLog: `Outcome reminder email for ${user.email}\n${text}`,
  });
}

export function scheduleOutcomeReminderEmail({ user, suggestions }) {
  if (!user?.email || !suggestions?.length || !Number.isFinite(reminderDelayMs) || reminderDelayMs <= 0) return;

  const timer = setTimeout(() => {
    sendOutcomeReminderEmail({ user, suggestions }).catch((error) => {
      console.error('Outcome reminder email failed:', error);
    });
  }, reminderDelayMs);

  if (typeof timer.unref === 'function') {
    timer.unref();
  }
}

export async function notifyAdminOutcomeSubmitted({ user, listing, outcome }) {
  if (!adminNotifyEmail) {
    console.info(`Admin outcome notification skipped. User: ${user?.email}; Listing: ${listing?.name}; Score: ${outcome?.self_reported_score}`);
    return;
  }

  const subject = 'New Route Longevity outcome submitted';
  const lines = [
    `User: ${user?.name || 'Unknown'} <${user?.email || 'unknown'}>`,
    `Listing: ${listing?.name || outcome?.listing_id}`,
    `External ID: ${listing?.external_id || '-'}`,
    `Visited at: ${outcome?.visited_at}`,
    `Score: ${outcome?.self_reported_score}/10`,
    outcome?.notes ? `Notes: ${outcome.notes}` : '',
  ].filter(Boolean);

  await sendEmail({
    to: adminNotifyEmail,
    subject,
    text: lines.join('\n'),
    html: emailShell({
      title: 'New outcome submitted',
      intro: 'A traveler submitted post-visit outcome feedback.',
      bodyHtml: `
        <table style="width:100%;border-collapse:collapse;color:#38534e;font-size:14px;">
          ${lines.map((line) => `<tr><td style="padding:8px 0;border-bottom:1px solid #edf5f1;">${escapeHtml(line)}</td></tr>`).join('')}
        </table>
      `,
      ctaLabel: 'Open admin panel',
    }),
    fallbackLog: `Admin outcome notification\n${lines.join('\n')}`,
  });
}
