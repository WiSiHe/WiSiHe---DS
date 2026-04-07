import { cn } from '@wisihe/utils';
import type { ContentItem } from '../../../three-d/types';
import type { SlideDesign } from './utils';

interface ContentItemListProps {
  items: ContentItem[];
  slideDesign: SlideDesign;
}

// Recursive component for rendering nested bullets
const ContentItemRenderer = ({
  contentItem,
  index,
  level = 0,
}: {
  contentItem: ContentItem;
  index: number;
  level?: number;
}) => {
  const isNested = level > 0;
  const isObject = typeof contentItem === 'object';
  const text = isObject ? contentItem.text : contentItem;
  const url = isObject ? contentItem.url : undefined;
  const children = isObject ? contentItem.children : undefined;

  // Remove leading bullet character if present
  const cleanText = text.trim().replace(/^•\s*/, '');

  // Determine if URL is external (starts with http:// or https://)
  const isExternal = url?.startsWith('http://') || url?.startsWith('https://');

  return (
    <li
      key={`${index}-${level}`}
      className={cn('flex items-start gap-4 min-w-0', isNested ? 'pl-6 md:pl-8' : 'group')}
    >
      <div className='shrink-0 mt-2'>
        {isNested ? (
          // Sub-bullet: smaller dash (no hover effects)
          <div className='w-3 h-0.5 bg-accent/70' />
        ) : (
          // Main bullet: accent-colored dot (with hover effects)
          <div className='w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-200' />
        )}
      </div>
      <div className='flex-1'>
        {url ? (
          // Render as link
          <a
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={cn(
              'leading-relaxed transition-colors break-words inline-block',
              isNested
                ? 'text-base md:text-lg lg:text-xl text-accent'
                : 'text-lg md:text-xl lg:text-2xl text-accent hover:text-accent/80 hover:underline',
            )}
          >
            {cleanText}
          </a>
        ) : (
          // Render as plain text
          <span
            className={cn(
              'leading-relaxed break-words',
              isNested
                ? 'text-base md:text-lg lg:text-xl text-foreground/80'
                : 'text-lg md:text-xl lg:text-2xl text-foreground/90 group-hover:text-foreground transition-colors',
            )}
          >
            {cleanText}
          </span>
        )}
        {children && children.length > 0 && (
          <ul className='mt-3 space-y-3 list-none'>
            {children
              .filter(child => {
                if (typeof child === 'string') {
                  return child.trim() !== '';
                }
                return child.text?.trim() !== '';
              })
              .map((child, childIndex) => (
                <ContentItemRenderer
                  key={childIndex}
                  contentItem={child}
                  index={childIndex}
                  level={level + 1}
                />
              ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export const ContentItemList = ({ items, slideDesign }: ContentItemListProps) => {
  const filteredItems = items.filter(item => {
    // Filter out empty strings or empty objects
    if (typeof item === 'string') {
      return item.trim() !== '';
    }
    return item.text?.trim() !== '';
  });

  return (
    <ul
      className={cn(
        'max-w-6xl mx-auto w-full list-none overflow-x-hidden px-4 md:px-6',
        slideDesign === 'minimal'
          ? 'space-y-4 md:space-y-5'
          : slideDesign === 'hero'
            ? 'space-y-6 md:space-y-8'
            : 'space-y-5 md:space-y-6',
      )}
    >
      {filteredItems.map((item, itemIndex) => (
        <ContentItemRenderer key={itemIndex} contentItem={item} index={itemIndex} />
      ))}
    </ul>
  );
};
