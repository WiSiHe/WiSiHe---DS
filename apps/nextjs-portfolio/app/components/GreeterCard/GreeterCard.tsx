import { motion, Variants } from "motion/react";
import type { JSX } from "react";
import { BiGame } from "react-icons/bi";
import { BsFillBrushFill } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";

const listVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Sequentially animate children
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const iconVariants: Variants = {
  initial: {
    scale: 0.8,
  },
  animate: {
    scale: 1,
    transition: {
      type: "spring",
    },
  },
};

const GreeterCard = (): JSX.Element => {
  const roles = [
    { icon: HiOutlineDesktopComputer, label: "Senior Front-end developer" },
    { icon: BsFillBrushFill, label: "Digital artist" },
    { icon: BiGame, label: "Game developer" },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="relative flex flex-col justify-center h-full gap-6 p-6 rounded-xl overflow-clip card-surface card-surface-elevated"
    >
      <div className="z-10 flex flex-col items-start h-full text-foreground lg:justify-center lg:p-6">
        <h1 className="text-3xl font-black tracking-tight xl:text-6xl">
          Henrik Wilhelm Sissener
        </h1>
        <motion.ul
          variants={listVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col w-full gap-2 text-lg xl:text-2xl"
        >
          {roles.map(({ icon: Icon, label }, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3 p-2 transition-colors rounded-lg group"
            >
              <motion.div
                variants={iconVariants}
                className="text-4xl transition-all duration-500 group-hover:rotate-360 group-hover:scale-110"
              >
                <Icon />
              </motion.div>
              <span className="font-medium">{label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default GreeterCard;
