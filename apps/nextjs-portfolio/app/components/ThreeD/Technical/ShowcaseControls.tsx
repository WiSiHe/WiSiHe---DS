'use client';

import { motion } from 'motion/react';

type TextureOption = {
  readonly name: string;
  readonly value: string;
};

interface ShowcaseControlsProps {
  autoRotate: boolean;
  onAutoRotateChange: (value: boolean) => void;
  showcaseTexture: string;
  onTextureChange: (value: string) => void;
  textureOptions: readonly TextureOption[];
}

export function ShowcaseControls({
  autoRotate,
  onAutoRotateChange,
  showcaseTexture,
  onTextureChange,
  textureOptions,
}: ShowcaseControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6 md:space-y-8 pb-4"
    >
      {/* Auto-Rotate Control */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Auto-Rotate
        </h3>
        <motion.button
          onClick={() => onAutoRotateChange(!autoRotate)}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] md:min-h-0 ${
            autoRotate
              ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/50'
              : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
          {autoRotate && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Swap Texture Control */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M21 9H3" />
          </svg>
          Swap Texture
        </h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {textureOptions.map((texture) => (
            <motion.button
              key={texture.value}
              onClick={() => onTextureChange(texture.value)}
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] md:min-h-0 ${
                showcaseTexture === texture.value
                  ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/50'
                  : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {texture.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
