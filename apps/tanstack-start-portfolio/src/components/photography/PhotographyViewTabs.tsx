'use client';

import { Link } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import { buildPhotographySearch, type PhotographyView } from '@/lib/photography/photographyUrl';

type PhotographyViewTabsProps = {
  activeView: PhotographyView;
  activeCountry: string | null;
  mapAvailable: boolean;
};

const TABS: { id: PhotographyView; label: string }[] = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'map', label: 'Map' },
];

export function PhotographyViewTabs({
  activeView,
  activeCountry,
  mapAvailable,
}: PhotographyViewTabsProps) {
  return (
    <nav className='relative mb-8 border-b border-border/50' aria-label='Photography views'>
      {!mapAvailable ? (
        <p className='mb-4 text-sm text-foreground-muted'>
          Map view is unavailable — add <code className='text-accent'>VITE_MAPBOX_TOKEN</code> to
          enable the interactive map. Browsing the gallery works as usual.
        </p>
      ) : null}
      <ul className='flex gap-8'>
        {TABS.map(tab => {
          const isActive = activeView === tab.id;
          const isMapTabDisabled = tab.id === 'map' && !mapAvailable;

          return (
            <li key={tab.id}>
              {isMapTabDisabled ? (
                <span
                  className={cn(
                    'relative inline-flex pb-3 text-sm font-medium text-foreground-muted/50',
                  )}
                  aria-disabled
                >
                  {tab.label}
                </span>
              ) : (
                <Link
                  to='/photography'
                  search={buildPhotographySearch({ view: tab.id, country: activeCountry })}
                  resetScroll={false}
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
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
