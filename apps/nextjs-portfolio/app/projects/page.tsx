import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A gallery of some of my paintings',
};

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projects</h1>
      <p>A gallery of some of my projects</p>
    </main>
  );
}
