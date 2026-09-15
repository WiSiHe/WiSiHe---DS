import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { PresentationSlideDeck } from '@/app/components/presentations/PresentationSlideDeck';
import { SITE_URL } from '@/lib/seo/constants';
import { buildContentMetadata, resolveSeoCopy } from '@/lib/seo/metadata';
import { client } from '@/sanity/lib/client';
import { fetchPresentationSlides } from '@/sanity/lib/fetchPresentations';
import { sanityFetch } from '@/sanity/lib/live';
import { presentationQuery, presentationSlugsQuery } from '@/sanity/lib/queries';

const WORKSHOP_SLUG = 'houston-we-re-coding-3d';

export const revalidate = 86400;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(presentationSlugsQuery);
  return (slugs as Array<{ slug: string }>)
    .filter(item => item.slug !== WORKSHOP_SLUG)
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === WORKSHOP_SLUG) {
    return { title: '3D Workshop | WiSiHe' };
  }

  const { data } = await sanityFetch({
    query: presentationQuery,
    params: { slug },
    stega: false,
  });

  const presentation = data as {
    title?: string;
    description?: string | null;
    noIndex?: boolean | null;
    seo?: {
      title?: string | null;
      description?: string | null;
      image?: unknown;
      noIndex?: boolean | null;
    } | null;
  } | null;

  if (!presentation?.title) {
    return { title: 'Presentation not found' };
  }

  const { title, description, noIndex } = resolveSeoCopy(presentation.seo, {
    title: presentation.title,
    description:
      presentation.description ??
      `Slide deck: ${presentation.title} by Henrik Wilhelm Sissener (WiSiHe).`,
  });

  return buildContentMetadata({
    title,
    description,
    path: `/presentations/${slug}`,
    seoImage: presentation.seo?.image,
    noIndex: presentation.noIndex === true || noIndex,
    openGraphType: 'article',
  });
}

export default async function PresentationPage({ params }: Props) {
  const { slug } = await params;

  if (slug === WORKSHOP_SLUG) {
    redirect('/three-d');
  }

  const { data } = await sanityFetch({
    query: presentationQuery,
    params: { slug },
  });

  const presentation = data as {
    title?: string;
    description?: string | null;
    slug?: string;
    noIndex?: boolean | null;
    tldr?: string | null;
    tldrPosition?: 'top' | 'bottom' | null;
  } | null;

  if (!presentation?.title) {
    notFound();
  }

  const slides = await fetchPresentationSlides(slug);
  const url = `${SITE_URL}/presentations/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Presentations',
            item: `${SITE_URL}/presentations`,
          },
          { '@type': 'ListItem', position: 3, name: presentation.title, item: url },
        ],
      },
      {
        '@type': 'PresentationDigitalDocument',
        '@id': url,
        name: presentation.title,
        description: presentation.description,
        url,
        author: {
          '@type': 'Person',
          name: 'Henrik Wilhelm Sissener',
          url: SITE_URL,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PresentationSlideDeck
        slides={slides}
        showSkipControl={false}
        tldr={presentation.tldr}
        tldrPosition={presentation.tldrPosition}
      />
    </>
  );
}
