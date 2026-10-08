import { cn } from '@wisihe/utils';
import type { ContentItem } from '@/lib/presentations/types';
import type { SlideDesign } from './utils';

type ContentItemListProps = {
  items: ContentItem[];
  slideDesign: SlideDesign;
};

function contentItemKey(item: ContentItem): string {
  return typeof item === 'string' ? item : `${item.text}|${item.url ?? ''}`;
}

function ContentItemRenderer({
  contentItem,
  index,
  level = 0,
}: {
  contentItem: ContentItem;
  index: number;
  level?: number;
}) {
  const isNested = level > 0;
  const isObject = typeof contentItem === 'object';
  const text = isObject ? contentItem.text : contentItem;
  const url = isObject ? contentItem.url : undefined;
  const children = isObject ? contentItem.children : undefined;
  const cleanText = text.trim().replace(/^•\s*/, '');
  const isExternal = url?.startsWith('http://') || url?.startsWith('https://');

  return (
    <li
      key={`${index}-${level}`}
      className={cn('flex min-w-0 items-start gap-4', isNested ? 'pl-6 md:pl-8' : 'group')}
    >
      <div className='mt-2 shrink-0'>
        {isNested ? (
          <div className='h-0.5 w-3 bg-accent/70' />
        ) : (
          <div className='h-2 w-2 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125' />
        )}
      </div>
      <div className='flex-1'>
        {url ? (
          <a
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={cn(
              'inline-block leading-relaxed break-words transition-colors',
              isNested
                ? 'text-base text-accent md:text-lg lg:text-xl'
                : 'text-lg text-accent hover:text-accent/80 hover:underline md:text-xl lg:text-2xl',
            )}
          >
            {cleanText}
          </a>
        ) : (
          <span
            className={cn(
              'leading-relaxed break-words',
              isNested
                ? 'text-base text-foreground/80 md:text-lg lg:text-xl'
                : 'text-lg text-foreground/90 transition-colors group-hover:text-foreground md:text-xl lg:text-2xl',
            )}
          >
            {cleanText}
          </span>
        )}
        {children && children.length > 0 ? (
          <ul className='mt-3 list-none space-y-3'>
            {children
              .filter(child => {
                if (typeof child === 'string') return child.trim() !== '';
                return child.text?.trim() !== '';
              })
              .map((child, childIndex) => (
                <ContentItemRenderer
                  key={contentItemKey(child)}
                  contentItem={child}
                  index={childIndex}
                  level={level + 1}
                />
              ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function ContentItemList({ items, slideDesign }: ContentItemListProps) {
  const filteredItems = items.filter(item => {
    if (typeof item === 'string') return item.trim() !== '';
    return item.text?.trim() !== '';
  });

  return (
    <ul
      className={cn(
        'mx-auto w-full max-w-6xl list-none overflow-x-hidden px-4 md:px-6',
        slideDesign === 'minimal'
          ? 'space-y-4 md:space-y-5'
          : slideDesign === 'hero'
            ? 'space-y-6 md:space-y-8'
            : 'space-y-5 md:space-y-6',
      )}
    >
      {filteredItems.map((item, itemIndex) => (
        <ContentItemRenderer key={contentItemKey(item)} contentItem={item} index={itemIndex} />
      ))}
    </ul>
  );
}
