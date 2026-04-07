'use client';

import { navigationItems } from '@wisihe/constants';
import { cn } from '@wisihe/utils';
import { motion, type Variants } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { FaBrush, FaCube, FaFolder, FaMailBulk, FaTv, FaUser } from 'react-icons/fa';
import IconLogo from '../icons/IconLogo';
import { Link } from '../ProgressLink';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

interface iNavigationProps {
  isAbsolute?: boolean;
}
const Navigation = ({ isAbsolute: _isAbsolute = true }: iNavigationProps): JSX.Element => {
  const pathName = usePathname();
  /** Design system routes use their own bottom nav on small screens — hide ours to avoid overlap. */
  const hideBottomNav = pathName?.startsWith('/design-system') ?? false;

  const navCluster = (
    <div className='flex items-stretch justify-center gap-1 sm:gap-2 pointer-events-auto'>
      <motion.ul
        key='nav'
        variants={container}
        initial='hidden'
        animate='show'
        className={cn(
          'p-2 gap-2',
          'flex text-foreground bg-surface border border-border rounded-full shadow-lg',
          'overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
        style={{ isolation: 'isolate' }}
      >
        {navigationItems.map(item => {
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
            <motion.li key={href} variants={listItem}>
              <Link
                href={href}
                aria-label={`Navigate to ${label}`}
                className={cn(
                  'px-4 py-2',
                  'transition-all gap-2 md:gap-2 flex items-center ease-in-out duration-300 text-sm md:text-base rounded-full border justify-center',
                  isActive
                    ? 'bg-accent text-accent-contrast border-accent-border'
                    : 'text-foreground-subtle bg-transparent border-transparent hover:bg-surface-hover hover:text-accent hover:border-border',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{navIcon}</span>
                <strong>{label}</strong>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );

  return (
    <header className='pointer-events-none'>
      <div className='fixed top-4 left-4 z-20'>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className='pointer-events-auto'
        >
          <Link
            href='/'
            aria-label='Navigate to the homepage'
            className='group relative flex items-center justify-center p-2 rounded-lg bg-surface border border-border shadow-lg transition-all duration-200 hover:border-accent-border hover:bg-surface-hover hover:scale-105'
          >
            <IconLogo
              color='currentColor'
              className={cn(
                'transition-all duration-300 text-foreground group-hover:text-accent w-12 h-12 md:w-20 md:h-20',
              )}
              size='100%'
            />
          </Link>
        </motion.div>
      </div>

      <div className='fixed top-4 right-4 z-40 pointer-events-auto'>
        <ThemeToggle />
      </div>

      {!hideBottomNav ? (
        <nav aria-label='Main Navigation' className='fixed bottom-4 left-0 right-0 z-40 px-4'>
          {navCluster}
        </nav>
      ) : null}
    </header>
  );
};

export default Navigation;
