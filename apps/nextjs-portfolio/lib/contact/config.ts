/** Inbox for contact form submissions (server-only). */
export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || 'hws902@gmail.com';

/** Must be a verified sender in Resend (e.g. contact@wisihe.no). */
export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || 'WiSiHe Contact <onboarding@resend.dev>';

export const CONTACT_DISPLAY_EMAIL = 'hws902@gmail.com';

export const CONTACT_LOCATION = 'Oslo, Norway';

/** True when Resend is configured and the server can deliver contact form emails. */
export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function buildContactMailtoUrl(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const params = new URLSearchParams({
    subject: data.subject,
    body: [`Name: ${data.name}`, `Reply-to: ${data.email}`, '', data.message].join('\n'),
  });

  return `mailto:${CONTACT_DISPLAY_EMAIL}?${params.toString()}`;
}
