import { sanityFetch } from '@/sanity/lib/live';
import { getAllRecipes } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import { Metadata } from 'next';
import { FiThermometer, FiUsers, FiBarChart } from 'react-icons/fi';

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
          }),
        }}
      />
      <div className="min-h-screen p-4 pt-32 mx-auto max-w-screen-2xl">
        <h1 className="font-semibold text-text-primary">Recipes</h1>
        <p className="text-text-secondary">A collection of recipes I&apos;ve tried and enjoyed.</p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {recipes?.map((recipe: Recipe) => (
            <li key={recipe._id}>
              <article className="relative flex flex-col gap-2 rounded-md transition-all duration-200 hover:shadow-lg border border-border">
                {recipe.mainImage && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={urlForImage(recipe.mainImage)?.url() || ''}
                      alt={recipe.mainImage.alt}
                      width={640}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="before:absolute before:inset-0 before:z-0"
                  >
                    <h2 className="text-lg font-semibold text-text-primary">{recipe.title}</h2>
                  </Link>
                  <p className="text-sm text-text-secondary">{recipe.description}</p>
                  <div className="flex gap-4 text-xs text-text-tertiary">
                    {recipe.cookingTime && (
                      <span className="flex items-center gap-1">
                        <FiThermometer className="w-3 h-3 text-accent-warm" />
                        {recipe.cookingTime} min
                      </span>
                    )}
                    {recipe.servings && (
                      <span className="flex items-center gap-1">
                        <FiUsers className="w-3 h-3 text-accent-success" />
                        {recipe.servings} servings
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className="flex items-center gap-1">
                        <FiBarChart className="w-3 h-3 text-accent-cool" />
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
