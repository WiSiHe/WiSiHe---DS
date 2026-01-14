'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechnicalSlideContent } from './TechnicalSlideContent';
import { TechnicalCanvasPanel } from './TechnicalCanvasPanel';
import technicalSlidesData from '../../../three-d/technicalSlides.json';
import type { Slide, SlideMode } from '../../../three-d/types';
import {
  TEXTURE_OPTIONS,
  DEFAULT_TEXTURE,
  DEFAULT_LIGHT_POSITION,
  DEFAULT_LIGHT_INTENSITY,
} from '../constants';

export function TechnicalDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showcaseTexture, setShowcaseTexture] = useState(DEFAULT_TEXTURE);
  const [autoRotate, setAutoRotate] = useState(true);
  const [directionalLightPosition, setDirectionalLightPosition] =
    useState<[number, number, number]>(DEFAULT_LIGHT_POSITION);
  const [directionalLightIntensity, setDirectionalLightIntensity] =
    useState(DEFAULT_LIGHT_INTENSITY);

  // Type assertion for JSON import
  const slides = technicalSlidesData as Slide[];
  const currentSlideData = slides[currentSlide];

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-background">
      {/* Left Content Panel */}
      <TechnicalSlideContent
        currentSlide={currentSlide}
        currentSlideData={currentSlideData}
        previousSlideData={currentSlide > 0 ? slides[currentSlide - 1] : undefined}
        totalSlides={slides.length}
        showcaseControls={{
          texture: showcaseTexture,
          onTextureChange: setShowcaseTexture,
          textureOptions: [...TEXTURE_OPTIONS], // Fix mutable type issue
          autoRotate,
          onAutoRotateChange: setAutoRotate,
        }}
        lightControls={{
          directionalLightPosition,
          onDirectionalLightPositionChange: setDirectionalLightPosition,
          directionalLightIntensity,
          onDirectionalLightIntensityChange: setDirectionalLightIntensity,
        }}
        onSlideClick={(index) => setCurrentSlide(index)}
        onNext={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
        onPrev={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
      />

      {/* Right 3D Panel */}
      <TechnicalCanvasPanel
        mode={currentSlideData.mode as SlideMode}
        showcaseTexture={showcaseTexture}
        autoRotate={autoRotate}
        directionalLightPosition={directionalLightPosition}
        directionalLightIntensity={directionalLightIntensity}
      />
    </div>
  );
}
