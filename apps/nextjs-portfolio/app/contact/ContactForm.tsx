'use client';

import { Button, Input, Textarea } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { buildContactMailtoUrl, CONTACT_DISPLAY_EMAIL } from '@/lib/contact/config';
import { type ContactFormState, submitContactForm } from './actions';

const initialState: ContactFormState = { ok: false };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimField(value: FormDataEntryValue | null, maxLength: number): string {
  return String(value ?? '')
    .trim()
    .slice(0, maxLength);
}

function validateContactFields(formData: FormData): ContactFormState['fieldErrors'] | null {
  const name = trimField(formData.get('name'), 100);
  const email = trimField(formData.get('email'), 254);
  const subject = trimField(formData.get('subject'), 200);
  const message = trimField(formData.get('message'), 5000);

  const fieldErrors: NonNullable<ContactFormState['fieldErrors']> = {};

  if (name.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Please enter a valid email address.';
  if (subject.length < 2) fieldErrors.subject = 'Please add a subject.';
  if (message.length < 10) fieldErrors.message = 'Message must be at least 10 characters.';

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

function SubmitButton({
  isPending,
  emailDeliveryEnabled,
}: {
  isPending: boolean;
  emailDeliveryEnabled: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        type='submit'
        isLoading={isPending}
        disabled={isPending}
        className='h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-contrast shadow-lg transition-all hover:shadow-accent/40'
      >
        {emailDeliveryEnabled ? 'Send message' : 'Open in email app'}
      </Button>
    </motion.div>
  );
}

type ContactFormProps = {
  emailDeliveryEnabled: boolean;
};

export default function ContactForm({ emailDeliveryEnabled }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [clientFieldErrors, setClientFieldErrors] = useState<ContactFormState['fieldErrors']>();

  const fieldErrors = clientFieldErrors ?? state.fieldErrors;

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      formRef.current?.reset();
      toast.success(state.message);
      trackEvent(AnalyticsEvent.CONTACT_FORM_SUBMITTED, { success: true });
    } else if (!state.fieldErrors) {
      toast.error(state.message);
      trackEvent(AnalyticsEvent.CONTACT_FORM_SUBMITTED, { success: false });
    }
  }, [state]);

  function handleMailtoFallback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientFieldErrors(undefined);

    const formData = new FormData(event.currentTarget);
    const errors = validateContactFields(formData);

    if (errors) {
      setClientFieldErrors(errors);
      return;
    }

    const mailtoUrl = buildContactMailtoUrl({
      name: trimField(formData.get('name'), 100),
      email: trimField(formData.get('email'), 254),
      subject: trimField(formData.get('subject'), 200),
      message: trimField(formData.get('message'), 5000),
    });

    window.location.href = mailtoUrl;
  }

  return (
    <form
      ref={formRef}
      action={emailDeliveryEnabled ? formAction : undefined}
      onSubmit={emailDeliveryEnabled ? undefined : handleMailtoFallback}
      className='relative z-10 space-y-6'
      noValidate
    >
      {!emailDeliveryEnabled ? (
        <div
          className='rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm leading-relaxed text-foreground-subtle'
          role='status'
        >
          The online form is not set up yet. You can still draft your message here and open it in
          your email app, or write to{' '}
          <a
            href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
            className='font-medium text-accent underline-offset-2 hover:underline'
          >
            {CONTACT_DISPLAY_EMAIL}
          </a>{' '}
          directly.
        </div>
      ) : null}

      <div className='absolute -left-[9999px] h-0 w-0 overflow-hidden' aria-hidden='true'>
        <label htmlFor='contact-company'>Company</label>
        <input id='contact-company' name='company' type='text' tabIndex={-1} autoComplete='off' />
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Input
          name='name'
          label='Name'
          placeholder='Your name'
          autoComplete='name'
          required
          inputSize='lg'
          className='border-border/50 bg-background/50 transition-all focus:border-accent'
          errorMessage={fieldErrors?.name}
        />
        <Input
          name='email'
          type='email'
          label='Email'
          placeholder='you@example.com'
          autoComplete='email'
          required
          inputSize='lg'
          className='border-border/50 bg-background/50 transition-all focus:border-accent'
          errorMessage={fieldErrors?.email}
        />
      </div>

      <Input
        name='subject'
        label='Subject'
        placeholder='How can I help?'
        required
        inputSize='lg'
        className='border-border/50 bg-background/50 transition-all focus:border-accent'
        errorMessage={fieldErrors?.subject}
      />

      <Textarea
        name='message'
        label='Message'
        placeholder='Tell me about your project, collaboration idea, or question…'
        rows={6}
        required
        className={cn(
          'min-h-[150px] resize-none border-border/50 bg-background/50 transition-all focus:border-accent',
        )}
        errorMessage={fieldErrors?.message}
      />

      {state.message && !state.ok && state.fieldErrors ? (
        <p className='text-sm text-error-600' role='alert'>
          Please fix the highlighted fields.
        </p>
      ) : null}

      {clientFieldErrors ? (
        <p className='text-sm text-error-600' role='alert'>
          Please fix the highlighted fields.
        </p>
      ) : null}

      {state.message && !state.ok && !state.fieldErrors ? (
        <p className='text-sm text-foreground-subtle' role='alert'>
          {state.message}{' '}
          <a
            href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
            className='font-medium text-accent underline-offset-2 hover:underline'
          >
            Email me directly
          </a>
          .
        </p>
      ) : null}

      <SubmitButton isPending={isPending} emailDeliveryEnabled={emailDeliveryEnabled} />
    </form>
  );
}
