'use client';

import { motion, AnimatePresence } from 'motion/react';
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
}

export function TechnicalSlideContent({
  currentSlide,
  currentSlideData,
  previousSlideData,
  totalSlides,
  showcaseControls,
  lightControls,
  onSlideClick,
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
  // Track what changed between slides
  const titleChanged = previousSlideData?.title !== currentSlideData.title;
  const descriptionChanged = previousSlideData?.description !== currentSlideData.description;
  const codeChanged = previousSlideData?.code !== currentSlideData.code;
  const linksChanged =
    JSON.stringify(previousSlideData?.links) !== JSON.stringify(currentSlideData.links);

  return (
    <article className="flex-1 lg:w-1/2 flex flex-col relative z-10">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-28 pb-4 px-8 md:pt-32 md:px-12 lg:pt-36 lg:px-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">
              Technical Deep Dive
            </span>
            <div className="h-1 w-1 rounded-full bg-accent" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>
          <TechnicalSlideIndicators
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onSlideClick={onSlideClick}
          />
        </div>
        {titleChanged ? (
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight"
            >
              {currentSlideData.title}
            </motion.h2>
          </AnimatePresence>
        ) : (
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
            {currentSlideData.title}
          </h2>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-8 px-8 md:pb-12 md:px-12 lg:pb-16 lg:px-16">
        <div className="flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div className="space-y-12 pt-8">

          {descriptionChanged ? (
            <AnimatePresence mode="wait">
              <motion.p
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed mb-10"
              >
                {currentSlideData.description}
              </motion.p>
            </AnimatePresence>
          ) : (
            <p className="text-lg md:text-xl lg:text-2xl text-foreground/70 leading-relaxed mb-8">
              {currentSlideData.description}
            </p>
          )}

          {currentSlideData.code && (
            <CodeExampleWrapper
              code={currentSlideData.code}
              shouldAnimate={codeChanged}
              currentSlide={currentSlide}
            />
          )}

          {/* Links Section */}
          {currentSlideData.links && currentSlideData.links.length > 0 && (
            <ResourceLinks
              links={currentSlideData.links}
              shouldAnimate={linksChanged}
              currentSlide={currentSlide}
            />
          )}

              {/* Showcase Controls */}
              {currentSlideData.mode === 'showcase' && (
                <div className="mt-8 space-y-6">
                  {/* Auto-Rotate Toggle */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">Auto-Rotate:</h3>
                    <motion.button
                      onClick={() => onAutoRotateChange(!autoRotate)}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        autoRotate
                          ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/50'
                          : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
                      }`}
                      aria-label={autoRotate ? 'Disable auto-rotate' : 'Enable auto-rotate'}
                      aria-pressed={autoRotate}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${autoRotate ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
                    </motion.button>
                  </div>

                  {/* Texture Selection */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">Swap Texture:</h3>
                    <div className="flex flex-wrap gap-3" role="group" aria-label="Texture selection">
                      {textureOptions.map((texture: { name: string; value: string }) => (
                        <motion.button
                          key={texture.value}
                          onClick={() => onTextureChange(texture.value)}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            showcaseTexture === texture.value
                              ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/50'
                              : 'bg-surface-elevated text-foreground hover:bg-surface border-2 border-transparent hover:border-border/50'
                          }`}
                          aria-label={`Switch to ${texture.name} texture`}
                          aria-pressed={showcaseTexture === texture.value}
                        >
                          {texture.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Directional Light Controls */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Directional Light:</h3>
                    
                    {/* Light Position */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/70">Position (X, Y, Z)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['x', 'y', 'z'] as const).map((axis, index) => (
                          <div key={axis} className="space-y-1">
                            <label className="text-xs text-foreground/60 uppercase">{axis}</label>
                            <input
                              type="number"
                              value={directionalLightPosition?.[index] ?? 0}
                              onChange={e => {
                                const newValue = parseFloat(e.target.value) || 0;
                                const currentPosition = directionalLightPosition ?? [0, 0, 0];
                                const newPosition: [number, number, number] = [...currentPosition];
                                newPosition[index] = newValue;
                                onDirectionalLightPositionChange(newPosition);
                              }}
                              step="0.5"
                              className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              aria-label={`Light position ${axis} axis`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Light Intensity */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/70">
                        Intensity: {directionalLightIntensity.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={directionalLightIntensity}
                        onChange={e => onDirectionalLightIntensityChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label="Light intensity"
                      />
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>0</span>
                        <span>3</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </article>
  );
}
