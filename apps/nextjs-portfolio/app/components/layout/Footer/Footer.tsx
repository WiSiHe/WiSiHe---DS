'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { SocialListItem } from './SocialListItem';

type FooterProps = {
  socialLinks: { _key: string; platform?: string | null; url?: string | null }[] | null | undefined;
  /** Short bio from the About page Sanity document */
  bio?: string | null;
};

// Navigation links visible in the public footer
const NAVIGATION_LINKS = [
  { name: 'Paintings', href: '/paintings' },
  { name: 'Projects', href: '/projects' },
  { name: 'Videos', href: '/videos' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Design System', href: '/design-system' },
  { name: 'Presentations', href: '/three-d' },
];

const Footer = ({ socialLinks, bio }: FooterProps) => {
  if (!socialLinks || socialLinks.length === 0) return null;

  const currentYear = new Date().getFullYear();

  const displayBio =
    bio ||
    'Frontend developer and digital artist based in Oslo. I build fast, polished web experiences and create digital paintings — two disciplines that keep feeding each other.';

  return (
    <footer className='relative w-full overflow-hidden border-t bg-background border-border'>
      <div className='relative flex flex-col w-full max-w-7xl gap-12 px-4 py-16 mx-auto text-foreground sm:px-6 md:px-8 lg:px-12'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
          {/* Bio column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className='space-y-4'
          >
            <h3 className='text-2xl font-bold font-oswald sm:text-3xl'>
              My name is <span className='text-accent'>Henrik Wilhelm Sissener</span>
            </h3>
            <p className='max-w-lg leading-relaxed text-foreground-subtle font-inter'>
              {displayBio}
            </p>
          </motion.div>

          {/* Explore column */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className='space-y-5'
            aria-label='Site navigation'
          >
            <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
              Explore
            </h3>
            <ul className='space-y-2.5'>
              {NAVIGATION_LINKS.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className='text-base font-medium text-foreground-subtle transition-all duration-200 hover:text-foreground hover:translate-x-1 inline-block font-inter'
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          {/* Connect column */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='space-y-5'
            aria-label='Social links'
          >
            <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
              Connect
            </h3>
            <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {socialLinks.map((link, index) => (
                <motion.li
                  key={link._key}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  className='group'
                >
                  <SocialListItem item={link} />
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Dev-only navigation strip */}
        {process.env.NODE_ENV === 'development' && (
          <div className='pt-6 border-t border-dashed border-accent/20'>
            <div className='flex flex-col items-center gap-3'>
              <span className='text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-accent text-accent-contrast'>
                Dev Links
              </span>
              <nav className='flex flex-wrap justify-center gap-x-6 gap-y-2'>
                {[
                  { name: 'Design System', href: '/design-system' },
                  { name: 'Presentation', href: '/three-d' },
                  { name: 'Test', href: '/test' },
                  { name: 'Data', href: '/data' },
                ].map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className='text-xs text-foreground-muted hover:text-accent transition-colors'
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className='pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground-muted font-inter'>
          <span>© {currentYear} Henrik Wilhelm Sissener</span>
          <span>Built in Oslo with Next.js & Sanity</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
