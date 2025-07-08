"use client";

import { motion, Variants } from "motion/react";
import Marquee from "react-fast-marquee";
import Chip from "../Chip/Chip";

const professionalSkills = [
  "Frontend Development",
  "UI/UX Design",
  "Responsive Web Design",
  "Accessibility (WCAG Standards)",
  "React.js",
  "SvelteKit",
  "Next.js",
  "Tailwind CSS",
  "Sanity CMS Integration",
  "Performance Optimization",
  "Interactive Prototyping",
];

const creativeSkills = [
  "Digital Drawing & Painting",
  "3D Modeling (Blender)",
  "Game Development (Unreal Engine 5)",
  "Video Editing & Production",
  "Interactive 3D Design (Spline)",
  "Concept Art & Illustration",
];

const SkillsSection = () => {
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
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
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
