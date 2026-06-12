'use server';

import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  isContactEmailConfigured,
} from '@/lib/contact/config';

export type ContactFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimField(value: FormDataEntryValue | null, maxLength: number): string {
  return String(value ?? '')
    .trim()
    .slice(0, maxLength);
}

function validateContactForm(formData: FormData):
  | {
      ok: true;
      data: { name: string; email: string; subject: string; message: string };
    }
  | { ok: false; fieldErrors: ContactFormState['fieldErrors'] } {
  const honeypot = trimField(formData.get('company'), 200);
  if (honeypot.length > 0) {
    return { ok: true, data: { name: '', email: '', subject: '', message: '' } };
  }

  const name = trimField(formData.get('name'), 100);
  const email = trimField(formData.get('email'), 254);
  const subject = trimField(formData.get('subject'), 200);
  const message = trimField(formData.get('message'), 5000);

  const fieldErrors: NonNullable<ContactFormState['fieldErrors']> = {};

  if (name.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Please enter a valid email address.';
  if (subject.length < 2) fieldErrors.subject = 'Please add a subject.';
  if (message.length < 10) fieldErrors.message = 'Message must be at least 10 characters.';

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { name, email, subject, message } };
}

async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isContactEmailConfigured()) {
    return {
      ok: false,
      message:
        'The contact form is not available yet. Please use the email link or social profiles instead.',
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      message:
        'The contact form is not available yet. Please use the email link or social profiles instead.',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `[WiSiHe Contact] ${data.subject}`,
      text: [`Name: ${data.name}`, `Email: ${data.email}`, '', data.message].join('\n'),
    }),
  });

  if (!response.ok) {
    console.error('Resend error', response.status, await response.text());
    return {
      ok: false,
      message: 'Something went wrong sending your message. Please try again or email directly.',
    };
  }

  return { ok: true };
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validated = validateContactForm(formData);

  if (!validated.ok) {
    return { ok: false, fieldErrors: validated.fieldErrors };
  }

  if (!validated.data.name) {
    return { ok: true, message: 'Thanks — your message has been sent.' };
  }

  const sent = await sendContactEmail(validated.data);
  if (!sent.ok) {
    return { ok: false, message: sent.message };
  }

  return { ok: true, message: 'Thanks — your message has been sent. I will get back to you soon.' };
}
