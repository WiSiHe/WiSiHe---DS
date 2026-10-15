import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import type { ReactNode } from 'react';
import { navItems } from '../../lib/design-system/constants';
import DesignSystemSidebar from './DesignSystemSidebar';

export function DesignSystemShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-contrast'>
      {/* Mobile Navigation (Floating Bottom) */}
      <div className='lg:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none'>
        <div className='bg-surface/80 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-full p-1.5 flex items-center gap-1 pointer-events-auto'>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300',
                  isActive
                    ? 'text-accent-contrast shadow-lg'
                    : 'text-foreground-subtle hover:text-foreground hover:bg-surface-hover',
                )}
                aria-label={item.name}
              >
                {isActive && <div className='absolute inset-0 bg-accent rounded-full z-0' />}
                <span className='relative z-10 text-lg'>{item.icon}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className='flex w-full max-w-6xl mx-auto px-4 py-8 pb-24 lg:pb-10 gap-8 lg:gap-10'>
        {/* Sidebar - Desktop Sticky */}
        <DesignSystemSidebar />

        {/* Primary content */}
        <div className='flex-1 min-w-0'>{children}</div>
      </div>
    </div>
  );
}

export default DesignSystemShell;
