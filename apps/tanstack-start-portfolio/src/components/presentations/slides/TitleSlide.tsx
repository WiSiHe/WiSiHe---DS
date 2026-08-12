import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '@/lib/presentations/types';

type TitleSlideProps = {
  slideData: PresentationSlide;
};

export function TitleSlide({ slideData }: TitleSlideProps) {
  const slideDesign = slideData.slideDesign || 'default';

  const getTitleClasses = () => {
    switch (slideDesign) {
      case 'minimal':
        return 'text-4xl md:text-6xl lg:text-7xl';
      case 'hero':
        return 'text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem]';
      default:
        return 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem]';
    }
  };

  const showDecorations = slideDesign !== 'minimal';
  const isHero = slideDesign === 'hero';

  return (
    <div
      className={cn(
        'relative w-full space-y-8 text-center',
        slideDesign === 'minimal'
          ? 'py-12 md:py-16 lg:py-20'
          : isHero
            ? 'py-12 md:py-16 lg:py-24'
            : 'py-12 md:py-16 lg:py-24',
      )}
    >
      {showDecorations ? (
        <>
          <div
            className={cn(
              'absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl',
              isHero ? 'h-[600px] w-[600px] bg-accent/10' : 'h-96 w-96 bg-accent/5',
            )}
          />
          <div
            className={cn(
              'absolute right-0 bottom-0 rounded-full blur-3xl',
              isHero ? 'h-96 w-96 bg-accent/10' : 'h-64 w-64 bg-accent/5',
            )}
          />
        </>
      ) : null}

      <div className='relative z-10 mb-12 inline-flex items-center gap-3 rounded-full bg-accent px-4 py-2.5 text-accent-contrast shadow-lg'>
        <span className='px-4 py-1.5 font-mono text-xs tracking-wider text-foreground/60 uppercase'>
          PRESENTATION
        </span>
        {slideData.category ? (
          <>
            <div className='h-1 w-1 rounded-full bg-border' />
            <span className='px-4 py-1.5 text-xs font-semibold tracking-wider text-accent uppercase'>
              {slideData.category}
            </span>
          </>
        ) : null}
      </div>

      <div className='relative z-10 mx-auto max-w-6xl'>
        <h1
          className={cn(
            getTitleClasses(),
            'mb-8 leading-[1.1] font-black tracking-tight text-foreground uppercase md:mb-10',
            'break-words px-4',
          )}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          <span className='mb-4 block text-foreground md:mb-6'>
            {slideData.title.split(':')[0]}
          </span>
          {slideData.title.includes(':') ? (
            <span className='mt-4 block text-4xl text-accent md:mt-6 md:text-5xl lg:text-6xl'>
              {slideData.title.split(':').slice(1).join(':')}
            </span>
          ) : null}
        </h1>

        {slideData.subtitle ? (
          <div>
            <p
              className='mt-8 text-2xl leading-relaxed font-bold break-words text-foreground/80 md:mt-12 md:text-4xl lg:text-5xl'
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {slideData.subtitle}
            </p>
            {showDecorations ? (
              <div className='mt-12 flex justify-center gap-2 md:mt-16'>
                <div className='h-1 w-16 rounded-full bg-accent' />
                <div className='h-1 w-8 rounded-full bg-accent/50' />
                <div className='h-1 w-4 rounded-full bg-accent/30' />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
