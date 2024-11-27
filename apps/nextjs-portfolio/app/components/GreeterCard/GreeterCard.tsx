import { delay, motion } from 'framer-motion';
import { BiGame } from 'react-icons/bi';
import { BsFillBrushFill } from 'react-icons/bs';
import { HiOutlineDesktopComputer } from 'react-icons/hi';
import type { JSX } from 'react';

const listVariants = {
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

const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const iconVariants = {
  initial: {
    scale: 0.8,
  },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
    },
  },
};

const GreeterCard = (): JSX.Element => {
  const roles = [
    { icon: HiOutlineDesktopComputer, label: 'Senior Front-end developer' },
    { icon: BsFillBrushFill, label: 'Digital artist' },
    { icon: BiGame, label: 'Game developer' },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="relative flex flex-col justify-center h-full gap-4 p-4 lg:p-10 rounded-xl backdrop-blur bg-white/40 overflow-clip drop-shadow-xl"
    >
      <div className="z-10 flex flex-col items-start h-full text-dark lg:justify-center lg:p-4">
        <h1 className="text-2xl xl:text-5xl">Henrik Wilhelm Sissener</h1>
        <motion.ul
          variants={listVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-2 mt-4 text-base xl:text-2xl"
        >
          {roles.map(({ icon: Icon, label }, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-center gap-2 p-1 group"
            >
              <motion.div
                variants={iconVariants}
                whileHover={{
                  scale: 1.15,
                  rotate: 360,
                  transition: { type: 'spring', delay: 0.2, duration: 0.5 },
                }}
                className="text-4xl"
              >
                <Icon />
              </motion.div>
              <span>{label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default GreeterCard;
