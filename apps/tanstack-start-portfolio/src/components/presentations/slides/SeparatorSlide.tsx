import type { PresentationSlide } from '@/lib/presentations/types';

type SeparatorSlideProps = {
  slideData: PresentationSlide;
};

export function SeparatorSlide({ slideData }: SeparatorSlideProps) {
  const design = slideData.slideDesign || 'default';

  if (design === 'minimal') {
    return (
      <div className='flex h-full w-full items-center justify-center px-6 md:px-8 lg:px-12'>
        <h2 className='max-w-6xl text-center text-3xl font-medium tracking-wide text-foreground/80 md:text-5xl lg:text-6xl'>
          {slideData.title}
        </h2>
      </div>
    );
  }

  if (design === 'bold') {
    return (
      <div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 md:px-8 lg:px-12'>
        <div className='absolute inset-0 bg-accent/10' />
        <div className='absolute top-0 left-0 h-2 w-full bg-accent md:h-3' />
        <div className='absolute bottom-0 left-0 h-2 w-full bg-accent md:h-3' />
        <h2 className='max-w-6xl text-center text-5xl leading-none font-black tracking-tighter text-foreground uppercase md:text-7xl lg:text-8xl'>
          {slideData.title}
        </h2>
      </div>
    );
  }

  if (design === 'hero') {
    return (
      <div className='relative flex h-full w-full flex-col items-center justify-center px-6 md:px-8 lg:px-12'>
        <div className='absolute inset-0 bg-accent/10' />
        <h2 className='max-w-6xl text-center text-5xl font-black tracking-tight text-foreground uppercase md:text-7xl lg:text-8xl'>
          {slideData.title}
        </h2>
        <div className='mt-12 h-1.5 w-48 rounded-full bg-accent md:mt-16' />
      </div>
    );
  }

  if (design === 'centered') {
    return (
      <div className='relative flex h-full w-full flex-col items-center justify-center px-6 md:px-8 lg:px-12'>
        <div className='absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10' />
        <div className='absolute top-1/2 left-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20' />
        <div className='mb-10 h-3 w-3 rounded-full bg-accent md:mb-12' />
        <h2 className='relative z-10 max-w-6xl text-center text-4xl font-bold text-foreground md:text-6xl lg:text-7xl'>
          {slideData.title}
        </h2>
        <div className='mt-10 h-3 w-3 rounded-full bg-accent md:mt-12' />
      </div>
    );
  }

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center px-6 md:px-8 lg:px-12'>
      <div className='absolute inset-0 bg-surface-subtle/30' />
      <div className='absolute top-1/2 right-12 left-12 h-px bg-border' />
      <h2 className='relative z-10 max-w-6xl text-center text-5xl font-black tracking-tight text-foreground uppercase md:text-7xl lg:text-8xl'>
        {slideData.title}
      </h2>
      <div className='mt-12 h-1 w-32 rounded-full bg-accent md:mt-16' />
    </div>
  );
}
