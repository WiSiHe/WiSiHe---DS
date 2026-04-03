'use client';

import { motion } from 'motion/react';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';

interface Link {
  text: string;
  url: string;
}

interface ResourceLinksProps {
  links: Link[];
  shouldAnimate?: boolean;
  currentSlide: number;
}

export function ResourceLinks({ links, shouldAnimate: _shouldAnimate, currentSlide: _currentSlide }: ResourceLinksProps) {
  const linksContent = (
    <div className='mb-8 space-y-3'>
      <h3 className='text-lg font-bold text-foreground mb-3'>Resources:</h3>
      <div className='flex flex-wrap gap-3'>
        {links.map((link, linkIndex) => (
          <motion.a
            key={linkIndex}
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-4 py-2 bg-surface-elevated text-accent-text border border-accent/30 rounded-lg font-medium hover:bg-accent-subtle hover:border-accent-border transition-all flex items-center gap-2'
          >
            <span>{link.text}</span>
            <HiArrowTopRightOnSquare className='w-4 h-4' />
          </motion.a>
        ))}
      </div>
    </div>
  );

  return linksContent;
}
