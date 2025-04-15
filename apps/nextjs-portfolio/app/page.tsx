import { sanityFetch } from "@/sanity/lib/live";
import { homePageQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroImageSection from "./components/HeroSection/HeroSection";
import PaintingsSection from "./components/PaintingsSection/PaintingsSection";
import { HomePageQueryResult } from "@/sanity.types";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";

const NotFoundSection = dynamic(
  () => import("./components/NotFound/NotFound"),
  {
    loading: () => <div className="h-[50vh]" />,
  },
);

const SkillsSection = dynamic(
  () => import("./components/SkillsSection/SkillsSection"),
  {
    loading: () => <div className="h-[50vh]" />,
  },
);

type Painting = NonNullable<
  NonNullable<HomePageQueryResult>["showcasePaintings"]
>[number];

// Fisher-Yates shuffle algorithm
function shuffleArray(array: Painting[]): Painting[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
  const shuffledPaintings = showcasePaintings
    ? shuffleArray(showcasePaintings)
    : [];

  const paintingsDescription =
    homepage.paintingsDescription as PortableTextBlock[];

  const professionalSkills = [
    "Frontend Development",
    "UI/UX Design",
    "Responsive Web Design",
    "Accessibility (WCAG Standards)",
    "React.js",
    "SvelteKit",
    "Next.js",
    "Tailwind CSS",
    "Sanity CMS Integration",
    "Performance Optimization",
    "Interactive Prototyping",
  ];

  const creativeSkills = [
    "Digital Drawing & Painting",
    "3D Modeling (Blender)",
    "Game Development (Unreal Engine 5)",
    "Video Editing & Production",
    "Interactive 3D Design (Spline)",
    "Concept Art & Illustration",
  ];

  return (
    <div className="bg-dark">
      <HeroImageSection paintings={shuffledPaintings} />

      <section className="px-4 py-20 space-y-10 lg:space-y-42 md:px-8 bg-gradient-to-b from-tertiary to-tertiary/70">
        <FeaturedProjects showcaseProjects={showcaseProjects} />

        <PaintingsSection
          paintings={shuffledPaintings}
          paintingsDescription={paintingsDescription}
        />
      </section>

      <Suspense fallback={<div className="h-[50vh]" />}>
        <NotFoundSection />
      </Suspense>
      <Suspense fallback={<div className="h-[50vh]" />}>
        <SkillsSection
          professionalSkills={professionalSkills}
          creativeSkills={creativeSkills}
        />
      </Suspense>
    </div>
  );
}
