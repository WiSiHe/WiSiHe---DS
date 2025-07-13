'use client';

import { urlForImage } from '@/sanity/lib/utils';
import { PortableTextBlock } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { FiBarChart, FiClock, FiTag, FiThermometer, FiUsers } from 'react-icons/fi';
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
    <div className="min-h-screen">
      <div className="pt-24 pb-16">
        <article className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb navigation for internal linking */}
              <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="hover:underline"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Home
                    </Link>
                  </li>
                  <li style={{ color: 'var(--color-text-tertiary)' }}>/</li>
                  <li>
                    <Link
                      href="/recipes"
                      className="hover:underline"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Recipes
                    </Link>
                  </li>
                  <li style={{ color: 'var(--color-text-tertiary)' }}>/</li>
                  <li style={{ color: 'var(--color-text-primary)' }}>{recipe.title}</li>
                </ol>
              </nav>

              <h1
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {title.length < 20 ? `${title} - Delicious Homemade Recipe` : title}
              </h1>
              {description && (
                <p
                  className="text-xl mb-8 leading-relaxed max-w-3xl mx-auto"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {description}
                </p>
              )}

              {/* Recipe Meta */}
              <div className="flex flex-wrap justify-center gap-6 text-sm mb-8 text-text-tertiary">
                {prepTime && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiClock className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span>Prep: {prepTime} min</span>
                  </div>
                )}
                {cookingTime && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiThermometer
                      className="w-4 h-4"
                      style={{ color: 'var(--color-accent-warm)' }}
                    />
                    <span>Cook: {cookingTime} min</span>
                  </div>
                )}
                {totalTime && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiClock className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span>Total: {totalTime} min</span>
                  </div>
                )}
                {servings && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiUsers className="w-4 h-4" style={{ color: 'var(--color-accent-success)' }} />
                    <span>Serves: {servings}</span>
                  </div>
                )}
                {difficulty && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiBarChart className="w-4 h-4" style={{ color: 'var(--color-accent-cool)' }} />
                    <span className="capitalize">{difficulty}</span>
                  </div>
                )}
              </div>

              {/* Main Image */}
              {mainImage && (
                <div className="aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl mb-12">
                  <Image
                    src={urlForImage(mainImage)?.url() || ''}
                    alt={mainImage.alt}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-col xl:flex-row justify-center items-start gap-12 max-w-screen-2xl mx-auto">
            <div className="xl:sticky xl:top-8 w-full xl:w-auto">
              <RecipeIngredients ingredientCategories={ingredientCategories} />

              <div
                className="mt-8 p-6 rounded-xl shadow-lg"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  More Recipes
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/recipes"
                    className="block text-sm hover:underline"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Browse All Recipes
                  </Link>
                  <Link
                    href="/projects"
                    className="block text-sm hover:underline"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    View Projects
                  </Link>
                  <Link
                    href="/paintings"
                    className="block text-sm hover:underline"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Digital Art Gallery
                  </Link>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="w-full xl:max-w-prose">
              <RecipeInstructions instructions={instructions} ingredients={allIngredients} />
            </div>
          </div>

          {/* Tips & Tricks */}
          {tips && tips.length > 0 && (
            <div className="mt-20 max-w-prose mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-text-primary">Tips & Tricks</h2>
                <p className="text-lg text-center text-text-secondary">
                  Pro tips to help you master this recipe
                </p>
              </div>
              <ul className="space-y-4 list-disc list-inside">
                {tips?.map((tip, index) => {
                  return <RecipeTipComponent key={index} tip={tip} />;
                })}
              </ul>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-16 pt-12 max-w-4xl mx-auto text-center ring ring-border">
              <div className="flex flex-wrap justify-center gap-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <FiTag className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
