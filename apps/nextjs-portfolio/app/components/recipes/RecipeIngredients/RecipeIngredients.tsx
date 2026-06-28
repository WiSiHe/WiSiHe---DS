'use client';

import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
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
  servings?: number;
  onServingsChange?: (servings: number) => void;
}

export function scaleAmount(
  amount: string,
  multiplier: number,
  isDiscrete?: boolean | null,
): string {
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
  servings: propsServings,
  onServingsChange,
}: RecipeIngredientsProps) {
  const [localServings, setLocalServings] = useState(baseServings ?? 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const servings = propsServings !== undefined ? propsServings : localServings;
  const setServings = onServingsChange !== undefined ? onServingsChange : setLocalServings;

  const multiplier = baseServings ? servings / baseServings : 1;

  const categories = useMemo(() => ingredientCategories ?? [], [ingredientCategories]);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!categories.length) return null;

  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/10 pb-4'>
        <h2 className='font-sans text-2xl font-extrabold tracking-tight text-foreground'>
          Ingredients
        </h2>
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
          <h3 className='mb-4 border-b border-border/10 pb-2 text-xs font-bold uppercase tracking-wider text-accent font-sans'>
            {category.categoryName}
          </h3>
          <ul className='space-y-4'>
            {(category.ingredients ?? []).map((ingredient, ingredientIndex) => {
              const ingredientId = `${categoryIndex}-${ingredientIndex}-${ingredient.ingredient}`;
              const isChecked = checkedIngredients.has(ingredientId);

              return (
                <li
                  key={`${ingredient.ingredient}-${ingredientIndex}`}
                  className={cn(
                    'flex items-start gap-3 transition-opacity duration-200',
                    isChecked && 'opacity-60',
                  )}
                >
                  <button
                    type='button'
                    onClick={() => toggleIngredient(ingredientId)}
                    className={cn(
                      'mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30',
                      isChecked
                        ? 'border-success bg-success'
                        : 'border-border bg-background hover:border-accent',
                    )}
                    aria-label={`Mark ${ingredient.ingredient} as ${isChecked ? 'incomplete' : 'complete'}`}
                  >
                    {isChecked && <FiCheck className='size-3.5 stroke-[3]' />}
                  </button>

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
                      <span
                        className={cn(
                          'font-medium text-foreground',
                          isChecked && 'line-through text-foreground-muted',
                        )}
                      >
                        {ingredient.ingredient}
                      </span>
                      <span
                        className={cn(
                          'text-sm text-foreground-subtle',
                          isChecked && 'line-through text-foreground-muted',
                        )}
                      >
                        {scaleAmount(ingredient.amount, multiplier, ingredient.isDiscrete)}{' '}
                        {ingredient.unit}
                      </span>
                    </div>
                    {ingredient.notes ? (
                      <p
                        className={cn(
                          'mt-1 text-sm text-foreground-muted',
                          isChecked && 'text-foreground-muted/65 line-through',
                        )}
                      >
                        {ingredient.notes}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
