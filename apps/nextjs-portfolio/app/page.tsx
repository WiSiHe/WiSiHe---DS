import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import Chip from './components/Chip/Chip';
import HeroImageSection from './components/HeroSection/HeroSection';
import NotFoundSection from './components/NotFound/NotFound';
import PaintingsSection from './components/PaintingsSection/PaintingsSection';
import { PortableTextBlock } from 'next-sanity';
import Link from 'next/link';

import { HomePageQueryResult } from '@/sanity.types';

export default async function Home() {
  const [{ data: homepage }]: [{ data: HomePageQueryResult }] =
    await Promise.all([sanityFetch({ query: homePageQuery })]);

  if (!homepage) {
    return (
      <div className="container p-4 mx-auto">
        <h1 className="text-4xl font-bold text-center">
          Welcome to My Portfolio
        </h1>
        <p className="mt-2 text-center">
          I am a frontend developer who loves to draw and design things.
        </p>
        <p className="mt-4 text-center">Content is coming soon. Stay tuned!</p>
      </div>
    );
  }

  const { showcasePaintings, showcaseProjects } = homepage;

  const paintingsDescription =
    homepage.paintingsDescription as PortableTextBlock[];

  const professionalSkills = [
    'Frontend Development',
    'UI/UX Design',
    'Responsive Web Design',
    'Accessibility (WCAG Standards)',
    'React.js',
    'SvelteKit',
    'Next.js',
    'Tailwind CSS',
    'Sanity CMS Integration',
    'Performance Optimization',
    'Interactive Prototyping',
  ];

  const creativeSkills = [
    'Digital Drawing & Painting',
    '3D Modeling (Blender)',
    'Game Development (Unreal Engine 5)',
    'Video Editing & Production',
    'Interactive 3D Design (Spline)',
    'Concept Art & Illustration',
  ];

  return (
    <div className="bg-dark">
      <HeroImageSection paintings={showcasePaintings} />
      {showcaseProjects && showcaseProjects.length > 0 ? (
        <section className="px-4 py-16 md:px-8 bg-tertiary/80">
          <div className="text-dark max-w-prose">
            <h2 className="pb-1 font-bold">Featured Projects</h2>
            <p>
              Here are some of the projects I have worked on. Click on the
              project to view more details.
            </p>
          </div>
          <div className="relative grid items-start h-full grid-cols-1 gap-6 pt-4 lg:gap-8 md:grid-cols-3">
            {showcaseProjects.map((project) => (
              <article
                key={project._id}
                className="relative flex flex-row w-full h-full bg-white rounded-lg shadow-lg md:flex-col text-dark overflow-clip"
              >
                <div className="relative bg-dark aspect-square min-w-52 md:aspect-video">
                  {project.image && (
                    <Image
                      className="object-cover w-full h-full"
                      src={
                        urlForImage(project.image)
                          ?.height(400)
                          .width(400)
                          .auto('format')
                          .url() || ''
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={project.name}
                    />
                  )}
                </div>
                <div className="relative flex flex-col justify-between w-full h-full p-4">
                  <div>
                    <h3 className="font-bold">{project.seo.title}</h3>
                    <p className="line-clamp-3">{project.seo.description}</p>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Link
                      href={`projects/${project.slug}`}
                      className="px-4 py-2 text-white rounded-full bg-primary hover:bg-primary/90"
                    >
                      Visit Project &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center">No projects to display.</p>
      )}
      <section className="flex flex-col gap-4 py-20 text-white">
        <div className="px-4 lg:px-10">
          <h2 className="text-4xl font-bold">Skills</h2>
          <p>Here are some of the skills I have acquired over the years.</p>
        </div>
        <Marquee
          gradientColor="#2B061E"
          autoFill
          gradient
          direction="left"
          speed={20}
        >
          {professionalSkills.map((skill) => (
            <Chip key={skill} label={skill} className="ml-2" />
          ))}
        </Marquee>
        <Marquee
          gradientColor="#2B061E"
          autoFill
          gradient
          direction="right"
          className=""
          speed={20}
        >
          {creativeSkills.map((skill) => (
            <Chip key={skill} label={skill} className="ml-2" />
          ))}
        </Marquee>
      </section>
      <PaintingsSection
        paintings={showcasePaintings}
        paintingsDescription={paintingsDescription}
      />

      <NotFoundSection />
    </div>
  );
}
