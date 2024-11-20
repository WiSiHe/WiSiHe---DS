import { sanityFetch } from '@/sanity/lib/live';
import { allPaintingsQuery } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { isEmptyArray } from '../../../../packages/utils/src/array';
import PaintingCard from '../components/PaintingCard/PaintingCard';

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
            return (
              <div
                key={painting._id}
                className="relative col-span-3 aspect-square"
              >
                <PaintingCard painting={painting} />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
