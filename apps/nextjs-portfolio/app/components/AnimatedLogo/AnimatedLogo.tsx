'use client';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import IconLogo from '../icons/IconLogo';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className = '' }: AnimatedLogoProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key='logo'
        initial={{ opacity: 0, rotate: 0, scale: 0, x: -100 }}
        animate={{ opacity: 1, rotate: 360, scale: 1, x: 0 }}
        exit={{ opacity: 0, rotate: 0, scale: 0, x: -100 }}
        whileHover={{
          rotate: 90,
        }}
        transition={{ type: 'spring', delay: 0.5, duration: 1 }}
        className='flex items-center gap-2'
      >
        <Link
          href='/'
          aria-label='Navigate to the homepage'
          className='flex items-center justify-center p-1 text-sm drop-shadow-sm decoration-4'
        >
          <IconLogo
            className={cn('transition-all ease-in-out', className)}
            width='2.5rem'
            height='2.5rem'
          />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedLogo;
