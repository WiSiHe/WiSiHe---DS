import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import Chip from './components/Chip/Chip';
import NotFoundSection from './components/NotFound/NotFound';

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

  const { showcasePaintings, showcaseProjects, title } = homepage;

  const skills = [
    'Frontend Development',
    'UI/UX Design',
    'Drawing',
    'React',
    'Next.js',
    'Tailwind CSS',
  ];

  return (
    <div className="container p-4 mx-auto">
      {/* Header */}
      <header className="my-12 text-center">
        <h1 className="text-5xl font-bold">
          {title || 'Henrik Wilhelm Sissener'}
        </h1>
        <p className="mt-4 text-xl">
          I am a frontend developer who loves to draw and design things.
        </p>
      </header>

      {/* Paintings Section */}
      {showcasePaintings && showcasePaintings.length > 0 ? (
        <section className="my-16">
          <h2 className="mb-8 text-3xl font-semibold text-center">
            Gallery of My Paintings
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {showcasePaintings.map((painting) => (
              <div key={painting._id} className="painting-item">
                <Image
                  className="object-cover rounded-lg"
                  src={
                    urlForImage(painting.image)
                      ?.height(720)
                      .width(1280)
                      .auto('format')
                      .url() || ''
                  }
                  alt={stegaClean(painting.image?.alt) || painting.title}
                  width={300}
                  height={200}
                />
                <p className="mt-2 font-medium text-center">{painting.title}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center">No paintings to display.</p>
      )}

      <Marquee autoFill gradient direction="left">
        {skills.map((skill) => (
          <Chip key={skill} label={skill} className="ml-2" />
        ))}
      </Marquee>

      {/* Projects Section */}
      {showcaseProjects && showcaseProjects.length > 0 ? (
        <section className="my-16">
          <h2 className="mb-8 text-3xl font-semibold text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {showcaseProjects.map((project) => (
              <div
                key={project._id}
                className="p-6 border rounded-lg shadow-lg project-item"
              >
                {project.image && (
                  <Image
                    className="object-cover rounded-lg"
                    src={
                      urlForImage(project.image)
                        ?.height(400)
                        .width(600)
                        .auto('format')
                        .url() || ''
                    }
                    alt={project.title}
                    width={600}
                    height={400}
                  />
                )}
                <h3 className="mt-4 text-2xl font-bold">{project.title}</h3>
                <p className="mt-2">{project.description}</p>
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
