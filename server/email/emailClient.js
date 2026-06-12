const emailFrom = process.env.AUTH_EMAIL_FROM || 'Route Longevity <notifications@routelongevity.com>';

export async function sendEmail({ to, subject, text, html, fallbackLog }) {
  if (!to) return;

  if (!process.env.RESEND_API_KEY) {
    console.info(fallbackLog || `Email not sent because RESEND_API_KEY is not set. To: ${to}; subject: ${subject}; body: ${text}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom,
      to,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Email failed for ${to}: ${details}`);
  }
}

export function runEmailJob(label, job) {
  Promise.resolve()
    .then(job)
    .catch((error) => {
      console.error(`${label} email job failed:`, error);
    });
}
