import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';

export default async function Home() {
  const [{ data: homepage }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
  ]);

  if (!homepage) {
    return null;
  }

  const { showcasePaintings, title } = homepage;

  const firstPainting = showcasePaintings[0];

  return (
    <div>
      <h1>{title}</h1>
      <Image
        className="object-cover -z-10"
        fill={true}
        alt={stegaClean(firstPainting.painting?.alt) || ''}
        src={
          urlForImage(firstPainting.image)
            ?.height(720)
            .width(1280)
            .auto('format')
            .url() as string
        }
        sizes="100vw"
        priority
      />

      <p>A gallery of some of my paintings</p>
    </div>
  );
}
