import PaintingDetail from '@/app/components/PaintingDetails/PaintingsDetails';
import { sanityFetch } from '@/sanity/lib/live';
import { paintingQuery, paintingsSlugs } from '@/sanity/lib/queries';
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

  return <PaintingDetail paintingData={painting} />;
}
