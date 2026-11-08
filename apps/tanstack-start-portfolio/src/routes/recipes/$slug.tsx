import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundMessage } from '../../components/layout/PageHero';
import { RecipeDetailView } from '../../components/recipes/RecipeDetailView';
import { portableTextToPlainText } from '../../lib/portableText';
import { resolveInstructionBlocks } from '../../lib/recipes/recipeScaling';
import { buildHead } from '../../lib/seo';
import { buildRecipeStructuredData } from '../../lib/seo/structuredData';
import { getRecipeBySlug, getRecipes, imageUrl } from '../../server/fns';

function buildRecipeImageUrls(recipe: NonNullable<Awaited<ReturnType<typeof getRecipeBySlug>>>) {
  const urls = new Set<string>();
  const main = imageUrl(recipe.mainImage, 1200, 630);
  if (main) urls.add(main);
  recipe.additionalImages?.forEach(img => {
    const url = imageUrl(img, 1200, 630);
    if (url) urls.add(url);
  });
  return [...urls];
}

export const Route = createFileRoute('/recipes/$slug')({
  loader: async ({ params }) => {
    const [recipe, allRecipes] = await Promise.all([
      getRecipeBySlug({ data: { slug: params.slug } }),
      getRecipes(),
    ]);
    if (!recipe?._id || !recipe.slug) throw notFound();
    return { recipe, moreRecipes: allRecipes ?? [] };
  },
  head: ({ loaderData }) => {
    const recipe = loaderData?.recipe;
    const structuredData = recipe
      ? buildRecipeStructuredData({
          slug: recipe.slug,
          title: recipe.title,
          description: recipe.description,
          imageUrls: buildRecipeImageUrls(recipe),
          publishedAt: recipe.publishedAt,
          updatedAt: recipe._updatedAt,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookingTime,
          totalTime: recipe.totalTime,
          servings: recipe.servings,
          recipeCategory: recipe.recipeCategory,
          recipeCuisine: recipe.recipeCuisine,
          ingredients:
            recipe.ingredientCategories?.flatMap(category =>
              (category.ingredients ?? []).map(ingredient => {
                const name = ingredient.ingredient || '';
                const amount = [ingredient.amount, ingredient.unit].filter(Boolean).join(' ');
                return amount ? `${amount} ${name}` : name;
              }),
            ) ?? [],
          instructions:
            recipe.instructions?.map(instruction => ({
              title: instruction.title,
              text: portableTextToPlainText(
                resolveInstructionBlocks(
                  instruction.content,
                  recipe.ingredientCategories?.flatMap(c => c.ingredients ?? []) ?? [],
                ),
              ),
            })) ?? [],
          tags: recipe.tags?.map(tag => tag.name).filter(Boolean) as string[],
          averageRating: recipe.averageRating,
          ratingCount: recipe.ratingCount,
        })
      : null;

    return buildHead({
      title: recipe?.seo?.title || recipe?.title || 'Recipe',
      description: recipe?.seo?.description || recipe?.description || `Recipe by Henrik Sissener`,
      path: `/recipes/${recipe?.slug}`,
      imageUrl: imageUrl(recipe?.seo?.image ?? recipe?.mainImage, 1200, 630),
      noIndex: recipe?.seo?.noIndex,
      type: 'article',
      jsonLd: structuredData,
    });
  },
  notFoundComponent: () => (
    <NotFoundMessage title='Recipe not found' description='This recipe does not exist.' />
  ),
  component: RecipeDetailPage,
});

function RecipeDetailPage() {
  const { recipe, moreRecipes } = Route.useLoaderData();
  return <RecipeDetailView recipe={recipe} moreRecipes={moreRecipes} />;
}
