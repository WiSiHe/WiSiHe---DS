import type { GetAllRecipesResult } from '@wisihe/sanity-queries';
import { Link } from '@/app/components/layout/ProgressLink';
import { RecipeCard } from '../RecipeCard/RecipeCard';

type MoreRecipesProps = {
  recipes: GetAllRecipesResult;
  currentSlug: string;
};

export function MoreRecipes({ recipes, currentSlug }: MoreRecipesProps) {
  const others = recipes.filter(recipe => recipe.slug !== currentSlug).slice(0, 3);
  if (!others.length) return null;

  return (
    <section
      className='mt-24 border-t border-border/30 pt-16'
      aria-labelledby='more-recipes-heading'
    >
      <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
            Keep cooking
          </p>
          <h2
            id='more-recipes-heading'
            className='mt-2 font-serif text-3xl font-bold text-foreground'
          >
            More recipes
          </h2>
        </div>
        <Link
          href='/recipes'
          className='text-sm font-semibold text-accent transition-colors hover:text-accent-hover'
        >
          View all recipes →
        </Link>
      </div>
      <ul className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {others.map(recipe => (
          <li key={recipe._id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </section>
  );
}
