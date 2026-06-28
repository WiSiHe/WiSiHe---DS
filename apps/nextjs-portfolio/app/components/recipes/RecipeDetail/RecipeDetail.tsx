'use client';

import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { GetRecipeResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForImage } from '@/sanity/lib/utils';
import RecipeIngredients, { scaleAmount } from '../RecipeIngredients/RecipeIngredients';
import RecipeInstructions from '../RecipeInstructions/RecipeInstructions';
import { RecipeMetaBadges } from '../RecipeMetaBadges/RecipeMetaBadges';
import RecipeTipComponent from '../RecipeTip/RecipeTip';

type RecipeDetailProps = {
  recipe: NonNullable<GetRecipeResult>;
};

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const {
    title,
    description,
    mainImage,
    ingredientCategories,
    instructions,
    tips,
    cookingTime,
    prepTime,
    totalTime,
    servings: baseServings,
    difficulty,
    tags,
    slug,
  } = recipe;

  const [servings, setServings] = useState(baseServings ?? 4);

  const allIngredients =
    ingredientCategories?.flatMap(category => category.ingredients ?? []) ?? [];

  const breadcrumbs = (
    <nav aria-label='Breadcrumb'>
      <ol className='flex flex-wrap items-center gap-2 text-sm'>
        <li>
          <Link href='/' className='text-foreground-muted transition-colors hover:text-accent'>
            Home
          </Link>
        </li>
        <li className='text-foreground-muted' aria-hidden>
          /
        </li>
        <li>
          <Link
            href='/recipes'
            className='text-foreground-muted transition-colors hover:text-accent'
          >
            Recipes
          </Link>
        </li>
        <li className='text-foreground-muted' aria-hidden>
          /
        </li>
        <li className='font-medium text-foreground'>{title}</li>
      </ol>
    </nav>
  );

  return (
    <div className='min-h-screen bg-background'>
      {/* Header section with split layout */}
      <header className='relative overflow-hidden border-b border-border/10 pt-28 pb-12 sm:pt-32 sm:pb-16'>
        <div
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_25%,transparent_100%)]'
          aria-hidden
        />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12'>
            {/* Left Column: Text */}
            <div
              className={cn('lg:col-span-7 space-y-6', !mainImage && 'lg:col-span-12 max-w-4xl')}
            >
              <div className='mb-2'>{breadcrumbs}</div>
              <h1 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-sans'>
                {title}
              </h1>
              {description ? (
                <p className='text-lg leading-relaxed text-foreground-subtle sm:text-xl max-w-2xl'>
                  {description}
                </p>
              ) : null}
              <RecipeMetaBadges
                prepTime={prepTime}
                cookingTime={cookingTime}
                totalTime={totalTime}
                servings={servings}
                difficulty={difficulty}
                className='pt-2'
              />
            </div>

            {/* Right Column: Image */}
            {mainImage ? (
              <div className='lg:col-span-5 relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-border/20 shadow-lg bg-surface-subtle'>
                <Image
                  src={urlForImage(mainImage)?.width(1000).quality(85).url() || ''}
                  alt={mainImage.alt}
                  fill
                  className='object-cover transition-transform duration-500 hover:scale-102'
                  priority
                  sizes='(max-width: 768px) 100vw, 40vw'
                  placeholder={mainImage.lqip ? 'blur' : 'empty'}
                  blurDataURL={mainImage.lqip ?? undefined}
                />
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content section */}
      <article className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12'>
          {/* Ingredients Column */}
          <aside className='lg:col-span-4 lg:sticky lg:top-24 h-fit'>
            <div className='space-y-6'>
              <RecipeIngredients
                ingredientCategories={ingredientCategories}
                baseServings={baseServings}
                servings={servings}
                onServingsChange={setServings}
              />
            </div>
          </aside>

          {/* Instructions Column */}
          <div className='min-w-0 lg:col-span-8'>
            <RecipeInstructions
              instructions={
                instructions as Parameters<typeof RecipeInstructions>[0]['instructions']
              }
              ingredients={allIngredients.map(ingredient => {
                const multiplier = baseServings ? servings / baseServings : 1;
                const scaledAmount = scaleAmount(
                  ingredient.amount,
                  multiplier,
                  ingredient.isDiscrete,
                );
                return {
                  ingredient: ingredient.ingredient,
                  amount: scaledAmount,
                  unit: ingredient.unit,
                  isDiscrete: ingredient.isDiscrete ?? undefined,
                  notes: ingredient.notes ?? undefined,
                };
              })}
            />
          </div>
        </div>

        {/* Tips section */}
        {tips && tips.length > 0 ? (
          <section className='mt-20' aria-labelledby='recipe-tips-heading'>
            <div className='mx-auto max-w-4xl'>
              <div className='mb-10 text-center'>
                <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
                  Pro tips
                </p>
                <h2
                  id='recipe-tips-heading'
                  className='mt-2 text-3xl font-extrabold text-foreground sm:text-4xl font-sans'
                >
                  Tips & tricks
                </h2>
              </div>
              <div className='grid gap-6 md:grid-cols-2'>
                {tips.map((tip, index) => (
                  <RecipeTipComponent
                    key={tip.title ?? `tip-${index}`}
                    tip={{
                      title: tip.title ?? undefined,
                      content: tip.content,
                      icon: tip.icon ?? undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Tags section */}
        {tags && tags.length > 0 ? (
          <section className='mt-20 border-t border-border/10 pt-12'>
            <div className='mx-auto max-w-4xl text-center'>
              <h3 className='mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                Tags
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {tags.map(tag => (
                  <Link
                    key={tag.name}
                    href={`/recipes?tag=${encodeURIComponent(tag.name)}`}
                    className='rounded-full border border-border/20 bg-surface px-4 py-2 text-sm font-medium text-foreground-subtle transition-colors hover:border-accent/40 hover:text-accent'
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Footer info */}
        <p className='mt-16 text-center text-sm text-foreground-muted'>
          Recipe by{' '}
          {ABOUT_PAGE_LINKS_ENABLED ? (
            <Link href='/about' className='font-medium text-accent hover:underline'>
              Henrik Wilhelm Sissener
            </Link>
          ) : (
            <span className='font-medium text-foreground'>Henrik Wilhelm Sissener</span>
          )}
          {' · '}
          <Link href={`/recipes/${slug}`} className='hover:text-accent'>
            Permalink
          </Link>
        </p>
      </article>
    </div>
  );
}
