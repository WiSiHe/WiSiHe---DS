'use client';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { BlurImage } from '../BlurImage/BlurImage';
import Chip from '../Chip/Chip';

type CardProps = {
  src: string;
  title: string;
  categories: { name: string }[];
  href: string;
};

export const Card = ({
  card,
  layout = false,
}: {
  card: CardProps;
  index: number;
  layout?: boolean;
}) => {
  const tagsVariants = {
    rest: { opacity: 0, y: -20 },
    hover: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const tagVariants = {
    rest: { opacity: 0, y: -20 },
    hover: { opacity: 1, y: 0 },
  };

  return (
    <motion.article
      layoutId={layout ? `card-${card.title}` : undefined}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="rounded-3xl group pointer-events-auto bg-surface h-[30rem] md:h-[40rem] w-96 shrink-0 overflow-clip flex flex-col items-start justify-start relative"
    >
      <BlurImage
        src={card.src}
        alt={card.title}
        fill
        className="absolute inset-0 object-cover"
        // Optimized responsive sizes for better performance
        sizes="(min-width: 768px) 384px, 224px"
        loading="lazy"
        quality={80}
      />
      <motion.div className="absolute text-accent-contrast bottom-4 right-4">
        <Link
          href={card.href}
          className="flex gap-1 px-3 py-1 transition-all duration-300 rounded-full group-hover:scale-110 bg-accent hover:bg-accent-hover"
        >
          View <IconArrowRight />
        </Link>
      </motion.div>
      <div className="absolute left-0 right-0 top-0 h-42 w-full pointer-events-none bg-linear-to-b from-black to-transparent" />
      <div className="relative w-full p-8">
        <motion.h3 className="max-w-xs font-sans text-xl font-black text-left md:text-3xl text-white text-balance">
          {card.title}
        </motion.h3>
        <motion.div variants={tagsVariants} className="flex z-10 flex-wrap gap-2 pt-2">
          {card.categories.map(category => (
            <motion.div
              variants={tagVariants}
              key={category.name}
              className="font-sans text-xs text-left text-accent-contrast group md:text-base"
            >
              <Chip label={category.name} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.article>
  );
};
