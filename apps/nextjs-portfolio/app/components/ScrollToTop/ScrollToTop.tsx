'use client';
import useScrollPosition from '@/hooks/useScrollPosition';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { IoArrowUpSharp } from 'react-icons/io5';

type ScrollToTopButtonProps = {
  isFixed?: boolean;
};

const SCROLL_THRESHOLD = 200;

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 1,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 1,
    },
  },
};

const buttonClassNames = cn(
  'flex items-center justify-center text-foreground rounded-full p-4',
  'transition-all duration-200 ease-in-out',
  'bg-surface shadow-sm hover:bg-accent hover:text-on-primary',
  'ring-accent focus:outline-hidden focus-visible:ring-2',
  'focus-visible:bg-accent focus-visible:text-on-primary',
  'active:bg-accent-dark hover:ring-2',
);

const ScrollToTopButton = ({ isFixed = true }: ScrollToTopButtonProps) => {
  const scrollPosition = useScrollPosition();

  const isVisible = scrollPosition > SCROLL_THRESHOLD;

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={cn('shrink-0', isFixed && 'fixed bottom-8 right-8 z-10')}
        >
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            className={buttonClassNames}
            aria-label="Scroll to top"
          >
            <IoArrowUpSharp />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
