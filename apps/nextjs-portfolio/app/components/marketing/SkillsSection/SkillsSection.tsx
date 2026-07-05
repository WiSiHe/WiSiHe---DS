'use client';

import { Chip } from '@wisihe/ui-react';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { type LogoItem, LogoLoop } from '@/app/components/effects/LogoLoop';
import ScrollGrowSection from '@/app/components/motion/ScrollGrowSection';
import {
  SECTION_REVEAL_VIEWPORT,
  skillsContainerVariants,
  skillsSpringItemVariants,
  useSectionReveal,
} from '@/lib/motion/sectionReveal';

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

function skillsToLogos(skills: readonly string[]): LogoItem[] {
  return skills.map(skill => ({
    node: <Chip label={skill} className='shrink-0' interactive={false} />,
    title: skill,
    ariaLabel: skill,
  }));
}

const SkillsSection = React.memo(function SkillsSection({
  eyebrow,
  title,
}: {
  eyebrow?: string | null;
  title?: string | null;
}) {
  const { reducedMotion } = useSectionReveal();
  const containerVariants = skillsContainerVariants(reducedMotion);
  const itemVariants = skillsSpringItemVariants(reducedMotion);

  const professionalLogos = useMemo(() => skillsToLogos(professionalSkills), []);
  const creativeLogos = useMemo(() => skillsToLogos(creativeSkills), []);

  const heading = title?.trim() || 'What I work with';
  const label = eyebrow?.trim() || '// Skills';

  return (
    <ScrollGrowSection className='relative overflow-hidden border-t border-border/20 py-20 text-foreground'>
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={SECTION_REVEAL_VIEWPORT}
        variants={containerVariants}
        className='flex flex-col gap-8'
      >
        <motion.div variants={itemVariants} className='z-10 pointer-events-none px-4 md:px-8'>
          <p className='font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs mb-3'>
            {label}
          </p>
          <h2 className='text-4xl md:text-5xl font-bold mb-3'>{heading}</h2>
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
      </motion.div>
    </ScrollGrowSection>
  );
});

export default SkillsSection;
