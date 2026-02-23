'use client';

import { motion } from 'motion/react';
import type { Slide } from '../../../three-d/types';
import type { ShowcaseControls } from '../types';
import { CodeExampleWrapper } from './CodeExampleWrapper';
import { ResourceLinks } from './ResourceLinks';
import { ShowcaseControls as ShowcaseControlsComponent } from './ShowcaseControls';
import { TechnicalSlideDescription } from './TechnicalSlideDescription';
import { TechnicalSlideHeader } from './TechnicalSlideHeader';

interface TechnicalSlideContentProps {
  currentSlide: number;
  currentSlideData: Slide;
  previousSlideData: Slide | undefined;
  totalSlides: number;
  showcaseControls: ShowcaseControls;
  onSlideClick?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onAddBox?: () => void;
}

export function TechnicalSlideContent({
  currentSlide,
  currentSlideData,
  totalSlides,
  showcaseControls,
  onSlideClick,
  onNext,
  onPrev,
  onAddBox,
}: Readonly<TechnicalSlideContentProps>) {
  const {
    texture: showcaseTexture,
    onTextureChange,
    textureOptions,
    autoRotate,
    onAutoRotateChange,
  } = showcaseControls;

  const { title, description, mode, code, links } = currentSlideData;
  return (
    <article className='h-full flex flex-col relative'>
      <TechnicalSlideHeader
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onSlideClick={onSlideClick}
        onNext={onNext}
        onPrev={onPrev}
      />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto pb-12 md:pb-16 lg:pb-20 px-4 md:px-6 lg:px-8'>
        <div className='space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 pt-6 md:pt-8'>
          {title && (
            <h2 className='text-5xl font-black text-foreground tracking-tighter leading-[0.9] max-w-3xl'>
              {title}
            </h2>
          )}
          {description && <TechnicalSlideDescription description={description} />}

          {/* Interactive Controls - Show before code example for showcase mode */}
          {mode === 'showcase' && (
            <ShowcaseControlsComponent
              autoRotate={autoRotate}
              onAutoRotateChange={onAutoRotateChange}
              showcaseTexture={showcaseTexture}
              onTextureChange={onTextureChange}
              textureOptions={textureOptions}
            />
          )}

          {mode === 'r3f-basics' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex justify-start'
            >
              <button
                onClick={onAddBox}
                className='px-4 py-2 bg-accent text-accent-contrast rounded-lg font-medium hover:bg-accent-hover transition-all shadow-lg active:scale-95 text-sm'
              >
                Add New Box (State Update)
              </button>
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
              className='w-full -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 mt-6 md:mt-8 lg:mt-10 xl:mt-12'
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
              className='mt-10 md:mt-12 lg:mt-16'
            >
              <ResourceLinks links={currentSlideData.links} currentSlide={currentSlide} />
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}
