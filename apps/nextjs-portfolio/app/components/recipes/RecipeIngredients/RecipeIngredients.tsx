'use client';

import { IconBasket, IconCheck, IconMinus, IconPlus, IconUsers } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import { clampServings, scaleAmount } from './scaleAmount';

export { scaleAmount } from './scaleAmount';

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

const stepperButtonClass = cn(
  'flex size-9 shrink-0 items-center justify-center rounded-xl',
  'text-foreground-subtle transition-colors',
  'hover:bg-surface-hover hover:text-foreground',
  'active:bg-surface-active',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
  'disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-foreground-subtle',
);

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
  const isScaled = Boolean(baseServings && servings !== baseServings);

  const categories = useMemo(() => ingredientCategories ?? [], [ingredientCategories]);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!categories.length) return null;

  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 border-b border-border/10 pb-5 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0 space-y-1'>
          <h2 className='font-sans text-2xl font-extrabold tracking-tight text-foreground'>
            Ingredients
          </h2>
          {isScaled && baseServings ? (
            <p className='text-xs text-foreground-muted'>
              Scaled from {baseServings} serving{baseServings === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>

        {baseServings ? (
          <div
            className={cn(
              'inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-border/50 bg-surface p-1.5 pl-3',
              'shadow-sm sm:w-auto sm:justify-start',
            )}
          >
            <div className='flex min-w-0 items-center gap-2'>
              <span
                className='flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent'
                aria-hidden
              >
                <IconUsers className='size-4' stroke={2} />
              </span>
              <div className='min-w-0 leading-tight'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted'>
                  Servings
                </p>
                <p className='truncate text-xs text-foreground-subtle'>Adjust amounts</p>
              </div>
            </div>

            <div
              className='inline-flex items-center gap-0.5 rounded-xl bg-background p-0.5 ring-1 ring-border/60'
              role='group'
              aria-label='Adjust servings'
            >
              <button
                type='button'
                onClick={() => setServings(clampServings(servings - 1))}
                disabled={servings <= 1}
                className={stepperButtonClass}
                aria-label='Decrease servings'
              >
                <IconMinus className='size-4' stroke={2} aria-hidden />
              </button>
              <input
                type='number'
                min={1}
                max={999}
                inputMode='numeric'
                value={servings}
                onChange={e => setServings(clampServings(Number(e.target.value) || 1))}
                className={cn(
                  'w-11 bg-transparent py-1.5 text-center text-base font-bold tabular-nums text-foreground',
                  'outline-none focus-visible:text-accent',
                  '[appearance:textfield]',
                  '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                )}
                aria-label='Number of servings'
              />
              <button
                type='button'
                onClick={() => setServings(clampServings(servings + 1))}
                disabled={servings >= 999}
                className={stepperButtonClass}
                aria-label='Increase servings'
              >
                <IconPlus className='size-4' stroke={2} aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {categories.map((category, categoryIndex) => (
        <div key={category.categoryName ?? categoryIndex} className='mb-8 last:mb-0'>
          <h3 className='mb-3 border-b border-border/10 pb-2 font-sans text-xs font-bold uppercase tracking-wider text-accent'>
            {category.categoryName}
          </h3>
          <ul className='space-y-2'>
            {(category.ingredients ?? []).map((ingredient, ingredientIndex) => {
              const ingredientId = `${categoryIndex}-${ingredientIndex}-${ingredient.ingredient}`;
              const isChecked = checkedIngredients.has(ingredientId);
              const scaledAmount = scaleAmount(
                ingredient.amount,
                multiplier,
                ingredient.isDiscrete,
              );

              return (
                <li key={`${ingredient.ingredient}-${ingredientIndex}`}>
                  <button
                    type='button'
                    onClick={() => toggleIngredient(ingredientId)}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors',
                      isChecked ? 'bg-surface-subtle/80' : 'hover:bg-surface-subtle/60',
                    )}
                    aria-pressed={isChecked}
                    aria-label={`Mark ${ingredient.ingredient} as ${isChecked ? 'needed' : 'got'}`}
                  >
                    {ingredient.photo ? (
                      <div
                        className={cn(
                          'relative size-14 shrink-0 overflow-hidden rounded-lg border transition-opacity',
                          isChecked ? 'border-border/30 opacity-55' : 'border-border/40',
                        )}
                      >
                        <Image
                          src={
                            urlForImage(ingredient.photo as Parameters<typeof urlForImage>[0])
                              ?.width(112)
                              .height(112)
                              .url() || ''
                          }
                          alt={ingredient.photo.alt ?? ingredient.ingredient}
                          width={56}
                          height={56}
                          className='size-full object-cover'
                        />
                        <span
                          className={cn(
                            'absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border shadow-sm transition-colors',
                            isChecked
                              ? 'border-accent bg-accent text-accent-contrast'
                              : 'border-border/70 bg-background/90 text-transparent group-hover:border-accent/50',
                          )}
                          aria-hidden
                        >
                          <IconCheck className='size-3' stroke={2.5} aria-hidden />
                        </span>
                      </div>
                    ) : (
                      <span
                        className={cn(
                          'flex size-14 shrink-0 items-center justify-center rounded-lg border transition-colors',
                          isChecked
                            ? 'border-accent/40 bg-accent/10 text-accent'
                            : 'border-border bg-surface-subtle text-foreground-muted group-hover:border-accent/30',
                        )}
                        aria-hidden
                      >
                        {isChecked ? (
                          <IconCheck className='size-5' stroke={2} aria-hidden />
                        ) : (
                          <IconBasket className='size-5' stroke={2} aria-hidden />
                        )}
                      </span>
                    )}

                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-3'>
                        <span
                          className={cn(
                            'font-medium leading-snug text-foreground',
                            isChecked && 'text-foreground-muted',
                          )}
                        >
                          {ingredient.ingredient}
                        </span>
                        <span
                          className={cn(
                            'shrink-0 text-right text-sm tabular-nums text-foreground-subtle',
                            isChecked && 'text-foreground-muted',
                          )}
                        >
                          {scaledAmount} {ingredient.unit}
                        </span>
                      </div>
                      {ingredient.notes ? (
                        <p
                          className={cn(
                            'mt-1 text-sm text-foreground-muted',
                            isChecked && 'text-foreground-muted/70',
                          )}
                        >
                          {ingredient.notes}
                        </p>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
