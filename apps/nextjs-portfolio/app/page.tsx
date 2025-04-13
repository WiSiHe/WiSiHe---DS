import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { PortableTextBlock } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import Chip from './components/Chip/Chip';
import HeroImageSection from './components/HeroSection/HeroSection';
import NotFoundSection from './components/NotFound/NotFound';
import PaintingsSection from './components/PaintingsSection/PaintingsSection';

import { HomePageQueryResult } from '@/sanity.types';
import Squares from './components/Squares/Squares';
import TiltedCard from './components/TiltedCard/TiltedCard';

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

      <section className="px-4 py-16 md:px-8 bg-tertiary/80">
        <div className="max-w-screen-xl mx-auto">
          <div className="mx-auto mb-12 text-center text-dark max-w-prose">
            <h2 className="mb-4 text-3xl font-bold">Featured Projects</h2>
            <p className="text-lg text-dark/80">
              Here are some of the projects I have worked on. Click on the
              project to view more details.
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-4 pb-4 overflow-x-auto lg:overflow-x-visible lg:p-4 flex-nowrap lg:justify-center lg:gap-12">
              {showcaseProjects &&
                showcaseProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex-none w-[85vw] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)]"
                  >
                    <article className="bg-white shadow-lg md:hidden rounded-xl text-dark overflow-clip">
                      <div className="relative bg-dark aspect-video">
                        {project.image && (
                          <Image
                            className="object-cover w-full h-full"
                            src={
                              urlForImage(project.image)
                                ?.height(700)
                                .width(700)
                                .auto('format')
                                .url() || ''
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={project.name}
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{project.seo.title}</h3>
                        <p className="line-clamp-3">
                          {project.seo.description}
                        </p>
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

                    <Link
                      href={`projects/${project.slug}`}
                      className="hidden md:block group"
                    >
                      <TiltedCard
                        altText={project.seo.title}
                        captionText={project.seo.title}
                        containerHeight="400px"
                        containerWidth="100%"
                        imageHeight="400px"
                        imageWidth="100%"
                        rotateAmplitude={8}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        imageSrc={
                          urlForImage(project.image)
                            ?.height(800)
                            .width(600)
                            .auto('format')
                            .url() || ''
                        }
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex flex-col gap-4 py-20 text-white ">
        <div className="absolute inset-0 w-full h-full">
          <Squares
            speed={0.5}
            squareSize={40}
            direction="down" // up, down, left, right, diagonal
            borderColor="oklch(59.61% 0.244 350.38)"
            hoverFillColor="oklch(59.61% 0.244 350.38)"
          />
        </div>

        <div className="z-10 px-4 pointer-events-none lg:px-10">
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
            <Chip
              key={skill}
              label={skill}
              className="ml-2 pointer-events-none"
            />
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
            <Chip
              key={skill}
              label={skill}
              className="ml-2 pointer-events-none"
            />
          ))}
        </Marquee>
        <PaintingsSection
          paintings={showcasePaintings}
          paintingsDescription={paintingsDescription}
        />
      </section>

      <NotFoundSection />
    </div>
  );
}
