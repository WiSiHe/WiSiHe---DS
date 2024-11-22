import { sanityFetch } from '@/sanity/lib/live';
import { getAllPaintingsandTags } from '@/sanity/lib/queries';
import { Metadata } from 'next';

import PaintingCard from '../components/PaintingCard/PaintingCard';
import { isEmptyObject } from '@wisihe/utils';
import { notFound } from 'next/navigation';
import Chip from '../components/Chip/Chip';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';

export const metadata: Metadata = {
  title: 'Paintings | WiSiHe',
  description: 'A gallery of some of my paintings',
};

import { GetAllPaintingsandTagsResult } from '@/sanity.types';

export default async function Paintings() {
  const [{ data }]: [{ data: GetAllPaintingsandTagsResult }] =
    await Promise.all([sanityFetch({ query: getAllPaintingsandTags })]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { paintings, tags } = data;

  const sortedTags = tags
    .filter((tag: { paintingsCount: number }) => tag.paintingsCount > 2)
    .sort((a, b) => {
      if (a.name === 'Store') return -1;
      if (b.name === 'Store') return 1;
      return (
        b.paintingsCount - a.paintingsCount || a.name.localeCompare(b.name)
      );
    });

  return (
    <>
      <div className="p-4 mt-16">
        <div className="pb-4">
          <h1>Paintings</h1>
          <p>A gallery of some of my paintings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(
            (tag: { _id: string; name: string; paintingsCount: number }) => {
              return (
                <Chip label={tag.name} key={tag._id}>
                  <p>{tag.paintingsCount}</p>
                </Chip>
              );
            }
          )}
        </div>
        <div className="grid w-full grid-cols-12 gap-4">
          {paintings.map((painting) => {
            return (
              <div
                key={painting._id}
                className="relative col-span-3 aspect-square"
              >
                <PaintingCard paintingData={painting} />
              </div>
            );
          })}
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
