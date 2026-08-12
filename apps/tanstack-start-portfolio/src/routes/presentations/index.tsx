import { createFileRoute, Link } from '@tanstack/react-router';
import { PresentationCard } from '../../components/presentations/PresentationCard';
import { buildHead } from '../../lib/seo';
import { getPresentations } from '../../server/fns';

export const Route = createFileRoute('/presentations/')({
  loader: () => getPresentations(),
  head: () =>
    buildHead({
      title: 'Presentations | WiSiHe',
      description:
        'Talks, workshops, and slide decks on frontend craft, 3D on the web, accessibility, and creative technology.',
      path: '/presentations',
    }),
  component: PresentationsPage,
});

function PresentationsPage() {
  const presentations = Route.useLoaderData();
  const [featured, ...rest] = presentations;

  return (
    <div className='min-h-screen bg-background'>
      <header className='relative overflow-hidden border-b border-border/40 pt-28 pb-16 sm:pt-32'>
        <div className='pointer-events-none absolute inset-0 bg-accent/5' aria-hidden />
        <div
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_25%,transparent_100%)] bg-[size:3rem_3rem]'
          aria-hidden
        />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <p className='font-mono text-xs font-semibold tracking-[0.28em] text-accent uppercase'>
            Talks & workshops
          </p>
          <h1 className='mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
            Presentations
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-foreground-subtle'>
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

        <p className='mt-10 text-sm text-foreground/50'>
          Looking for the interactive 3D workshop?{' '}
          <Link to='/three-d' className='text-accent hover:underline'>
            Open Three-D
          </Link>
        </p>
      </div>
    </div>
  );
}
