'use client';

import { motion } from 'motion/react';
import { TechnicalSlideIndicators } from './TechnicalSlideIndicators';
import { CodeExampleWrapper } from './CodeExampleWrapper';
import { ResourceLinks } from './ResourceLinks';
import type { Slide } from '../../../three-d/types';
import type { ShowcaseControls, LightControls } from '../types';

interface TechnicalSlideContentProps {
  currentSlide: number;
  currentSlideData: Slide;
  previousSlideData: Slide | undefined;
  totalSlides: number;
  showcaseControls: ShowcaseControls;
  lightControls: LightControls;
  onSlideClick?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function TechnicalSlideContent({
  currentSlide,
  currentSlideData,
  previousSlideData,
  totalSlides,
  showcaseControls,
  lightControls,
  onSlideClick,
  onNext,
  onPrev,
}: Readonly<TechnicalSlideContentProps>) {
  const {
    texture: showcaseTexture,
    onTextureChange,
    textureOptions,
    autoRotate,
    onAutoRotateChange,
  } = showcaseControls;

  const {
    directionalLightPosition,
    onDirectionalLightPositionChange,
    directionalLightIntensity,
    onDirectionalLightIntensityChange,
  } = lightControls;

  return (
    <article className="h-full flex flex-col relative">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-16 md:pt-24 lg:pt-28 xl:pt-32 pb-6 md:pb-8 px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3 md:gap-4 lg:gap-6">
          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md shadow-sm shadow-accent/5 hover:shadow-md hover:shadow-accent/10 transition-all duration-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-sm shadow-accent/50"></span>
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Technical Deep Dive &middot; {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="p-3 md:p-2.5 lg:p-3 rounded-full bg-surface-elevated/50 hover:bg-surface-elevated border border-border/50 hover:border-accent/30 disabled:opacity-30 disabled:hover:bg-surface-elevated/50 disabled:hover:border-border/50 disabled:cursor-not-allowed transition-all duration-200 text-foreground hover:text-accent hover:shadow-md hover:shadow-accent/10 active:scale-95 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
              aria-label="Previous Slide"
              style={{ touchAction: 'manipulation' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <TechnicalSlideIndicators
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onSlideClick={onSlideClick}
            />

            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className="p-3 md:p-2.5 lg:p-3 rounded-full bg-surface-elevated/50 hover:bg-surface-elevated border border-border/50 hover:border-accent/30 disabled:opacity-30 disabled:hover:bg-surface-elevated/50 disabled:hover:border-border/50 disabled:cursor-not-allowed transition-all duration-200 text-foreground hover:text-accent hover:shadow-md hover:shadow-accent/10 active:scale-95 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
              aria-label="Next Slide"
              style={{ touchAction: 'manipulation' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mt-4 md:mt-6 lg:mt-8">
          {currentSlideData.title}
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-12 md:pb-16 lg:pb-20 px-4 md:px-6 lg:px-8">
        <div className="">
          <div className="space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 pt-6 md:pt-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-prose balance-text text-lg md:text-xl lg:text-2xl text-foreground/70 leading-relaxed mb-8 md:mb-10"
            >
              {currentSlideData.description}
            </motion.p>

            {/* Interactive Controls - Show before code example for showcase mode */}
            {currentSlideData.mode === 'showcase' && (
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
                    {textureOptions.map((texture: { name: string; value: string }) => (
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
            )}

            {/* Code Example - Break out of prose width */}
            {currentSlideData.code && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: currentSlideData.mode === 'showcase' ? 0.2 : 0.1,
                }}
                className="w-full -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 mt-6 md:mt-8 lg:mt-10 xl:mt-12"
              >
                <CodeExampleWrapper code={currentSlideData.code} currentSlide={currentSlide} />
              </motion.div>
            )}

            {/* Resource Links */}
            {currentSlideData.links && currentSlideData.links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-10 md:mt-12 lg:mt-16"
              >
                <ResourceLinks links={currentSlideData.links} currentSlide={currentSlide} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
