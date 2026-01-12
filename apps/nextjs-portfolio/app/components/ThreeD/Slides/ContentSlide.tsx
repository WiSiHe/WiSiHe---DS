'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PresentationSlide } from '../../../three-d/types';
import {
  PerformanceChart,
  BusinessImpactChart,
  EngagementChart,
  HistoryTimeline,
} from '../../Charts';
import { presentationSlides } from '../../../three-d/presentationSlides';

interface ContentSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate: boolean;
  slideDirection: 'up' | 'down';
  currentHistorySlideIndex?: number;
}

export const ContentSlide = ({
  slideData,
  index,
  shouldAnimate,
  slideDirection,
  currentHistorySlideIndex,
}: ContentSlideProps) => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  // If examples exist, use interactive example selection layout
  if (slideData.examples && slideData.examples.length > 0) {
    const selectedExample = slideData.examples[selectedExampleIndex];

    return (
      <motion.div
        key={`content-${index}`}
        initial={
          shouldAnimate
            ? {
                opacity: 0,
                x: slideDirection === 'down' ? 100 : -100,
              }
            : { opacity: 1, x: 0 }
        }
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full flex flex-col lg:flex-row gap-8 lg:gap-12 overflow-hidden max-w-full"
      >
        {/* Left Side - Example List */}
        <div className="flex-1 flex flex-col justify-center space-y-4 overflow-y-auto max-h-full overflow-x-hidden min-w-0 max-w-full">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {slideData.category && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-1.5 text-xs font-bold text-accent bg-accent/10 rounded-full border border-accent/30 uppercase tracking-wider"
              >
                {slideData.category}
              </motion.span>
            )}
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">
              Slide {index + 1} / {presentationSlides.length}
            </span>
          </div>

          <motion.h2
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: shouldAnimate ? 0.1 : 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-foreground uppercase leading-tight tracking-tight break-words max-w-full"
          >
            {slideData.title}
          </motion.h2>

          {slideData.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl text-accent font-bold mb-8 break-words max-w-full"
            >
              {slideData.subtitle}
            </motion.p>
          )}

          {slideData.content && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed break-words"
            >
              {slideData.content[0]}
            </motion.p>
          )}

          {/* Example Buttons */}
          <div className="space-y-3">
            {slideData.examples.map((example, exampleIndex) => (
              <motion.button
                key={exampleIndex}
                onClick={() => setSelectedExampleIndex(exampleIndex)}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + exampleIndex * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                  selectedExampleIndex === exampleIndex
                    ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20'
                    : 'bg-surface-elevated border-border hover:border-accent/50 hover:bg-surface'
                }`}
                aria-label={`View ${example.name} example`}
                aria-pressed={selectedExampleIndex === exampleIndex}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3
                      className={`text-xl md:text-2xl font-bold mb-2 transition-colors ${
                        selectedExampleIndex === exampleIndex
                          ? 'text-accent'
                          : 'text-foreground'
                      }`}
                    >
                      {example.name}
                    </h3>
                    <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                      {example.description}
                    </p>
                  </div>
                  {selectedExampleIndex === exampleIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-accent flex-shrink-0 mt-1"
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Sources */}
          {slideData.sources && slideData.sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8 pt-8 border-t border-border/30"
            >
              <p className="text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wider">
                Sources:
              </p>
              <ul className="space-y-2">
                {slideData.sources.map((source, sourceIndex) => (
                  <li key={sourceIndex} className="text-sm text-foreground/50 flex items-start">
                    <span className="mr-2 text-accent">•</span>
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline transition-colors"
                      >
                        {source.text}
                      </a>
                    ) : (
                      <span>{source.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right Side - Example Showcase */}
        <motion.div
          initial={
            shouldAnimate
              ? { opacity: 0, x: slideDirection === 'down' ? 100 : -100 }
              : { opacity: 1, x: 0 }
          }
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldAnimate ? 0.3 : 0, duration: 0.6 }}
          className="flex-shrink-0 lg:w-1/2 flex items-center justify-center max-w-full overflow-hidden min-w-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedExampleIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {selectedExample.image ? (
                <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-full bg-surface/50">
                  <img
                    src={selectedExample.image}
                    alt={`${selectedExample.name} - ${selectedExample.description || 'Interactive 3D example'}`}
                    className="w-full h-auto block max-w-full max-h-[60vh] object-contain"
                    loading="lazy"
                  />
                </div>
              ) : selectedExample.iframe ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 max-h-[60vh] bg-surface/50">
                  <iframe
                    src={selectedExample.iframe}
                    className="w-full h-full border-0 min-h-[400px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${selectedExample.name} Demo`}
                  />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }

  // Default layout for non-example slides
  return (
    <motion.div
      key={`content-${index}`}
      initial={
        shouldAnimate
          ? {
              opacity: 0,
              x: slideDirection === 'down' ? 100 : -100,
            }
          : { opacity: 1, x: 0 }
      }
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full h-full flex flex-col lg:flex-row gap-8 lg:gap-12 overflow-hidden max-w-full"
    >
      {/* Left Side - Content */}
      <article className="flex-1 flex flex-col justify-center space-y-8 overflow-y-auto max-h-full overflow-x-hidden min-w-0 max-w-full">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {slideData.category && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-1.5 text-xs font-bold text-accent bg-accent/10 rounded-full border border-accent/30 uppercase tracking-wider"
            >
              {slideData.category}
            </motion.span>
          )}
          <div className="h-1 w-12 bg-accent rounded-full" />
          <span className="text-sm font-mono text-accent uppercase tracking-wider">
            Slide {index + 1} / {presentationSlides.length}
          </span>
        </div>

        <motion.h1
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: shouldAnimate ? 0.1 : 0 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-foreground uppercase leading-tight tracking-tight break-words max-w-full"
        >
          {slideData.title}
        </motion.h1>

        {slideData.subtitle && (
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl text-accent font-bold mb-8 break-words max-w-full"
          >
            {slideData.subtitle}
          </motion.h2>
        )}

        {slideData.content && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4 max-w-full list-none"
          >
            {slideData.content
              .filter(item => item.trim() !== '') // Filter out empty strings
              .map((item, itemIndex) => {
                // Remove leading bullet character if present
                const cleanItem = item.trim().replace(/^•\s*/, '');
                return (
                  <motion.li
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + 0.1 * itemIndex, duration: 0.4 }}
                    className="flex items-start group gap-4"
                  >
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-200" />
                    </div>
                    <span className="text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed group-hover:text-foreground transition-colors break-words flex-1">
                      {cleanItem}
                    </span>
                  </motion.li>
                );
              })}
          </motion.ul>
        )}

        {/* Sources */}
        {slideData.sources && slideData.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-12 pt-8 border-t border-border/30"
          >
            <p className="text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wider">
              Sources:
            </p>
            <ul className="space-y-2">
              {slideData.sources.map((source, sourceIndex) => (
                <li key={sourceIndex} className="text-sm text-foreground/50 flex items-start">
                  <span className="mr-2 text-accent">•</span>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline transition-colors"
                    >
                      {source.text}
                    </a>
                  ) : (
                    <span>{source.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </article>

      {/* Right Side - Chart, Image, Iframe, Tools, or Examples */}
      {(slideData.chartType || slideData.image || slideData.iframe || slideData.tools) && (
        <motion.div
          initial={
            shouldAnimate
              ? { opacity: 0, x: slideDirection === 'down' ? 100 : -100 }
              : { opacity: 1, x: 0 }
          }
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldAnimate ? 0.3 : 0, duration: 0.6 }}
          className="flex-shrink-0 lg:w-1/2 flex items-center justify-center max-w-full overflow-hidden min-w-0"
        >
          {slideData.tools ? (
            <div className="w-full max-w-full p-6 bg-surface-elevated rounded-2xl border-2 border-border overflow-hidden min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slideData.tools.map((tool, toolIndex) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: toolIndex * 0.1, duration: 0.4 }}
                    className="group p-5 bg-surface rounded-xl border-2 border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                  >
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {tool.name}
                        </h3>
                        <svg
                          className="w-5 h-5 text-foreground/50 group-hover:text-accent transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {tool.category && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-accent bg-accent/10 rounded-full">
                          {tool.category}
                        </span>
                      )}
                      {tool.nerdLevel !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                            Nerd Level:
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((level) => {
                              const nerdLevel = tool.nerdLevel ?? 0;
                              return (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    level <= nerdLevel
                                      ? level <= 2
                                        ? 'bg-green-500'
                                        : level <= 3
                                          ? 'bg-yellow-500'
                                          : level <= 4
                                            ? 'bg-orange-500'
                                            : 'bg-red-500'
                                      : 'bg-foreground/10'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-xs font-bold text-foreground/70">
                            {tool.nerdLevel}/5
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-foreground/70 text-sm leading-relaxed group-hover:text-foreground transition-colors mb-4">
                      {tool.description}
                    </p>
                    {tool.workshopUrl && (
                      <motion.a
                        href={tool.workshopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border-2 border-accent/30 hover:border-accent/50 rounded-lg font-semibold text-sm transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>View Workshop</span>
                      </motion.a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : slideData.iframe ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 max-h-[60vh] bg-surface/50">
              <iframe
                src={slideData.iframe}
                className="w-full h-full border-0 min-h-[400px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Interactive 3D Workshop Demo"
              />
            </div>
          ) : slideData.chartType ? (
            <div className="w-full max-w-full p-4 bg-surface-elevated/50 rounded-2xl border border-border/50 overflow-hidden min-w-0">
              {slideData.chartType === 'performance' && <PerformanceChart />}
              {slideData.chartType === 'business-impact' && <BusinessImpactChart />}
              {slideData.chartType === 'engagement' && <EngagementChart />}
              {slideData.chartType === 'history-timeline' && (
                <HistoryTimeline currentHistorySlideIndex={currentHistorySlideIndex} />
              )}
            </div>
          ) : slideData.image ? (
            <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-full bg-surface/50">
              <img
                src={slideData.image}
                alt={slideData.subtitle ? `${slideData.title} - ${slideData.subtitle}` : slideData.title}
                className="w-full h-auto block max-w-full max-h-[60vh] object-contain"
                loading="lazy"
              />
            </div>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
};

