'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextBlock } from 'next-sanity';
import { FiBarChart, FiClock, FiTag, FiThermometer, FiUsers } from 'react-icons/fi';
import { urlForImage } from '@/sanity/lib/utils';
import RecipeIngredients from '../RecipeIngredients/RecipeIngredients';
import RecipeInstructions from '../RecipeInstructions/RecipeInstructions';
import RecipeTipComponent, { type RecipeTip as RecipeTipData } from '../RecipeTip/RecipeTip';

interface RecipeIngredient {
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
  ingredients: RecipeIngredient[];
}

interface Instruction {
  title?: string;
  content: PortableTextBlock[];
}

interface Recipe {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  mainImage?: {
    asset?: {
      _ref: string;
      _type: 'reference';
    };
    alt: string;
    lqip?: string;
    aspectRatio?: number;
  };
  ingredientCategories?: IngredientCategory[];
  instructions?: Instruction[];
  tips?: RecipeTipData[];
  cookingTime?: number;
  prepTime?: number;
  totalTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  publishedAt?: string;
  tags?: Array<{ name: string }>;
}

interface RecipeDetailProps {
  recipe: Recipe;
}

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
  } = recipe;

  // Flatten all ingredients for instruction processing
  const allIngredients =
    recipe.ingredientCategories?.flatMap(category => category.ingredients) || [];

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section with Image */}
      {mainImage && (
        <div className='relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden'>
          <div className='absolute inset-0'>
            <Image
              src={urlForImage(mainImage)?.url() || ''}
              alt={mainImage.alt}
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background' />
          </div>
          <div className='relative h-full flex items-end'>
            <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'>
              {/* Breadcrumb */}
              <nav className='mb-6' aria-label='Breadcrumb'>
                <ol className='flex items-center space-x-2 text-sm'>
                  <li>
                    <Link
                      href='/'
                      className='text-white/80 hover:text-white hover:underline transition-colors bg-black/65 backdrop-blur-lg px-3 py-1 rounded-full'
                    >
                      Home
                    </Link>
                  </li>
                  <li className='text-white/50'>/</li>
                  <li>
                    <Link
                      href='/recipes'
                      className='text-white/80 hover:text-white hover:underline transition-colors bg-black/65 backdrop-blur-lg px-3 py-1 rounded-full'
                    >
                      Recipes
                    </Link>
                  </li>
                  <li className='text-white/50'>/</li>
                  <li className='text-white/95 font-medium bg-black/65 backdrop-blur-lg px-3 py-1 rounded-full'>
                    {recipe.title}
                  </li>
                </ol>
              </nav>

              <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif mb-4 leading-tight text-white drop-shadow-2xl'>
                {title}
              </h1>
              {description && (
                <p className='text-lg md:text-xl mb-6 leading-relaxed max-w-3xl text-white/90 drop-shadow-lg'>
                  {description}
                </p>
              )}

              {/* Recipe Meta */}
              <div className='flex flex-wrap gap-3'>
                {prepTime && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-lg border border-white/35 shadow-lg text-white'>
                    <FiClock className='w-4 h-4' />
                    <span className='text-sm font-medium'>Prep: {prepTime} min</span>
                  </div>
                )}
                {cookingTime && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-lg border border-white/35 shadow-lg text-white'>
                    <FiThermometer className='w-4 h-4' />
                    <span className='text-sm font-medium'>Cook: {cookingTime} min</span>
                  </div>
                )}
                {totalTime && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-lg border border-white/35 shadow-lg text-white'>
                    <FiClock className='w-4 h-4' />
                    <span className='text-sm font-medium'>Total: {totalTime} min</span>
                  </div>
                )}
                {servings && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-lg border border-white/35 shadow-lg text-white'>
                    <FiUsers className='w-4 h-4' />
                    <span className='text-sm font-medium'>Serves: {servings}</span>
                  </div>
                )}
                {difficulty && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-lg border border-white/35 shadow-lg text-white'>
                    <FiBarChart className='w-4 h-4' />
                    <span className='text-sm font-medium capitalize'>{difficulty}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      {!mainImage && (
        <div className='pt-32 pb-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Breadcrumb */}
            <nav className='mb-8' aria-label='Breadcrumb'>
              <ol className='flex items-center space-x-2 text-sm'>
                <li>
                  <Link
                    href='/'
                    className='text-foreground-muted hover:text-foreground hover:underline transition-colors'
                  >
                    Home
                  </Link>
                </li>
                <li className='text-foreground-muted'>/</li>
                <li>
                  <Link
                    href='/recipes'
                    className='text-foreground-muted hover:text-foreground hover:underline transition-colors'
                  >
                    Recipes
                  </Link>
                </li>
                <li className='text-foreground-muted'>/</li>
                <li className='text-foreground font-medium'>{recipe.title}</li>
              </ol>
            </nav>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight text-foreground'>
              {title}
            </h1>
            {description && (
              <p className='text-lg md:text-xl mb-10 leading-relaxed max-w-3xl text-foreground-subtle'>
                {description}
              </p>
            )}

            {/* Recipe Meta */}
            <div className='flex flex-wrap gap-3 mb-12'>
              {prepTime && (
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/30 shadow-sm hover:shadow-md transition-all duration-200 text-foreground-subtle'>
                  <FiClock className='w-4 h-4 text-accent' />
                  <span>Prep: {prepTime} min</span>
                </div>
              )}
              {cookingTime && (
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/30 shadow-sm hover:shadow-md transition-all duration-200 text-foreground-subtle'>
                  <FiThermometer className='w-4 h-4 text-accent' />
                  <span>Cook: {cookingTime} min</span>
                </div>
              )}
              {totalTime && (
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/30 shadow-sm hover:shadow-md transition-all duration-200 text-foreground-subtle'>
                  <FiClock className='w-4 h-4 text-accent' />
                  <span>Total: {totalTime} min</span>
                </div>
              )}
              {servings && (
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/30 shadow-sm hover:shadow-md transition-all duration-200 text-foreground-subtle'>
                  <FiUsers className='w-4 h-4 text-success' />
                  <span>Serves: {servings}</span>
                </div>
              )}
              {difficulty && (
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border/30 shadow-sm hover:shadow-md transition-all duration-200 text-foreground-subtle'>
                  <FiBarChart className='w-4 h-4 text-info' />
                  <span className='capitalize'>{difficulty}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='pb-20'>
        <article className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Main Content */}
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
            {/* Sidebar - Ingredients */}
            <aside className='lg:w-80 lg:shrink-0'>
              <div className='lg:sticky lg:top-8 space-y-6'>
                <RecipeIngredients ingredientCategories={ingredientCategories} />

                {/* Explore More */}
                <div className='p-6 rounded-2xl bg-surface border border-border/30 shadow-lg'>
                  <h3 className='font-semibold mb-4 text-foreground'>Explore More</h3>
                  <div className='space-y-3'>
                    <Link
                      href='/recipes'
                      className='block px-4 py-2.5 rounded-lg text-sm text-foreground-subtle hover:text-foreground hover:bg-surface-hover transition-all duration-200'
                    >
                      Browse All Recipes
                    </Link>
                    <Link
                      href='/projects'
                      className='block px-4 py-2.5 rounded-lg text-sm text-foreground-subtle hover:text-foreground hover:bg-surface-hover transition-all duration-200'
                    >
                      View Projects
                    </Link>
                    <Link
                      href='/paintings'
                      className='block px-4 py-2.5 rounded-lg text-sm text-foreground-subtle hover:text-foreground hover:bg-surface-hover transition-all duration-200'
                    >
                      Digital Art Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content - Instructions */}
            <div className='flex-1 min-w-0'>
              <RecipeInstructions instructions={instructions} ingredients={allIngredients} />
            </div>
          </div>

          {/* Tips & Tricks */}
          {tips && tips.length > 0 && (
            <section className='mt-24'>
              <div className='max-w-4xl mx-auto'>
                <div className='text-center mb-12'>
                  <h2 className='text-3xl md:text-4xl font-bold mb-4 text-foreground font-serif'>
                    Tips & Tricks
                  </h2>
                  <p className='text-lg text-foreground-subtle'>
                    Pro tips to help you master this recipe
                  </p>
                </div>
                <div className='grid gap-6 md:grid-cols-2'>
                  {tips?.map((tip, index) => {
                    // biome-ignore lint/suspicious/noArrayIndexKey: Tips list is static
                    return <RecipeTipComponent key={index} tip={tip} />;
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <section className='mt-24 pt-12 border-t border-border/30'>
              <div className='max-w-4xl mx-auto'>
                <h3 className='text-center text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-6'>
                  Tags
                </h3>
                <div className='flex flex-wrap justify-center gap-3'>
                  {tags.map(tag => (
                    <Link
                      key={tag.name}
                      href={`/recipes?tag=${tag.name}`}
                      className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-surface border border-border/30 shadow-sm hover:shadow-md hover:border-accent/30 hover:bg-accent-surface transition-all duration-200 text-foreground-subtle hover:text-foreground'
                    >
                      <FiTag className='w-3.5 h-3.5 text-accent' />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
