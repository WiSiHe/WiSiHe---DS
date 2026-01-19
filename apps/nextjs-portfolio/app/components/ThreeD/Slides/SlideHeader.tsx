import { presentationSlides } from '../../../three-d/presentationSlides';

interface SlideHeaderProps {
  category?: string;
  index: number;
}

export const SlideHeader = ({ category, index }: SlideHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6 md:mb-8 flex-wrap">
      {category && (
        <span className="px-4 py-1.5 text-xs font-bold text-accent bg-accent/10 rounded-full border border-accent/30 uppercase tracking-wider">
          {category}
        </span>
      )}
      <div className="h-1 w-12 bg-accent rounded-full" />
      <span className="text-sm font-mono text-accent uppercase tracking-wider">
        Slide {index + 1} / {presentationSlides.length}
      </span>
    </div>
  );
};
