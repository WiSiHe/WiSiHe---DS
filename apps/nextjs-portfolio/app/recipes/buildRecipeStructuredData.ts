import type { GetRecipeResult } from '@wisihe/sanity-queries';
import { portableTextToPlainText, urlForImage } from '@/sanity/lib/utils';

const SITE_URL = 'https://www.wisihe.no';
const AUTHOR = {
  '@type': 'Person' as const,
  name: 'Henrik Wilhelm Sissener',
  alternateName: 'WiSiHe',
  url: SITE_URL,
};

export function formatRecipeDuration(minutes: number | null | undefined): string | undefined {
  if (!minutes || minutes <= 0) return undefined;
  return `PT${minutes}M`;
}

export function buildRecipeIngredientList(recipe: NonNullable<GetRecipeResult>): string[] {
  return (
    recipe.ingredientCategories?.flatMap(category =>
      (category.ingredients ?? []).map(ingredient => {
        const name = ingredient.ingredient || '';
        const amount = [ingredient.amount, ingredient.unit].filter(Boolean).join(' ');
        return amount ? `${amount} ${name}` : name;
      }),
    ) ?? []
  );
}

export function buildRecipeStructuredData(recipe: NonNullable<GetRecipeResult>) {
  const url = `${SITE_URL}/recipes/${recipe.slug}`;
  const imageUrl = recipe.mainImage
    ? urlForImage(recipe.mainImage)?.width(1200).height(630).url()
    : undefined;
  const keywords = recipe.tags
    ?.map(tag => tag.name)
    .filter(Boolean)
    .join(', ');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Recipes', item: `${SITE_URL}/recipes` },
          { '@type': 'ListItem', position: 3, name: recipe.title, item: url },
        ],
      },
      {
        '@type': 'Recipe',
        '@id': url,
        name: recipe.title,
        description: recipe.description,
        image: imageUrl ? [imageUrl] : undefined,
        author: AUTHOR,
        datePublished: recipe.publishedAt,
        prepTime: formatRecipeDuration(recipe.prepTime),
        cookTime: formatRecipeDuration(recipe.cookingTime),
        totalTime: formatRecipeDuration(recipe.totalTime),
        recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
        keywords,
        recipeIngredient: buildRecipeIngredientList(recipe),
        recipeInstructions:
          recipe.instructions?.map((instruction, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: instruction.title ?? `Step ${index + 1}`,
            text: portableTextToPlainText(
              instruction.content as readonly Record<string, unknown>[],
            ),
          })) ?? [],
        ...(recipe.difficulty && {
          recipeDifficulty: recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1),
        }),
        ...(recipe.recipeCategory ? { recipeCategory: recipe.recipeCategory } : {}),
        ...(recipe.recipeCuisine ? { recipeCuisine: recipe.recipeCuisine } : {}),
        ...(recipe.tips?.length && {
          recipeTip: recipe.tips.map(tip => tip.content).filter(Boolean),
        }),
      },
    ],
  };
}

export function buildRecipesListStructuredData(
  recipes: Array<{
    slug: string;
    title: string;
    description?: string | null;
    mainImage?: { asset?: unknown; alt?: string } | null;
    cookingTime?: number | null;
    prepTime?: number | null;
    totalTime?: number | null;
    servings?: number | null;
    difficulty?: string | null;
    publishedAt?: string | null;
    tags?: Array<{ name: string }> | null;
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/recipes#collection`,
        url: `${SITE_URL}/recipes`,
        name: 'Recipes | WiSiHe',
        description: "Henrik Sissener's collection of home-cooked recipes.",
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'ItemList',
        name: 'Recipes',
        numberOfItems: recipes.length,
        itemListElement: recipes.map((recipe, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/recipes/${recipe.slug}`,
          name: recipe.title,
        })),
      },
    ],
  };
}
