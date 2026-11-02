'use client';

import { Link } from '@tanstack/react-router';
import type { GetAllRecipesResult, GetRecipeResult } from '@wisihe/sanity-queries';
import { Breadcrumbs, RecipeMetaBadges } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { type ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import CustomPortableText from '@/components/cms/PortableText/PortableText';
import { renderBreadcrumbLink } from '@/components/detail/breadcrumbLink';
import { ShareButton } from '@/components/detail/ShareButton';
import { RecipeCookingMode } from '@/components/recipes/RecipeCookingMode';
import { RecipePrintView } from '@/components/recipes/RecipePrintView';
import RecipeTipComponent from '@/components/recipes/RecipeTip';
import Image from '@/components/ui/Image';
import { portableTextToPlainText } from '@/lib/portableText';
import { SITE_URL } from '@/lib/site';
import { imageUrl } from '@/server/fns';

type PortableTextValue = ComponentProps<typeof CustomPortableText>['value'];

type RecipeDetailViewProps = {
  recipe: NonNullable<GetRecipeResult>;
  moreRecipes: GetAllRecipesResult;
};

function resolveCalories(nutrition: Record<string, unknown> | null | undefined): number | null {
  const calories = nutrition?.calories;
  return typeof calories === 'number' ? calories : null;
}

export function RecipeDetailView({ recipe, moreRecipes }: RecipeDetailViewProps) {
  const [servings, setServings] = useState(recipe.servings ?? 4);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allImages = useMemo(() => {
    const list: NonNullable<typeof recipe.mainImage>[] = [];
    if (recipe.mainImage) list.push(recipe.mainImage);
    if (recipe.additionalImages?.length) list.push(...recipe.additionalImages);
    return list;
  }, [recipe.mainImage, recipe.additionalImages]);

  const printIngredientCategories = useMemo(() => {
    const multiplier = recipe.servings ? servings / recipe.servings : 1;
    return (recipe.ingredientCategories ?? []).map(category => ({
      categoryName: category.categoryName || '',
      ingredients: (category.ingredients ?? []).map(item => {
        const amount = item.amount ?? '';
        const scaled =
          multiplier !== 1 && amount && !Number.isNaN(Number.parseFloat(amount))
            ? String(Math.round(Number.parseFloat(amount) * multiplier * 100) / 100)
            : amount;
        return {
          ingredient: item.ingredient || '',
          amount: scaled,
          unit: item.unit || '',
          notes: item.notes || undefined,
        };
      }),
    }));
  }, [recipe.ingredientCategories, recipe.servings, servings]);

  const printInstructions = useMemo(
    () =>
      (recipe.instructions ?? []).map(step => ({
        title: step.title,
        content: portableTextToPlainText(step.content),
      })),
    [recipe.instructions],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const others = moreRecipes.filter(r => r.slug !== recipe.slug).slice(0, 3);

  return (
    <div className='min-h-screen bg-background print:min-h-0 print:bg-white'>
      <RecipePrintView
        title={recipe.title ?? 'Recipe'}
        description={recipe.description}
        servings={servings}
        prepTime={recipe.prepTime}
        cookingTime={recipe.cookingTime}
        totalTime={recipe.totalTime}
        difficulty={recipe.difficulty}
        ingredientCategories={printIngredientCategories}
        instructions={printInstructions}
        tips={recipe.tips?.map(tip => ({ title: tip.title, content: tip.content || '' })) ?? null}
        url={`${SITE_URL}/recipes/${recipe.slug ?? ''}`}
      />

      <div className='recipe-screen-only print:hidden'>
        <header className='relative overflow-hidden border-b border-border/10 pt-28 pb-12 sm:pt-32 sm:pb-16'>
          <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12'>
              <div
                className={cn(
                  'space-y-6 lg:col-span-7',
                  !recipe.mainImage && 'lg:col-span-12 max-w-4xl',
                )}
              >
                <Breadcrumbs
                  crumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Recipes', href: '/recipes' },
                    { label: recipe.title ?? 'Recipe' },
                  ]}
                  renderLink={renderBreadcrumbLink}
                />
                <h1 className='font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
                  {recipe.title}
                </h1>
                {recipe.description ? (
                  <p className='max-w-2xl text-lg leading-relaxed text-foreground-subtle sm:text-xl'>
                    {recipe.description}
                  </p>
                ) : null}
                <RecipeMetaBadges
                  prepTime={recipe.prepTime}
                  cookingTime={recipe.cookingTime}
                  totalTime={recipe.totalTime}
                  servings={servings}
                  difficulty={recipe.difficulty}
                  caloriesPerServing={resolveCalories(recipe.nutrition)}
                  variant='hero'
                  className='pt-2'
                />
                <ShareButton title={recipe.title ?? 'Recipe'} />
              </div>

              {allImages.length > 0 ? (
                <div className='relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-border/20 bg-surface-subtle shadow-lg lg:col-span-5 lg:aspect-[4/3]'>
                  {allImages.length > 1 ? (
                    <>
                      <div className='h-full w-full overflow-hidden' ref={emblaRef}>
                        <div className='flex h-full w-full'>
                          {allImages.map((img, index) => {
                            const src = imageUrl(img, 1000);
                            if (!src) return null;
                            return (
                              <div
                                key={img.asset?._ref ?? src}
                                className='relative min-w-0 flex-[0_0_100%]'
                              >
                                <Image
                                  src={src}
                                  alt={img.alt || recipe.title}
                                  fill
                                  className='object-cover'
                                  priority={index === 0}
                                  sizes='40vw'
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className='absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5'>
                        {allImages.map((img, index) => (
                          <button
                            key={img.asset?._ref ?? `slide-${index}`}
                            type='button'
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={cn(
                              'h-2 w-2 rounded-full',
                              index === selectedIndex ? 'bg-accent' : 'bg-foreground/30',
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <Image
                      src={imageUrl(allImages[0] as Parameters<typeof imageUrl>[0], 1000) || ''}
                      alt={recipe.title}
                      fill
                      className='object-cover'
                      priority
                      sizes='40vw'
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <article className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
          {recipe.story?.length ? (
            <section className='mx-auto mb-12 max-w-3xl'>
              <h2 className='mb-4 font-sans text-2xl font-extrabold tracking-tight'>
                About this dish
              </h2>
              <CustomPortableText
                value={recipe.story as unknown as PortableTextValue}
                variant='article'
              />
            </section>
          ) : null}

          <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12'>
            <aside className='h-fit lg:sticky lg:top-24 lg:col-span-4'>
              <div className='space-y-6 rounded-2xl border border-border/20 bg-surface p-6'>
                <div className='flex items-center justify-between gap-3'>
                  <h2 className='text-xl font-bold'>Ingredients</h2>
                  <label className='flex items-center gap-2 text-sm text-foreground-muted'>
                    Servings
                    <input
                      type='number'
                      min={1}
                      max={24}
                      value={servings}
                      onChange={e => setServings(Math.max(1, Number(e.target.value) || 1))}
                      className='w-16 rounded-md border border-border bg-background px-2 py-1 text-center text-foreground'
                    />
                  </label>
                </div>
                {recipe.ingredientCategories?.map(category => (
                  <div key={category.categoryName || 'ingredients'}>
                    {category.categoryName ? (
                      <h3 className='mb-2 font-semibold text-accent'>{category.categoryName}</h3>
                    ) : null}
                    <ul className='space-y-2'>
                      {category.ingredients?.map(item => (
                        <li
                          key={`${item.ingredient}-${item.amount}-${item.unit}`}
                          className='text-foreground/80'
                        >
                          {[item.amount, item.unit, item.ingredient].filter(Boolean).join(' ')}
                          {item.notes ? (
                            <span className='text-foreground/50'> — {item.notes}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </aside>

            <div className='min-w-0 lg:col-span-8'>
              <div className='mb-6 flex items-center justify-between gap-4'>
                <h2 className='text-2xl font-bold'>Instructions</h2>
                <RecipeCookingMode />
              </div>
              <ol className='list-decimal space-y-4 pl-5'>
                {recipe.instructions?.map((step, i) => (
                  <li // biome-ignore lint/suspicious/noArrayIndexKey: steps have no stable id and titles may be empty or repeated; the list is static
                    key={i}
                    className='pl-2'
                  >
                    {step.title ? <strong className='mb-1 block'>{step.title}</strong> : null}
                    {Array.isArray(step.content) && step.content.length > 0 ? (
                      <CustomPortableText
                        value={step.content as unknown as PortableTextValue}
                        variant='minimal'
                      />
                    ) : (
                      <span className='text-foreground/80'>
                        {portableTextToPlainText(step.content) || String(step.content ?? '')}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.tips?.length ? (
            <section className='mt-20'>
              <div className='mx-auto max-w-4xl'>
                <h2 className='mb-8 text-center font-sans text-3xl font-extrabold sm:text-4xl'>
                  Tips & tricks
                </h2>
                <div className='grid gap-6 md:grid-cols-2'>
                  {recipe.tips.map((tip, index) => (
                    <RecipeTipComponent
                      // biome-ignore lint/suspicious/noArrayIndexKey: tips have no stable id and titles may be empty or repeated; the list is static
                      key={index}
                      tip={{
                        title: tip.title ?? undefined,
                        content: tip.content || '',
                        icon: tip.icon ?? undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {others.length > 0 ? (
            <section className='mt-24 border-t border-border/30 pt-16'>
              <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
                    Keep cooking
                  </p>
                  <h2 className='mt-2 font-serif text-3xl font-bold text-foreground'>
                    More recipes
                  </h2>
                </div>
                <Link
                  to='/recipes'
                  className='text-sm font-semibold text-accent hover:text-accent-hover'
                >
                  View all recipes →
                </Link>
              </div>
              <ul className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {others.map(item => (
                  <li key={item._id}>
                    <Link
                      to='/recipes/$slug'
                      params={{ slug: item.slug }}
                      className='group block overflow-hidden rounded-2xl border border-border'
                    >
                      {item.mainImage ? (
                        <Image
                          src={imageUrl(item.mainImage, 600) || ''}
                          alt={item.title}
                          width={600}
                          height={400}
                          className='aspect-[3/2] w-full object-cover transition-transform group-hover:scale-105'
                        />
                      ) : null}
                      <p className='p-4 font-medium group-hover:text-accent'>{item.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </div>
    </div>
  );
}
