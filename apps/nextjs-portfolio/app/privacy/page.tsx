import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CONTACT_DISPLAY_EMAIL } from '@/lib/contact/config';

const SITE_URL = 'https://www.wisihe.no';
const LAST_UPDATED = '12 June 2026';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How WiSiHe handles analytics, local storage, and contact form data — privacy-first, anonymous usage statistics only.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='space-y-3'>
      <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
      <div className='space-y-3 text-sm leading-relaxed text-foreground-subtle md:text-base'>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className='container mx-auto min-h-screen max-w-3xl px-4 pt-32 pb-20'>
      <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent'>
        Legal
      </p>
      <h1 className='mb-4 text-3xl font-black tracking-tight text-foreground md:text-4xl'>
        Privacy policy
      </h1>
      <p className='mb-10 text-sm text-foreground-muted'>Last updated: {LAST_UPDATED}</p>

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
            I use{' '}
            <a
              href='https://posthog.com/privacy'
              className='text-accent underline-offset-2 hover:underline'
              rel='noopener noreferrer'
              target='_blank'
            >
              PostHog
            </a>{' '}
            and{' '}
            <a
              href='https://vercel.com/legal/privacy-policy'
              className='text-accent underline-offset-2 hover:underline'
              rel='noopener noreferrer'
              target='_blank'
            >
              Vercel Analytics
            </a>{' '}
            to understand how pages are used (for example page views, navigation, and feature
            clicks). PostHog is configured in <strong>cookieless mode</strong>: it does not store
            analytics identifiers in cookies or browser storage on your device. Session recordings
            and user profiling are disabled.
          </p>
          <p>
            Vercel Analytics provides aggregate, privacy-oriented traffic metrics and does not use
            third-party advertising cookies.
          </p>
        </Section>

        <Section title='Local storage on your device'>
          <p>
            Some features store small amounts of data in your browser&apos;s{' '}
            <code className='rounded bg-surface px-1.5 py-0.5 text-xs'>localStorage</code> — for
            example whether you have liked a painting or project, or a one-time view counter so the
            same item is not counted repeatedly. This data stays on your device and is not used for
            advertising.
          </p>
          <p>
            Theme preference (light / dark / system) may be remembered so the site matches your
            choice on return visits.
          </p>
        </Section>

        <Section title='Contact form'>
          <p>
            If you use the{' '}
            <Link href='/contact' className='text-accent underline-offset-2 hover:underline'>
              contact form
            </Link>
            , I receive the name, email, subject, and message you submit so I can reply. Messages
            are sent by email to{' '}
            <a
              href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
              className='text-accent underline-offset-2 hover:underline'
            >
              {CONTACT_DISPLAY_EMAIL}
            </a>{' '}
            via a transactional email provider. I do not add you to marketing lists unless you ask.
          </p>
        </Section>

        <Section title='Your rights'>
          <p>
            Under GDPR and Norwegian privacy law you may request access, correction, or deletion of
            personal data I hold about you (for example a contact form message). Email{' '}
            <a
              href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
              className='text-accent underline-offset-2 hover:underline'
            >
              {CONTACT_DISPLAY_EMAIL}
            </a>{' '}
            and I will respond within a reasonable time.
          </p>
        </Section>

        <Section title='Changes'>
          <p>
            This policy may be updated occasionally. Material changes will be reflected on this page
            with a new &quot;Last updated&quot; date.
          </p>
        </Section>

        <Section title='Contact'>
          <p>
            Questions about privacy?{' '}
            <Link href='/contact' className='text-accent underline-offset-2 hover:underline'>
              Get in touch
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
