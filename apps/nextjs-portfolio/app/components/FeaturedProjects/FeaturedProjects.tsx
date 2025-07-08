"use client";

import { HomePageQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import Link from "next/link";
import { motion, Variants } from "motion/react";
import TiltedCard from "../TiltedCard/TiltedCard";

type FeaturedProjectsProps = {
  showcaseProjects?:
    | NonNullable<HomePageQueryResult>["showcaseProjects"]
    | null;
};

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

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
    <div className="max-w-screen-xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto mb-12 text-center text-dark max-w-prose"
      >
        <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold">
          Featured Projects
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-dark/80">
          Here are some of the projects I have worked on. Click on the project
          to view more details.
        </motion.p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative"
      >
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {showcaseProjects.map((project) => (
            <motion.div
              key={project._id}
              variants={itemVariants}
              className="w-full hover:z-10 hover:drop-shadow-2xl"
            >
              <Link href={`projects/${project.slug}`} className="block group">
                <TiltedCard
                  altText={project.seo.title}
                  captionText={project.seo.title}
                  containerHeight="400px"
                  containerWidth="100%"
                  imageHeight="400px"
                  imageWidth="100%"
                  rotateAmplitude={10}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  blurDataURL={project.image?.lqip || ""}
                  imageSrc={
                    urlForImage(project.image)
                      ?.height(800)
                      .width(800)
                      .auto("format")
                      .url() || ""
                  }
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeaturedProjects;
