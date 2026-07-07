'use client';

import { cn } from '@wisihe/utils';
import { Link } from '@/app/components/layout/ProgressLink';
import { buildPhotographyHref, type PhotographyView } from '@/lib/photography/photographyUrl';

type PhotographyViewTabsProps = {
  activeView: PhotographyView;
  activeCountry: string | null;
};

const TABS: { id: PhotographyView; label: string }[] = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'map', label: 'Map' },
];

export function PhotographyViewTabs({ activeView, activeCountry }: PhotographyViewTabsProps) {
  return (
    <nav className='relative mb-8 border-b border-border/50' aria-label='Photography views'>
      <ul className='flex gap-8'>
        {TABS.map(tab => {
          const isActive = activeView === tab.id;
          const href = buildPhotographyHref({ view: tab.id, country: activeCountry });

          return (
            <li key={tab.id}>
              <Link
                href={href}
                scroll={false}
                className={cn(
                  'relative inline-flex pb-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-foreground-muted hover:text-foreground-subtle',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
