'use client';

import { IconArrowRight, IconShoppingBag } from '@tabler/icons-react';
import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import Link from 'next/link';
import PaintingCard from '@/app/components/paintings/PaintingCard/PaintingCard';
import PaintingsCarousel from '@/app/components/paintings/PaintingsSection/PaintingsCarousel';
import { paintingsShopHref } from '@/lib/algolia/constants';
import { type HomeSectionIntroCopy, pickSectionIntro } from '@/lib/homeSectionCopy';
import HomeSectionHeader from '../HomeSectionHeader/HomeSectionHeader';

type PaintingItem = NonNullable<HomeExtrasQueryResult>['forSalePaintings'][number];

const DEFAULT_COPY = {
  eyebrow: '// Shop',
  title: 'Available as prints',
  description:
    'Selected works available through print-on-demand — take a piece of the gallery home.',
  linkLabel: 'Browse gallery',
};

function formatForSaleCount(count: number): string {
  if (count === 1) return '1 work is currently available as a print';
  return `${count} works are currently available as prints`;
}

function buildShopDescription(baseDescription: string, forSaleCount: number): string {
  const countPhrase = formatForSaleCount(forSaleCount);
  const trimmed = baseDescription.trim();
  if (!trimmed) return `${countPhrase}.`;
  return `${trimmed} ${countPhrase}.`;
}

type ShopTeaserSectionProps = {
  intro: HomeSectionIntroCopy | null | undefined;
  paintings: PaintingItem[];
  forSaleCount: number;
};

export default function ShopTeaserSection({
  intro,
  paintings,
  forSaleCount,
}: ShopTeaserSectionProps) {
  if (paintings.length === 0) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);
  const description = buildShopDescription(copy.description, forSaleCount);
  const [featuredPainting, ...restPaintings] = paintings;
  const showFeaturedLayout = paintings.length >= 3;

  return (
    <section
      className='border-t border-border/20 bg-background py-24 px-4 md:px-8'
      aria-labelledby='shop-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div className='flex flex-col gap-4 md:flex-row md:items-end md:gap-8'>
            <HomeSectionHeader
              eyebrow={copy.eyebrow}
              title={copy.title}
              description={description}
              headingId='shop-teaser-heading'
              align='left'
            />
            <p className='flex items-center gap-2 self-start rounded-full border border-accent/25 bg-accent/8 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent backdrop-blur-sm md:self-auto'>
              <IconShoppingBag className='size-3.5' aria-hidden />
              {forSaleCount} for sale
            </p>
          </div>
          <Button
            as={Link}
            href={paintingsShopHref()}
            variant='secondary'
            size='medium'
            Icon={IconArrowRight}
            iconPosition='right'
            className='shrink-0 self-start rounded-full md:self-auto'
          >
            {copy.linkLabel}
          </Button>
        </div>

        <PaintingsCarousel paintings={paintings} showFooter={false} />

        <ul className='hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {showFeaturedLayout ? (
            <>
              <li className='lg:col-span-2 lg:row-span-2'>
                <PaintingCard paintingData={featuredPainting as any} shouldBeLazy alwaysShowTags />
              </li>
              {restPaintings.map(painting => (
                <li key={painting._id}>
                  <PaintingCard paintingData={painting as any} shouldBeLazy alwaysShowTags />
                </li>
              ))}
            </>
          ) : (
            paintings.map(painting => (
              <li key={painting._id}>
                <PaintingCard paintingData={painting as any} shouldBeLazy alwaysShowTags />
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
