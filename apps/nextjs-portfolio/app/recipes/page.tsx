import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiBarChart, FiThermometer, FiUsers } from 'react-icons/fi';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllRecipes } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';

interface Recipe {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  mainImage?: {
    asset?: {
      _ref: string;
      _type: 'reference';
    };
    alt: string;
    lqip?: string;
    aspectRatio?: number;
  };
  cookingTime?: number;
  prepTime?: number;
  totalTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  publishedAt?: string;
  tags?: Array<{ name: string }>;
}

interface RecipesQueryResult {
  data: Recipe[];
}

export async function generateMetadata(): Promise<Metadata> {
  const result = (await sanityFetch({ query: getAllRecipes })) as RecipesQueryResult;
  const recipes = result.data;

  const title = 'Recipes | WiSiHe';
  const description = `A collection of ${recipes?.length || 0} delicious recipes I've tried and enjoyed. From quick weeknight meals to special occasion dishes, find inspiration for your next culinary adventure.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://www.wisihe.no/recipes',
      siteName: 'WiSiHe',
      images: [
        {
          url: 'https://www.wisihe.no/og-image.jpg', // Replace with your actual OG image
          width: 1200,
          height: 630,
          alt: 'WiSiHe Recipes',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.wisihe.no/og-image.jpg'], // Replace with your actual OG image
    },
    alternates: {
      canonical: 'https://www.wisihe.no/recipes',
    },
  };
}

export default async function RecipesPage() {
  const result = (await sanityFetch({ query: getAllRecipes })) as RecipesQueryResult;
  const recipes = result.data;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Recipes Collection',
    description: "A collection of recipes I've tried and enjoyed",
    numberOfItems: recipes?.length || 0,
    itemListElement:
      recipes?.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Recipe',
          '@id': `https://www.wisihe.no/recipes/${recipe.slug}`,
          name: recipe.title,
          description: recipe.description,
          image: recipe.mainImage ? urlForImage(recipe.mainImage)?.url() : undefined,
          cookTime: recipe.cookingTime ? `PT${recipe.cookingTime}M` : undefined,
          prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
          totalTime: recipe.totalTime ? `PT${recipe.totalTime}M` : undefined,
          recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
          difficulty: recipe.difficulty,
          datePublished: recipe.publishedAt,
          keywords: recipe.tags?.map(tag => tag.name).join(', '),
        },
      })) || [],
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <div className='w-full min-h-screen bg-background p-4 pt-32 mx-auto max-w-7xl'>
        <div className='w-full pb-6'>
          <h1 className='text-3xl md:text-4xl font-bold font-serif text-foreground mb-3'>
            Recipes
          </h1>
          <p className='text-base md:text-lg text-foreground-subtle max-w-prose text-pretty leading-relaxed'>
            A collection of recipes I&apos;ve tried and enjoyed.
          </p>
        </div>
        <ul className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {recipes?.map((recipe: Recipe) => (
            <li key={recipe._id}>
              <article className='group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl border border-border/30 bg-surface hover:border-accent/30'>
                {recipe.mainImage && (
                  <div className='aspect-video overflow-hidden relative'>
                    <Image
                      src={urlForImage(recipe.mainImage)?.url() || ''}
                      alt={recipe.mainImage.alt}
                      width={640}
                      height={360}
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                  </div>
                )}
                <div className='p-5 flex flex-col gap-3'>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className='before:absolute before:inset-0 before:z-0'
                  >
                    <h2 className='text-lg font-semibold text-foreground group-hover:text-accent transition-colors'>
                      {recipe.title}
                    </h2>
                  </Link>
                  {recipe.description && (
                    <p className='text-sm text-foreground-subtle line-clamp-2'>
                      {recipe.description}
                    </p>
                  )}
                  <div className='flex flex-wrap gap-4 text-xs text-foreground-muted'>
                    {recipe.cookingTime && (
                      <span className='flex items-center gap-1.5'>
                        <FiThermometer className='w-3.5 h-3.5 text-accent' />
                        {recipe.cookingTime} min
                      </span>
                    )}
                    {recipe.servings && (
                      <span className='flex items-center gap-1.5'>
                        <FiUsers className='w-3.5 h-3.5 text-success' />
                        {recipe.servings} servings
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className='flex items-center gap-1.5'>
                        <FiBarChart className='w-3.5 h-3.5 text-info' />
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
