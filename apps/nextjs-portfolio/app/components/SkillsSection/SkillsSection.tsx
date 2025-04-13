'use client';

import { motion } from 'motion/react';
import Marquee from 'react-fast-marquee';
import Chip from '../Chip/Chip';

type SkillsSectionProps = {
  professionalSkills: string[];
  creativeSkills: string[];
};

const SkillsSection = ({
  professionalSkills,
  creativeSkills,
}: SkillsSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
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
      className="relative flex flex-col gap-4 py-20 text-white"
    >
      <motion.div
        variants={itemVariants}
        className="z-10 px-4 pointer-events-none lg:px-10"
      >
        <h2 className="text-4xl font-bold">Skills</h2>
        <p>Here are some of the skills I have acquired over the years.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Marquee
          gradientColor="#2B061E"
          autoFill
          gradient
          direction="left"
          speed={10}
        >
          {professionalSkills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              className="ml-2 pointer-events-none"
            />
          ))}
        </Marquee>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Marquee
          gradientColor="#2B061E"
          autoFill
          gradient
          direction="right"
          speed={10}
        >
          {creativeSkills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              className="ml-2 pointer-events-none"
            />
          ))}
        </Marquee>
      </motion.div>
    </motion.section>
  );
};

export default SkillsSection;
