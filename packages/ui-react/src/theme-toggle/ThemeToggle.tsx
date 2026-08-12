'use client';

import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ThemeToggleProps = {
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  onCycle: () => void;
  className?: string;
};

const themeIconClass = 'size-5 stroke-[2]';

export function ThemeToggle({ theme, resolvedTheme, onCycle, className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = () => {
    if (!mounted) return <div className='h-4 w-4' />;
    if (theme === 'system') {
      return <IconDeviceDesktop className={themeIconClass} aria-hidden />;
    }
    return theme === 'dark' ? (
      <IconMoon className={themeIconClass} aria-hidden />
    ) : (
      <IconSun className={themeIconClass} aria-hidden />
    );
  };

  const getLabel = () => {
    if (theme === 'system') return `Theme: System (${resolvedTheme})`;
    return `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
  };

  const isDarkActive = mounted && resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <div className={cn('cursor-default', className)} aria-hidden>
        <div className='h-5 w-5' />
      </div>
    );
  }

  return (
    <motion.button
      type='button'
      onClick={onCycle}
      data-state={isDarkActive ? 'dark' : 'light'}
      className={cn(
        'flex items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg transition-all duration-300',
        'p-4',
        'cursor-pointer hover:bg-surface-hover hover:text-accent hover:border-accent-border active:scale-95',
        className,
      )}
      whileTap={{ scale: 0.95 }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <div className='flex h-5 w-5 items-center justify-center overflow-hidden'>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='text-lg'
        >
          {getIcon()}
        </motion.div>
      </div>
    </motion.button>
  );
}
