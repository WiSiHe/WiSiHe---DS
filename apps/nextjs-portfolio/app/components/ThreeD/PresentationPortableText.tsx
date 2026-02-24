'use client';

/**
 * Presentation-specific Portable Text renderer
 * Styled for slide presentations with larger text and accent colors
 */

import Image from 'next/image';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/utils';
import ResolvedLink from '../ResolvedLink/ResolvedLink';

// Type for link mark definitions from Sanity
type LinkMark = {
  _type: 'link';
  _key: string;
  linkType?: 'href' | 'slug' | 'painting' | 'project';
  href?: string;
  slug?: string;
  painting?: {
    _ref: string;
    _type: 'reference';
  };
  project?: {
    _ref: string;
    _type: 'reference';
  };
  openInNewTab?: boolean;
};

// Type for image assets from Sanity
type SanityImage = {
  _type: 'image';
  asset?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  alt?: string;
  caption?: string;
  lqip?: string | null;
  aspectRatio?: number | null;
};

interface PresentationPortableTextProps {
  className?: string;
  value: PortableTextBlock[];
  // Slide design variant for responsive sizing
  slideDesign?: 'default' | 'centered' | 'split' | 'full-width' | 'minimal' | 'hero';
}

// Image component for Portable Text in presentations
const PresentationImage = ({ value }: { value: SanityImage }) => {
  if (!value?.asset?._ref) {
    return null;
  }

  const imageUrl = urlForImage(value)?.width(1200).fit('max').url();
  const alt = value.alt || 'Image';
  const caption = value.caption;
  const hasLqip = value.lqip && value.lqip.length > 0;

  return (
    <figure className='my-6'>
      <div className='relative w-full overflow-hidden rounded-lg'>
        <Image
          src={imageUrl || ''}
          alt={alt}
          width={1200}
          height={800}
          className='w-full h-auto object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px'
          priority={false}
          loading='lazy'
          placeholder={hasLqip ? 'blur' : 'empty'}
          blurDataURL={hasLqip ? value.lqip || undefined : undefined}
          quality={80}
        />
      </div>
      {caption && (
        <figcaption className='mt-2 text-sm text-center text-foreground/60'>{caption}</figcaption>
      )}
    </figure>
  );
};

// Code block component for presentations
const PresentationCode = ({ value }: { value: { code: string; language?: string } }) => {
  return (
    <pre className='bg-surface-elevated text-foreground p-4 rounded-lg overflow-x-auto my-4 border border-border text-base md:text-lg'>
      <code className={`language-${value.language || 'text'}`}>{value.code}</code>
    </pre>
  );
};

// Callout component for presentations
const PresentationCallout = ({
  value,
}: {
  value: { type: string; title?: string; content: PortableTextBlock[] };
}) => {
  const getCalloutStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-accent-subtle border-accent-border text-accent-text';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      default:
        return 'bg-surface-elevated border-border text-foreground/80';
    }
  };

  return (
    <div className={`border-l-4 p-4 my-4 rounded-r-lg ${getCalloutStyles(value.type)}`}>
      {value.title && <h4 className='font-bold mb-2 text-lg'>{value.title}</h4>}
      <div className='text-base'>
        <PortableText value={value.content} />
      </div>
    </div>
  );
};

// Video embed component for presentations
const PresentationVideo = ({
  value,
}: {
  value: { url: string; title?: string; caption?: string };
}) => {
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname === 'youtu.be') {
        return videoUrl.pathname.slice(1);
      }
      if (videoUrl.hostname.includes('youtube.com')) {
        if (videoUrl.pathname.includes('/shorts/')) {
          return videoUrl.pathname.split('/shorts/')[1];
        }
        return videoUrl.searchParams.get('v');
      }
      return null;
    } catch {
      return null;
    }
  };

  const videoId = getYouTubeVideoId(value.url);

  if (!videoId) {
    return (
      <div className='my-4 p-4 bg-surface-elevated rounded-lg text-center border border-border'>
        <p className='text-foreground/60'>Invalid video URL</p>
      </div>
    );
  }

  return (
    <figure className='my-4'>
      <div className='aspect-video w-full'>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className='w-full h-full rounded-lg'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title={value.title || 'Embedded video'}
        />
      </div>
      {value.caption && (
        <figcaption className='mt-2 text-sm text-center text-foreground/60'>
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default function PresentationPortableText({
  className,
  value,
  slideDesign = 'default',
}: PresentationPortableTextProps) {
  // Get text size classes based on slide design
  const getTextSizeClasses = () => {
    switch (slideDesign) {
      case 'minimal':
        return {
          normal: 'text-base md:text-lg lg:text-xl',
          h1: 'text-2xl md:text-3xl lg:text-4xl',
          h2: 'text-xl md:text-2xl lg:text-3xl',
          h3: 'text-lg md:text-xl lg:text-2xl',
          h4: 'text-base md:text-lg lg:text-xl',
          list: 'text-base md:text-lg lg:text-xl',
        };
      case 'hero':
        return {
          normal: 'text-xl md:text-2xl lg:text-3xl',
          h1: 'text-4xl md:text-5xl lg:text-6xl',
          h2: 'text-3xl md:text-4xl lg:text-5xl',
          h3: 'text-2xl md:text-3xl lg:text-4xl',
          h4: 'text-xl md:text-2xl lg:text-3xl',
          list: 'text-xl md:text-2xl lg:text-3xl',
        };
      default:
        return {
          normal: 'text-lg md:text-xl lg:text-2xl',
          h1: 'text-3xl md:text-4xl lg:text-5xl',
          h2: 'text-2xl md:text-3xl lg:text-4xl',
          h3: 'text-xl md:text-2xl lg:text-3xl',
          h4: 'text-lg md:text-xl lg:text-2xl',
          list: 'text-lg md:text-xl lg:text-2xl',
        };
    }
  };

  const sizes = getTextSizeClasses();

  const components: PortableTextComponents = {
    types: {
      image: ({ value }) => <PresentationImage value={value as SanityImage} />,
      codeBlock: ({ value }) => (
        <PresentationCode value={value as { code: string; language?: string }} />
      ),
      callout: ({ value }) => (
        <PresentationCallout
          value={value as { type: string; title?: string; content: PortableTextBlock[] }}
        />
      ),
      videoEmbed: ({ value }) => (
        <PresentationVideo value={value as { url: string; title?: string; caption?: string }} />
      ),
    },
    block: {
      h1: ({ children }) => (
        <h1 className={`${sizes.h1} font-black text-foreground mb-4 leading-tight`}>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className={`${sizes.h2} font-bold text-foreground mb-3 leading-tight`}>{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className={`${sizes.h3} font-semibold text-foreground mb-2 leading-tight`}>
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className={`${sizes.h4} font-semibold text-foreground mb-2 leading-tight`}>
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className='border-l-4 border-accent pl-4 my-4 italic text-foreground/80'>
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className={`${sizes.normal} text-foreground/90 mb-4 leading-relaxed`}>{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`${sizes.list} space-y-3 mb-4 list-none`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`${sizes.list} space-y-3 mb-4 list-decimal list-inside`}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className='flex items-start gap-3 group'>
          <span className='shrink-0 mt-2.5'>
            <span className='block w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-200' />
          </span>
          <span className='flex-1 text-foreground/90 leading-relaxed'>{children}</span>
        </li>
      ),
      number: ({ children }) => <li className='text-foreground/90 leading-relaxed'>{children}</li>,
    },
    marks: {
      link: ({ children, value }) => {
        const linkValue = value as LinkMark;
        return (
          <ResolvedLink
            link={linkValue}
            className='text-accent hover:text-accent/80 hover:underline transition-colors font-medium'
          >
            {children}
          </ResolvedLink>
        );
      },
      strong: ({ children }) => <strong className='font-bold text-foreground'>{children}</strong>,
      em: ({ children }) => <em className='italic'>{children}</em>,
      code: ({ children }) => (
        <code className='bg-surface-elevated px-1.5 py-0.5 rounded text-sm font-mono text-accent border border-border'>
          {children}
        </code>
      ),
      underline: ({ children }) => <u className='underline decoration-accent'>{children}</u>,
      'strike-through': ({ children }) => (
        <del className='line-through text-foreground/60'>{children}</del>
      ),
    },
  };

  return (
    <div className={['max-w-none', className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  );
}
