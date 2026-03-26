// src/routes/__root.tsx
/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useLocation,
} from '@tanstack/react-router';
import { navigationItems } from '@wisihe/constants';
import { Flex } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { FaBrush, FaCube, FaFolder, FaMailBulk, FaTv, FaUser } from 'react-icons/fa';
import IconLogo from '../components/icons/IconLogo';
import '../index.css';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      type: 'spring',
    },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 },
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Henrik Sissener | Portfolio' },
      {
        name: 'description',
        content: 'Personal portfolio of Henrik Sissener, built with TanStack Start.',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Header />
      <main id='main-content'>
        <Outlet />
      </main>
      <Footer />
    </RootDocument>
  );
}

function Header() {
  const { pathname: pathName } = useLocation();

  return (
    <header className='fixed top-4 left-4 right-4 z-50 pointer-events-none'>
      <nav className='flex items-start justify-between max-w-7xl mx-auto w-full'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
            variants={container}
            initial='hidden'
            animate='show'
            className='flex items-center bg-surface/80 backdrop-blur-md border border-border rounded-full shadow-lg overflow-hidden'
          >
            {navigationItems.map(item => {
              const isActive =
                pathName === item.href || (item.href !== '/' && pathName.startsWith(item.href));
              const { href, label } = item;

              const navIcon = {
                Paintings: <FaBrush />,
                Projects: <FaFolder />,
                Videos: <FaTv />,
                '3D': <FaCube />,
                About: <FaUser />,
                Contact: <FaMailBulk />,
              }[label] || <FaFolder />;

              return (
                <motion.li key={href} variants={listItem}>
                  <Link
                    to={href as any}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm md:text-base transition-all hover:text-accent',
                      isActive ? 'bg-accent text-accent-contrast' : 'text-foreground/70',
                    )}
                  >
                    <span>{navIcon}</span>
                    <strong className='hidden md:block font-medium'>{label}</strong>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const navigationLinks = [
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className='relative w-full border-t border-border bg-surface mt-20'>
      <div className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12'>
        <div className='space-y-6'>
          <h3 className='text-2xl font-bold'>
            Henrik <span className='text-accent'>Sissener</span>
          </h3>
          <p className='max-w-xs text-foreground/60 leading-relaxed'>
            Frontend developer specializing in React and Svelte. Passionate about building
            beautiful, functional digital experiences.
          </p>
        </div>

        <div className='space-y-6'>
          <h4 className='text-xl font-bold text-accent'>Explore</h4>
          <ul className='space-y-3'>
            {navigationLinks.map(link => (
              <li key={link.name}>
                <Link
                  to={link.href as any}
                  className='text-foreground/70 hover:text-accent transition-colors'
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='space-y-6'>
          <h4 className='text-xl font-bold text-accent'>Connect</h4>
          <Flex gap={16}>
            <a
              href='https://github.com/wisihe'
              target='_blank'
              rel='noreferrer'
              className='text-foreground/70 hover:text-accent font-medium'
            >
              GitHub
            </a>
            <a
              href='https://linkedin.com/in/henrik-wilhelm-sissener'
              target='_blank'
              rel='noreferrer'
              className='text-foreground/70 hover:text-accent font-medium'
            >
              LinkedIn
            </a>
          </Flex>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8 border-t border-border/20 text-center'>
        <p className='text-sm text-foreground/40'>
          © {new Date().getFullYear()} Henrik Sissener • Built with TanStack Start
        </p>
      </div>
    </footer>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en' className='dark scroll-smooth'>
      <head>
        <HeadContent />
      </head>
      <body className='antialiased'>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
