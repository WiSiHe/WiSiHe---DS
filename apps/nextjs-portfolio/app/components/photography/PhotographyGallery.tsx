import { PhotographyListing } from './PhotographyListing';

type PhotographyGalleryProps = {
  photos: import('@wisihe/sanity-queries').PhotographyListQueryResult;
  activeCountry: string | null;
};

export function PhotographyGallery({ photos, activeCountry }: PhotographyGalleryProps) {
  return <PhotographyListing photos={photos} activeCountry={activeCountry} />;
}
