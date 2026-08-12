'use client';

import { IconBrush, IconCamera, IconDeviceTv, IconFolder, IconUser } from '@tabler/icons-react';
import { navigationItems } from '@wisihe/constants';
import {
  type DockLinkComponentProps,
  IconLogoBrand,
  type ThemePreference,
  ThemeToggle,
} from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { useTheme } from '../../../providers';
import { Link } from '../ProgressLink';

const LazyDock = dynamic(() => import('@wisihe/ui-react').then(m => ({ default: m.Dock })), {
  ssr: false,
});

const NAV_ICONS: Record<string, JSX.Element> = {
  Paintings: <IconBrush className='size-5' stroke={2} aria-hidden />,
  Projects: <IconFolder className='size-5' stroke={2} aria-hidden />,
  Videos: <IconDeviceTv className='size-5' stroke={2} aria-hidden />,
  Photography: <IconCamera className='size-5' stroke={2} aria-hidden />,
  About: <IconUser className='size-5' stroke={2} aria-hidden />,
};

function DockLink({ href, className, children, ...props }: DockLinkComponentProps) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

function HeaderThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <ThemeToggle
      theme={theme as ThemePreference}
      resolvedTheme={resolvedTheme as 'light' | 'dark'}
      onCycle={cycleTheme}
    />
  );
}

interface NavigationProps {
  isAbsolute?: boolean;
}

const Navigation = ({ isAbsolute: _isAbsolute = true }: NavigationProps): JSX.Element => {
  const pathName = usePathname();
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
    <header className='pointer-events-none recipe-screen-only print:hidden'>
      <div className='fixed top-4 left-4 z-60 pointer-events-auto'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          <Link
            href='/'
            aria-label='Navigate to the homepage'
            className={cn(
              'group relative flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 shadow-lg',
              'transition-[border-color,background-color,box-shadow] duration-200',
              'hover:border-accent-border hover:bg-surface-hover hover:shadow-xl',
            )}
          >
            <IconLogoBrand
              className={cn(
                'h-9 w-9 transition-colors duration-300 group-hover:text-accent md:h-12 md:w-12',
              )}
              size='100%'
            />
          </Link>
        </motion.div>
      </div>

      <div className='fixed top-4 right-4 z-40 pointer-events-auto'>
        <HeaderThemeToggle />
      </div>

      {!hideBottomNav ? (
        <nav
          aria-label='Main navigation'
          className='pointer-events-auto fixed bottom-0 left-0 right-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4'
        >
          <LazyDock items={dockItems} linkComponent={DockLink} aria-label='Main navigation' />
        </nav>
      ) : null}
    </header>
  );
};

export default Navigation;
