'use client';

import { motion, Variants } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type JSX } from 'react';
import { FaBrush, FaFolder, FaMailBulk, FaTv } from 'react-icons/fa';

import { navigationItems } from '@wisihe/constants';
import { cn } from '@wisihe/utils';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import IconLogo from '../icons/IconLogo';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
      bounce: 0.05,
      type: 'spring',
    },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: -100 },
  show: { opacity: 1, y: 0 },
};

interface iNavigationProps {
  isAbsolute?: boolean;
}
const Navigation = ({ isAbsolute = true }: iNavigationProps): JSX.Element => {
  const pathName = usePathname();

  return (
    <header className="">
      <nav
        aria-label="Main Navigation"
        className={cn(
          'z-30 flex items-center justify-between rounded-full',
          isAbsolute ? 'fixed top-4 left-4 right-4' : 'relative',
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          whileHover={{ scale: 1.05, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex items-center gap-2 backdrop-blur-lg bg-surface-elevated/40 p-2 rounded-full text-text-primary"
        >
          <Link
            href="/"
            aria-label="Navigate to the homepage"
            className="flex items-center justify-center p-1 text-sm drop-shadow-sm decoration-4"
          >
            <IconLogo className={cn('transition-all ease-in-out text-3xl text-text-primary')} />
          </Link>
        </motion.div>
        <motion.ul
          key="nav"
          variants={container}
          initial="hidden"
          animate="show"
          className="flex items-center backdrop-blur-lg shadow-xl p-1 overflow-clip bg-surface-elevated/40 rounded-full"
        >
          {navigationItems.map((item, i) => {
            const isActive = pathName?.includes(item.href);
            const { href, label } = item;

            const navIcon = {
              Paintings: <FaBrush />,
              Projects: <FaFolder />,
              Videos: <FaTv />,
              Contact: <FaMailBulk />,
            }[label];

            return (
              <motion.li
                key={i}
                variants={listItem}
                className="first:rounded-l-full first:rounded-r-sm last:rounded-r-full last:rounded-l-sm overflow-clip"
              >
                <Link
                  href={href}
                  className={cn(
                    'transition-all gap-1 md:gap-2 flex items-center ease-in-out duration-300 text-xs md:text-base px-4 md:px-4 py-2',
                    isActive
                      ? 'text-on-primary bg-accent hover:bg-accent-light'
                      : 'text-text-primary hover:bg-accent hover:text-on-primary',
                  )}
                >
                  <span className="hidden md:block text-lg">{navIcon}</span>
                  <strong className="">{label}</strong>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex items-center gap-2 backdrop-blur-lg bg-surface-elevated/40 p-2 rounded-full text-text-primary"
        >
          <ThemeToggle />
        </motion.div>
      </nav>
    </header>
  );
};

export default Navigation;
