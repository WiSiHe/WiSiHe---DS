'use client';

import { IconBrush, IconCamera, IconDeviceTv, IconFolder, IconUser } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { navigationItems } from '@wisihe/constants';
import { type DockLinkComponentProps, IconLogoBrand, ThemeToggle } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { JSX } from 'react';
import { lazy, Suspense } from 'react';
import { getResolvedTheme, useThemeStore } from '@/lib/store';

const LazyDock = lazy(() => import('@wisihe/ui-react').then(m => ({ default: m.Dock })));

const NAV_ICONS: Record<string, JSX.Element> = {
  Paintings: <IconBrush className='size-5' stroke={2} aria-hidden />,
  Projects: <IconFolder className='size-5' stroke={2} aria-hidden />,
  Videos: <IconDeviceTv className='size-5' stroke={2} aria-hidden />,
  Photography: <IconCamera className='size-5' stroke={2} aria-hidden />,
  About: <IconUser className='size-5' stroke={2} aria-hidden />,
};

function DockLink({ href, className, children, ...props }: DockLinkComponentProps) {
  return (
    <Link to={href as '/'} className={className} {...props}>
      {children}
    </Link>
  );
}

function HeaderThemeToggle() {
  const { theme, cycleTheme } = useThemeStore();
  const resolvedTheme = getResolvedTheme(theme);

  return <ThemeToggle theme={theme} resolvedTheme={resolvedTheme} onCycle={cycleTheme} />;
}

export function Header() {
  const { pathname: pathName } = useLocation();
  const hideBottomNav =
    pathName.startsWith('/design-system') ||
    pathName === '/three-d' ||
    pathName.startsWith('/three-d/') ||
    (pathName.startsWith('/presentations/') && pathName !== '/presentations');

  const dockItems = navigationItems.map(item => {
    const isActive =
      pathName === item.href || (item.href !== '/' && pathName.startsWith(item.href));

    return {
      href: item.href,
      label: item.label,
      icon: NAV_ICONS[item.label] ?? null,
      isActive,
      ariaLabel: `Navigate to ${item.label}`,
    };
  });

  return (
    <header className='pointer-events-none print:hidden'>
      <div className='pointer-events-auto fixed top-4 left-4 z-60'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          <Link
            to='/'
            aria-label='Navigate to the homepage'
            className={cn(
              'group relative flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 shadow-lg',
              'transition-[border-color,background-color,box-shadow] duration-200',
              'hover:border-accent-border hover:bg-surface-hover hover:shadow-xl',
            )}
          >
            <IconLogoBrand
              className='h-9 w-9 transition-colors duration-300 group-hover:text-accent md:h-12 md:w-12'
              size='100%'
            />
          </Link>
        </motion.div>
      </div>

      <div className='pointer-events-auto fixed top-4 right-4 z-40'>
        <HeaderThemeToggle />
      </div>

      {!hideBottomNav ? (
        <nav
          aria-label='Main navigation'
          className='pointer-events-auto fixed right-0 bottom-0 left-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4'
        >
          <Suspense fallback={null}>
            <LazyDock items={dockItems} linkComponent={DockLink} aria-label='Main navigation' />
          </Suspense>
        </nav>
      ) : null}
    </header>
  );
}
