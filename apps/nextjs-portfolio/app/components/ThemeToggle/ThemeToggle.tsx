'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';
import { useTheme } from '../../providers';

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <FaDesktop />;
    }
    return theme === 'dark' ? <FaSun /> : <FaMoon />;
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme === 'dark' ? 'Light mode' : 'Dark mode';
  };

  const isNeonActive = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-3 md:p-2 rounded-full header-glass">
        <div className="w-4 h-4" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      data-state={isNeonActive ? 'on' : 'off'}
      className="flex items-center justify-center cursor-pointer p-4 rounded-full header-glass neon-interactive text-foreground hover:bg-surface-hover hover:text-accent hover:border-accent-border active:scale-95 shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <motion.div
        key={(theme ?? 'system') + resolvedTheme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="text-xs"
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
