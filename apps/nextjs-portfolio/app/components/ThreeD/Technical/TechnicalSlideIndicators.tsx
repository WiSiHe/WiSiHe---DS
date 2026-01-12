'use client';

interface TechnicalSlideIndicatorsProps {
  currentSlide: number;
  totalSlides: number;
  onSlideClick?: (index: number) => void;
}

export function TechnicalSlideIndicators({
  currentSlide,
  totalSlides,
  onSlideClick,
}: TechnicalSlideIndicatorsProps) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideClick?.(index)}
          type="button"
          className={`h-2 rounded-full transition-all cursor-pointer ${
            index === currentSlide
              ? 'bg-accent w-8 ring-2 ring-accent/30'
              : 'bg-surface-elevated hover:bg-border w-2'
          }`}
          aria-label={`Go to slide ${index + 1} of ${totalSlides}`}
          aria-current={index === currentSlide ? 'true' : undefined}
        />
      ))}
    </div>
  );
}
