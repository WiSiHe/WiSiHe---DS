import { sanityFetch } from '@/sanity/lib/live';
import { getAllRecipes } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

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

export default async function RecipesPage() {
  const result = (await sanityFetch({ query: getAllRecipes })) as RecipesQueryResult;
  const recipes = result.data;

  return (
    <div className="min-h-screen p-4 pt-32 mx-auto max-w-screen-2xl">
      <h1 className="font-semibold">Recipes</h1>
      <p>A collection of recipes I&apos;ve tried and enjoyed.</p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe: Recipe) => (
          <li key={recipe._id}>
            <Link href={`/recipes/${recipe.slug}`}>
              <article className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
                {recipe.mainImage && (
                  <div className="aspect-video overflow-hidden rounded-md">
                    <Image
                      src={
                        recipe.mainImage.asset?._ref
                          ? `https://cdn.sanity.io/images/your-project-id/${recipe.mainImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg')}`
                          : ''
                      }
                      alt={recipe.mainImage.alt}
                      width={640}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-lg font-semibold">{recipe.title}</h2>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <div className="flex gap-4 text-xs text-gray-400">
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
  );
}
