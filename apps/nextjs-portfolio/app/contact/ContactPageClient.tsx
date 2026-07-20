'use client';

import { IconMail, IconMapPin } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { SocialListItem } from '@/app/components/layout/Footer/SocialListItem';
import { CONTACT_DISPLAY_EMAIL, CONTACT_LOCATION } from '@/lib/contact/config';

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
      className='container mx-auto min-h-screen max-w-2xl px-4 pt-32 pb-20'
    >
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
        Have a project in mind, want to license artwork, or just want to say hello? Email me or DM
        on social.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className='space-y-8'
      >
        <div className='group flex items-center gap-5'>
          <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-contrast'>
            <IconMail className='size-5' stroke={2} aria-hidden />
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
            <IconMapPin className='size-5' stroke={2} aria-hidden />
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
          <div className='flex flex-col gap-3 sm:max-w-sm'>
            {socialLinks.map(item => (
              <SocialListItem key={item._key} item={item} variant='card' />
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
