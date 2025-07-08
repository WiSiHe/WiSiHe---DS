"use client";
import Link from "next/link";
import { motion, Variants } from "motion/react";
import GridDistortion from "../GridDistortion/GridDistortion";

const randomImageArray = [
  "/images/bathtub.jpg",
  "/images/celestial.jpg",
  "/images/cloud.jpg",
  "/images/cute.jpg",
  "/images/space.jpg",
  "/images/winter.jpg",
  "/images/sunlight.jpg",
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
      className="relative grid w-full h-full grid-flow-col-dense bg-tertiary aspect-square xl:aspect-video overflow-clip"
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
        className="absolute inset-0 z-10 flex flex-col items-center p-4 mx-auto my-auto text-center text-white pointer-events-none h-fit w-fit"
      >
        <motion.div variants={itemVariants} className="text-xs">
          <h2>
            <strong>Still not convinced?</strong>
          </h2>
          <div className="pb-4">Come on, just a little peak, I dare you!</div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex justify-center pt-4"
        >
          <Link
            href="/paintings"
            className="px-4 py-2 bg-white rounded-full pointer-events-auto text-dark hover:bg-white/90"
          >
            <strong>Paintings</strong>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default NotFoundSection;
