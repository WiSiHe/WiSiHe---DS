import type { GetAllRecipesResult, GetRecipeResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { MoreRecipes } from '@/app/components/recipes/MoreRecipes/MoreRecipes';
import { client } from '@/sanity/lib/client';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllRecipes, getRecipe, getRecipeSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import RecipeDetail from '../../components/recipes/RecipeDetail/RecipeDetail';
import { buildRecipeStructuredData } from '../buildRecipeStructuredData';

const SITE_URL = 'https://www.wisihe.no';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(getRecipeSlugs);
  return (slugs as Array<{ slug: string }>).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: getRecipe,
    params: { slug },
    stega: false,
  });
  const recipe = data as GetRecipeResult;

  if (!recipe) {
    return { title: 'Recipe not found | WiSiHe' };
  }

  const seo = recipe.seo as
    | { title?: string; description?: string; image?: unknown; noIndex?: boolean }
    | undefined;

  const title =
    seo?.title?.trim() ||
    (recipe.title.toLowerCase().includes('recipe') ? recipe.title : `${recipe.title} | Recipe`);

  const description =
    seo?.description?.trim() ||
    recipe.description ||
    `Step-by-step ${recipe.title} — ingredients, timings, and tips from Henrik Sissener's kitchen.`;

  const seoImage = seo?.image ? urlForImage(seo.image as Parameters<typeof urlForImage>[0]) : null;
  const imageUrl =
    seoImage?.width(1200).height(630).quality(85).url() ||
    (recipe.mainImage
      ? urlForImage(recipe.mainImage)?.width(1200).height(630).quality(85).url()
      : null) ||
    `${SITE_URL}/og-image.jpg`;

  const url = `${SITE_URL}/recipes/${recipe.slug}`;
  const tags = recipe.tags?.slice(0, 9).map(tag => tag.name) ?? [];

  return {
    title,
    description,
    authors: [{ name: 'Henrik Wilhelm Sissener', url: SITE_URL }],
    creator: 'Henrik Wilhelm Sissener',
    alternates: { canonical: url },
    openGraph: {
      title: recipe.title,
      description,
      type: 'article',
      url,
      siteName: 'WiSiHe',
      publishedTime: recipe.publishedAt ?? undefined,
      authors: ['Henrik Wilhelm Sissener'],
      tags,
      images: [
        { url: imageUrl, width: 1200, height: 630, alt: recipe.mainImage?.alt ?? recipe.title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description,
      images: [imageUrl],
    },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    keywords: ['recipe', 'cooking', recipe.title, ...tags],
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;

  const [{ data: recipeData }, { data: allRecipesData }] = await Promise.all([
    sanityFetch({ query: getRecipe, params: { slug } }),
    sanityFetch({ query: getAllRecipes }),
  ]);

  const recipe = recipeData as GetRecipeResult;
  const allRecipes = (allRecipesData ?? []) as GetAllRecipesResult;

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildRecipeStructuredData(recipe)} />
      <RecipeDetail recipe={recipe} />
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <MoreRecipes recipes={allRecipes} currentSlug={recipe.slug} />
      </div>
    </>
  );
}
