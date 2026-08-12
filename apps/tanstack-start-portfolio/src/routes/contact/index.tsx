import { createFileRoute } from '@tanstack/react-router';
import { socialMediaLinks } from '@wisihe/constants';
import { Button } from '@wisihe/ui-react';
import { motion } from 'motion/react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { buildHead } from '../../lib/seo';
import { CONTACT_DISPLAY_EMAIL, CONTACT_LOCATION } from '../../lib/site';

export const Route = createFileRoute('/contact/')({
  head: () =>
    buildHead({
      title: 'Contact | WiSiHe',
      description: 'Get in touch with Henrik Sissener about projects, art, or collaboration.',
      path: '/contact',
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className='container mx-auto min-h-screen px-4 pt-32 pb-20'>
      <div className='grid grid-cols-1 items-start gap-16 lg:grid-cols-2'>
        <div className='max-w-xl'>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='mb-8 text-5xl font-black uppercase leading-tight tracking-tighter md:text-7xl'
          >
            Get in <span className='italic text-accent'>Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='mb-12 text-xl leading-relaxed text-pretty text-foreground/70'
          >
            Have a project in mind or just want to chat about art and technology? I&apos;m always
            open to new opportunities and creative collaborations.
          </motion.p>

          <div className='space-y-8'>
            <div className='group flex items-center gap-6'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-sm transition-all group-hover:bg-accent group-hover:text-accent-contrast'>
                <FaEnvelope className='text-xl' />
              </div>
              <div>
                <p className='text-sm font-bold uppercase tracking-widest text-foreground/40'>
                  Email
                </p>
                <a
                  href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
                  className='text-xl font-medium transition-colors hover:text-accent'
                >
                  {CONTACT_DISPLAY_EMAIL}
                </a>
              </div>
            </div>

            <div className='group flex items-center gap-6'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-sm transition-all group-hover:bg-accent group-hover:text-accent-contrast'>
                <FaMapMarkerAlt className='text-xl' />
              </div>
              <div>
                <p className='text-sm font-bold uppercase tracking-widest text-foreground/40'>
                  Location
                </p>
                <p className='text-xl font-medium'>{CONTACT_LOCATION}</p>
              </div>
            </div>
          </div>

          <div className='mt-12 flex flex-wrap gap-3'>
            {socialMediaLinks.map(link => (
              <a
                key={link.label}
                href={link.url}
                target='_blank'
                rel='noreferrer'
                className='rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent'
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-border bg-surface p-8 shadow-sm'>
          <h2 className='mb-4 text-2xl font-bold'>Send an email</h2>
          <p className='mb-8 text-foreground/60'>
            This site does not collect form submissions. Click below to open your mail client — that
            keeps your message between you and me.
          </p>
          <a href={`mailto:${CONTACT_DISPLAY_EMAIL}?subject=Hello%20from%20wisihe.no`}>
            <Button variant='primary' size='large'>
              Email {CONTACT_DISPLAY_EMAIL}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
