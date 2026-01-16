'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TechnicalSlideContent } from './TechnicalSlideContent';
import { TechnicalCanvasPanel } from './TechnicalCanvasPanel';
import type { Slide } from '../../../three-d/types';
import {
  TEXTURE_OPTIONS,
  DEFAULT_TEXTURE,
  DEFAULT_LIGHT_POSITION,
  DEFAULT_LIGHT_INTENSITY,
} from '../constants';

export const TechnicalDeck = React.memo(function TechnicalDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showcaseTexture, setShowcaseTexture] = useState(DEFAULT_TEXTURE);
  const [autoRotate, setAutoRotate] = useState(true);
  const [directionalLightPosition, setDirectionalLightPosition] =
    useState<[number, number, number]>(DEFAULT_LIGHT_POSITION);
  const [directionalLightIntensity, setDirectionalLightIntensity] =
    useState(DEFAULT_LIGHT_INTENSITY);
  const [slides, setSlides] = useState<Slide[] | null>(null);

  // Dynamically load technical slides JSON data - optimized with error handling
  useEffect(() => {
    let cancelled = false;
    
    import('../../../three-d/technicalSlides.json')
      .then((data) => {
        if (!cancelled) {
          setSlides(data.default as Slide[]);
        }
      })
      .catch((error) => {
        console.error('Failed to load technical slides:', error);
        if (!cancelled) {
          setSlides([]); // Set empty array to prevent infinite loading state
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Memoize current slide data to prevent unnecessary re-renders
  // Must be called before any conditional returns (Rules of Hooks)
  const currentSlideData = useMemo(() => {
    if (!slides || slides.length === 0) return null;
    return slides[currentSlide];
  }, [slides, currentSlide]);

  const previousSlideData = useMemo(() => {
    if (!slides || slides.length === 0 || currentSlide === 0) return undefined;
    return slides[currentSlide - 1];
  }, [slides, currentSlide]);

  // Memoize callbacks to prevent child re-renders
  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => {
      if (!slides || slides.length === 0) return prev;
      return Math.min(prev + 1, slides.length - 1);
    });
  }, [slides]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Memoize control objects to prevent unnecessary re-renders
  const showcaseControls = useMemo(
    () => ({
      texture: showcaseTexture,
      onTextureChange: setShowcaseTexture,
      textureOptions: TEXTURE_OPTIONS,
      autoRotate,
      onAutoRotateChange: setAutoRotate,
    }),
    [showcaseTexture, autoRotate],
  );

  const lightControls = useMemo(
    () => ({
      directionalLightPosition,
      onDirectionalLightPositionChange: setDirectionalLightPosition,
      directionalLightIntensity,
      onDirectionalLightIntensityChange: setDirectionalLightIntensity,
    }),
    [directionalLightPosition, directionalLightIntensity],
  );

  // Don't render until slides are loaded
  if (!slides || slides.length === 0 || !currentSlideData) {
    return (
      <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-foreground/60 font-medium">Loading slides...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-background">
      {/* Left Content Panel */}
      <TechnicalSlideContent
        currentSlide={currentSlide}
        currentSlideData={currentSlideData}
        previousSlideData={previousSlideData}
        totalSlides={slides.length}
        showcaseControls={showcaseControls}
        lightControls={lightControls}
        onSlideClick={handleSlideClick}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Right 3D Panel - Always render, visibility-based animation pausing is handled inside */}
      <TechnicalCanvasPanel
        mode={currentSlideData.mode}
        showcaseTexture={showcaseTexture}
        autoRotate={autoRotate}
        directionalLightPosition={directionalLightPosition}
        directionalLightIntensity={directionalLightIntensity}
      />
    </div>
  );
});
