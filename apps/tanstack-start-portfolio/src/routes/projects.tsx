import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, Tag } from '@wisihe/ui-react';
import { getProjects } from '../server/fns';

export const Route = createFileRoute('/projects')({
  loader: () => getProjects(),
  component: Projects,
});

function Projects() {
  const projects = Route.useLoaderData();

  return (
    <div className='projects-page flex flex-col gap-16'>
      <section className='hero'>
        <div className='flex flex-col items-center gap-6 text-center'>
          <h1>My Projects</h1>
          <p>A selection of my recent work and personal experiments.</p>
        </div>
      </section>

      <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-3'>
        {projects.map(project => (
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
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {project.description}
              </p>
              <div className='flex flex-wrap gap-2'>
                {project.tags.map(tag => (
                  <Tag key={tag} variant='outline'>
                    {tag}
                  </Tag>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
