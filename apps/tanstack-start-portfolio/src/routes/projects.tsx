import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, Flex, Grid, Tag } from '@wisihe/ui-react';
import { getProjects } from '../server/fns';

export const Route = createFileRoute('/projects')({
  loader: () => getProjects(),
  component: Projects,
});

function Projects() {
  const projects = Route.useLoaderData();

  return (
    <Flex direction='column' gap={64} className='projects-page'>
      <section className='hero'>
        <Flex direction='column' align='center' gap={24} style={{ textAlign: 'center' }}>
          <h1>My Projects</h1>
          <p>A selection of my recent work and personal experiments.</p>
        </Flex>
      </section>

      <Grid columns={3} gap={32} style={{ marginTop: '2rem' }}>
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
              <Flex gap={8} wrap='wrap'>
                {project.tags.map(tag => (
                  <Tag key={tag} variant='outline'>
                    {tag}
                  </Tag>
                ))}
              </Flex>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Flex>
  );
}
