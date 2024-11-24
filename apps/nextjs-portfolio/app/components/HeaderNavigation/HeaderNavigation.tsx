'use client';

import { FaBrush, FaFolder, FaMailBulk, FaTv } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type JSX } from 'react';
import { FaHamburger } from 'react-icons/fa';

import { navigationItems } from '@wisihe/constants';
import { cn } from '@wisihe/utils';
import AnimatedLogo from '../AnimatedLogo/AnimatedLogo';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
      bounce: 0.05,
      type: 'spring',
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: -100 },
  show: { opacity: 1, y: 0 },
};

interface iNavigationProps {
  isAbsolute?: boolean;
}
const Navigation = ({ isAbsolute = true }: iNavigationProps): JSX.Element => {
  const pathName = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className={cn(
          'z-20 flex items-center justify-between py-2 px-4 bg-dark/40 backdrop-blur-md text-white',
          isAbsolute ? 'fixed top-0 left-0 right-0' : 'relative'
        )}
      >
        <AnimatedLogo theme="light" />
        <motion.button
          initial={{ opacity: 0, scale: 0, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            type: 'spring',
            bounce: 0.05,
            duration: 1,
          }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-4 transition-all duration-500 lg:hidden hover:bg-primary active:text-white hover:text-white active:bg-primary"
          aria-expanded={isOpen}
          aria-label="Open Navigation"
        >
          <FaHamburger />
        </motion.button>

        <motion.ul
          key="nav"
          variants={container}
          initial="hidden"
          animate="show"
          className="items-center hidden gap-1 xl:gap-4 lg:flex"
        >
          {navigationItems.map((item, i) => {
            const isActive = pathName?.includes(item.href);
            const { href, label } = item;

            const navIcon = {
              Paintings: <FaBrush />,
              Projects: <FaFolder />,
              Videos: <FaTv />,
              Contact: <FaMailBulk />,
            }[label];
            return (
              <motion.li key={i} variants={listItem}>
                <Link
                  href={href}
                  className={cn(
                    'transition-all gap-2 flex items-center text-white px-4 py-2 hover:bg-primary hover:text-white active:bg-primary',
                    isActive
                      ? 'underline decoration-primary text-white decoration-2 bg-primary'
                      : ' text-white'
                  )}
                >
                  {navIcon}
                  <strong className="drop-shadow">{label}</strong>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </>
  );
};

export default Navigation;
