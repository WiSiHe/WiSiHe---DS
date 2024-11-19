import { sanityFetch } from '@/sanity/lib/live';
import { paintingQuery, paintingsSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: paintingsSlugs,
    perspective: 'published',
    stega: false,
  });
  return data;
}

export default async function PaintingPage(props: Props) {
  const params = await props.params;

  const [{ data: painting }] = await Promise.all([
    sanityFetch({ query: paintingQuery, params }),
  ]);

  if (!painting?._id) {
    return notFound();
  }

  const { image, title } = painting;

  return (
    <section>
      <h1>{title}</h1>
      <Image
        className="object-cover -z-10"
        fill={true}
        alt={stegaClean(painting?.alt) || ''}
        src={
          urlForImage(image)
            ?.height(720)
            .width(1280)
            .auto('format')
            .url() as string
        }
        sizes="100vw"
        priority
      />
    </section>
  );
}
