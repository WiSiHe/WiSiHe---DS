import { createFileRoute, Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { buildHead } from '../lib/seo';
import { CONTACT_DISPLAY_EMAIL } from '../lib/site';

const LAST_UPDATED = '20 July 2026';

export const Route = createFileRoute('/privacy')({
  head: () =>
    buildHead({
      title: 'Privacy | WiSiHe',
      description:
        'How WiSiHe handles analytics and local storage — privacy-first, anonymous usage statistics only.',
      path: '/privacy',
    }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='space-y-3'>
      <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
      <div className='space-y-3 text-sm leading-relaxed text-foreground/70 md:text-base'>
        {children}
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className='container mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-20'>
      <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent'>
        Legal
      </p>
      <h1 className='mb-4 text-3xl font-black tracking-tight text-foreground md:text-4xl'>
        Privacy policy
      </h1>
      <p className='mb-10 text-sm text-foreground/50'>Last updated: {LAST_UPDATED}</p>

      <div className='space-y-10'>
        <Section title='Overview'>
          <p>
            This site is operated by Henrik Wilhelm Sissener (WiSiHe), based in Oslo, Norway. I
            collect as little data as possible. Analytics are anonymous and cookieless where
            possible. I do not sell personal data.
          </p>
        </Section>

        <Section title='Analytics'>
          <p>
            When analytics are enabled, I use PostHog and Vercel Analytics to understand how pages
            are used. PostHog is configured in cookieless mode where possible. Session recordings
            and user profiling are disabled.
          </p>
        </Section>

        <Section title='Local storage on your device'>
          <p>
            Some features store small amounts of data in your browser&apos;s localStorage — for
            example theme preference. This data stays on your device and is not used for
            advertising.
          </p>
        </Section>

        <Section title='Contact'>
          <p>
            This site does not collect messages through a form. To get in touch, email{' '}
            <a
              href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
              className='text-accent underline-offset-2 hover:underline'
            >
              {CONTACT_DISPLAY_EMAIL}
            </a>{' '}
            or reach out via the social profiles on the{' '}
            <Link to='/contact' className='text-accent underline-offset-2 hover:underline'>
              contact page
            </Link>
            .
          </p>
        </Section>

        <Section title='Your rights'>
          <p>
            Under GDPR and Norwegian privacy law you may request access, correction, or deletion of
            personal data I hold about you. Email{' '}
            <a
              href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
              className='text-accent underline-offset-2 hover:underline'
            >
              {CONTACT_DISPLAY_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title='Changes'>
          <p>
            This policy may be updated occasionally. Material changes will be reflected on this page
            with a new &quot;Last updated&quot; date.
          </p>
        </Section>
      </div>
    </div>
  );
}
