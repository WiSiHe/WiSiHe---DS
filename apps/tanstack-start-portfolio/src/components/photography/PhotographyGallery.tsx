import type { PhotographyView } from '@/lib/photography/photographyUrl';
import { PhotographyListing } from './PhotographyListing';

type PhotographyGalleryProps = {
  photos: import('@wisihe/sanity-queries').PhotographyListQueryResult;
  activeCountry: string | null;
  activeView: PhotographyView;
};

export function PhotographyGallery({ photos, activeCountry, activeView }: PhotographyGalleryProps) {
  return (
    <PhotographyListing photos={photos} activeCountry={activeCountry} activeView={activeView} />
  );
}
