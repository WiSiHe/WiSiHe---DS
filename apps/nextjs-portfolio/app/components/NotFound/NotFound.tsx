'use client';
import Link from 'next/link';
import { motion, Variants } from 'motion/react';

const NotFoundSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="relative flex items-center justify-center w-full min-h-screen bg-surface"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center bg-surface-elevated p-8 md:p-12 rounded-lg shadow-xl mx-4 text-center text-text-primary max-w-lg"
      >
        <motion.div variants={itemVariants} className="text-xs text-text-primary">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-lg mb-2">
            <strong>Page Not Found</strong>
          </h2>
          <div className="pb-4">
            The page you&apos;re looking for doesn&apos;t exist. But hey, while you&apos;re here...
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex justify-center">
          <Link
            href="/paintings"
            className="px-4 py-2 bg-surface-elevated rounded-full pointer-events-auto text-text-primary hover:bg-accent-light hover:text-on-primary"
          >
            <strong>Paintings</strong>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default NotFoundSection;
