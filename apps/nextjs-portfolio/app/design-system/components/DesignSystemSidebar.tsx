'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '../constants';

export default function DesignSystemSidebar() {
  const pathname = usePathname();

  return (
    <aside className='hidden lg:flex flex-col w-64 sticky top-32 h-fit max-h-[calc(100vh-8rem)] pr-8 overflow-y-auto custom-scrollbar'>
      <div className='mb-6 px-4'>
        <h2 className='font-serif font-black text-lg tracking-tight text-foreground/80'>
          Design<span className='text-accent'>System</span>
        </h2>
        <p className='text-[10px] font-mono text-foreground-muted mt-1 opacity-60'>
          @wisihe/tokens v1.1.0
        </p>
      </div>

      <nav className='space-y-1'>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 group overflow-hidden',
                isActive
                  ? 'text-accent-contrast font-bold shadow-md'
                  : 'text-foreground-subtle hover:text-foreground hover:bg-surface-hover/50',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId='sidebar-active-bg'
                  className='absolute inset-0 bg-accent z-0'
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <span
                className={cn(
                  'relative z-10 text-lg transition-transform duration-300 group-hover:scale-110',
                  isActive
                    ? 'text-accent-contrast'
                    : 'text-foreground-muted group-hover:text-accent',
                )}
              >
                {item.icon}
              </span>

              <span className='relative z-10 text-sm'>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
