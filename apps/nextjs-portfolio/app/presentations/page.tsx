import type { AllPresentationsQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { PresentationCard } from '@/app/components/presentations/PresentationCard';
import { sanityFetch } from '@/sanity/lib/live';
import { allPresentationsQuery } from '@/sanity/lib/queries';

const SITE_URL = 'https://www.wisihe.no';
const PAGE_URL = `${SITE_URL}/presentations`;

export const metadata: Metadata = {
  title: 'Presentations | WiSiHe',
  description:
    'Talks, workshops, and slide decks on frontend craft, 3D on the web, accessibility, and creative technology.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Presentations | WiSiHe',
    description:
      'Talks, workshops, and slide decks on frontend craft, 3D on the web, accessibility, and creative technology.',
    url: PAGE_URL,
    siteName: 'WiSiHe',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default async function PresentationsPage() {
  const { data } = await sanityFetch({ query: allPresentationsQuery });
  const presentations = (data ?? []) as AllPresentationsQueryResult;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}#collection`,
    url: PAGE_URL,
    name: 'Presentations',
    description: metadata.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    hasPart: presentations.map(p => ({
      '@type': 'CreativeWork',
      name: p.title,
      url:
        p.slug === 'houston-we-re-coding-3d'
          ? `${SITE_URL}/three-d`
          : `${SITE_URL}/presentations/${p.slug}`,
    })),
  };

  const [featured, ...rest] = presentations;

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className='min-h-screen bg-background'>
        <header className='relative overflow-hidden border-b border-border/40 pt-28 pb-16 sm:pt-32'>
          <div className='pointer-events-none absolute inset-0 bg-accent/5' aria-hidden />
          <div
            className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_25%,transparent_100%)]'
            aria-hidden
          />
          <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
              Talks & workshops
            </p>
            <h1 className='mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
              Presentations
            </h1>
            <p className='mt-4 max-w-2xl text-lg leading-relaxed text-foreground-subtle text-pretty'>
              Slide decks from conference talks, internal workshops, and deep dives — built for the
              web, meant to be explored.
            </p>
          </div>
        </header>

        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
          {presentations.length === 0 ? (
            <div className='rounded-2xl border border-dashed border-border px-6 py-20 text-center'>
              <p className='font-serif text-2xl font-bold text-foreground'>No presentations yet</p>
              <p className='mt-2 text-foreground-muted'>New decks will appear here from Sanity.</p>
            </div>
          ) : (
            <div className='space-y-10'>
              {featured ? <PresentationCard presentation={featured} featured /> : null}
              {rest.length > 0 ? (
                <ul className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {rest.map(presentation => (
                    <li key={presentation._id}>
                      <PresentationCard presentation={presentation} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
