'use client';

import Image from 'next/image';
import { TbBasket } from 'react-icons/tb';
import { urlForImage } from '@/sanity/lib/utils';

interface Ingredient {
  ingredient: string;
  photo?: {
    asset?: {
      _ref: string;
      _type: 'reference';
    };
    alt: string;
    lqip?: string;
    aspectRatio?: number;
  };
  amount: string;
  unit: string;
  isDiscrete?: boolean;
  notes?: string;
}

interface IngredientCategory {
  categoryName: string;
  ingredients: Ingredient[];
}

interface RecipeIngredientsProps {
  ingredientCategories?: IngredientCategory[];
}

export default function RecipeIngredients({ ingredientCategories }: RecipeIngredientsProps) {
  return (
    <div className='rounded-2xl shadow-lg p-6 bg-surface ring ring-border w-full min-w-72'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold mb-4 text-foreground'>Ingredients</h2>
      </div>
      {ingredientCategories?.map((category, categoryIndex) => (
        <div key={categoryIndex} className='mb-8 last:mb-0'>
          <h3
            className='text-lg font-semibold mb-4 pb-2'
            style={{
              color: 'var(--color-foreground)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {category.categoryName}
          </h3>
          <ul className='space-y-4'>
            {category.ingredients.map((ingredient, ingredientIndex) => (
              <li key={ingredientIndex} className='flex items-start gap-4'>
                {ingredient.photo ? (
                  <div className='flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden'>
                    <Image
                      src={urlForImage(ingredient.photo)?.width(64).height(64).url() || ''}
                      alt={ingredient.photo?.alt ?? ''}
                      width={64}
                      height={64}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ) : (
                  <div className='flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-surface ring ring-border'>
                    <TbBasket className='w-5 h-5' />
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-baseline gap-2 flex-wrap'>
                    <span className='font-medium' style={{ color: 'var(--color-foreground)' }}>
                      {ingredient.ingredient}
                    </span>
                    <span className='text-sm' style={{ color: 'var(--color-foreground-subtle)' }}>
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                  {ingredient.notes && (
                    <p className='text-sm mt-1' style={{ color: 'var(--color-foreground-muted)' }}>
                      {ingredient.notes}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
