'use client';

import { motion } from 'motion/react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SocialListItem } from '@/app/components/layout/Footer/SocialListItem';
import { CONTACT_DISPLAY_EMAIL, CONTACT_LOCATION } from '@/lib/contact/config';
import ContactForm from './ContactForm';

type SocialLink = {
  _key: string;
  platform?: string | null;
  url?: string | null;
};

type ContactPageClientProps = {
  socialLinks: SocialLink[];
};

export default function ContactPageClient({ socialLinks }: ContactPageClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className='container mx-auto min-h-screen px-4 pt-32 pb-20'
    >
      <div className='grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-20'>
        <div className='max-w-xl'>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className='mb-6 text-4xl font-black uppercase leading-tight tracking-tighter md:text-6xl'
          >
            Get in <span className='text-accent italic'>touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className='mb-10 text-lg leading-relaxed text-foreground-subtle text-pretty md:text-xl'
          >
            Have a project in mind, want to license artwork, or just want to say hello? Send a
            message below — or reach me on email and social media.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className='space-y-8'
          >
            <div className='group flex items-center gap-5'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-contrast'>
                <FaEnvelope className='text-xl' aria-hidden />
              </div>
              <div>
                <p className='text-xs font-bold uppercase tracking-widest text-foreground-muted'>
                  Email
                </p>
                <a
                  href={`mailto:${CONTACT_DISPLAY_EMAIL}`}
                  className='text-lg font-medium transition-colors hover:text-accent md:text-xl'
                >
                  {CONTACT_DISPLAY_EMAIL}
                </a>
              </div>
            </div>

            <div className='group flex items-center gap-5'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-contrast'>
                <FaMapMarkerAlt className='text-xl' aria-hidden />
              </div>
              <div>
                <p className='text-xs font-bold uppercase tracking-widest text-foreground-muted'>
                  Location
                </p>
                <p className='text-lg font-medium md:text-xl'>{CONTACT_LOCATION}</p>
              </div>
            </div>
          </motion.div>

          {socialLinks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
              className='mt-14'
            >
              <p className='mb-5 text-xs font-bold uppercase tracking-widest text-foreground-muted'>
                Social media
              </p>
              <div className='flex flex-wrap gap-3'>
                {socialLinks.map(item => (
                  <SocialListItem key={item._key} item={item} variant='icon' />
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className='relative overflow-hidden rounded-[2rem] border border-border/50 bg-surface p-8 shadow-2xl md:p-10 lg:rounded-[2.5rem]'
        >
          <div
            className='pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/5 blur-[100px]'
            aria-hidden
          />
          <h2 className='relative z-10 mb-6 text-xl font-semibold text-foreground'>
            Send a message
          </h2>
          <ContactForm />
        </motion.div>
      </div>
    </motion.div>
  );
}
