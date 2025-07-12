import { sanityFetch } from '@/sanity/lib/live';
import { getAllRecipes } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import { Metadata } from 'next';

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
      url: 'https://wisihe.no/recipes',
      siteName: 'WiSiHe',
      images: [
        {
          url: 'https://wisihe.no/og-image.jpg', // Replace with your actual OG image
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
      images: ['https://wisihe.no/og-image.jpg'], // Replace with your actual OG image
    },
    alternates: {
      canonical: 'https://wisihe.no/recipes',
    },
  };
}

export default async function RecipesPage() {
  const result = (await sanityFetch({ query: getAllRecipes })) as RecipesQueryResult;
  const recipes = result.data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                  '@id': `https://wisihe.no/recipes/${recipe.slug}`,
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
          }),
        }}
      />
      <div className="min-h-screen p-4 pt-32 mx-auto max-w-screen-2xl">
        <h1 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Recipes
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          A collection of recipes I&apos;ve tried and enjoyed.
        </p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes?.map((recipe: Recipe) => (
            <li key={recipe._id}>
              <Link href={`/recipes/${recipe.slug}`}>
                <article
                  className="flex flex-col gap-2 p-4 rounded-md transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {recipe.mainImage && (
                    <div className="aspect-video overflow-hidden rounded-md">
                      <Image
                        src={urlForImage(recipe.mainImage)?.url() || ''}
                        alt={recipe.mainImage.alt}
                        width={640}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {recipe.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {recipe.description}
                  </p>
                  <div
                    className="flex gap-4 text-xs"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {recipe.cookingTime && <span>⏱️ {recipe.cookingTime} min</span>}
                    {recipe.servings && <span>👥 {recipe.servings} servings</span>}
                    {recipe.difficulty && <span>📊 {recipe.difficulty}</span>}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
