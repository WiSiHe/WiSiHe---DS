/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import { PortableText, type PortableTextComponents, type PortableTextBlock } from 'next-sanity';
import Image from 'next/image';
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

interface CustomPortableTextProps {
  className?: string;
  value: PortableTextBlock[];
}

// Image component for Portable Text
const PortableTextImage = ({ value }: { value: SanityImage }) => {
  if (!value?.asset?._ref) {
    return null;
  }

  const imageUrl = urlForImage(value)?.width(1200).fit('max').url();
  const alt = value.alt || 'Image';
  const caption = value.caption;
  const hasLqip = value.lqip && value.lqip.length > 0;

  return (
    <figure className="my-8">
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl || ''}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
          priority={false}
          loading="lazy"
          placeholder={hasLqip ? 'blur' : 'empty'}
          blurDataURL={hasLqip ? value.lqip || undefined : undefined}
          quality={80}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Code block component
const PortableTextCode = ({ value }: { value: { code: string; language?: string } }) => {
  return (
    <pre className="bg-surface-elevated text-foreground p-4 rounded-lg overflow-x-auto my-6 border border-border">
      <code className={`language-${value.language || 'text'}`}>{value.code}</code>
    </pre>
  );
};

// Callout component
const PortableTextCallout = ({
  value,
}: {
  value: { type: string; title?: string; content: PortableTextBlock[] };
}) => {
  const getCalloutStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-accent/10 border-accent/20 text-accent-dark dark:bg-accent/20 dark:border-accent/30 dark:text-accent-light';
      case 'warning':
        return 'bg-accent-warm/10 border-accent-warm/20 text-accent-warm dark:bg-accent-warm/20 dark:border-accent-warm/30 dark:text-accent-warm';
      case 'success':
        return 'bg-accent-success/10 border-accent-success/20 text-accent-success dark:bg-accent-success/20 dark:border-accent-success/30 dark:text-accent-success';
      case 'error':
        return 'bg-error/10 border-error/20 text-error dark:bg-error/20 dark:border-error/30 dark:text-error';
      default:
        return 'bg-surface-elevated border-border text-text-secondary';
    }
  };

  return (
    <div className={`border-l-4 p-4 my-6 ${getCalloutStyles(value.type)}`}>
      {value.title && <h4 className="font-semibold mb-2">{value.title}</h4>}
      <div className="prose prose-sm max-w-none">
        <PortableText value={value.content} />
      </div>
    </div>
  );
};

// Video embed component
const PortableTextVideo = ({
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
      <div className="my-6 p-4 bg-surface-elevated rounded-lg text-center border border-border">
        <p className="text-text-secondary">Invalid video URL</p>
      </div>
    );
  }

  return (
    <figure className="my-6">
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={value.title || 'Embedded video'}
        />
      </div>
      {value.caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default function CustomPortableText({ className, value }: CustomPortableTextProps) {
  const components: PortableTextComponents = {
    types: {
      image: ({ value }) => <PortableTextImage value={value as SanityImage} />,
      codeBlock: ({ value }) => (
        <PortableTextCode value={value as { code: string; language?: string }} />
      ),
      callout: ({ value }) => (
        <PortableTextCallout
          value={value as { type: string; title?: string; content: PortableTextBlock[] }}
        />
      ),
      videoEmbed: ({ value }) => (
        <PortableTextVideo value={value as { url: string; title?: string; caption?: string }} />
      ),
    },
    block: {
      h1: ({ children, value }) => (
        <h1
          id={value?._key ? `heading-${value._key}` : undefined}
          className="relative group scroll-mt-20"
          key={value?._key}
        >
          {children}
          {value?._key && (
            <a
              href={`#heading-${value._key}`}
              className="absolute top-0 bottom-0 left-0 flex items-center -ml-6 transition-opacity opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              aria-label="Link to heading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          )}
        </h1>
      ),
      h2: ({ children, value }) => (
        <h2
          id={value?._key ? `heading-${value._key}` : undefined}
          className="relative group scroll-mt-20"
          key={value?._key}
        >
          {children}
          {value?._key && (
            <a
              href={`#heading-${value._key}`}
              className="absolute top-0 bottom-0 left-0 flex items-center -ml-6 transition-opacity opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              aria-label="Link to heading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          )}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          id={value?._key ? `heading-${value._key}` : undefined}
          className="relative group scroll-mt-20"
          key={value?._key}
        >
          {children}
          {value?._key && (
            <a
              href={`#heading-${value._key}`}
              className="absolute top-0 bottom-0 left-0 flex items-center -ml-6 transition-opacity opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              aria-label="Link to heading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          )}
        </h3>
      ),
      h4: ({ children, value }) => (
        <h4
          id={value?._key ? `heading-${value._key}` : undefined}
          className="relative group scroll-mt-20"
          key={value?._key}
        >
          {children}
          {value?._key && (
            <a
              href={`#heading-${value._key}`}
              className="absolute top-0 bottom-0 left-0 flex items-center -ml-6 transition-opacity opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              aria-label="Link to heading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          )}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
      ),
    },
    listItem: ({ children }) => <li className="leading-relaxed">{children}</li>,
    marks: {
      link: ({ children, value }) => {
        // Properly type the link value
        const linkValue = value as LinkMark;
        return <ResolvedLink link={linkValue}>{children}</ResolvedLink>;
      },
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
      ),
      underline: ({ children }) => <u className="underline">{children}</u>,
      'strike-through': ({ children }) => <del className="line-through">{children}</del>,
    },
  };

  return (
    <div
      className={['prose prose-gray dark:prose-invert max-w-none', className]
        .filter(Boolean)
        .join(' ')}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}
