'use client';
import { SettingsQueryResult } from '@/sanity.types';
import { SocialListItem } from './SocialListItem';
import { motion } from 'motion/react';

type FooterProps = {
  socialLinks: NonNullable<SettingsQueryResult>['socialLinks'];
};

const Footer = ({ socialLinks }: FooterProps) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <footer className="relative w-full overflow-hidden border-t-2 bg-dark border-primary">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/50" />
      <div className="relative flex flex-col w-full max-w-screen-xl gap-12 px-4 py-16 mx-auto text-white sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text sm:text-3xl">
              About
            </h3>
            <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
              I&apos;m a passionate artist dedicated to creating unique and
              meaningful work. Feel free to explore my portfolio and reach out
              for collaborations.
            </p>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text sm:text-3xl">
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
          className="pt-8 mt-4 text-center border-t border-gray-700/50"
        >
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} All Rights Reserved • Crafted with ❤️
            in Oslo
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
