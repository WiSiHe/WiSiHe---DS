'use client';

import { ProjectQueryResult } from '@/sanity.types';

type ConnectedPageProps = {
  project: NonNullable<ProjectQueryResult>;
};

const ConnectedPage = ({ project }: ConnectedPageProps) => {
  const { name, connectedPage } = project;
  const projectTitle = name || 'Untitled Project';

  if (!connectedPage) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold font-serif text-foreground">Project Preview</h2>
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border/20 bg-surface">
          <iframe
            src={connectedPage}
            className="absolute inset-0 w-full h-full"
            title={`Connected page for ${projectTitle}`}
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </div>
    </section>
  );
};

export default ConnectedPage;

