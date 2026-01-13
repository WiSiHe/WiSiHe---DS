'use client';

import { useState, useRef, useEffect } from 'react';
import { TechnicalProgressBar } from './TechnicalProgressBar';
import { TechnicalSlideContent } from './TechnicalSlideContent';
import { TechnicalCanvasPanel } from './TechnicalCanvasPanel';
import { TechnicalNavigation } from './TechnicalNavigation';
import { GridBackground } from '../GridBackground';
import technicalSlidesData from '../../../three-d/technicalSlides.json';
import type { Slide } from '../../../three-d/types';
import {
  TEXTURE_OPTIONS,
  DEFAULT_TEXTURE,
  DEFAULT_LIGHT_POSITION,
  DEFAULT_LIGHT_INTENSITY,
} from '../constants';

export function TechnicalDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showcaseTexture, setShowcaseTexture] = useState(DEFAULT_TEXTURE);
  const [autoRotate, setAutoRotate] = useState(false);
  const [directionalLightPosition, setDirectionalLightPosition] =
    useState<[number, number, number]>(DEFAULT_LIGHT_POSITION);
  const [directionalLightIntensity, setDirectionalLightIntensity] =
    useState(DEFAULT_LIGHT_INTENSITY);
  const previousSlideRef = useRef(0);

  // Type assertion for JSON import
  const slides = technicalSlidesData as Slide[];

  const currentSlideData = slides[currentSlide];
  const previousSlideData = slides[previousSlideRef.current];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === slides.length - 1;

  // Update previous slide ref after render
  useEffect(() => {
    previousSlideRef.current = currentSlide;
  }, [currentSlide]);

  const handlePrevious = () => {
    if (!isFirstSlide) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSlideClick = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  return (
    <div className="snap-start h-screen w-full flex flex-col lg:flex-row bg-background text-foreground overflow-hidden max-w-full relative shrink-0">
      <GridBackground />
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      {/* Progress Indicator */}
      <TechnicalProgressBar currentSlide={currentSlide} totalSlides={slides.length} />

      {/* Left Panel - Content */}
      <TechnicalSlideContent
        currentSlide={currentSlide}
        currentSlideData={currentSlideData}
        previousSlideData={previousSlideData}
        totalSlides={slides.length}
        showcaseControls={{
          texture: showcaseTexture,
          onTextureChange: setShowcaseTexture,
          textureOptions: [...TEXTURE_OPTIONS],
          autoRotate,
          onAutoRotateChange: setAutoRotate,
        }}
        lightControls={{
          directionalLightPosition,
          onDirectionalLightPositionChange: setDirectionalLightPosition,
          directionalLightIntensity,
          onDirectionalLightIntensityChange: setDirectionalLightIntensity,
        }}
        onSlideClick={handleSlideClick}
      />

      {/* Right Panel - 3D Canvas */}
      <TechnicalCanvasPanel
        mode={currentSlideData.mode}
        showcaseTexture={showcaseTexture}
        autoRotate={autoRotate}
        directionalLightPosition={directionalLightPosition}
        directionalLightIntensity={directionalLightIntensity}
      />

      {/* Navigation Buttons */}
      <TechnicalNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirstSlide={isFirstSlide}
        isLastSlide={isLastSlide}
      />
    </div>
  );
}
