import type { AboutQueryResult, HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import type { PortableTextBlock } from 'next-sanity';
import { Suspense } from 'react';
import AboutTeaserSection from '@/app/components/marketing/AboutTeaserSection/AboutTeaserSection';
import ContactCtaSection from '@/app/components/marketing/ContactCtaSection/ContactCtaSection';
import HeroImageSection from '@/app/components/marketing/HeroSection/HeroSection';
import ShopTeaserSection from '@/app/components/marketing/ShopTeaserSection/ShopTeaserSection';
import SkillsSection from '@/app/components/marketing/SkillsSection/SkillsSection';
import VideosTeaserSection from '@/app/components/marketing/VideosTeaserSection/VideosTeaserSection';
import PaintingsSection from '@/app/components/paintings/PaintingsSection/PaintingsSection';
import FeaturedProjects from '@/app/components/projects/FeaturedProjects/FeaturedProjects';
import type { HomePageSection, HomePageSectionsContext } from '@/lib/homePageBuilder';
import { buildHeroCollageItems, getHeroOverview, getHomeSections } from '@/lib/homePageBuilder';

const HeroSkeleton = () => (
  <div className='relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 lg:min-h-[70vh] lg:pt-0 bg-surface overflow-clip'>
    <div className='w-full h-96 bg-surface-elevated animate-pulse rounded-2xl' />
  </div>
);

const SectionSkeleton = () => (
  <div className='max-w-7xl mx-auto px-4 py-20'>
    <div className='h-8 bg-surface-elevated animate-pulse rounded mb-4' />
    <div className='h-4 bg-surface-elevated animate-pulse rounded mb-8' />
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {[1, 2, 3].map(i => (
        <div key={i} className='h-64 bg-surface-elevated animate-pulse rounded' />
      ))}
    </div>
  </div>
);

type HomePageSectionsProps = HomePageSectionsContext;

function renderSection(
  section: HomePageSection,
  context: {
    heroOverview: ReturnType<typeof getHeroOverview>;
    heroItems: ReturnType<typeof buildHeroCollageItems>;
    heroEyebrow?: string | null;
    heroName?: string | null;
    about: AboutQueryResult | null;
    extras: HomeExtrasQueryResult | null;
  },
) {
  const { heroOverview, heroItems, heroEyebrow, heroName, about, extras } = context;
  const key = section._key;

  switch (section._type) {
    case 'homeHeroSection':
      return (
        <div key={key} className='bg-background'>
          <Suspense fallback={<HeroSkeleton />}>
            <HeroImageSection
              items={heroItems}
              overview={heroOverview as PortableTextBlock[] | null}
              heroEyebrow={heroEyebrow}
              heroName={heroName}
            />
          </Suspense>
        </div>
      );

    case 'homeProjectsSection':
      return (
        <section key={key} className='relative bg-background pt-24 pb-12'>
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedProjects
              showcaseProjects={section.showcaseProjects}
              projectsDescription={section.description}
            />
          </Suspense>
        </section>
      );

    case 'homePaintingsSection':
      return (
        <section key={key} className='bg-surface py-24 px-4 md:px-8'>
          <Suspense fallback={<SectionSkeleton />}>
            <PaintingsSection
              paintingsDescription={section.description}
              showcasePaintings={section.showcasePaintings}
              paintingsSource={
                section.showcasePaintingsCurated ? 'cms_showcase' : 'featured_fallback'
              }
            />
          </Suspense>
        </section>
      );

    case 'homeAboutTeaserSection':
      return <AboutTeaserSection key={key} section={section} about={about} />;

    case 'homeVideosTeaserSection':
      if (!extras?.videos?.length) return null;
      return <VideosTeaserSection key={key} intro={section.intro} videos={extras.videos} />;

    case 'homeShopTeaserSection':
      if (!extras?.forSalePaintings?.length) return null;
      return (
        <ShopTeaserSection key={key} intro={section.intro} paintings={extras.forSalePaintings} />
      );

    case 'homeSkillsSection':
      return (
        <Suspense key={key} fallback={<div className='h-64 bg-surface-elevated animate-pulse' />}>
          <SkillsSection eyebrow={section.eyebrow} title={section.title} />
        </Suspense>
      );

    case 'homeContactCtaSection':
      return <ContactCtaSection key={key} section={section} about={about} />;

    default:
      return null;
  }
}

export default function HomePageSections({
  home,
  about,
  extras,
  heroEyebrow,
  heroName,
}: HomePageSectionsProps) {
  const sections = getHomeSections(home);
  const heroOverview = getHeroOverview(home);
  const heroItems = buildHeroCollageItems(home);

  return (
    <>
      {sections.map(section =>
        renderSection(section, {
          heroOverview,
          heroItems,
          heroEyebrow,
          heroName,
          about,
          extras,
        }),
      )}
    </>
  );
}
