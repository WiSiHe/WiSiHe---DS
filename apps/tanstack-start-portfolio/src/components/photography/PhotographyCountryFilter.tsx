'use client';

import { IconFilter, IconMapPin, IconX } from '@tabler/icons-react';
import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import { cn } from '@wisihe/utils';
import { useEffect, useState } from 'react';
import { RouterLink } from '@/components/layout/RouterLink';
import type { PhotographyCountryFilterItem } from '@/lib/photography/photographyCountries';

type CountryFilterRowProps = {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
};

function CountryFilterRow({ active, label, count, onClick }: CountryFilterRowProps) {
  return (
    <li className='w-full'>
      <button
        type='button'
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-colors',
          active
            ? 'bg-accent/10 font-medium text-foreground'
            : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        )}
      >
        <span className='min-w-0 grow truncate'>{label}</span>
        <span
          className={cn(
            'shrink-0 tabular-nums text-xs',
            active ? 'text-accent' : 'text-foreground-muted',
          )}
        >
          {count}
        </span>
      </button>
    </li>
  );
}

type PhotographyCountryFilterPanelProps = {
  countries: PhotographyCountryFilterItem[];
  activeCountry: string | null;
  totalCount: number;
  filteredCount: number;
  onSelectCountry: (code: string | null) => void;
};

function PhotographyCountryFilterPanel({
  countries,
  activeCountry,
  totalCount,
  filteredCount,
  onSelectCountry,
}: PhotographyCountryFilterPanelProps) {
  return (
    <>
      <div className='flex flex-col gap-1.5'>
        <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
          Places
        </p>
        <p className='text-sm text-foreground-subtle'>
          {filteredCount} of {totalCount} in view
        </p>
      </div>

      <ul className='flex w-full flex-col gap-0.5'>
        <CountryFilterRow
          active={activeCountry === null}
          label='All places'
          count={totalCount}
          onClick={() => onSelectCountry(null)}
        />
        {countries.map(country => (
          <CountryFilterRow
            key={country.code}
            active={activeCountry === country.code}
            label={country.name}
            count={country.count}
            onClick={() => onSelectCountry(country.code === activeCountry ? null : country.code)}
          />
        ))}
      </ul>

      {ABOUT_PAGE_LINKS_ENABLED ? (
        <p className='border-t border-border/40 pt-4 text-xs leading-relaxed text-foreground-muted'>
          <RouterLink
            href='/about#travel-map-section'
            className='inline-flex items-center gap-1.5 font-medium text-accent hover:underline'
          >
            <IconMapPin className='size-3.5 shrink-0' stroke={1.75} aria-hidden />
            Full travel story on About
          </RouterLink>
        </p>
      ) : null}
    </>
  );
}

type PhotographyCountryFilterProps = PhotographyCountryFilterPanelProps;

export function PhotographyCountryFilter({
  countries,
  activeCountry,
  totalCount,
  filteredCount,
  onSelectCountry,
}: PhotographyCountryFilterProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktopLayout(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen && !isDesktopLayout ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktopLayout, isMobileFiltersOpen]);

  const handleSelectCountry = (code: string | null) => {
    onSelectCountry(code);
    setIsMobileFiltersOpen(false);
  };

  if (countries.length <= 1) return null;

  return (
    <>
      <div className='md:hidden'>
        <button
          type='button'
          onClick={() => setIsMobileFiltersOpen(true)}
          className='flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-accent-border hover:bg-surface-hover'
        >
          <IconFilter className='size-4' stroke={2} aria-hidden />
          Places
          {activeCountry ? (
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-contrast'>
              1
            </span>
          ) : null}
        </button>
      </div>

      <div
        aria-hidden='true'
        onClick={() => setIsMobileFiltersOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isMobileFiltersOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'z-50 flex flex-col gap-6',
          'max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[90dvh] max-md:w-full max-md:overflow-y-auto',
          'max-md:rounded-t-3xl max-md:border-t max-md:border-border max-md:bg-background max-md:p-6 max-md:shadow-2xl',
          'max-md:transition-transform max-md:duration-300 max-md:ease-out',
          isMobileFiltersOpen
            ? 'max-md:translate-y-0'
            : 'max-md:pointer-events-none max-md:translate-y-full',
          'md:pointer-events-auto md:relative md:w-56 md:shrink-0 md:translate-y-0 md:overflow-visible md:border-0 md:p-0 md:shadow-none',
          'md:sticky md:top-32 xl:top-36',
        )}
        role={!isDesktopLayout && isMobileFiltersOpen ? 'dialog' : undefined}
        aria-label={!isDesktopLayout && isMobileFiltersOpen ? 'Places filter' : undefined}
      >
        <div className='flex items-center justify-between border-b border-border/50 pb-2 md:hidden'>
          <h2 className='text-xl font-bold text-foreground'>Places</h2>
          <button
            type='button'
            onClick={() => setIsMobileFiltersOpen(false)}
            className='-mr-2 rounded-full p-2 text-foreground-muted hover:bg-surface-hover hover:text-foreground'
            aria-label='Close places filter'
          >
            <IconX className='size-6' stroke={2} aria-hidden />
          </button>
        </div>

        <PhotographyCountryFilterPanel
          countries={countries}
          activeCountry={activeCountry}
          totalCount={totalCount}
          filteredCount={filteredCount}
          onSelectCountry={handleSelectCountry}
        />
      </aside>
    </>
  );
}
