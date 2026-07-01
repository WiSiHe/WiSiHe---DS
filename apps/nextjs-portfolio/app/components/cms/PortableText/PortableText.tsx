'use client';

import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity';
import type { ReactNode } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import RecipeTipComponent from '../../recipes/RecipeTip/RecipeTip';
import ResolvedLink from '../ResolvedLink/ResolvedLink';
import { PortableTextCodeBlock } from './PortableTextCodeBlock';

export type PortableTextVariant = 'default' | 'article' | 'minimal';

const BREAKOUT_MEDIA_CLASS =
  'not-prose relative left-1/2 w-[min(100vw-2rem,64rem)] max-w-5xl -translate-x-1/2';

const PARAGRAPH_CLASS: Record<PortableTextVariant, string> = {
  minimal: 'mb-3 leading-relaxed text-foreground-subtle last:mb-0',
  article: 'mb-5 leading-[1.75] text-foreground text-pretty',
  default: 'mb-4 leading-relaxed',
};

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
  hotspot?: { x?: number; y?: number; height?: number; width?: number };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  alt?: string;
  caption?: string;
  lqip?: string | null;
  aspectRatio?: number | null;
};

type PortableTextCodeValue = {
  code: string;
  language?: string;
  filename?: string;
};

interface CustomPortableTextProps {
  className?: string;
  value: PortableTextBlock[];
  variant?: PortableTextVariant;
}

function HeadingAnchor({ blockKey }: Readonly<{ blockKey: string }>) {
  return (
    <a
      href={`#heading-${blockKey}`}
      className='absolute top-0 bottom-0 left-0 flex items-center -ml-6 transition-opacity opacity-0 group-hover:opacity-100 text-foreground-muted hover:text-foreground'
    >
      <span className='sr-only'>Link to heading</span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        aria-hidden='true'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
        />
      </svg>
    </a>
  );
}

function createPortableTextImage(wide: boolean) {
  return function PortableTextImage({ value }: { value: SanityImage }) {
    if (!value?.asset?._ref) return null;

    const imageUrl = urlForImage(value)?.width(1200).fit('max').url();
    const alt = value.alt || 'Image';
    const caption = value.caption;
    const hasLqip = value.lqip && value.lqip.length > 0;

    return (
      <figure className={cn('my-8', wide && BREAKOUT_MEDIA_CLASS)}>
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
        {caption ? (
          <figcaption className='mt-2 text-sm text-center text-foreground-muted'>
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  };
}

function createPortableTextVideo(wide: boolean) {
  return function PortableTextVideo({
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
        <div className='my-6 p-4 bg-surface-subtle rounded-lg text-center border border-border'>
          <p className='text-foreground-subtle'>Invalid video URL</p>
        </div>
      );
    }

    return (
      <figure className={cn('my-6', wide && BREAKOUT_MEDIA_CLASS)}>
        <div className='aspect-video w-full'>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className='w-full h-full rounded-lg'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            title={value.title || 'Embedded video'}
          />
        </div>
        {value.caption ? (
          <figcaption className='mt-2 text-sm text-center text-foreground-muted'>
            {value.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  };
}

function createPortableTextCodeBlock(wide: boolean) {
  return function CodeBlockType({ value }: { value: PortableTextCodeValue }) {
    return (
      <div className={cn(wide && BREAKOUT_MEDIA_CLASS)}>
        <PortableTextCodeBlock
          code={value.code}
          language={value.language}
          filename={value.filename}
        />
      </div>
    );
  };
}

function createHeadingBlock(
  variant: PortableTextVariant,
  Tag: 'h1' | 'h2' | 'h3' | 'h4',
  className: string,
) {
  return function HeadingBlock({
    children,
    value,
  }: {
    children?: ReactNode;
    value?: PortableTextBlock;
  }) {
    const blockKey = value?._key;
    const withAnchor = variant === 'default' && blockKey;

    return (
      <Tag
        id={blockKey ? `heading-${blockKey}` : undefined}
        className={cn(className, withAnchor && 'relative group scroll-mt-20')}
        key={blockKey}
      >
        {children}
        {withAnchor ? <HeadingAnchor blockKey={blockKey} /> : null}
      </Tag>
    );
  };
}

function createPortableTextComponents(variant: PortableTextVariant): PortableTextComponents {
  const wide = variant === 'article';

  const headingClass: Record<'h1' | 'h2' | 'h3' | 'h4', string> =
    variant === 'article'
      ? {
          h1: 'font-serif text-3xl md:text-4xl font-bold text-foreground mt-0 mb-6 scroll-mt-24',
          h2: 'font-serif text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 scroll-mt-24 first:mt-0',
          h3: 'font-serif text-xl md:text-2xl font-semibold text-foreground mt-10 mb-3 scroll-mt-24',
          h4: 'text-lg font-semibold text-foreground mt-8 mb-2 scroll-mt-24',
        }
      : {
          h1: 'relative group scroll-mt-20',
          h2: 'relative group scroll-mt-20',
          h3: 'relative group scroll-mt-20',
          h4: 'relative group scroll-mt-20',
        };

  const paragraphClass = PARAGRAPH_CLASS[variant];

  const listClass = variant === 'article' ? 'mb-6 space-y-2 pl-5' : 'mb-4 space-y-2';

  return {
    types: {
      divider: ({ value }) => (
        <hr
          className={
            (value as { style?: string })?.style === 'space'
              ? 'my-10 border-0'
              : 'my-8 border-border'
          }
        />
      ),
      code: createPortableTextCodeBlock(wide),
      image: createPortableTextImage(wide),
      codeBlock: ({ value }) => {
        const codeValue = value as PortableTextCodeValue;
        const block = <PortableTextCodeBlock code={codeValue.code} language={codeValue.language} />;
        return wide ? <div className={BREAKOUT_MEDIA_CLASS}>{block}</div> : block;
      },
      callout: ({ value }) => (
        <PortableTextCallout
          value={
            value as {
              type: string;
              title?: string;
              content: PortableTextBlock[];
            }
          }
          wide={wide}
        />
      ),
      recipeTip: ({ value }) => (
        <RecipeTipComponent
          tip={
            value as {
              icon?: string;
              title?: string;
              content: string;
              type: string;
            }
          }
        />
      ),
      videoEmbed: createPortableTextVideo(wide),
    },
    block: {
      h1: createHeadingBlock(variant, 'h1', headingClass.h1),
      h2: createHeadingBlock(variant, 'h2', headingClass.h2),
      h3: createHeadingBlock(variant, 'h3', headingClass.h3),
      h4: createHeadingBlock(variant, 'h4', headingClass.h4),
      blockquote: ({ children }) => (
        <blockquote
          className={cn(
            'border-l-4 border-accent pl-4 italic text-foreground-muted',
            variant === 'article' && 'my-8 text-base md:text-lg',
          )}
        >
          {children}
        </blockquote>
      ),
      normal: ({ children }) => <p className={paragraphClass}>{children}</p>,
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={cn(
            listClass,
            variant === 'article' ? 'list-disc list-outside' : 'list-disc list-inside',
          )}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className={cn(
            listClass,
            variant === 'article' ? 'list-decimal list-outside' : 'list-decimal list-inside',
          )}
        >
          {children}
        </ol>
      ),
    },
    listItem: ({ children }) => <li className='leading-relaxed'>{children}</li>,
    marks: {
      link: ({ children, value }) => {
        const linkValue = value as LinkMark;
        return <ResolvedLink link={linkValue}>{children}</ResolvedLink>;
      },
      strong: ({ children }) => (
        <strong className='font-semibold text-foreground'>{children}</strong>
      ),
      em: ({ children }) => <em className='italic'>{children}</em>,
      code: ({ children }) => (
        <code className='bg-surface-subtle px-1 py-0.5 rounded text-sm font-mono'>{children}</code>
      ),
      underline: ({ children }) => <u className='underline'>{children}</u>,
      'strike-through': ({ children }) => <del className='line-through'>{children}</del>,
    },
  };
}

function PortableTextCallout({
  value,
  wide,
}: Readonly<{
  value: { type: string; title?: string; content: PortableTextBlock[] };
  wide: boolean;
}>) {
  const getCalloutStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-info-subtle border-info text-info-text';
      case 'warning':
        return 'bg-warning-subtle border-warning text-warning-text';
      case 'success':
        return 'bg-success-subtle border-success text-success-text';
      case 'error':
        return 'bg-danger-subtle border-danger text-danger-text';
      default:
        return 'bg-surface-subtle border-border text-foreground-subtle';
    }
  };

  return (
    <div
      className={cn(
        'border-l-4 p-4 my-6',
        getCalloutStyles(value.type),
        wide && BREAKOUT_MEDIA_CLASS,
      )}
    >
      {value.title ? <h4 className='font-semibold mb-2'>{value.title}</h4> : null}
      <div className='prose prose-sm max-w-none'>
        <PortableText value={value.content} />
      </div>
    </div>
  );
}

const VARIANT_WRAPPER_CLASS: Record<PortableTextVariant, string> = {
  default: 'prose prose-gray dark:prose-invert max-w-none',
  article:
    'prose prose-neutral dark:prose-invert max-w-none text-foreground prose-headings:font-serif prose-headings:text-foreground prose-a:text-accent prose-a:underline-offset-2 hover:prose-a:text-accent-hover',
  minimal: 'max-w-none',
};

export default function CustomPortableText({
  className,
  value,
  variant = 'default',
}: Readonly<CustomPortableTextProps>) {
  const components = createPortableTextComponents(variant);

  return (
    <div className={[VARIANT_WRAPPER_CLASS[variant], className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  );
}
