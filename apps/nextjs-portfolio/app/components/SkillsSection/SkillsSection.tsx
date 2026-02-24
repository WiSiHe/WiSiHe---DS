'use client';

import { motion, type Variants } from 'motion/react';
import React, { useMemo } from 'react';
import Marquee from 'react-fast-marquee';
import Chip from '../Chip/Chip';

const professionalSkills = [
  'Frontend Development',
  'UI/UX Design',
  'Responsive Web Design',
  'Accessibility (WCAG Standards)',
  'React.js',
  'SvelteKit',
  'Next.js',
  'Tailwind CSS',
  'Sanity CMS Integration',
  'Performance Optimization',
  'Interactive Prototyping',
] as const;

const creativeSkills = [
  'Digital Drawing & Painting',
  '3D Modeling (Blender)',
  'Game Development (Unreal Engine 5)',
  'Video Editing & Production',
  'Interactive 3D Design (Spline)',
  'Concept Art & Illustration',
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
      stiffness: 150,
      damping: 20,
    },
  },
};

const SkillsSection = React.memo(function SkillsSection() {
  // Memoize chip arrays to prevent recreation on every render
  const professionalChips = useMemo(
    () =>
      professionalSkills.map(skill => (
        <Chip key={skill} label={skill} className='ml-2 pointer-events-none' interactive={false} />
      )),
    [],
  );

  const creativeChips = useMemo(
    () =>
      creativeSkills.map(skill => (
        <Chip key={skill} label={skill} className='ml-2 pointer-events-none' interactive={false} />
      )),
    [],
  );

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className='relative flex flex-col gap-8 py-20 text-foreground'
    >
      <motion.div variants={itemVariants} className='z-10 pointer-events-none px-4 md:px-8'>
        <h2 className='text-4xl md:text-5xl font-bold mb-3'>Skills</h2>
        <p className='text-lg text-foreground-subtle'>
          Here are some of the skills I have acquired over the years.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Marquee
          gradientColor='var(--color-surface)'
          autoFill
          gradient
          direction='left'
          speed={8}
          pauseOnHover={false}
        >
          {professionalChips}
        </Marquee>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Marquee
          gradientColor='var(--color-surface)'
          autoFill
          gradient
          direction='right'
          speed={8}
          pauseOnHover={false}
        >
          {creativeChips}
        </Marquee>
      </motion.div>
    </motion.section>
  );
});

export default SkillsSection;
