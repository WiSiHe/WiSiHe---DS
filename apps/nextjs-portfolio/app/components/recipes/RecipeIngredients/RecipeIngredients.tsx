'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { TbBasket } from 'react-icons/tb';
import { urlForImage } from '@/sanity/lib/utils';

interface Ingredient {
  ingredient: string;
  photo?: {
    asset?: {
      _ref?: string;
      _type?: 'reference';
    };
    alt?: string;
    lqip?: string | null;
    aspectRatio?: number | null;
  } | null;
  amount: string;
  unit: string;
  isDiscrete?: boolean | null;
  notes?: string | null;
}

interface IngredientCategory {
  categoryName: string;
  ingredients?: Ingredient[] | null;
}

interface RecipeIngredientsProps {
  ingredientCategories?: IngredientCategory[] | null;
  baseServings?: number | null;
}

function scaleAmount(amount: string, multiplier: number, isDiscrete?: boolean | null): string {
  if (multiplier === 1 || isDiscrete) return amount;
  const numeric = Number.parseFloat(amount.replace(',', '.'));
  if (Number.isNaN(numeric)) return amount;

  const scaled = numeric * multiplier;
  const formatted = Number.isInteger(scaled)
    ? String(scaled)
    : scaled.toFixed(1).replace(/\.0$/, '');
  return formatted;
}

export default function RecipeIngredients({
  ingredientCategories,
  baseServings,
}: RecipeIngredientsProps) {
  const [servings, setServings] = useState(baseServings ?? 4);
  const multiplier = baseServings ? servings / baseServings : 1;

  const categories = useMemo(() => ingredientCategories ?? [], [ingredientCategories]);

  if (!categories.length) return null;

  return (
    <div className='w-full min-w-72 rounded-2xl border border-border/40 bg-surface p-6 shadow-lg ring-1 ring-border/20'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='font-serif text-2xl font-bold text-foreground'>Ingredients</h2>
        {baseServings ? (
          <label className='flex items-center gap-2 text-sm text-foreground-subtle'>
            <span className='font-medium'>Servings</span>
            <input
              type='number'
              min={1}
              max={24}
              value={servings}
              onChange={e => setServings(Math.max(1, Number(e.target.value) || 1))}
              className='w-16 rounded-lg border border-border bg-background px-2 py-1 text-center text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30'
            />
          </label>
        ) : null}
      </div>

      {categories.map((category, categoryIndex) => (
        <div key={category.categoryName ?? categoryIndex} className='mb-8 last:mb-0'>
          <h3 className='mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground'>
            {category.categoryName}
          </h3>
          <ul className='space-y-4'>
            {(category.ingredients ?? []).map((ingredient, ingredientIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static recipe ingredient list
              <li
                key={`${ingredient.ingredient}-${ingredientIndex}`}
                className='flex items-start gap-4'
              >
                {ingredient.photo ? (
                  <div className='size-16 shrink-0 overflow-hidden rounded-lg border border-border/40'>
                    <Image
                      src={
                        urlForImage(ingredient.photo as Parameters<typeof urlForImage>[0])
                          ?.width(64)
                          .height(64)
                          .url() || ''
                      }
                      alt={ingredient.photo.alt ?? ingredient.ingredient}
                      width={64}
                      height={64}
                      className='size-full object-cover'
                    />
                  </div>
                ) : (
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle text-foreground-muted'>
                    <TbBasket className='size-5' />
                  </div>
                )}
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
                    <span className='font-medium text-foreground'>{ingredient.ingredient}</span>
                    <span className='text-sm text-foreground-subtle'>
                      {scaleAmount(ingredient.amount, multiplier, ingredient.isDiscrete)}{' '}
                      {ingredient.unit}
                    </span>
                  </div>
                  {ingredient.notes ? (
                    <p className='mt-1 text-sm text-foreground-muted'>{ingredient.notes}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
