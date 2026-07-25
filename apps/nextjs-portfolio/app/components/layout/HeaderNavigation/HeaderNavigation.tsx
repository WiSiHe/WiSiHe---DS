'use client';

import { navigationItems } from '@wisihe/constants';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { FaBrush, FaFolder, FaTv, FaUser } from 'react-icons/fa';
import { Dock } from '@/app/components/ui/Dock';
import IconLogo from '../icons/IconLogo';
import { Link } from '../ProgressLink';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const NAV_ICONS: Record<string, JSX.Element> = {
  Paintings: <FaBrush />,
  Projects: <FaFolder />,
  Videos: <FaTv />,
  About: <FaUser />,
};

interface iNavigationProps {
  isAbsolute?: boolean;
}

const Navigation = ({ isAbsolute: _isAbsolute = true }: iNavigationProps): JSX.Element => {
  const pathName = usePathname();
  /** Immersive routes use their own chrome — hide dock to avoid overlap. */
  const hideBottomNav =
    pathName?.startsWith('/design-system') ||
    pathName === '/three-d' ||
    pathName?.startsWith('/three-d/') ||
    (pathName?.startsWith('/presentations/') && pathName !== '/presentations');

  const dockItems = navigationItems.map(item => {
    const isActive =
      pathName === item.href || (item.href !== '/' && pathName?.startsWith(item.href));

    return {
      href: item.href,
      label: item.label,
      icon: NAV_ICONS[item.label] ?? null,
      isActive,
      ariaLabel: `Navigate to ${item.label}`,
    };
  });

  return (
    <header className='pointer-events-none'>
      <div className='fixed top-4 left-4 z-[60]'>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className='pointer-events-auto'
        >
          <Link
            href='/'
            aria-label='Navigate to the homepage'
            className='group relative flex items-center justify-center p-2 rounded-lg bg-surface border border-border shadow-lg transition-all duration-200 hover:border-accent-border hover:bg-surface-hover'
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
        <nav
          aria-label='Main navigation'
          className='pointer-events-auto fixed bottom-0 left-0 right-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4'
        >
          <Dock items={dockItems} aria-label='Main navigation' />
        </nav>
      ) : null}
    </header>
  );
};

export default Navigation;
