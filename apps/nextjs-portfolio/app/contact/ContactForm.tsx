'use client';

import { Button, Input, Textarea } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { CONTACT_DISPLAY_EMAIL } from '@/lib/contact/config';
import { type ContactFormState, submitContactForm } from './actions';

const initialState: ContactFormState = { ok: false };

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        type='submit'
        isLoading={isPending}
        disabled={isPending}
        className='h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-contrast shadow-lg transition-all hover:shadow-accent/40'
      >
        Send message
      </Button>
    </motion.div>
  );
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

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

  return (
    <form ref={formRef} action={formAction} className='relative z-10 space-y-6' noValidate>
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
          errorMessage={state.fieldErrors?.name}
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
          errorMessage={state.fieldErrors?.email}
        />
      </div>

      <Input
        name='subject'
        label='Subject'
        placeholder='How can I help?'
        required
        inputSize='lg'
        className='border-border/50 bg-background/50 transition-all focus:border-accent'
        errorMessage={state.fieldErrors?.subject}
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
        errorMessage={state.fieldErrors?.message}
      />

      {state.message && !state.ok && state.fieldErrors ? (
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

      <SubmitButton isPending={isPending} />
    </form>
  );
}
