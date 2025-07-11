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
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="flex items-center relative h-12 w-12 backdrop-blur-lg bg-surface-elevated overflow-clip rounded-full text-text-primary hover:bg-accent-light hover:text-on-primary"
        >
          <Link
            href="/"
            aria-label="Navigate to the homepage"
            className="flex items-center justify-center p-1 text-sm drop-shadow-sm rounded-full h-full w-full"
          >
            <IconLogo
              className={cn('transition-all ease-in-out absolute inset-0')}
              width={64}
              height={64}
            />
          </Link>
        </motion.div>
        <div className="flex items-center gap-2">
          <motion.ul
            key="nav"
            variants={container}
            initial="hidden"
            animate="show"
            className="flex items-center backdrop-blur-lg shadow-xl p-1 overflow-clip bg-surface-elevated rounded-full"
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
                    aria-label={`Navigate to ${label}`}
                    className={cn(
                      'transition-all gap-1 md:gap-2 focus-visible:bg-accent-light focus-visible:text-on-primary flex items-center ease-in-out duration-300 text-xs md:text-base px-6 md:py-2 md:px-4 py-3',
                      isActive
                        ? 'text-on-primary bg-accent hover:bg-accent-light'
                        : 'text-text-primary hover:bg-accent-light hover:text-on-primary',
                    )}
                  >
                    <span className="text-lg">{navIcon}</span>
                    <strong className="hidden md:block not-sr-only">{label}</strong>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
