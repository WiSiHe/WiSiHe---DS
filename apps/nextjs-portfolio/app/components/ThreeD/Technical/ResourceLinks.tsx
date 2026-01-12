'use client';

import { motion, AnimatePresence } from 'motion/react';

interface Link {
  text: string;
  url: string;
}

interface ResourceLinksProps {
  links: Link[];
  shouldAnimate: boolean;
  currentSlide: number;
}

export function ResourceLinks({ links, shouldAnimate, currentSlide }: ResourceLinksProps) {
  const linksContent = (
    <div className={`${shouldAnimate ? 'mb-10' : 'mb-8'} ${shouldAnimate ? 'space-y-4' : 'space-y-3'}`}>
      <h3 className="text-lg font-bold text-foreground mb-3">Resources:</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link, linkIndex) => (
          <motion.a
            key={linkIndex}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-surface-elevated text-accent border border-accent/30 rounded-lg font-medium hover:bg-accent/10 hover:border-accent/50 transition-all flex items-center gap-2"
          >
            <span>{link.text}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        ))}
      </div>
    </div>
  );

  if (shouldAnimate) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`links-${currentSlide}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {linksContent}
        </motion.div>
      </AnimatePresence>
    );
  }

  return linksContent;
}
