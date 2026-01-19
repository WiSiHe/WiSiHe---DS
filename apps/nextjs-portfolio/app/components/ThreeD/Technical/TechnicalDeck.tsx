'use client';

import { useState } from 'react';
import { TechnicalSlideContent } from './TechnicalSlideContent';
import { TechnicalCanvasPanel } from './TechnicalCanvasPanel';
import type { Slide } from '../../../three-d/types';
import technicalSlides from '../../../three-d/technicalSlides.json';
import {
  TEXTURE_OPTIONS,
  DEFAULT_TEXTURE,
} from '../constants';

const slides = technicalSlides as Slide[];

export function TechnicalDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showcaseTexture, setShowcaseTexture] = useState(DEFAULT_TEXTURE);
  const [autoRotate, setAutoRotate] = useState(true);

  const currentSlideData = slides.length === 0 ? null : slides[currentSlide];
  const previousSlideData = slides.length === 0 || currentSlide === 0 ? undefined : slides[currentSlide - 1];

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleNext = () => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  };

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const showcaseControls = {
    texture: showcaseTexture,
    onTextureChange: setShowcaseTexture,
    textureOptions: TEXTURE_OPTIONS,
    autoRotate,
    onAutoRotateChange: setAutoRotate,
  };


  // Guard against empty slides
  if (slides.length === 0 || !currentSlideData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 h-full w-full overflow-hidden bg-background">
      {/* Content Panel - Full width on mobile, 3/5 width on desktop */}
      <div className="col-span-1 lg:col-span-3 h-full overflow-hidden">
        <TechnicalSlideContent
          currentSlide={currentSlide}
          currentSlideData={currentSlideData}
          previousSlideData={previousSlideData}
          totalSlides={slides.length}
          showcaseControls={showcaseControls}
          onSlideClick={handleSlideClick}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>

      {/* 3D Panel - Hidden on mobile, 2/5 width on desktop - Always render, visibility-based animation pausing is handled inside */}
      <div className="hidden lg:block lg:col-span-2 h-full overflow-hidden">
        <TechnicalCanvasPanel
          mode={currentSlideData.mode}
          showcaseTexture={showcaseTexture}
          autoRotate={autoRotate}
        />
      </div>
    </div>
  );
}
