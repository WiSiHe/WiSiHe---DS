'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FaDesktop, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../../providers';

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering icon once mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (!mounted) return <div className='w-4 h-4' />;

    // When in system mode, show the icon for what it *is* or what it *will be*?
    // Usually it's best to show current mode or system icon.
    if (theme === 'system') return <FaDesktop />;
    return theme === 'dark' ? <FaMoon /> : <FaSun />;
  };

  const getLabel = () => {
    if (theme === 'system') return `Theme: System (${resolvedTheme})`;
    return `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
  };

  const isDarkActive = mounted && resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <div className={cn('', 'cursor-default')} aria-hidden>
        <div className='h-5 w-5' />
      </div>
    );
  }

  return (
    <motion.button
      type='button'
      onClick={cycleTheme}
      data-state={isDarkActive ? 'dark' : 'light'}
      className={cn(
        'flex items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg transition-all duration-300',
        'p-4',
        'cursor-pointer hover:bg-surface-hover hover:text-accent hover:border-accent-border active:scale-95',
      )}
      whileTap={{ scale: 0.95 }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <div className='flex items-center justify-center w-5 h-5 overflow-hidden'>
        <motion.div
          key={mounted ? theme : 'unmounted'}
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
};

export default ThemeToggle;
