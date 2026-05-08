// src/routes/__root.tsx
/// <reference types="vite/client" />

import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { RootDocument } from '../components/layout/RootDocument';
import { pageVariants } from '../lib/motion';
import '../index.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { pathname } = useLocation();

  return (
    <RootDocument>
      <Header />
      <main id='main-content' className='min-h-screen'>
        {/* We use key={pathname} to trigger transitions on route change */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </RootDocument>
  );
}
