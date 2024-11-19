'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import IconLogo from '../icons/IconLogo';

const NAV_ITEMS = [
  {
    name: 'Paintings',
    href: '/paintings',
  },
  {
    name: 'Videos',
    href: '/videos',
  },
  {
    name: 'Projects',
    href: '/projects',
  },
];

const HeaderNavigation = () => {
  const pathname = usePathname();

  const navItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex items-center justify-between w-full p-4 bg-white shadow-md"
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Link href="/">
          <IconLogo />
        </Link>
      </motion.div>

      {/* Navigation Section */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        <ul className="flex space-x-6">
          {NAV_ITEMS.map((item, i) => (
            <motion.li
              key={i}
              variants={navItemVariants}
              className={`list-none ${
                pathname === item.href
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-700 hover:text-blue-500'
              }`}
            >
              <Link href={item.href} className="transition-colors">
                {item.name}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </motion.header>
  );
};

export default HeaderNavigation;
