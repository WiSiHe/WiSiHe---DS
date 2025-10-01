'use client';
import { SettingsQueryResult } from '@/sanity.types';
import { SocialListItem } from './SocialListItem';
import { motion } from 'motion/react';
import Link from 'next/link';

type FooterProps = {
  socialLinks: NonNullable<SettingsQueryResult>['socialLinks'];
};

const Footer = ({ socialLinks }: FooterProps) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  const navigationLinks = [
    { name: 'Paintings', href: '/paintings' },
    { name: 'Projects', href: '/projects' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Videos', href: '/videos' },
    { name: 'Contact', href: '/contact' },
    { name: 'Interactive', href: '/interactive' },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t-2 bg-surface border-primary">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/50" />
      <div className="relative flex flex-col w-full max-w-screen-xl gap-12 px-4 py-16 mx-auto text-text-primary sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold sm:text-3xl">
              My name is{' '}
              <span className="text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text animate-gradient drop-shadow-sm">
                Henrik Wilhelm Sissener
              </span>
            </h3>
            <p className="max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              I&apos;m a <span className="font-medium text-primary">frontend developer</span>{' '}
              specializing in React and Svelte. In my free time, I enjoy{' '}
              <span className="font-medium text-accent">drawing</span> and dabbling in{' '}
              <span className="font-medium text-accent">game development</span>.
            </p>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text sm:text-3xl drop-shadow-sm">
              Explore
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="inline-block text-lg font-medium text-text-primary transition-all duration-300 hover:text-primary hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text sm:text-3xl drop-shadow-sm">
              Connect
            </h3>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {socialLinks.map((link, index) => (
                <motion.li
                  key={link._key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <SocialListItem item={link} />
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 mt-4 text-center border-t border-border"
        >
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} All Rights Reserved • Crafted with ❤️ in Oslo
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
