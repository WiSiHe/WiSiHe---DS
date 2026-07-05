import { createFileRoute, Link } from '@tanstack/react-router';
import { getPaintings } from '../server/fns';

export const Route = createFileRoute('/paintings/')({
  loader: () => getPaintings(),
  component: Paintings,
});

function Paintings() {
  const paintings = Route.useLoaderData();

  return (
    <div className='paintings-page mx-auto flex max-w-7xl flex-col gap-12 px-4 py-32 md:px-8'>
      <section className='hero max-w-prose'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-bold md:text-5xl'>Digital Art Gallery</h1>
          <p className='text-lg leading-relaxed text-foreground/60'>
            A curated collection of my digital paintings and artwork, exploring themes of
            imagination, storytelling, and visual creativity.
          </p>
        </div>
      </section>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {paintings.map(painting => (
          <Link
            key={painting._id}
            to='/paintings/$slug'
            params={{ slug: painting.slug }}
            className='group relative aspect-3/4 overflow-hidden rounded-2xl border border-border bg-surface shadow-md transition-all hover:border-accent/50 hover:shadow-2xl'
          >
            {painting.imageUrl ? (
              <img
                src={painting.imageUrl}
                alt={painting.title}
                className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-surface-elevated'>
                <span className='text-foreground/20'>No Image</span>
              </div>
            )}

            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

            <div className='absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
              <h3 className='text-xl font-bold text-white'>{painting.title}</h3>
              {painting.date && (
                <p className='mt-1 text-sm text-white/60'>
                  {new Date(painting.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
