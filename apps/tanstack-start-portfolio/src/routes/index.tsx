// src/routes/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@wisihe/ui-react';
import { getHomeData } from '../server/fns';

export const Route = createFileRoute('/')({
  loader: () => getHomeData(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();

  return (
    <div className='home-page flex flex-col gap-16'>
      <section className='hero'>
        <div className='flex flex-col items-center gap-8 text-center'>
          <h1>{data.title}</h1>
          <p>{data.overview}</p>
          <div className='flex justify-center gap-4'>
            <Link to='/projects'>
              <Button>View My Work</Button>
            </Link>
            <Link to='/about'>
              <Button variant='secondary'>Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Core Focus</h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'var(--accent)' }}>Frontend Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: 'var(--muted)' }}>
                Creating responsive, accessible, and performant user interfaces using the latest
                React features and TanStack ecosystem.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'var(--accent)' }}>Backend Stability</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: 'var(--muted)' }}>
                Architecting scalable server-side solutions and efficient database designs to power
                complex applications.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'var(--accent)' }}>Performance First</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: 'var(--muted)' }}>
                Optimizing every aspect of the stack to ensure the fastest possible delivery and
                smoothest user experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {data.featuredProjects.length > 0 && (
        <section>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Featured Projects</h2>
          {data.projectsDescription ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>
              {data.projectsDescription}
            </p>
          ) : null}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {data.featuredProjects.map(project => (
              <Card key={project._id} style={{ overflow: 'hidden' }}>
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section
        style={{
          padding: '6rem 0',
          textAlign: 'center',
          background:
            'linear-gradient(to bottom, transparent, rgba(var(--color-accent-rgb-val), 0.05))',
          margin: '0 -2rem',
          borderRadius: '2.5rem',
        }}
      >
        <div className='flex flex-col items-center gap-6'>
          <h2 style={{ marginBottom: '0.5rem' }}>Ready to start a project?</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '600px' }}>
            Whether you have a fully-fledged idea or just a spark of inspiration, I'm here to help
            you bring it to life.
          </p>
          <Link to='/contact'>
            <Button variant='primary' size='large'>
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
