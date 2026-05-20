import { Link, useLocation } from '@tanstack/react-router';
import { navigationItems } from '@wisihe/constants';
import { cn } from '@wisihe/utils';
import { Box, Brush, Folder, Mail, Monitor, Moon, Sun, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useThemeStore } from '../../lib/store';
import { IconLogo } from '../icons/IconLogo';

const springJuicy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
  mass: 1.2,
};

const juiceVariants = {
  hover: { scale: 1.08, y: -2, transition: springJuicy },
  tap: { scale: 0.94, y: 1, transition: { ...springJuicy, stiffness: 600 } },
};

const navContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1, ...springJuicy },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: springJuicy },
};

export function Header() {
  const { pathname: pathName } = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className='fixed top-4 left-4 right-4 z-50 pointer-events-none'>
      <nav className='flex items-start justify-between max-w-7xl mx-auto w-full'>
        <motion.div
          variants={juiceVariants as any}
          initial={false}
          whileHover='hover'
          whileTap='tap'
          className='pointer-events-auto'
        >
          <Link
            to='/'
            className='group flex items-center justify-center p-2 rounded-xl bg-surface/80 backdrop-blur-md border border-border shadow-lg transition-all hover:border-accent hover:bg-surface'
          >
            <IconLogo className='w-10 h-10 md:w-12 md:h-12 text-foreground group-hover:text-accent transition-colors' />
          </Link>
        </motion.div>

        <div className='flex items-center gap-2 pointer-events-auto'>
          <motion.ul
            variants={navContainerVariants}
            initial='hidden'
            animate='show'
            className='flex items-center bg-surface/80 backdrop-blur-md border border-border rounded-full shadow-lg overflow-hidden px-2'
          >
            {navigationItems.map(item => {
              const isActive =
                pathName === item.href || (item.href !== '/' && pathName.startsWith(item.href));
              const { href, label } = item;

              return (
                <motion.li key={href} variants={navItemVariants}>
                  <Link
                    to={href as any}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm md:text-base transition-all hover:text-accent group',
                      isActive ? 'bg-accent text-accent-contrast' : 'text-foreground/70',
                    )}
                  >
                    <span className='w-4 h-4 transition-transform group-hover:rotate-12 flex items-center justify-center'>
                      {label === 'Paintings' && <Brush size={16} />}
                      {label === 'Projects' && <Folder size={16} />}
                      {label === 'Videos' && <Monitor size={16} />}
                      {label === '3D' && <Box size={16} />}
                      {label === 'About' && <User size={16} />}
                      {label === 'Contact' && <Mail size={16} />}
                    </span>
                    <strong className='hidden md:block font-medium'>{label}</strong>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.button
            onClick={toggleTheme}
            variants={juiceVariants as any}
            whileHover='hover'
            whileTap='tap'
            className='p-3 rounded-full bg-surface/80 backdrop-blur-md border border-border shadow-lg text-foreground hover:text-accent transition-colors'
            aria-label='Toggle theme'
          >
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className='flex items-center justify-center'
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
