'use client';

import { motion, Variants } from 'motion/react';
import { usePathname } from 'next/navigation';
import { type JSX } from 'react';
import { FaBrush, FaCube, FaFolder, FaMailBulk, FaTv, FaUser } from 'react-icons/fa';

import Link from '../ProgressLink';

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
          'z-[100] flex items-center justify-between',
          isAbsolute ? 'fixed top-4 left-4 right-4' : 'relative',
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            aria-label="Navigate to the homepage"
            className="group relative flex items-center justify-center p-2 rounded-lg bg-surface border border-border/30 shadow-lg hover:bg-surface-hover hover:border-accent/50 hover:shadow-xl transition-all"
          >
            <IconLogo
              color="currentColor"
              className={cn('transition-all duration-300 text-foreground group-hover:text-accent')}
              width={80}
              height={80}
            />
          </Link>
        </motion.div>

        <div className="flex items-center gap-1 md:gap-2">
          <motion.ul
            key="nav"
            variants={container}
            initial="hidden"
            animate="show"
            className="flex items-center bg-surface border border-border/30 shadow-xl p-1 overflow-clip rounded-full"
            style={{ isolation: 'isolate' }}
          >
            {navigationItems.map((item, i) => {
              const isActive = pathName?.includes(item.href);
              const { href, label } = item;

              const navIcon = {
                Paintings: <FaBrush />,
                Projects: <FaFolder />,
                Videos: <FaTv />,
                '3D': <FaCube />,
                About: <FaUser />,
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
                      'transition-all gap-1 md:gap-2 focus-visible:bg-accent-surface focus-visible:text-accent flex items-center ease-in-out duration-300 text-xs md:text-base rounded-full',
                      isActive
                        ? 'text-accent-contrast bg-accent border border-accent-border shadow-lg aspect-square justify-center p-2.5 md:px-4 md:py-2 md:aspect-auto'
                        : 'text-foreground hover:bg-surface-hover hover:text-accent px-3 py-2.5 md:px-4 md:py-2',
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
