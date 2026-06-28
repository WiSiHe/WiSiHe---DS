import type { GetRecipeResult } from '@wisihe/sanity-queries';
import { portableTextToPlainText, urlForImage } from '@/sanity/lib/utils';

const SITE_URL = 'https://www.wisihe.no';
const AUTHOR = {
  '@type': 'Person' as const,
  name: 'Henrik Wilhelm Sissener',
  alternateName: 'WiSiHe',
  url: `${SITE_URL}/about`,
};

function buildRecipeImageUrls(recipe: NonNullable<GetRecipeResult>): string[] {
  const urls = new Set<string>();

  const addImage = (image: Parameters<typeof urlForImage>[0] | null | undefined) => {
    const url = image ? urlForImage(image)?.width(1200).height(630).url() : undefined;
    if (url) urls.add(url);
  };

  addImage(recipe.mainImage);
  recipe.additionalImages?.forEach(addImage);

  return [...urls];
}

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

import {
  hasNutritionData,
  type RecipeNutritionValues,
  resolveCalories,
} from '@/app/components/recipes/RecipeNutrition/recipeNutritionUtils';

function buildNutritionJsonLd(nutrition: RecipeNutritionValues | null | undefined) {
  if (!hasNutritionData(nutrition) || !nutrition) return undefined;

  const calories = resolveCalories(nutrition);
  const entry: {
    '@type': 'NutritionInformation';
    calories?: string;
    proteinContent?: string;
    carbohydrateContent?: string;
    fatContent?: string;
    fiberContent?: string;
    sugarContent?: string;
    sodiumContent?: string;
  } = {
    '@type': 'NutritionInformation',
  };

  if (calories != null) entry.calories = `${calories} calories`;
  if (nutrition.protein != null && nutrition.protein > 0) {
    entry.proteinContent = `${nutrition.protein} g`;
  }
  if (nutrition.carbohydrates != null && nutrition.carbohydrates > 0) {
    entry.carbohydrateContent = `${nutrition.carbohydrates} g`;
  }
  if (nutrition.fat != null && nutrition.fat > 0) {
    entry.fatContent = `${nutrition.fat} g`;
  }
  if (nutrition.fiber != null && nutrition.fiber > 0) {
    entry.fiberContent = `${nutrition.fiber} g`;
  }
  if (nutrition.sugar != null && nutrition.sugar > 0) {
    entry.sugarContent = `${nutrition.sugar} g`;
  }
  if (nutrition.sodium != null && nutrition.sodium > 0) {
    entry.sodiumContent = `${nutrition.sodium} mg`;
  }

  const hasValues = Boolean(
    entry.calories ||
      entry.proteinContent ||
      entry.carbohydrateContent ||
      entry.fatContent ||
      entry.fiberContent ||
      entry.sugarContent ||
      entry.sodiumContent,
  );

  return hasValues ? entry : undefined;
}

export function buildRecipeStructuredData(recipe: NonNullable<GetRecipeResult>) {
  const url = `${SITE_URL}/recipes/${recipe.slug}`;
  const images = buildRecipeImageUrls(recipe);
  const keywords = recipe.tags
    ?.map(tag => tag.name)
    .filter(Boolean)
    .join(', ');
  const storyText = recipe.story?.length
    ? portableTextToPlainText(recipe.story as readonly Record<string, unknown>[])
    : '';
  const description =
    recipe.description?.trim() ||
    storyText.slice(0, 200) ||
    `Home-cooked ${recipe.title} by Henrik Sissener.`;
  const ratingCount = recipe.ratingCount ?? 0;
  const averageRating = recipe.averageRating ?? null;
  const nutritionJsonLd = buildNutritionJsonLd(recipe.nutrition);

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
        inLanguage: 'en',
        name: recipe.title,
        description,
        image: images.length > 0 ? images : undefined,
        author: AUTHOR,
        datePublished: recipe.publishedAt ?? undefined,
        dateModified: recipe._updatedAt ?? recipe.publishedAt ?? undefined,
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
        ...(nutritionJsonLd ? { nutrition: nutritionJsonLd } : {}),
        ...(ratingCount > 0 &&
          averageRating != null && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: averageRating,
              ratingCount,
              bestRating: 5,
              worstRating: 1,
            },
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
