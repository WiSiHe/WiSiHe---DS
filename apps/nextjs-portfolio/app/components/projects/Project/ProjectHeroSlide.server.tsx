import Image from 'next/image';
import type { ProjectGalleryImage } from '@/lib/projects/projectGalleryImages';
import { urlForImage } from '@/sanity/lib/utils';

type ProjectHeroSlideProps = {
  image: ProjectGalleryImage;
  alt: string;
};

/** Server-rendered LCP slide — included in the initial HTML response. */
export function ProjectHeroSlide({ image, alt }: ProjectHeroSlideProps) {
  const lqip = image.lqip ?? undefined;
  const imageUrl = urlForImage(image)?.width(1200).fit('max')?.url() || '';

  if (!imageUrl) {
    return null;
  }

  return (
    <>
      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/10'
        aria-hidden
      />
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className='relative z-10 object-contain p-2 sm:p-4'
        priority
        fetchPriority='high'
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        sizes='(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px'
        draggable={false}
      />
    </>
  );
}
