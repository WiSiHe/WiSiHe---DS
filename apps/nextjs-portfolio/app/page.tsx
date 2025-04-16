import { HomePageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { homePageQuery } from "@/sanity/lib/queries";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import HeroImageSection from "./components/HeroSection/HeroSection";
import PaintingsSection from "./components/PaintingsSection/PaintingsSection";
import { PortableTextBlock } from "next-sanity";
import { Metadata } from "next";

import SkillsSection from "./components/SkillsSection/SkillsSection";

export const metadata: Metadata = {
  title: "Henrik Sissener | Frontend Developer & Creative",
  description:
    "Portfolio of Henrik Sissener, a frontend developer specializing in React and Svelte. Explore my projects, artwork, and development skills.",
  keywords: [
    "frontend developer",
    "React",
    "Svelte",
    "portfolio",
    "web development",
    "game development",
    "art",
  ],
  openGraph: {
    title: "Henrik Sissener | Frontend Developer & Creative",
    description:
      "Portfolio of Henrik Sissener, a frontend developer specializing in React and Svelte. Explore my projects, artwork, and development skills.",
    type: "website",
    locale: "en_US",
    siteName: "Henrik Sissener Portfolio",
    images: [
      {
        url: "/images/hell.jpg",
        width: 1200,
        height: 630,
        alt: "Henrik Sissener Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Henrik Sissener | Frontend Developer & Creative",
    description:
      "Portfolio of Henrik Sissener, a frontend developer specializing in React and Svelte. Explore my projects, artwork, and development skills.",
    images: ["/images/hell.jpg"],
  },
};

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
      {/* <NotFoundSection /> */}
      <SkillsSection />
    </div>
  );
}
