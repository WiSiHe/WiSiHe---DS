import { createFileRoute, Link } from '@tanstack/react-router'
import { Flex, Grid } from '@wisihe/ui-react'
import { getPaintings } from '../server/fns'

export const Route = createFileRoute('/paintings/')({
  loader: () => getPaintings(),
  component: Paintings,
})

function Paintings() {
  const paintings = Route.useLoaderData()

  return (
    <Flex direction="column" gap={48} className="paintings-page py-32 px-4 md:px-8 max-w-7xl mx-auto">
      <section className="hero max-w-prose">
        <Flex direction="column" gap={16}>
          <h1 className="text-4xl md:text-5xl font-bold">Digital Art Gallery</h1>
          <p className="text-lg text-foreground/60 leading-relaxed">
            A curated collection of my digital paintings and artwork, exploring themes of
            imagination, storytelling, and visual creativity.
          </p>
        </Flex>
      </section>

      <Grid columns={1} gap={24} className="sm:grid-cols-2 lg:grid-cols-3">
        {paintings.map((painting) => (
          <Link
            key={painting._id}
            to="/paintings/$slug"
            params={{ slug: painting.slug }}
            className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-surface border border-border shadow-md transition-all hover:shadow-2xl hover:border-accent/50"
          >
            {painting.imageUrl ? (
              <img
                src={painting.imageUrl}
                alt={painting.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
                <span className="text-foreground/20">No Image</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="text-xl font-bold text-white">{painting.title}</h3>
              {painting.date && (
                <p className="text-sm text-white/60 mt-1">
                  {new Date(painting.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </Grid>
    </Flex>
  )
}
