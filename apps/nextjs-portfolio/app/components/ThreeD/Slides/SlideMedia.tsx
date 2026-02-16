import Image from 'next/image';
import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '../../../three-d/types';
import { urlForImage } from '../../../../sanity/lib/utils';
import { getAspectRatioClass } from './utils';
import { useLazyIframe } from './hooks';
import {
  PerformanceChart,
  BusinessImpactChart,
  EngagementChart,
  HistoryTimeline,
} from '../../Charts';
import { Numbers } from '../Numbers/Numbers';
import { GridBackground } from '../GridBackground';

interface SlideMediaProps {
  slideData: PresentationSlide;
  index: number;
  currentHistorySlideIndex?: number;
}

export const SlideMedia = ({
  slideData,
  
  index,
  currentHistorySlideIndex,
}: SlideMediaProps) => {
  const mainIframeRef = useLazyIframe();

  if (slideData.tools) {
    return (
      <div className="w-full max-w-full p-6 bg-surface-elevated rounded-2xl border-2 border-border overflow-hidden min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slideData.tools.map((tool) => (
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
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-accent-text bg-accent-subtle rounded-full">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-subtle hover:bg-accent-surface text-accent-text border-2 border-accent-border rounded-lg font-semibold text-sm transition-all duration-200"
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
    );
  }

  if (slideData.iframe) {
    return (
      <div
        ref={mainIframeRef.containerRef}
        className={cn(
          'relative w-full rounded-xl overflow-hidden glass-panel shadow-lg hover:shadow-xl transition-all duration-300',
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
          <div className="w-full h-full flex items-center justify-center bg-surface-subtle min-h-[400px]">
            <div className="text-foreground/40 text-sm">Loading...</div>
          </div>
        )}
      </div>
    );
  }

  if (slideData.metrics) {
    return (
      <div className="w-full max-w-full p-4 glass-panel rounded-2xl overflow-hidden min-w-0">
        <Numbers metrics={slideData.metrics} />
      </div>
    );
  }

  if (slideData.chartType === 'history-timeline') {
    return (
      <div className="w-full h-full min-h-[500px]">
        <HistoryTimeline activeIndex={currentHistorySlideIndex ?? 0} />
      </div>
    );
  }

  if (slideData.chartType) {
    return (
      <div className="w-full max-w-full p-4 glass-panel rounded-2xl overflow-hidden min-w-0">
        {slideData.chartType === 'performance' && <PerformanceChart />}
        {slideData.chartType === 'business-impact' && <BusinessImpactChart />}
        {slideData.chartType === 'engagement' && <EngagementChart />}
      </div>
    );
  }

  if (slideData.image) {
    // Handle both Sanity image objects and string URLs
    const imageUrl =
      typeof slideData.image === 'object'
        ? urlForImage(slideData.image)?.width(1200).height(675).url() || ''
        : slideData.image;

    const imageAlt =
      (typeof slideData.image === 'object' && slideData.image.alt) ||
      (slideData.subtitle ? `${slideData.title} - ${slideData.subtitle}` : slideData.title);

    return (
      <div
        className={cn(
          'relative rounded-xl overflow-hidden glass-panel shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-full',
          getAspectRatioClass(slideData.imageAspectRatio)
        )}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading={index <= 2 ? 'eager' : 'lazy'}
          priority={index <= 2}
        />
      </div>
    );
  }

  // Decorative Placeholder for slides without media
  return (
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
  );
};
