'use client';

import { motion } from 'motion/react';
import { HiArrowPath, HiSquares2X2 } from 'react-icons/hi2';

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
          <HiArrowPath className="text-accent w-5 h-5" />
          Auto-Rotate
        </h3>
        <motion.button
          onClick={() => onAutoRotateChange(!autoRotate)}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            autoRotate
              ? 'bg-accent text-accent-contrast shadow-lg shadow-accent/50'
              : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
          {autoRotate && <HiArrowPath className="animate-spin w-4 h-4" />}
        </motion.button>
      </div>

      {/* Swap Texture Control */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <HiSquares2X2 className="text-accent w-5 h-5" />
          Swap Texture
        </h3>
        <div className="flex flex-wrap gap-2 md:gap-2">
          {textureOptions.map((texture) => (
            <motion.button
              key={texture.value}
              onClick={() => onTextureChange(texture.value)}
              type="button"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-semibold text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                showcaseTexture === texture.value
                  ? 'bg-accent text-accent-contrast shadow-lg shadow-accent/50'
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
