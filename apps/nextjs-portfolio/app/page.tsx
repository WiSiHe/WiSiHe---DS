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

export default async function Home() {
  const [{ data: homepage }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
  ]);

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

  const skills = [
    'Frontend Development',
    'UI/UX Design',
    'Drawing',
    'React',
    'Svelte',
    'Next.js',
    'Tailwind CSS',
    'Sanity',
  ];

  const softwareSkills = [
    'Photoshop',
    'Figma',
    'Unreal Engine 5',
    'Blender',
    'Spline',
    'Sanity',
  ];

  return (
    <div className="bg-dark">
      <HeroImageSection paintings={showcasePaintings} />
      <PaintingsSection
        paintings={showcasePaintings}
        paintingsDescription={paintingsDescription}
      />

      <section className="flex flex-col gap-4 py-20 text-white">
        <div className="px-4 lg:px-10">
          <h2 className="text-3xl font-semibold">Skills</h2>
          <p>Here are some of the skills I have acquired over the years.</p>
        </div>
        <Marquee
          gradientColor="#2B061E"
          autoFill
          gradient
          direction="left"
          speed={20}
        >
          {skills.map((skill) => (
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
          {softwareSkills.map((skill) => (
            <Chip key={skill} label={skill} className="ml-2" />
          ))}
        </Marquee>
      </section>

      {/* Projects Section */}
      {showcaseProjects && showcaseProjects.length > 0 ? (
        <section className="px-4 py-16 ring md:px-8 bg-tertiary">
          <div className="prose">
            <h2 className="">Featured Projects</h2>
            <p>
              Here are some of the projects I have worked on. Click on the
              project to view more details.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:gap-8 md:grid-cols-3">
            {showcaseProjects.map((project) => (
              <div
                key={project._id}
                className="relative rounded-lg shadow-lg overflow-clip bg-tertiary"
              >
                <div className="relative aspect-video">
                  {project.image && (
                    <Image
                      className="object-cover"
                      src={
                        urlForImage(project.image)
                          ?.height(400)
                          .width(600)
                          .auto('format')
                          .url() || ''
                      }
                      alt={project.title}
                      fill
                    />
                  )}
                </div>
                <div className="p-4 rel">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <p className="">{project.description}</p>
                  <div className="flex justify-end">
                    <Link href={project.slug} className="mt-2 text-primary">
                      Visit Project &rarr;
                    </Link>
                  </div>
                </div>
                {/* Additional project details can be added here */}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center">No projects to display.</p>
      )}
      <NotFoundSection />
    </div>
  );
}
