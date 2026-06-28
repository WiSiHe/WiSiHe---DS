'use client';

import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { GetRecipeResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
    additionalImages,
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
    language,
    translations,
  } = recipe;

  const [servings, setServings] = useState(baseServings ?? 4);

  const cleanIngredientCategories = useMemo(() => {
    if (!ingredientCategories) return [];
    return ingredientCategories.map(cat => ({
      categoryName: cat.categoryName || '',
      ingredients: (cat.ingredients || []).map(ing => ({
        ingredient: ing.ingredient || '',
        amount: ing.amount || '',
        unit: ing.unit || '',
        isDiscrete: ing.isDiscrete || false,
        notes: ing.notes || '',
        photo: ing.photo
          ? {
              _type: 'image' as const,
              asset: ing.photo.asset,
              alt: ing.photo.alt || '',
              lqip: ing.photo.lqip || undefined,
              aspectRatio: ing.photo.aspectRatio || undefined,
            }
          : null,
      })),
    }));
  }, [ingredientCategories]);

  const allIngredients = useMemo(() => {
    return cleanIngredientCategories.flatMap(category => category.ingredients ?? []);
  }, [cleanIngredientCategories]);

  const allImages = useMemo(() => {
    const list = [];
    if (mainImage) list.push(mainImage);
    if (additionalImages && additionalImages.length > 0) {
      list.push(...additionalImages);
    }
    return list;
  }, [mainImage, additionalImages]);

  const firstImage = allImages[0];

  const LANGUAGE_LABEL: Record<string, string> = {
    en: 'English',
    no: 'Norsk',
  };

  const otherTranslations = useMemo(() => {
    if (!translations || !Array.isArray(translations)) return [];
    return (translations as any[]).filter(
      (t: any) => t.value?.language && t.value.language !== (language || 'en'),
    );
  }, [translations, language]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
              <div className='flex flex-wrap items-center justify-between gap-4 mb-2 w-full'>
                {breadcrumbs}
                {otherTranslations.length > 0 && (
                  <div className='flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider'>
                    <span className='text-foreground-muted'>Translate:</span>
                    {otherTranslations.map((t: any) => {
                      const lang = t.value?.language;
                      const slugVal = t.value?.slug;
                      if (!lang || !slugVal) return null;
                      return (
                        <Link
                          key={lang}
                          href={`/recipes/${slugVal}`}
                          className='px-2.5 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent transition-colors font-semibold'
                        >
                          {LANGUAGE_LABEL[lang] ?? lang.toUpperCase()}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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

            {/* Right Column: Image or Carousel */}
            {allImages.length > 0 && firstImage ? (
              allImages.length > 1 ? (
                <div className='lg:col-span-5 relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-border/20 shadow-lg bg-surface-subtle group/carousel'>
                  <div className='overflow-hidden w-full h-full' ref={emblaRef}>
                    <div className='flex w-full h-full'>
                      {allImages.map((img, index) => {
                        const imageUrl = urlForImage(img)?.width(1000).quality(85).url() || '';
                        return (
                          <div
                            key={index}
                            className='relative flex-[0_0_100%] w-full h-full min-w-0'
                          >
                            <Image
                              src={imageUrl}
                              alt={img.alt || `${title} - Image ${index + 1}`}
                              fill
                              className='object-cover h-full w-full'
                              priority={index === 0}
                              sizes='(max-width: 768px) 100vw, 40vw'
                              placeholder={img.lqip ? 'blur' : 'empty'}
                              blurDataURL={img.lqip ?? undefined}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Chevrons */}
                  <button
                    type='button'
                    onClick={scrollPrev}
                    className='absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background border border-border/20 text-foreground transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 cursor-pointer shadow-md'
                    aria-label='Previous image'
                  >
                    <FiChevronLeft className='w-5 h-5' />
                  </button>
                  <button
                    type='button'
                    onClick={scrollNext}
                    className='absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background border border-border/20 text-foreground transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 cursor-pointer shadow-md'
                    aria-label='Next image'
                  >
                    <FiChevronRight className='w-5 h-5' />
                  </button>

                  {/* Dot Indicators */}
                  <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5'>
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        type='button'
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all duration-200 cursor-pointer',
                          index === selectedIndex
                            ? 'bg-accent scale-110 shadow-sm'
                            : 'bg-foreground/30 hover:bg-foreground/50',
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className='lg:col-span-5 relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-border/20 shadow-lg bg-surface-subtle'>
                  <Image
                    src={urlForImage(firstImage)?.width(1000).quality(85).url() || ''}
                    alt={firstImage.alt || title || ''}
                    fill
                    className='object-cover transition-transform duration-500 hover:scale-102'
                    priority
                    sizes='(max-width: 768px) 100vw, 40vw'
                    placeholder={firstImage.lqip ? 'blur' : 'empty'}
                    blurDataURL={firstImage.lqip ?? undefined}
                  />
                </div>
              )
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
                ingredientCategories={cleanIngredientCategories}
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
                      content: tip.content || '',
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
                {tags.map(tag => {
                  if (!tag.name) return null;
                  return (
                    <Link
                      key={tag.name}
                      href={`/recipes?tag=${encodeURIComponent(tag.name)}`}
                      className='rounded-full border border-border/20 bg-surface px-4 py-2 text-sm font-medium text-foreground-subtle transition-colors hover:border-accent/40 hover:text-accent'
                    >
                      {tag.name}
                    </Link>
                  );
                })}
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
