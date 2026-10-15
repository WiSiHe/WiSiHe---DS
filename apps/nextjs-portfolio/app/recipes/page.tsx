import type { GetAllRecipesResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { RecipesListing } from '@/app/components/recipes/RecipesListing/RecipesListing';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllRecipes } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { buildRecipesListStructuredData } from './buildRecipeStructuredData';

const SITE_URL = 'https://www.wisihe.no';
const RECIPES_URL = `${SITE_URL}/recipes`;
const DEFAULT_DESCRIPTION =
  'Home-cooked recipes from Henrik Sissener — weeknight-friendly dishes, comfort food, and experiments worth repeating.';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: getAllRecipes, stega: false });
  const recipes = (data ?? []) as GetAllRecipesResult;
  const count = recipes.length;
  const title = 'Recipes | WiSiHe';
  const description =
    count > 0
      ? `${count} recipes I've cooked, tweaked, and loved — from quick dinners to slow weekend projects.`
      : DEFAULT_DESCRIPTION;

  const ogImage = recipes[0]?.mainImage
    ? urlForImage(recipes[0].mainImage)?.width(1200).height(630).quality(85).url()
    : `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    alternates: { canonical: RECIPES_URL },
    openGraph: {
      title,
      description,
      type: 'website',
      url: RECIPES_URL,
      siteName: 'WiSiHe',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: 'WiSiHe Recipes' }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RecipesPage() {
  const { data } = await sanityFetch({ query: getAllRecipes });
  const recipes = (data ?? []) as GetAllRecipesResult;
  const validRecipes = recipes.filter(
    (r): r is typeof r & { slug: string; title: string } => !!r.slug && !!r.title,
  );

  return (
    <>
      <JsonLd data={buildRecipesListStructuredData(validRecipes)} />
      <div className='min-h-screen bg-background'>
        <header className='relative overflow-hidden border-b border-border/40 pt-28 pb-16 sm:pt-32'>
          <div className='pointer-events-none absolute inset-0 bg-accent/5' aria-hidden />
          <div
            className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_25%,transparent_100%)]'
            aria-hidden
          />
          <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
              Kitchen notes
            </p>
            <h1 className='mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
              Recipes
            </h1>
            <p className='mt-4 max-w-2xl text-lg leading-relaxed text-foreground-subtle text-pretty'>
              Dishes I actually make at home — tested, annotated, and shared so you can steal the
              ideas without the guesswork.
            </p>
            {recipes.length > 0 ? (
              <p className='mt-6 text-sm font-medium text-foreground-muted'>
                {recipes.length} recipe{recipes.length === 1 ? '' : 's'} in the collection
              </p>
            ) : null}
          </div>
        </header>

        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
          {recipes.length > 0 ? (
            <Suspense fallback={<p className='text-foreground-muted'>Loading recipes…</p>}>
              <RecipesListing recipes={recipes} />
            </Suspense>
          ) : (
            <div className='rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-20 text-center'>
              <p className='font-serif text-2xl font-bold text-foreground'>Recipes coming soon</p>
              <p className='mt-2 text-foreground-muted'>
                New dishes will land here as they get written up in Sanity Studio.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
