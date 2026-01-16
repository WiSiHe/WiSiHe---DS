'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@wisihe/utils';
import type { PortableTextBlock } from 'next-sanity';
import type {
  PresentationSlide,
  ContentItem,
  SlideContent,
  PortableTextBlockLike,
} from '../../../three-d/types';
import {
  PerformanceChart,
  BusinessImpactChart,
  EngagementChart,
  HistoryTimeline,
} from '../../Charts';
import { Numbers } from '../Numbers/Numbers';
import { GridBackground } from '../GridBackground';
import { presentationSlides } from '../../../three-d/presentationSlides';
import PresentationPortableText from '../PresentationPortableText';
import { urlForImage } from '../../../../sanity/lib/utils';

// Type guard to check if content is Portable Text (from Sanity) vs ContentItem[] (static fallback)
function isPortableText(content: SlideContent): content is PortableTextBlockLike[] {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return false;
  }
  // Portable Text blocks have _type and typically children/markDefs
  const firstItem = content[0];
  return (
    typeof firstItem === 'object' &&
    firstItem !== null &&
    '_type' in firstItem &&
    typeof firstItem._type === 'string'
  );
}

// Type guard to check if content is ContentItem[] (static fallback)
function isContentItemArray(content: SlideContent): content is ContentItem[] {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return false;
  }
  const firstItem = content[0];
  // ContentItem is either a string or an object with 'text' property (no _type)
  return typeof firstItem === 'string' || (typeof firstItem === 'object' && 'text' in firstItem);
}

interface ContentSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate?: boolean;
  slideDirection?: 'up' | 'down';
  currentHistorySlideIndex?: number;
}

// Helper function to map aspect ratio strings to Tailwind classes
const getAspectRatioClass = (ratio?: string): string => {
  if (!ratio) return 'aspect-video';
  const map: Record<string, string> = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[4/3]',
    landscape: 'aspect-[3/2]',
    auto: '',
  };
  return map[ratio] || ratio; // Use custom string as-is if not in map
};

// Hook to lazy load iframes based on visibility
const useLazyIframe = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Keep observing to unload if far off-screen (optional optimization)
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return { isVisible, containerRef };
};

export const ContentSlide = ({
  slideData,
  index,
  shouldAnimate,
  slideDirection,
  currentHistorySlideIndex,
}: ContentSlideProps) => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const exampleIframeRef = useLazyIframe();
  const mainIframeRef = useLazyIframe();

  // Get slide design variant - ensure consistent value for SSR
  const slideDesign = (slideData.slideDesign || 'default') as
    | 'default'
    | 'centered'
    | 'split'
    | 'full-width'
    | 'minimal'
    | 'hero';

  // If examples exist, use interactive example selection layout
  if (slideData.examples && slideData.examples.length > 0) {
    const selectedExample = slideData.examples[selectedExampleIndex];

    return (
      <div className="w-full h-full flex flex-col lg:flex-row gap-8 lg:gap-12 overflow-hidden max-w-full">
        {/* Left Side - Example List */}
        <div className="flex-1 flex flex-col justify-center space-y-4 overflow-y-auto max-h-full overflow-x-hidden min-w-0 max-w-full">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {slideData.category && (
              <span className="px-4 py-1.5 text-xs font-bold text-accent bg-accent/10 rounded-full border border-accent/30 uppercase tracking-wider">
                {slideData.category}
              </span>
            )}
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">
              Slide {index + 1} / {presentationSlides.length}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-foreground uppercase leading-tight tracking-tight break-words max-w-full">
            {slideData.title}
          </h2>

          {slideData.subtitle && (
            <p className="text-2xl md:text-3xl lg:text-4xl text-accent font-bold mb-8 break-words max-w-full">
              {slideData.subtitle}
            </p>
          )}

          {slideData.content && slideData.content.length > 0 && (
            <div className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed break-words">
              {isPortableText(slideData.content) && (
                <PresentationPortableText
                  value={slideData.content as PortableTextBlock[]}
                  slideDesign={slideDesign}
                />
              )}
              {isContentItemArray(slideData.content) && (
                <p>
                  {typeof slideData.content[0] === 'string'
                    ? slideData.content[0].trim().replace(/^•\s*/, '')
                    : slideData.content[0].text.trim().replace(/^•\s*/, '')}
                </p>
              )}
            </div>
          )}

          {/* Example Buttons */}
          <div className="space-y-3">
            {slideData.examples.map((example, exampleIndex) => (
              <button
                key={exampleIndex}
                onClick={() => setSelectedExampleIndex(exampleIndex)}
                type="button"
                className={cn(
                  'w-full text-left p-5 rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  selectedExampleIndex === exampleIndex
                    ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20'
                    : 'bg-surface-elevated border-border hover:border-accent/50 hover:bg-surface'
                )}
                aria-label={`View ${example.name} example`}
                aria-pressed={selectedExampleIndex === exampleIndex}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        'text-xl md:text-2xl font-bold mb-2 transition-colors',
                        selectedExampleIndex === exampleIndex ? 'text-accent' : 'text-foreground'
                      )}
                    >
                      {example.name}
                    </h3>
                    <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                      {example.description}
                    </p>
                  </div>
                  {selectedExampleIndex === exampleIndex && (
                    <div className="w-3 h-3 rounded-full bg-accent shrink-0 mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Sources */}
          {slideData.sources && slideData.sources.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border/30">
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
            </div>
          )}
        </div>

        {/* Right Side - Example Showcase */}
        <div className="shrink-0 lg:w-1/2 flex items-center justify-center max-w-full overflow-hidden min-w-0">
          <div key={selectedExampleIndex} className="w-full">
              {selectedExample.image ? (
                <div
                  className={cn(
                    'relative rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-full bg-surface/50',
                    getAspectRatioClass(slideData.imageAspectRatio)
                  )}
                >
                  <Image
                    src={selectedExample.image}
                    alt={`${selectedExample.name} - ${selectedExample.description || 'Interactive 3D example'}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              ) : selectedExample.iframe ? (
                <div 
                  ref={exampleIframeRef.containerRef}
                  className="relative w-full rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 max-h-[60vh] bg-surface/50"
                >
                  {exampleIframeRef.isVisible ? (
                    <iframe
                      src={selectedExample.iframe}
                      className="w-full h-full border-0 min-h-[400px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${selectedExample.name} Demo`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface/30">
                      <div className="text-foreground/40 text-sm">Loading...</div>
                    </div>
                  )}
                </div>
              ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Get layout classes based on slideDesign
  const getLayoutClasses = () => {
    switch (slideDesign) {
      case 'centered':
        return 'flex flex-col items-center justify-center gap-8 lg:gap-12';
      case 'split':
        return 'flex flex-col lg:flex-row gap-8 lg:gap-12';
      case 'full-width':
        return 'flex flex-col gap-8 lg:gap-12';
      case 'minimal':
        return 'flex flex-col lg:flex-row gap-4 lg:gap-6';
      case 'hero':
        return 'flex flex-col items-center justify-center gap-12 lg:gap-16';
      default: // 'default'
        return 'flex flex-col lg:flex-row gap-8 lg:gap-12';
    }
  };

  const getContentClasses = () => {
    switch (slideDesign) {
      case 'centered':
        return 'flex-1 flex flex-col items-center text-center space-y-6 max-w-4xl';
      case 'full-width':
        return 'w-full flex flex-col justify-center space-y-6';
      case 'minimal':
        return 'flex-1 flex flex-col justify-center space-y-3';
      case 'hero':
        return 'flex-1 flex flex-col items-center text-center space-y-10 max-w-5xl';
      default:
        return 'flex-1 flex flex-col justify-center space-y-6';
    }
  };

  const getTitleClasses = () => {
    switch (slideDesign) {
      case 'minimal':
        return 'text-3xl md:text-4xl lg:text-5xl';
      case 'hero':
        return 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl';
      case 'centered':
        return 'text-4xl md:text-6xl lg:text-7xl xl:text-8xl';
      default:
        return 'text-4xl md:text-6xl lg:text-7xl';
    }
  };

  const getMediaContainerClasses = () => {
    const baseClasses = 'max-w-full overflow-hidden min-w-0';
    switch (slideDesign) {
      case 'centered':
        return `w-full max-w-4xl flex items-center justify-center ${baseClasses}`;
      case 'full-width':
        return `w-full flex items-center justify-center ${baseClasses}`;
      case 'minimal':
        return `shrink-0 lg:w-1/2 flex items-center justify-center ${baseClasses}`;
      case 'hero':
        return `w-full max-w-6xl flex items-center justify-center ${baseClasses}`;
      default:
        return `shrink-0 lg:w-1/2 flex items-center justify-center ${baseClasses}`;
    }
  };

  // Default layout for non-example slides
  return (
    <div
      className={cn(
        'w-full h-full overflow-hidden max-w-full',
        getLayoutClasses(),
        slideDesign === 'minimal' ? 'p-4' : 'p-8 lg:p-12'
      )}
    >
      {/* Content Section */}
      <article
        className={cn(
          getContentClasses(),
          'overflow-y-auto max-h-full overflow-x-hidden min-w-0 max-w-full px-2'
        )}
      >
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {slideData.category && (
            <span className="px-4 py-1.5 text-xs font-bold text-accent bg-accent/10 rounded-full border border-accent/30 uppercase tracking-wider">
              {slideData.category}
            </span>
          )}
          <div className="h-1 w-12 bg-accent rounded-full" />
          <span className="text-sm font-mono text-accent uppercase tracking-wider">
            Slide {index + 1} / {presentationSlides.length}
          </span>
        </div>

        <h1 className={cn(getTitleClasses(), 'font-black mb-4 text-foreground uppercase leading-tight tracking-tight break-words overflow-wrap-anywhere max-w-full')} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
          {slideData.title}
        </h1>

        {slideData.subtitle && (
          <h2
            className={cn(
              'text-accent font-bold break-words overflow-wrap-anywhere max-w-full',
              slideDesign === 'minimal'
                ? 'text-xl md:text-2xl lg:text-3xl mb-6'
                : slideDesign === 'hero'
                  ? 'text-3xl md:text-4xl lg:text-5xl mb-10'
                  : 'text-2xl md:text-3xl lg:text-4xl mb-6'
            )}
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
          >
            {slideData.subtitle}
          </h2>
        )}

        {/* Content - Portable Text (Sanity) or ContentItem[] (static fallback) */}
        {slideData.content && isPortableText(slideData.content) && (
          <div className="max-w-full overflow-x-hidden px-4 md:px-6">
            <PresentationPortableText
              value={slideData.content as PortableTextBlock[]}
              slideDesign={slideDesign}
            />
          </div>
        )}

        {/* Legacy ContentItem[] rendering for static fallback slides */}
        {slideData.content && isContentItemArray(slideData.content) && (
          <ul
            className={cn(
              'max-w-full list-none overflow-x-hidden px-4 md:px-6',
              slideDesign === 'minimal'
                ? 'space-y-3'
                : slideDesign === 'hero'
                  ? 'space-y-6'
                  : 'space-y-4'
            )}
          >
            {slideData.content
              .filter(item => {
                // Filter out empty strings or empty objects
                if (typeof item === 'string') {
                  return item.trim() !== '';
                }
                return item.text?.trim() !== '';
              })
              .map((item, itemIndex) => {
                // Recursive component for rendering nested bullets
                const renderContentItem = (
                  contentItem: ContentItem,
                  index: number,
                  level: number = 0,
                ) => {
                  const isNested = level > 0;
                  const isObject = typeof contentItem === 'object';
                  const text = isObject ? contentItem.text : contentItem;
                  const url = isObject ? contentItem.url : undefined;
                  const children = isObject ? contentItem.children : undefined;

                  // Remove leading bullet character if present
                  const cleanText = text.trim().replace(/^•\s*/, '');

                  // Determine if URL is external (starts with http:// or https://)
                  const isExternal = url?.startsWith('http://') || url?.startsWith('https://');

                  return (
                    <li
                      key={`${index}-${level}`}
                      className={cn('flex items-start gap-4 min-w-0', isNested ? 'pl-6 md:pl-8' : 'group')}
                    >
                      <div className="shrink-0 mt-2">
                        {isNested ? (
                          // Sub-bullet: smaller dash (no hover effects)
                          <div className="w-3 h-0.5 bg-accent/70" />
                        ) : (
                          // Main bullet: accent-colored dot (with hover effects)
                          <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        {url ? (
                          // Render as link
                          <a
                            href={url}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className={cn(
                              'leading-relaxed transition-colors break-words inline-block',
                              isNested
                                ? 'text-base md:text-lg lg:text-xl text-accent'
                                : 'text-lg md:text-xl lg:text-2xl text-accent hover:text-accent/80 hover:underline'
                            )}
                          >
                            {cleanText}
                          </a>
                        ) : (
                          // Render as plain text
                          <span
                            className={cn(
                              'leading-relaxed break-words',
                              isNested
                                ? 'text-base md:text-lg lg:text-xl text-foreground/80'
                                : 'text-lg md:text-xl lg:text-2xl text-foreground/90 group-hover:text-foreground transition-colors'
                            )}
                          >
                            {cleanText}
                          </span>
                        )}
                        {children && children.length > 0 && (
                          <ul className="mt-3 space-y-3 list-none">
                            {children
                              .filter(child => {
                                if (typeof child === 'string') {
                                  return child.trim() !== '';
                                }
                                return child.text?.trim() !== '';
                              })
                              .map((child, childIndex) =>
                                renderContentItem(child, childIndex, level + 1),
                              )}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                };

                return renderContentItem(item, itemIndex);
              })}
          </ul>
        )}

        {/* Sources */}
        {slideData.sources && slideData.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border/30">
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
          </div>
        )}
      </article>

      {/* Media Section - Chart, Image, Iframe, Numbers, Tools, or Decorative Placeholder */}
      <div
        className={cn(getMediaContainerClasses(), slideDesign === 'full-width' && 'order-first')}
      >
        {slideData.tools ? (
          <div className="w-full max-w-full p-6 bg-surface-elevated rounded-2xl border-2 border-border overflow-hidden min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slideData.tools.map((tool, toolIndex) => (
                <div
                  key={tool.name}
                  className="group p-5 bg-surface rounded-xl border-2 border-border hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
                >
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block">
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
                          {[1, 2, 3, 4, 5].map(level => {
                            const nerdLevel = tool.nerdLevel ?? 0;
                            return (
                              <div
                                key={level}
                                className={cn(
                                  'w-2 h-2 rounded-full transition-all',
                                  level <= nerdLevel
                                    ? level <= 2
                                      ? 'bg-green-500'
                                      : level <= 3
                                        ? 'bg-yellow-500'
                                        : level <= 4
                                          ? 'bg-orange-500'
                                          : 'bg-red-500'
                                    : 'bg-foreground/10'
                                )}
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
                    <a
                      href={tool.workshopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border-2 border-accent/30 hover:border-accent/50 rounded-lg font-semibold text-sm transition-all duration-200"
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
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : slideData.iframe ? (
          <div
            ref={mainIframeRef.containerRef}
            className={cn(
              'relative w-full rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-surface/50',
              getAspectRatioClass(slideData.iframeAspectRatio)
            )}
          >
            {mainIframeRef.isVisible ? (
              <iframe
                src={slideData.iframe}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Interactive 3D Workshop Demo"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface/30 min-h-[400px]">
                <div className="text-foreground/40 text-sm">Loading...</div>
              </div>
            )}
          </div>
        ) : slideData.metrics ? (
          <div className="w-full max-w-full p-4 bg-surface-elevated/50 rounded-2xl border border-border/50 overflow-hidden min-w-0">
            <Numbers metrics={slideData.metrics} />
          </div>
        ) : slideData.chartType === 'history-timeline' ? (
          <div className="w-full h-full min-h-[400px]">
            <HistoryTimeline activeIndex={currentHistorySlideIndex ?? 0} />
          </div>
        ) : slideData.chartType ? (
          <div className="w-full max-w-full p-4 bg-surface-elevated/50 rounded-2xl border border-border/50 overflow-hidden min-w-0">
            {slideData.chartType === 'performance' && <PerformanceChart />}
            {slideData.chartType === 'business-impact' && <BusinessImpactChart />}
            {slideData.chartType === 'engagement' && <EngagementChart />}
          </div>
        ) : slideData.image ? (
          <div
            className={cn(
              'relative rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-full bg-surface/50',
              getAspectRatioClass(slideData.imageAspectRatio)
            )}
          >
            <Image
              src={
                typeof slideData.image === 'object'
                  ? urlForImage(slideData.image)?.url() || ''
                  : slideData.image
              }
              alt={
                (typeof slideData.image === 'object' && slideData.image.alt) ||
                (slideData.subtitle
                  ? `${slideData.title} - ${slideData.subtitle}`
                  : slideData.title)
              }
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading={index <= 2 ? 'eager' : 'lazy'}
              priority={index <= 2}
            />
          </div>
        ) : (
          /* Decorative Placeholder for slides without media */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-linear-to-br from-accent/5 via-surface to-accent/10 border border-border/30">
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-30">
              <GridBackground />
            </div>
            {/* Decorative accent elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
            </div>
            {/* Subtle corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-accent/20 rounded-tl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent/20 rounded-br-lg" />
            {/* Category badge if available */}
            {slideData.category && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-accent/30 text-6xl md:text-8xl font-black uppercase tracking-widest select-none">
                  {slideData.category.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
