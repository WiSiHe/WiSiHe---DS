'use client';

import { useNavigate } from '@tanstack/react-router';
import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo } from 'react';
import { hasMapboxToken } from '@/lib/mapbox';
import { buildPhotographyCountryFilters } from '@/lib/photography/photographyCountries';
import { writePhotographyGalleryReturnUrl } from '@/lib/photography/photographyGalleryReturnUrl';
import { buildPhotographyMapMarkers } from '@/lib/photography/photographyMapMarkers';
import {
  buildPhotographyHref,
  buildPhotographySearch,
  type PhotographyView,
} from '@/lib/photography/photographyUrl';
import { PhotographyCard } from './PhotographyCard';
import { PhotographyCountryFilter } from './PhotographyCountryFilter';
import { PhotographyFeaturedHero } from './PhotographyFeaturedHero';
import { PhotographyMapView } from './PhotographyMapView';
import { PhotographyViewTabs } from './PhotographyViewTabs';
import { photographySectionLabelClass } from './photographyStyles';

const GRID_LAYOUT_TRANSITION = {
  layout: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

type PhotographyListingProps = {
  photos: PhotographyListQueryResult;
  activeCountry: string | null;
  activeView: PhotographyView;
};

export function PhotographyListing({ photos, activeCountry, activeView }: PhotographyListingProps) {
  const navigate = useNavigate({ from: '/photography/' });
  const mapAvailable = hasMapboxToken();
  const effectiveView = activeView === 'map' && !mapAvailable ? 'gallery' : activeView;

  const countryFilters = useMemo(() => buildPhotographyCountryFilters(photos), [photos]);

  const setCountryFilter = useCallback(
    (code: string | null) => {
      navigate({
        search: buildPhotographySearch({ view: effectiveView, country: code }),
        resetScroll: false,
      });
    },
    [effectiveView, navigate],
  );

  const switchToGallery = useCallback(() => {
    navigate({
      search: buildPhotographySearch({ view: 'gallery', country: activeCountry }),
      resetScroll: false,
    });
  }, [activeCountry, navigate]);

  const galleryHref = buildPhotographyHref({ view: effectiveView, country: activeCountry });

  useEffect(() => {
    writePhotographyGalleryReturnUrl(galleryHref);
  }, [galleryHref]);

  const filteredPhotos = useMemo(() => {
    if (!activeCountry) return photos;
    return photos.filter(photo => photo.place?.countryCode?.trim().toUpperCase() === activeCountry);
  }, [activeCountry, photos]);

  const mapMarkers = useMemo(() => buildPhotographyMapMarkers(filteredPhotos), [filteredPhotos]);

  const featuredPhoto = useMemo(() => {
    if (activeCountry || effectiveView === 'map') return null;
    return filteredPhotos.find(photo => photo.isFeatured) ?? null;
  }, [activeCountry, effectiveView, filteredPhotos]);

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
      <motion.div layout transition={GRID_LAYOUT_TRANSITION.layout} className='space-y-12'>
        <AnimatePresence mode='popLayout' initial={false}>
          {featuredPhoto ? (
            <motion.div
              key={`featured-${featuredPhoto._id}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={GRID_LAYOUT_TRANSITION}
            >
              <PhotographyFeaturedHero photo={featuredPhoto} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode='popLayout' initial={false}>
          {activeCountry && activeCountryName ? (
            <motion.div
              key={`filter-${activeCountry}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={GRID_LAYOUT_TRANSITION}
              className='flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-5'
            >
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
            </motion.div>
          ) : gridPhotos.length > 0 ? (
            <motion.div
              key='gallery-heading'
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={GRID_LAYOUT_TRANSITION}
              className='flex items-end justify-between gap-4 border-b border-border/40 pb-4'
            >
              <p className={photographySectionLabelClass}>Gallery</p>
              <p className='font-mono text-[10px] uppercase tracking-[0.16em] text-foreground-muted'>
                {gridPhotos.length} {gridPhotos.length === 1 ? 'image' : 'images'}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {gridPhotos.length > 0 ? (
          <motion.div
            layout
            transition={GRID_LAYOUT_TRANSITION.layout}
            className='columns-1 [column-gap:1.75rem] sm:columns-2 xl:columns-3'
          >
            <AnimatePresence mode='popLayout' initial={false}>
              {gridPhotos.map((photo, index) => (
                <motion.div
                  key={photo._id}
                  layout
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={GRID_LAYOUT_TRANSITION}
                  className='mb-6 break-inside-avoid'
                >
                  <PhotographyCard photo={photo} priority={!featuredPhoto && index < 2} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </motion.div>
    );

  const mainContent =
    effectiveView === 'map' ? (
      <PhotographyMapView
        markers={mapMarkers}
        fitBoundsKey={`${effectiveView}-${activeCountry ?? 'all'}`}
        activeCountry={activeCountry}
        filteredPhotoCount={filteredPhotos.length}
        onClearCountry={() => setCountryFilter(null)}
        onSwitchToGallery={switchToGallery}
      />
    ) : (
      galleryContent
    );

  return (
    <>
      <PhotographyViewTabs
        activeView={effectiveView}
        activeCountry={activeCountry}
        mapAvailable={mapAvailable}
      />

      <div className={cn('relative flex w-full flex-col gap-8 md:flex-row md:items-start')}>
        <PhotographyCountryFilter
          countries={countryFilters}
          activeCountry={activeCountry}
          totalCount={photos.length}
          filteredCount={filteredPhotos.length}
          onSelectCountry={setCountryFilter}
        />

        <div className='min-w-0 flex-1'>{mainContent}</div>
      </div>
    </>
  );
}
