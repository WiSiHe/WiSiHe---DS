'use client';

import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { GetRecipeResult } from '@wisihe/sanity-queries';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForImage } from '@/sanity/lib/utils';
import RecipeIngredients from '../RecipeIngredients/RecipeIngredients';
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
    servings,
    difficulty,
    tags,
    slug,
  } = recipe;

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

  const heroBreadcrumbs = (
    <nav aria-label='Breadcrumb'>
      <ol className='flex flex-wrap items-center gap-2 text-sm'>
        <li>
          <Link
            href='/'
            className='rounded-full border border-white/30 bg-black/65 px-3 py-1 text-white/85 backdrop-blur-lg transition-colors hover:text-white'
          >
            Home
          </Link>
        </li>
        <li className='text-white/50' aria-hidden>
          /
        </li>
        <li>
          <Link
            href='/recipes'
            className='rounded-full border border-white/30 bg-black/65 px-3 py-1 text-white/85 backdrop-blur-lg transition-colors hover:text-white'
          >
            Recipes
          </Link>
        </li>
        <li className='text-white/50' aria-hidden>
          /
        </li>
        <li className='rounded-full border border-white/30 bg-black/65 px-3 py-1 font-medium text-white backdrop-blur-lg'>
          {title}
        </li>
      </ol>
    </nav>
  );

  return (
    <div className='min-h-screen bg-background'>
      {mainImage ? (
        <div className='relative h-[58vh] min-h-[380px] max-h-[620px] overflow-hidden'>
          <Image
            src={urlForImage(mainImage)?.width(1600).quality(85).url() || ''}
            alt={mainImage.alt}
            fill
            className='object-cover'
            priority
            sizes='100vw'
            placeholder={mainImage.lqip ? 'blur' : 'empty'}
            blurDataURL={mainImage.lqip ?? undefined}
          />
          <div
            className='absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-background'
            aria-hidden
          />
          <div className='relative flex h-full items-end'>
            <div className='mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8'>
              <div className='mb-6'>{heroBreadcrumbs}</div>
              <h1 className='mb-4 font-serif text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl'>
                {title}
              </h1>
              {description ? (
                <p className='mb-6 max-w-3xl text-lg leading-relaxed text-white/90 drop-shadow-md sm:text-xl'>
                  {description}
                </p>
              ) : null}
              <RecipeMetaBadges
                prepTime={prepTime}
                cookingTime={cookingTime}
                totalTime={totalTime}
                servings={servings}
                difficulty={difficulty}
                variant='hero'
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='border-b border-border/30 pb-10 pt-32'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-8'>{breadcrumbs}</div>
            <h1 className='mb-4 font-serif text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl'>
              {title}
            </h1>
            {description ? (
              <p className='mb-8 max-w-3xl text-lg text-foreground-subtle sm:text-xl'>
                {description}
              </p>
            ) : null}
            <RecipeMetaBadges
              prepTime={prepTime}
              cookingTime={cookingTime}
              totalTime={totalTime}
              servings={servings}
              difficulty={difficulty}
            />
          </div>
        </div>
      )}

      <article className='mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:gap-12'>
          <aside className='lg:w-80 lg:shrink-0'>
            <div className='space-y-6 lg:sticky lg:top-24'>
              <RecipeIngredients
                ingredientCategories={ingredientCategories}
                baseServings={servings}
              />
            </div>
          </aside>

          <div className='min-w-0 flex-1'>
            <RecipeInstructions
              instructions={
                instructions as Parameters<typeof RecipeInstructions>[0]['instructions']
              }
              ingredients={allIngredients.map(ingredient => ({
                ingredient: ingredient.ingredient,
                amount: ingredient.amount,
                unit: ingredient.unit,
                isDiscrete: ingredient.isDiscrete ?? undefined,
                notes: ingredient.notes ?? undefined,
              }))}
            />
          </div>
        </div>

        {tips && tips.length > 0 ? (
          <section className='mt-20' aria-labelledby='recipe-tips-heading'>
            <div className='mx-auto max-w-4xl'>
              <div className='mb-10 text-center'>
                <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
                  Pro tips
                </p>
                <h2
                  id='recipe-tips-heading'
                  className='mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl'
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

        {tags && tags.length > 0 ? (
          <section className='mt-20 border-t border-border/30 pt-12'>
            <div className='mx-auto max-w-4xl text-center'>
              <h3 className='mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                Tags
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {tags.map(tag => (
                  <Link
                    key={tag.name}
                    href={`/recipes?tag=${encodeURIComponent(tag.name)}`}
                    className='rounded-full border border-border/40 bg-surface px-4 py-2 text-sm font-medium text-foreground-subtle transition-colors hover:border-accent/40 hover:text-accent'
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

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
