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
}: TechnicalSlideContentProps) {
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
    <article className="flex-1 lg:w-1/2 flex flex-col relative z-10">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-28 pb-4 px-8 md:pt-32 md:px-12 lg:pt-36 lg:px-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Technical Deep Dive &middot; {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="p-2 rounded-full hover:bg-surface-elevated disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-foreground"
              aria-label="Previous Slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
              className="p-2 rounded-full hover:bg-surface-elevated disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-foreground"
              aria-label="Next Slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
          {currentSlideData.title}
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-8 px-8 md:pb-12 md:px-12 lg:pb-16 lg:px-16">
        <div className="flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div className="space-y-12 pt-8">
            <p className="text-lg md:text-xl lg:text-2xl text-foreground/70 leading-relaxed mb-8">
              {currentSlideData.description}
            </p>

            {currentSlideData.code && (
              <CodeExampleWrapper
                code={currentSlideData.code}
                currentSlide={currentSlide}
              />
            )}

            {currentSlideData.links && currentSlideData.links.length > 0 && (
              <ResourceLinks
                links={currentSlideData.links}
                currentSlide={currentSlide}
              />
            )}

            {currentSlideData.mode === 'showcase' && (
              <div className="mt-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">Auto-Rotate:</h3>
                  <motion.button
                    onClick={() => onAutoRotateChange(!autoRotate)}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${autoRotate
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/50'
                      : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
                      }`}
                  >
                    <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">Swap Texture:</h3>
                  <div className="flex flex-wrap gap-3">
                    {textureOptions.map((texture: { name: string; value: string }) => (
                      <motion.button
                        key={texture.value}
                        onClick={() => onTextureChange(texture.value)}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${showcaseTexture === texture.value
                          ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/50'
                          : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
                          }`}
                      >
                        {texture.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Light controls omitted for brevity but logic is preserved in parent if needed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
