'use client';

import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react';
import { cn } from '@wisihe/utils';
import ResolvedLink from '@/components/cms/ResolvedLink';
import Image from '@/components/ui/Image';
import { urlForImage } from '@/lib/sanity';
import type { SlideDesign } from './slides/utils';

type LinkMark = {
  _type: 'link';
  _key: string;
  linkType?: 'href' | 'slug' | 'painting' | 'project' | 'recipe' | 'video';
  href?: string;
  slug?: string;
  painting?: { _ref: string; _type: 'reference' };
  project?: { _ref: string; _type: 'reference' };
  recipe?: { _ref: string; _type: 'reference' };
  video?: { _ref: string; _type: 'reference' };
  openInNewTab?: boolean;
};

type SanityImage = {
  _type: 'image';
  asset?: { _ref: string; _type: 'reference'; _weak?: boolean };
  alt?: string;
  caption?: string;
  lqip?: string | null;
};

type PresentationPortableTextProps = {
  className?: string;
  value: PortableTextBlock[];
  slideDesign?: SlideDesign;
};

function PresentationImage({ value }: { value: SanityImage }) {
  if (!value?.asset?._ref) return null;

  const imageUrl = urlForImage(value)?.width(1200).fit('max').url();
  const alt = value.alt || 'Image';

  return (
    <figure className='my-6'>
      <div className='relative w-full overflow-hidden rounded-lg'>
        <Image
          src={imageUrl || ''}
          alt={alt}
          width={1200}
          height={800}
          className='h-auto w-full object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px'
          loading='lazy'
        />
      </div>
      {value.caption ? (
        <figcaption className='mt-2 text-center text-sm text-foreground/60'>
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PresentationCode({ value }: { value: { code: string; language?: string } }) {
  return (
    <pre className='my-4 overflow-x-auto rounded-lg border border-border bg-surface-elevated p-4 text-base text-foreground md:text-lg'>
      <code className={`language-${value.language || 'text'}`}>{value.code}</code>
    </pre>
  );
}

function PresentationVideo({
  value,
}: {
  value: { url: string; title?: string; caption?: string };
}) {
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname === 'youtu.be') return videoUrl.pathname.slice(1);
      if (videoUrl.hostname.includes('youtube.com')) {
        if (videoUrl.pathname.includes('/shorts/')) {
          return videoUrl.pathname.split('/shorts/')[1] ?? null;
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
      <div className='my-4 rounded-lg border border-border bg-surface-elevated p-4 text-center'>
        <p className='text-foreground/60'>Invalid video URL</p>
      </div>
    );
  }

  return (
    <figure className='my-4'>
      <div className='aspect-video w-full'>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className='h-full w-full rounded-lg'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title={value.title || 'Embedded video'}
        />
      </div>
      {value.caption ? (
        <figcaption className='mt-2 text-center text-sm text-foreground/60'>
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function getTextSizeClasses(slideDesign: SlideDesign) {
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
}

export default function PresentationPortableText({
  className,
  value,
  slideDesign = 'default',
}: PresentationPortableTextProps) {
  const sizes = getTextSizeClasses(slideDesign);

  const components: PortableTextComponents = {
    types: {
      image: ({ value: imageValue }) => <PresentationImage value={imageValue as SanityImage} />,
      codeBlock: ({ value: codeValue }) => (
        <PresentationCode value={codeValue as { code: string; language?: string }} />
      ),
      videoEmbed: ({ value: videoValue }) => (
        <PresentationVideo
          value={videoValue as { url: string; title?: string; caption?: string }}
        />
      ),
    },
    block: {
      h1: ({ children }) => (
        <h1 className={`${sizes.h1} mb-4 leading-tight font-black text-foreground`}>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className={`${sizes.h2} mb-3 leading-tight font-bold text-foreground`}>{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className={`${sizes.h3} mb-2 leading-tight font-semibold text-foreground`}>
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className={`${sizes.h4} mb-2 leading-tight font-semibold text-foreground`}>
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className='my-4 border-l-4 border-accent pl-4 text-foreground/80 italic'>
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className={`${sizes.normal} mb-4 leading-relaxed text-foreground/90`}>{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`${sizes.list} mb-4 list-none space-y-3`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`${sizes.list} mb-4 list-inside list-decimal space-y-3`}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className='group flex items-start gap-3'>
          <span className='mt-2.5 shrink-0'>
            <span className='block h-2 w-2 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125' />
          </span>
          <span className='flex-1 leading-relaxed text-foreground/90'>{children}</span>
        </li>
      ),
      number: ({ children }) => <li className='leading-relaxed text-foreground/90'>{children}</li>,
    },
    marks: {
      link: ({ children, value: markValue }) => (
        <ResolvedLink
          link={markValue as LinkMark}
          className='font-medium text-accent transition-colors hover:text-accent/80 hover:underline'
        >
          {children}
        </ResolvedLink>
      ),
      strong: ({ children }) => <strong className='font-bold text-foreground'>{children}</strong>,
      em: ({ children }) => <em className='italic'>{children}</em>,
      code: ({ children }) => (
        <code className='rounded border border-border bg-surface-elevated px-1.5 py-0.5 font-mono text-sm text-accent'>
          {children}
        </code>
      ),
      underline: ({ children }) => <u className='decoration-accent underline'>{children}</u>,
      'strike-through': ({ children }) => (
        <del className='text-foreground/60 line-through'>{children}</del>
      ),
    },
  };

  return (
    <div className={cn('max-w-none', className)}>
      <PortableText components={components} value={value} />
    </div>
  );
}
