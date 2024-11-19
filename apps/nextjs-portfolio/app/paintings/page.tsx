import { sanityFetch } from '@/sanity/lib/live';
import { allPaintingsQuery } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { isEmptyArray } from '../../../../packages/utils/src/array';
import Image from 'next/image';
import { stegaClean } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Paintings | WiSiHe',
  description: 'A gallery of some of my paintings',
};

export default async function Paintings() {
  const [{ data: paintings }] = await Promise.all([
    sanityFetch({ query: allPaintingsQuery }),
  ]);

  if (isEmptyArray(paintings)) {
    return null;
  }

  return (
    <div>
      <h1>Paintings</h1>
      <p>A gallery of some of my paintings</p>
      <div className="grid w-full grid-cols-12 gap-4">
        {paintings.map(
          (painting: {
            _id: string;
            slug: { current: string };
            title: string;
            alt: string;
            image: unknown;
          }) => {
            const { image, slug, title, alt = '' } = painting;
            return (
              <div
                key={painting._id}
                className="relative col-span-3 aspect-square"
              >
                <Link href={`/paintings/${slug.current}`}>
                  <h2 className="before:absolute before:inset-0 before:z-0">
                    {title}
                  </h2>
                </Link>
                <Image
                  className="object-cover -z-10"
                  fill={true}
                  alt={stegaClean(alt) || ''}
                  src={
                    urlForImage(image)
                      ?.height(320)
                      .width(640)
                      .auto('format')
                      .url() as string
                  }
                  sizes="100vw"
                  priority
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
