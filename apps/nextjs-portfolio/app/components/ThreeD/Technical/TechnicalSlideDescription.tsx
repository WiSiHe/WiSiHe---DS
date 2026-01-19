'use client';

import { motion } from 'motion/react';

interface TechnicalSlideDescriptionProps {
  description: string;
}

export function TechnicalSlideDescription({ description }: TechnicalSlideDescriptionProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-prose balance-text text-lg md:text-xl lg:text-2xl text-foreground/70 leading-relaxed mb-8 md:mb-10"
    >
      {description}
    </motion.p>
  );
}
