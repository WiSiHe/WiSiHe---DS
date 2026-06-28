'use client';

import type { GetAllRecipesResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RecipeCard } from '../RecipeCard/RecipeCard';

type RecipesListingProps = {
  recipes: GetAllRecipesResult;
};

export function RecipesListing({ recipes }: RecipesListingProps) {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get('tag');
  const [activeTag, setActiveTag] = useState<string | null>(tagFromUrl);

  useEffect(() => {
    setActiveTag(tagFromUrl);
  }, [tagFromUrl]);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const recipe of recipes) {
      for (const tag of recipe.tags ?? []) {
        if (tag.name) {
          counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1);
        }
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name);
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (!activeTag) return recipes;
    return recipes.filter(recipe =>
      recipe.tags?.some(tag => tag.name && tag.name.toLowerCase() === activeTag.toLowerCase()),
    );
  }, [activeTag, recipes]);

  const [featured, ...rest] = filteredRecipes;
  const showFeatured = !activeTag && featured;

  return (
    <div className='space-y-10'>
      {allTags.length > 0 ? (
        <div className='space-y-3'>
          <p className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
            Filter by tag
          </p>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => setActiveTag(null)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                activeTag === null
                  ? 'border-accent bg-accent text-accent-contrast'
                  : 'border-border bg-surface text-foreground-subtle hover:border-accent/40 hover:text-accent',
              )}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                type='button'
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  activeTag === tag
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-border bg-surface text-foreground-subtle hover:border-accent/40 hover:text-accent',
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {filteredRecipes.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center'>
          <p className='font-serif text-2xl font-bold text-foreground'>No recipes found</p>
          <p className='mt-2 text-foreground-muted'>
            Try another tag or browse the full collection.
          </p>
          <button
            type='button'
            onClick={() => setActiveTag(null)}
            className='mt-6 text-sm font-semibold text-accent hover:underline'
          >
            Clear filter
          </button>
        </div>
      ) : (
        <>
          {showFeatured ? <RecipeCard recipe={featured} featured className='mb-10' /> : null}

          <ul
            className={cn(
              'grid grid-cols-1 gap-6 md:grid-cols-2',
              showFeatured ? 'lg:grid-cols-3' : 'lg:grid-cols-3',
            )}
          >
            {(showFeatured ? rest : filteredRecipes).map(recipe => (
              <li key={recipe._id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTag ? (
        <p className='text-center text-sm text-foreground-muted'>
          Showing {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'} tagged{' '}
          <Chip
            label={activeTag}
            size='small'
            interactive={false}
            className='inline-flex align-middle'
          />
        </p>
      ) : null}
    </div>
  );
}
