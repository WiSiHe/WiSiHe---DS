import { createFileRoute } from '@tanstack/react-router';
import { Chip } from '@wisihe/ui-react';
import { ContentCard, PageHero } from '../../components/layout/PageHero';
import { buildHead } from '../../lib/seo';
import { getRecipes, imageUrl } from '../../server/fns';

export const Route = createFileRoute('/recipes/')({
  loader: () => getRecipes(),
  head: ({ loaderData }) => {
    const count = loaderData?.length ?? 0;
    return buildHead({
      title: 'Recipes | WiSiHe',
      description:
        count > 0
          ? `${count} recipes I've cooked, tweaked, and loved.`
          : 'Home-cooked recipes from Henrik Sissener.',
      path: '/recipes',
      imageUrl: imageUrl(loaderData?.[0]?.mainImage, 1200, 630),
    });
  },
  component: RecipesPage,
});

function RecipesPage() {
  const recipes = Route.useLoaderData().filter(
    (r): r is typeof r & { slug: string; title: string } => !!r.slug && !!r.title,
  );

  return (
    <div className='container mx-auto px-4 pt-32 pb-20'>
      <PageHero
        eyebrow='Kitchen'
        title='Recipes'
        description='Home-cooked recipes — weeknight-friendly dishes, comfort food, and experiments worth repeating.'
      />

      {recipes.length === 0 ? (
        <p className='text-foreground/60'>No recipes published yet.</p>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {recipes.map(recipe => (
            <ContentCard
              key={recipe._id}
              to='/recipes/$slug'
              params={{ slug: recipe.slug }}
              imageUrl={imageUrl(recipe.mainImage, 800, 600)}
              title={recipe.title}
              description={recipe.description}
              meta={
                <div className='mt-auto flex flex-wrap gap-2 pt-2'>
                  {recipe.totalTime ? (
                    <span className='text-xs text-foreground/50'>{recipe.totalTime} min</span>
                  ) : null}
                  {recipe.difficulty ? (
                    <Chip label={recipe.difficulty} size='small' outlined />
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
