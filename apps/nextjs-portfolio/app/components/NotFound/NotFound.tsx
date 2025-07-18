'use client';
import Link from 'next/link';
import { motion, Variants } from 'motion/react';
import GridDistortion from '../GridDistortion/GridDistortion';

const randomImageArray = [
  '/images/bathtub.jpg',
  '/images/celestial.jpg',
  '/images/cloud.jpg',
  '/images/cute.jpg',
  '/images/space.jpg',
  '/images/winter.jpg',
  '/images/sunlight.jpg',
];

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
      className="relative grid w-full h-full grid-flow-col-dense bg-surface aspect-square xl:aspect-video overflow-clip"
    >
      <GridDistortion
        grid={10}
        mouse={0.1}
        strength={0.15}
        relaxation={0.9}
        imageSrc={randomImageArray[0]}
      />

      <motion.div
        variants={itemVariants}
        className="absolute inset-0 z-10 flex flex-col items-center bg-surface/40 backdrop-blur-3xl p-4 md:p-8 rounded mx-auto my-auto text-center text-text-primary h-fit w-fit"
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
