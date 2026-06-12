/** Inbox for contact form submissions (server-only). */
export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || 'hws902@gmail.com';

/** Must be a verified sender in Resend (e.g. contact@wisihe.no). */
export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || 'WiSiHe Contact <onboarding@resend.dev>';

export const CONTACT_DISPLAY_EMAIL = 'hws902@gmail.com';

export const CONTACT_LOCATION = 'Oslo, Norway';
