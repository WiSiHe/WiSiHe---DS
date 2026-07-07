'use client';

import { IconMapPin } from '@tabler/icons-react';
import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Link } from '@/app/components/layout/ProgressLink';
import { PhotographyCard } from './PhotographyCard';
import { PhotographyFeaturedHero } from './PhotographyFeaturedHero';
import { photographyGlassPanelClass, photographySectionLabelClass } from './photographyStyles';

type PhotographyListingProps = {
  photos: PhotographyListQueryResult;
  activeCountry: string | null;
};

type CountryFilter = {
  code: string;
  name: string;
  count: number;
};

function buildCountryFilters(photos: PhotographyListQueryResult): CountryFilter[] {
  const counts = new Map<string, CountryFilter>();

  for (const photo of photos) {
    const code = photo.place?.countryCode?.trim().toUpperCase();
    const name = photo.place?.countryName?.trim();
    if (!code || !name) continue;

    const existing = counts.get(code);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(code, { code, name, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function FilterOption({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors duration-200',
        active
          ? 'bg-accent/10 text-foreground'
          : 'text-foreground-subtle hover:bg-surface-hover hover:text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent transition-opacity duration-200',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
        )}
      />
      <span className='flex items-center justify-between gap-3 pl-2'>
        <span className='text-sm font-medium'>{label}</span>
        <span
          className={cn(
            'min-w-6 rounded-full px-1.5 py-0.5 text-center font-mono text-[10px] tabular-nums',
            active ? 'bg-accent/15 text-accent' : 'bg-surface-subtle text-foreground-muted',
          )}
        >
          {count}
        </span>
      </span>
    </button>
  );
}

export function PhotographyListing({ photos, activeCountry }: PhotographyListingProps) {
  const router = useRouter();

  const countryFilters = useMemo(() => buildCountryFilters(photos), [photos]);

  const setCountryFilter = useCallback(
    (code: string | null) => {
      const query = code ? `/photography?country=${encodeURIComponent(code)}` : '/photography';
      router.push(query, { scroll: false });
    },
    [router],
  );

  const filteredPhotos = useMemo(() => {
    if (!activeCountry) return photos;
    return photos.filter(photo => photo.place?.countryCode?.trim().toUpperCase() === activeCountry);
  }, [activeCountry, photos]);

  const featuredPhoto = useMemo(() => {
    if (activeCountry) return null;
    return filteredPhotos.find(photo => photo.isFeatured) ?? null;
  }, [activeCountry, filteredPhotos]);

  const gridPhotos = useMemo(() => {
    if (!featuredPhoto) return filteredPhotos;
    return filteredPhotos.filter(photo => photo._id !== featuredPhoto._id);
  }, [filteredPhotos, featuredPhoto]);

  const activeCountryName =
    countryFilters.find(country => country.code === activeCountry)?.name ?? activeCountry;

  if (!photos.length) return null;

  const galleryContent =
    filteredPhotos.length === 0 ? (
      <div className='rounded-2xl border border-dashed border-border/70 bg-surface/25 px-6 py-16 text-center backdrop-blur-sm'>
        <p className='font-serif text-2xl font-bold text-foreground'>No photos in this country</p>
        <p className='mt-2 text-foreground-muted'>Try another filter or browse the full gallery.</p>
        <button
          type='button'
          onClick={() => setCountryFilter(null)}
          className='mt-6 text-sm font-semibold text-accent hover:underline'
        >
          Show all photos
        </button>
      </div>
    ) : (
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeCountry ?? 'all'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className='space-y-12'
        >
          {featuredPhoto ? <PhotographyFeaturedHero photo={featuredPhoto} /> : null}

          {activeCountry && activeCountryName ? (
            <div className='flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-5'>
              <div>
                <p className={photographySectionLabelClass}>Filtered view</p>
                <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
                  {activeCountryName}
                </p>
              </div>
              <button
                type='button'
                onClick={() => setCountryFilter(null)}
                className='text-sm font-semibold text-accent transition-colors hover:text-foreground'
              >
                Clear filter
              </button>
            </div>
          ) : gridPhotos.length > 0 ? (
            <div className='flex items-end justify-between gap-4 border-b border-border/40 pb-4'>
              <p className={photographySectionLabelClass}>Gallery</p>
              <p className='font-mono text-[10px] uppercase tracking-[0.16em] text-foreground-muted'>
                {gridPhotos.length} {gridPhotos.length === 1 ? 'image' : 'images'}
              </p>
            </div>
          ) : null}

          {gridPhotos.length > 0 ? (
            <div className='columns-1 [column-gap:1.25rem] sm:columns-2 xl:columns-3'>
              {gridPhotos.map((photo, index) => (
                <div key={photo._id} className='mb-5 break-inside-avoid'>
                  <PhotographyCard photo={photo} priority={!featuredPhoto && index < 2} />
                </div>
              ))}
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    );

  return (
    <div className='relative flex flex-col gap-10 md:flex-row md:items-start md:gap-10 lg:gap-14'>
      {countryFilters.length > 1 ? (
        <aside className='md:sticky md:top-32 md:w-52 md:shrink-0 lg:w-56 xl:top-36'>
          <div className={photographyGlassPanelClass}>
            <div className='space-y-5'>
              <div className='space-y-1 border-b border-border/30 pb-4'>
                <p className={photographySectionLabelClass}>Places</p>
                <p className='text-sm leading-snug text-foreground-muted'>
                  {filteredPhotos.length} of {photos.length} in view
                </p>
              </div>

              <div className='flex flex-col gap-0.5'>
                <FilterOption
                  active={activeCountry === null}
                  label='All places'
                  count={photos.length}
                  onClick={() => setCountryFilter(null)}
                />
                {countryFilters.map(country => (
                  <FilterOption
                    key={country.code}
                    active={activeCountry === country.code}
                    label={country.name}
                    count={country.count}
                    onClick={() =>
                      setCountryFilter(country.code === activeCountry ? null : country.code)
                    }
                  />
                ))}
              </div>

              {ABOUT_PAGE_LINKS_ENABLED ? (
                <Link
                  href='/about#travel-map-section'
                  className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 bg-surface/40 px-3 py-2.5 text-sm font-medium text-foreground-subtle transition-all duration-200 hover:border-accent/35 hover:bg-surface hover:text-foreground'
                >
                  <IconMapPin className='size-4 shrink-0 text-accent' stroke={2} aria-hidden />
                  Travel map
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      ) : null}

      <div className='min-w-0 flex-1'>{galleryContent}</div>
    </div>
  );
}
