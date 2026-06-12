'use client';

import { Chip } from '@wisihe/ui-react';
import { motion, type Variants } from 'motion/react';
import React, { useMemo } from 'react';
import { type LogoItem, LogoLoop } from '../../ui/LogoLoop';

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

function skillsToLogos(skills: readonly string[]): LogoItem[] {
  return skills.map(skill => ({
    node: <Chip label={skill} className='shrink-0' interactive={false} />,
    title: skill,
    ariaLabel: skill,
  }));
}

const SkillsSection = React.memo(function SkillsSection() {
  const professionalLogos = useMemo(() => skillsToLogos(professionalSkills), []);
  const creativeLogos = useMemo(() => skillsToLogos(creativeSkills), []);

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className='relative flex flex-col gap-8 overflow-hidden py-20 text-foreground'
    >
      <motion.div variants={itemVariants} className='z-10 pointer-events-none px-4 md:px-8'>
        <h2 className='text-4xl md:text-5xl font-bold mb-3'>Skills</h2>
        <p className='text-lg text-foreground-subtle'>
          Here are some of the skills I have acquired over the years.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <LogoLoop
          logos={professionalLogos}
          direction='left'
          speed={90}
          gap={16}
          logoHeight={40}
          fadeOut
          fadeOutColor='var(--color-background)'
          pauseOnHover
          ariaLabel='Professional skills'
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <LogoLoop
          logos={creativeLogos}
          direction='right'
          speed={75}
          gap={16}
          logoHeight={40}
          fadeOut
          fadeOutColor='var(--color-background)'
          pauseOnHover
          ariaLabel='Creative skills'
        />
      </motion.div>
    </motion.section>
  );
});

export default SkillsSection;
