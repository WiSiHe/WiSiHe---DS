type SlideHeaderProps = {
  category?: string;
  index: number;
  totalSlides?: number;
};

export function SlideHeader({ category, index, totalSlides }: SlideHeaderProps) {
  return (
    <div className='mb-6 flex flex-wrap items-center gap-3 md:mb-8'>
      {category ? (
        <span className='rounded-full border border-accent-border bg-accent-subtle px-4 py-1.5 text-xs font-bold tracking-wider text-accent-text uppercase'>
          {category}
        </span>
      ) : null}
      <div className='h-1 w-12 rounded-full bg-accent' />
      <span className='font-mono text-sm tracking-wider text-accent uppercase'>
        Slide {index + 1}
        {totalSlides != null ? ` / ${totalSlides}` : ''}
      </span>
    </div>
  );
}
