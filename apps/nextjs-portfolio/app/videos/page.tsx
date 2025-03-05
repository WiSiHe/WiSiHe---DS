import { Video } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllVideos } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { isEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import { getImageProps } from 'next/image';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Videos | WiSiHe',
  description: 'A collection of some of my videos',
};

export default async function Videos() {
  const [{ data }] = await Promise.all([sanityFetch({ query: getAllVideos })]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { videos } = data;
  console.log('videos', videos);

  return (
    <div className="min-h-screen p-4 pt-20 text-white mx-auto max-w-(--breakpoint-2xl)">
      <h1>Videos</h1>
      <p>A collection of some of my videos</p>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video: Video) => {
          const { thumbnail, title, description, _id } = video;
          const thumbnailUrl = urlForImage(thumbnail);
          const common = {
            alt: video.title,
            fill: true,
            className: 'object-cover',
          };

          const {
            props: { srcSet: desktop },
          } = getImageProps({
            ...common,

            quality: 80,
            src: thumbnailUrl?.width(400).height(400).url() || '',
          });
          const {
            props: { srcSet: mobile, ...rest },
          } = getImageProps({
            ...common,
            quality: 70,
            src: thumbnailUrl?.width(400).height(200).url() || '',
          });

          return (
            <div key={_id} className="relative">
              <picture>
                <source media="(min-width: 1000px)" srcSet={desktop} />
                <source media="(min-width: 500px)" srcSet={mobile} />
                <img
                  {...rest}
                  style={{ width: '100%' }}
                  className="object-cover w-full aspect-video lg:aspect-square"
                />
              </picture>
              <div className="py-4">
                <h2 className="font-black">{title}</h2>
                <p className="line-clamp-3">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
