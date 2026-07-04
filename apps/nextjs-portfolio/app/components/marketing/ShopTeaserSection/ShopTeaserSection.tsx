'use client';

import { IconShoppingBag } from '@tabler/icons-react';
import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { paintingsShopHref } from '@/lib/algolia/constants';
import { type HomeSectionIntroCopy, pickSectionIntro } from '@/lib/homeSectionCopy';
import ShopPrintShowcase from './ShopPrintShowcase';

type PaintingItem = NonNullable<HomeExtrasQueryResult>['forSalePaintings'][number];

const DEFAULT_COPY = {
  eyebrow: '// Shop',
  title: 'Take home a print',
  description:
    'Selected works, ready to order — museum-quality reproductions shipped to your door.',
  linkLabel: 'Browse all prints',
};

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

  return (
    <section
      className='relative isolate overflow-hidden border-t border-border/20 bg-background px-4 py-16 md:px-8 md:py-24'
      aria-labelledby='shop-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <header className='relative z-10 mb-10 md:mb-14 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10'>
          <div className='lg:col-span-7'>
            <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs'>
              {copy.eyebrow}
            </p>
            <h2
              id='shop-teaser-heading'
              className='max-w-xl font-serif text-[clamp(2rem,8vw,3.75rem)] font-extrabold leading-[0.95] tracking-tight text-foreground'
            >
              {copy.title}
            </h2>
            {copy.description ? (
              <p className='mt-4 max-w-lg text-base leading-relaxed text-foreground-subtle text-pretty md:text-lg'>
                {copy.description}
              </p>
            ) : null}
          </div>

          <div className='mt-5 flex items-center gap-3 lg:col-span-5 lg:mt-0 lg:justify-end'>
            <p className='inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent backdrop-blur-sm'>
              <IconShoppingBag className='size-3.5' aria-hidden />
              {forSaleCount} for sale
            </p>
          </div>
        </header>

        <ShopPrintShowcase
          paintings={paintings}
          forSaleCount={forSaleCount}
          shopHref={paintingsShopHref()}
          linkLabel={copy.linkLabel}
        />
      </div>
    </section>
  );
}
